/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.admin')
		.controller('HivSummaryIndicatorsCtrl', HivSummaryIndicatorsCtrl);
  HivSummaryIndicatorsCtrl.$nject =
    ['$rootScope', '$scope', '$stateParams', 'EtlRestService', 'HivSummaryIndicatorService', 'moment','$filter','$state' ];

  function HivSummaryIndicatorsCtrl($rootScope, $scope, $stateParams,EtlRestService, HivSummaryIndicatorService, moment,$filter,$state) {
    //Patient List Directive Properties & Methods
    $scope.startDate = new Date("January 1, 2015 12:00:00");
    $scope.endDate = new Date();
    $scope.selectedLocation=$stateParams.locationuuid||'';
    $scope.selectedIndicatorBox=$stateParams.indicator||'';
    $scope.loadPatientList=loadPatientList;

    //Hiv Summary Indicators Service Properties & Methods
    $scope.reportName='hiv-summary-report';
    $scope.countBy='num_persons';
    $scope.loadHivSummaryIndicators=loadHivSummaryIndicators;
    $scope.getIndicatorLabelByName =getIndicatorLabelByName;

    //UX Scope Params
    $scope.isBusy = false;
    $scope.experiencedLoadingError = false;

    //Dynamic DataTable Params
    $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.defaultIndicators = []; //initialize unfiltered indicators to []
    $scope.counter = 0;
    $scope.setCountType= function(val) {
      $scope.countBy= val;
      loadHivSummaryIndicators()
    };

    ///Multi-Select Properties/ Params
    $scope.selectedIndicatorTags = {};
    $scope.selectedIndicatorTags.selectedAll = false;
    $scope.selectedIndicatorTags.indicatorTags = [];
    $scope.indicatorTags = [];
    $scope.onSelectedIndicatorTagChanged=onSelectedIndicatorTagChanged;
    $scope.isBusy = false;

    //Start Initialization
    init();

    //scope methods
    function init() {
      if(!loadCachedData())loadIndicatorsSchema();
    }

    function loadHivSummaryIndicators() {
      $scope.experiencedLoadingErrors = false;
      if($scope.isBusy === true) return;
      $scope.isBusy = true;
      $scope.indicators = [];
      $scope.defaultIndicators = [];
      if ($scope.countBy && $scope.countBy !== '' && $scope.reportName && $scope.reportName!==''
        && $scope.startDate && $scope.startDate!=='' )
        EtlRestService.getHivSummaryIndicators(
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.reportName, $scope.countBy, onFetchHivSummaryIndicatorsSuccess, onFetchHivSummaryIndicatorsError);
    }

    function onFetchHivSummaryIndicatorsSuccess(result) {
      $scope.isBusy = false;
      $scope.defaultIndicators = result.result;
      console.log("Sql query for HivSummaryIndicators request=======>", result.sql, result.sqlParams);
      if($scope.defaultIndicators)$scope.indicators=$scope.defaultIndicators.slice(0, 6);
      //Select default indicator tags if not set
      if(!$scope.selectedIndicatorTags.indicatorTags.length)
        $scope.selectedIndicatorTags.indicatorTags=$scope.indicatorTags.slice(0, 6);
      filterIndicators();
    }

    function onFetchHivSummaryIndicatorsError(error) {
      console.log('Aww! something wrong happened', error);
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if($scope.isBusy === true) return;
      $scope.isBusy = true;
      $scope.indicatorTags =[];
      $scope.selectedIndicatorTags.indicatorTags=[];
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.isBusy = false;
      $scope.indicatorTags =result.result;
    }

    function onFetchIndicatorsSchemaError(error) {
      console.log('Aww! something wrong happened', error);
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function loadPatientList(indicator, location, $parentIndex, $index, curPage, key) {
      $scope.selectedIndicatorBox=indicator;
      $scope.selectedLocation=location;
      $scope.selectedPosition = {
        parent: $parentIndex,
        index: $index,
        page:curPage,
        key:key,
      };
      HivSummaryIndicatorService.setIndicatorDetails(getIndicatorDetails(indicator));
      cacheResource(); //cache report before changing view/state
      $state.go('admin.hiv-summary-indicators.patients', {locationuuid:location, indicator:indicator});
    }

    function onSelectedIndicatorTagChanged(tag) {
      filterIndicators();
    }

    /**
     * Filters indicator by $scope.selectedIndicatorTags using key value pairs.
     * @property $scope.defaultIndicators, $scope.indicators $scope.selectedIndicatorTags.
     */
    function filterIndicators() {
      //Filters indicator by $scope.selectedIndicatorTags
      $scope.indicators =[];
      _.each( $scope.defaultIndicators, function (reportIndicator) {
        var result = {};
        _.each( $scope.selectedIndicatorTags.indicatorTags, function (indicatorTag) {
          angular.forEach(reportIndicator, function(value, key) {
            if(key==indicatorTag.name||key=='location_uuid'||key=='location') {
              result[key] = value;
            }
          });
        });
        $scope.indicators.push(result);
      });
    }

    function getIndicatorLabelByName(name) {
      var found = $filter('filter')( $scope.indicatorTags, {name: name})[0];
      if(found)return found.label;
    }

    function getIndicatorDetails(name) {
      var found = $filter('filter')( $scope.indicatorTags, {name: name})[0];
      if(found)return found;
    }
    /**
     * Method to fetch cached data to avoid round trips.
     */
    function loadCachedData() {
      if(HivSummaryIndicatorService.getDefaultIndicators()) {
        $scope.defaultIndicators = HivSummaryIndicatorService.getDefaultIndicators();
        $scope.indicators = HivSummaryIndicatorService.getIndicators();
        $scope.indicatorTags = HivSummaryIndicatorService.getIndicatorTags();
        $scope.selectedIndicatorTags.indicatorTags = HivSummaryIndicatorService.getSelectedIndicatorTags();
        $scope.selectedPosition=HivSummaryIndicatorService.getSelectedPosition();
        $scope.startDate=HivSummaryIndicatorService.getStartDate();
        $scope.endDate=HivSummaryIndicatorService.getEndDate();
        filterIndicators();
        return true;
      }
    }
    /**
     * Function to cache data in order to prevent app from hitting the server when a resource is requested
     */
    function cacheResource() {
      HivSummaryIndicatorService.setSelectedIndicatorTags($scope.selectedIndicatorTags.indicatorTags);
      HivSummaryIndicatorService.setDefaultIndicators($scope.defaultIndicators);
      HivSummaryIndicatorService.setIndicatorTags($scope.indicatorTags);
      HivSummaryIndicatorService.setIndicators($scope.indicators);
      HivSummaryIndicatorService.setSelectedPosition($scope.selectedPosition);
      HivSummaryIndicatorService.setStartDate($scope.startDate);
      HivSummaryIndicatorService.setEndDate($scope.endDate);
    }

  }
})();
