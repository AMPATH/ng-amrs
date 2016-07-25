/*jshint -W003, -W098, -W033 */
(function(){
  'use strict';

  angular
    .module('app.admin')
    .controller('ClinicalComparatorCtrl',ClinicalComparatorCtrl);
  ClinicalComparatorCtrl.$nject=
    ['$rootScope','$scope','$stateParams','EtlRestService','OpenmrsRestService','CachedDataService',
      'HivMonthlySummaryIndicatorService','moment','$filter','$state', '$timeout','LocationModel'];

  function ClinicalComparatorCtrl($rootScope,$scope,$stateParams,EtlRestService,OpenmrsRestService,
                                           CachedDataService,HivMonthlySummaryIndicatorService,moment,$filter,$state,
                                           $timeout,LocationModel){
    //Patient List Directive Properties & Methods
    var date = new Date();
    $scope.startDate = new Date(date.getFullYear(), date.getMonth()-12, 1);
    $scope.endDate  = date;
    $scope.selectedLocation=$stateParams.locationuuid||'';
    $scope.selectedIndicatorBox=$stateParams.indicator||'';
    $scope.ChangeView =ChangeView;
    $scope.selectedLocationName = $stateParams.locationName || '';

    //Hiv Summary Indicators Service Properties & Methods

    $scope.reportName='clinic-comparator-report';
    $scope.countBy='num_persons';
    $scope.groupBy='groupByYear,groupByMonth,groupByLocation';
    $scope.loadHivSummaryIndicators=loadHivSummaryIndicators;
    $scope.getIndicatorLabelByName =getIndicatorLabelByName;

    //UX Scope Params
    $scope.isBusy = false;
    $scope.experiencedLoadingError = false;
    $scope.resultIsEmpty= false;
    $scope.encounterDate=[];
    $scope.Location=[];
    $scope.state = $state.current.name;

    //Dynamic DataTable Params
    $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.fixedColumns=true;
    $scope.setCountType= function(val) {
      $scope.countBy= val;
      loadHivSummaryIndicators()
    };

    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {options: {}};
    //types of charts to be selected
    $scope.exportList=[
      {name: 'Export Basic', value:''},
      {name: 'Export All', value: 'all'},
      {name: 'Export Selected', value: 'selected'}];
    $scope.exportDataType=$scope.exportList[1];
    $scope.updateSelectedType = function() {
      var bsTable= document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType:  $scope.exportDataType.value
      });
    };

    //Start Initialization
    init();

    //scope methods
    function init() {
      $timeout(function() {
        if (!loadCachedData())
          loadIndicatorsSchema();
         // fetchLocations();
      },1000);
    }

    function loadHivSummaryIndicators() {
      $scope.experiencedLoadingErrors = false;
      $scope.resultIsEmpty= false;
      if($scope.isBusy === true) return;
      $scope.indicators =[];
      $scope.isBusy = true;
      if ($scope.countBy && $scope.countBy !== '' && $scope.reportName && $scope.reportName!=='' && $scope.startDate
        && $scope.startDate!=='' )
        var locations =getSelectedLocations($scope.selectedLocations);
        var indicators = getSelectedIndicators($scope.selectedIndicatorTags);
        EtlRestService.getHivSummaryIndicators(
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.reportName, $scope.countBy, onFetchHivSummaryIndicatorsSuccess, onFetchHivSummaryIndicatorsError,
          $scope.groupBy,locations,'',indicators,0,300, $scope.startAge, $scope.endAge,  $scope.gender);

    }


    function onFetchHivSummaryIndicatorsSuccess(result) {
      $scope.isBusy = false;
      console.log('Sql query for HivSummaryIndicators request=======>', result.sql, result.sqlParams);
      if (result.size === 0) {
        $scope.allDataLoaded = true;
      } else {
        $scope.indicators.length === 0 ? $scope.indicators.push.apply($scope.indicators, result.result) : $scope.indicators = result.result;
      }
      buildDataTable();
      $scope.chartFilters = true;
    }

    function onFetchHivSummaryIndicatorsError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if($scope.isBusy === true) return;
      $scope.indicatorTags =[];
      $scope.isBusy = true;
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.isBusy = false;
      $scope.indicatorTags =result.result;

    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }


    function getSelectedIndicators(selectedIndicatorObject) {
      var indicators;
      indicators = '' + selectedIndicatorObject.indicatorTags.name;
      return indicators;
    }

    function getSelectedLocations(selectedLocationObject) {
      if (selectedLocationObject.selectedAll === true)
        return;
      var locations;
      if (selectedLocationObject.locations)
        for (var i = 0; i < selectedLocationObject.locations.length; i++) {
          if (i === 0) {
            locations = '' + selectedLocationObject.locations[i].uuId();
          } else {
            locations =
              locations + ',' + selectedLocationObject.locations[i].uuId();
          }
        }
      return locations;
    }


    /**
     * Filters indicator by $scope.selectedIndicatorTags using key value pairs.
     * @property $scope.defaultIndicators, $scope.indicators $scope.selectedIndicatorTags.
     */

    function getIndicatorLabelByName(name) {
      var found = $filter('filter')( $scope.indicatorTags, {name: name})[0];
      if(found)return found.label;
    }


    /**
     * Method to fetch cached data to avoid round trips.
     */
    function loadCachedData() {
      if(HivMonthlySummaryIndicatorService.getIndicatorTags()) {
        $scope.indicators = HivMonthlySummaryIndicatorService.getIndicators($scope.state);
        $scope.indicatorTags = HivMonthlySummaryIndicatorService.getIndicatorTags();
        $scope.startDate=HivMonthlySummaryIndicatorService.getStartDate();
        $scope.endDate=HivMonthlySummaryIndicatorService.getEndDate();
        $scope.selectedLocations=HivMonthlySummaryIndicatorService.getSelectedLocation();
        $scope.startAge = HivMonthlySummaryIndicatorService.getReportFilters().startAge;
        $scope.endAge = HivMonthlySummaryIndicatorService.getReportFilters().endAge;
        $scope.gender = HivMonthlySummaryIndicatorService.getReportFilters().gender;
        $scope.selectedIndicatorTags=HivMonthlySummaryIndicatorService.getSelectedIndicatorTags($scope.state);
        buildDataTable();
        //$scope.chartFilters = true;

        return true;
      }
    }

    function ChangeView(){
      $state.go('admin.hiv-summary-combined');
    }

    /**
     * Functions to populate and define bootstrap data table
     */
    function buildDataTable() {
      $timeout(function () {
        buildColumns();
        buildTableControls();
      }, 1000);

    }


    function buildSingleColumn(header) {
      var visible =(header!=='location_uuid');
      $scope.columns.push({
        field: header,
        title: $filter('titlecase')(header),
        align: 'center',
        valign: 'center',
        class:header==='month'?'bst-table-min-width':undefined,
        visible: visible,
        tooltip: true,
        sortable: true,
        formatter: function (value, row, index) {
          return cellFormatter(value, row, index, header);


        }
      });

    }

    function buildColumns() {
      var obj =[];
      var location=getSelectedLocationByName($scope.selectedLocations);
      $scope.Location = location.split(",");
      $scope.Location.unshift('month');
      $scope.columns = [];
      _.each($scope.Location, function (header) {

        if (header)
          buildSingleColumn(header);
        obj.push({name:header});

      });
      $rootScope.$broadcast("location", obj);
    }


    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data:$scope.indicators,
          rowStyle: function (row, index) {
            return { classes: 'none' };
          },
          tooltip:true,
          classes: 'table table-hover',
          cache: false,
          height: 550,
          detailView:false,
          //detailFormatter:detailFormatter,
          striped: true,
          selectableRows:true,
          showFilter:true,
          pagination: true,
          pageSize: 20,
          pageList: [5, 10, 25, 50, 100, 200],
          search: true,
          trimOnSearch: true,
          singleSelect: false,
          showColumns: true,
          showRefresh: true,
          showMultiSort: true,
          showPaginationSwitch:true,
          smartDisplay: true,
          idField:'location',
          minimumCountColumns: 2,
          clickToSelect: true,
          showToggle: false,
          maintainSelected: true,
          showExport: true,
          toolbar:'#toolbar',
          toolbarAlign: 'left',
          exportTypes:['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
          columns: $scope.columns,
          exportOptions: {fileName: 'hivSummaryIndicators' },
          iconSize: undefined,
          iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
          icons: {
            paginationSwitchDown: 'glyphicon-chevron-down',
            paginationSwitchUp: 'glyphicon-chevron-up',
            refresh: 'glyphicon-refresh',
            toggle: 'glyphicon-list-alt',
            columns: 'glyphicon-th',
            sort: 'glyphicon-sort',
            plus: 'glyphicon-plus',
            minus: 'glyphicon-minus',
            detailOpen: 'glyphicon-plus',
            detailClose: 'glyphicon-minus'
          },
          fixedColumns: $scope.fixedColumns,
          fixedNumber:1,
          onPostBody:function(){
            //please make sure you calibrate results[0].style.maxHeight with relation to height (550)
            var results = document.getElementsByClassName("fixed-table-body-columns");
            results[0].style.maxHeight='380px';
          }
        }
      };
    }
    function getSelectedLocationByName(selectedLocationObject) {
      if (selectedLocationObject.selectedAll === true)
        return;
      var locations;
      if (selectedLocationObject.locations)
      for (var i = 0; i < selectedLocationObject.locations.length; i++) {
        if (i === 0) {
          locations = '' + selectedLocationObject.locations[i].name();
        } else {
          locations =
            locations + ',' + selectedLocationObject.locations[i].name();
        }
      }
      return locations;
    }

    /**
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {

      if(header==='month') return '<div class="text-center" style="height:43px!important;" ><span ' +
        'class="text-info text-capitalize">'+ $filter('date')(row.month, 'MMM, y')+'</span></div>';
      for(var i=0; i<row.data.length; i++){
        var data = row.data[i];
        if(data.location===header){
          return '<div class="btn btn-large btn-default" style="padding: inherit; width:100%; max-width: 300px" ><span ' +
            'class="text-info text-capitalize">'+data.indicator+'</span></div>';

        }

      }

    }

  }
})();
