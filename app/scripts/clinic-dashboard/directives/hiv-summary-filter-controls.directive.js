/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.clinicDashboard')
		.directive('statsClinicDashboardHivSummaryFilters', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedForms: "=",
				startDate: "=",
        endDate: "=",
				selectedProvider: "=",
        enabledControls: "=",
        selectedLocations: "=",
        selectedIndicatorTags: "=",
        reportName:"="

    },
			controller: hivSummaryFilterController,
			link: hivSummaryFilterLink,
			templateUrl: "views/clinic-dashboard/hiv-summary-filter-controls.html"
		};
	}

  hivSummaryFilterController.$inject = ['$scope', '$rootScope', 'SearchDataService',
  'moment', '$state', '$filter',
    'CachedDataService', 'LocationModel','OpenmrsRestService', 'EtlRestService','ClinicDashboardService'];

    function hivSummaryFilterController($scope, $rootScope, SearchDataService, moment,
       $state, $filter, CachedDataService,
  LocationModel, OpenmrsRestService, EtlRestService,ClinicDashboardService) {
		$scope.forms = [];
		$scope.selectedForms = {};
		$scope.selectedForms.selected = [];
		$scope.selectedEncounterTypes = {};
		$scope.selectedEncounterTypes.selected = [];
		$scope.selectAllForms = selectAllForms;
		$scope.selectAllEncounterTypes = selectAllEncounterTypes;

    //location var
    $scope.selectedLocations = {};
    $scope.selectedLocations.selectedAll = false;
    $scope.selectedLocations.locations = [];
    $scope.selectAllLocations= selectAllLocations;

		$scope.providers = [];
		$scope.selectedProvider = {};
		$scope.selectedProvider.selected = {};
		$scope.findProviders = findProviders;
		$scope.findingProvider = false;
    $scope.canView = canView;
    var locationService = OpenmrsRestService.getLocationResService();

    ///Multi-Select Properties/ Params
    $scope.selectedIndicatorTags = {};
    $scope.selectedIndicatorTags.selectedAll = false;
    $scope.selectedIndicatorTags.indicatorTags = [];
    $scope.indicatorTags = [];
    $scope.onSelectedIndicatorTagChanged=onSelectedIndicatorTagChanged;
    $scope.selectAllTags= selectAllTags;

      //expose member to scope
      $scope.loadIndicatorsSchema= loadIndicatorsSchema;
      $scope.fetchLocations=fetchLocations;
      $scope.reInitialize =  init;
      $rootScope.$on('location:change', function(){
        $scope.$parent.selectedLocation=ClinicDashboardService.
            getSelectedLocation().selected.uuId();
      });
      //pre-load data
    init();
    function init() {
      $scope.$parent.selectedLocation=ClinicDashboardService.
          getSelectedLocation().selected.uuId();
      if(canView('indicator')) loadIndicatorsSchema();
      if(canView('location')) fetchLocations();
      loadForms();
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
      $scope.indicatorTags =result.result;
      $scope.indicatorSelectOptions = {
        placeholder: 'Select desired Indicator(s) or type to search...',
        dataTextField: 'name',
        dataValueField: 'name',
        filter: 'contains',
        autoClose: false,
        itemTemplate: '<span></span>' +
        '<span><strong>#: data.name #</strong><br/><span><small>#: data.label #</small></span></span>',
        tagTemplate:  '<span class="selected-value"></span><span>#:data.name#</span>',
        dataSource:result.result
      };
      $scope.isBusy = false;
    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.indicatorSelectOptions = {};
      $scope.experiencedLoadingErrors = true;
    }
    function onSelectedIndicatorTagChanged(tag) {

    }
		function loadForms() {
			$scope.forms = CachedDataService.getCachedPocForms();
		}

    function canView(param){
      return $scope.enabledControls.indexOf(param) > -1;
    }

    function selectAllForms() {
      if ($scope.forms)
        $scope.selectedForms.selected = $scope.forms;
    }

		function selectAllEncounterTypes() {
			if ($scope.forms)
				$scope.selectedEncounterTypes.selected = $scope.forms;
		}

		function findProviders(searchText) {

			$scope.providers = [];
			if (searchText && searchText !== ' ') {
				$scope.findingProvider = true;
				SearchDataService.findProvider(searchText, onProviderSearchSuccess, onProviderSearchError);
			}
		}

		function onProviderSearchSuccess(data) {
			$scope.findingProvider = false;
			$scope.providers = data;
		}

		function onProviderSearchError(error) {
			$scope.findingProvider = false;
		}

    function fetchLocations() {
      $scope.isBusy = true;
      locationService.getLocations(onGetLocationsSuccess,
        onGetLocationsError, false);
    }

    function onGetLocationsSuccess(locations) {
      $scope.isBusy = false;
      $scope.locations = wrapLocations(locations);
      //$scope.selectedLocations.locations = $scope.locations;
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
    }

    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        var wrapped = wrapLocation(locations[i]);
        wrapped.index = i;
        wrappedLocations.push(wrapped);
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      return LocationModel.toWrapper(location);
    }
    function selectAllLocations() {
      if ( $scope.selectedLocations.selectedAll === false){
        $scope.selectedLocations.selectedAll = true;
        $scope.selectedLocations.locations =  $scope.locations;
      }
      else{
        $scope.selectedLocations.selectedAll = false;
        $scope.selectedLocations.locations = [];
      }
    }
    function selectAllTags() {
      if($scope.indicatorTags.length>0){
        if ( $scope.selectedIndicatorTags.selectedAll === false){
          $scope.selectedIndicatorTags.selectedAll = true;
          $scope.selectedIndicatorTags.indicatorTags = $scope.indicatorTags;
        }
        else{
          $scope.selectedIndicatorTags.selectedAll = false;
          $scope.selectedIndicatorTags.indicatorTags = [];
        }
      }
    }
	}

	function hivSummaryFilterLink(scope, element, attrs, vm) {
    }
})();
