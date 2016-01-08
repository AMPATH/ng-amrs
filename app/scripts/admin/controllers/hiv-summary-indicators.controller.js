/*jshint -W003, -W098, -W033 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HivSummaryIndicatorsCtrl', HivSummaryIndicatorsCtrl);
  HivSummaryIndicatorsCtrl.$nject =
    ['$rootScope', '$scope', '$stateParams', 'EtlRestService', 'HivSummaryIndicatorService', 'moment', '$filter', '$state'];

  function HivSummaryIndicatorsCtrl($rootScope, $scope, $stateParams, EtlRestService, HivSummaryIndicatorService, moment, $filter, $state) {
    //Patient List Directive Properties & Methods
    var date = new Date();
    $scope.startDate = new Date(date.getFullYear(), date.getMonth()-1, 1);
    $scope.endDate  = date;
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.selectedIndicatorBox = $stateParams.indicator || '';
    $scope.loadPatientList = loadPatientList;

    //Hiv Summary Indicators Service Properties & Methods
    $scope.reportName = 'hiv-summary-report';
    $scope.countBy = 'num_persons';
    $scope.groupBy = 'groupByLocation';
    $scope.loadHivSummaryIndicators = loadHivSummaryIndicators;
    $scope.getIndicatorLabelByName = getIndicatorLabelByName;

    //UX Scope Params
    $scope.isBusy = false;
    $scope.experiencedLoadingError = false;

    //Dynamic DataTable Params
    $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function (val) {
      $scope.countBy = val;
      loadHivSummaryIndicators()
    };

    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {options: {}};
    $scope.exportList = [
      {name: 'Export Basic', value: ''},
      {name: 'Export All', value: 'all'},
      {name: 'Export Selected', value: 'selected'}];
    $scope.exportDataType = $scope.exportList[1];
    $scope.updateSelectedType = function () {
      console.log($scope.exportDataType.value, $scope.exportDataType.name);
      var bsTable = document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType: $scope.exportDataType.value
      });
    };
    //Start Initialization
    init();

    //scope methods
    function init() {
      if (!loadCachedData())loadIndicatorsSchema();
    }

    function loadHivSummaryIndicators() {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      $scope.indicators = [];
      $scope.isBusy = true;
      if ($scope.countBy && $scope.countBy !== '' && $scope.reportName && $scope.reportName !== ''
        && $scope.startDate && $scope.startDate !== '')
        EtlRestService.getHivSummaryIndicators(
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.reportName, $scope.countBy, onFetchHivSummaryIndicatorsSuccess, onFetchHivSummaryIndicatorsError,
          $scope.groupBy,'');
    }

    function onFetchHivSummaryIndicatorsSuccess(result) {
      $scope.isBusy = false;
      console.log('Sql query for HivSummaryIndicators request=======>', result.sql, result.sqlParams);
      $scope.indicators = result.result;
      buildDataTable();
    }

    function onFetchHivSummaryIndicatorsError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      $scope.indicatorTags = [];
      $scope.isBusy = true;
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.isBusy = false;
      $scope.indicatorTags = result.result;
      $scope.indicatorTags.unshift( {name: 'location'}, {name: 'location_uuid'})

    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        loadPatientList(toParams.indicator, toParams.locationuuid)
      });

    function loadPatientList(indicator, location) {
      $scope.selectedIndicatorBox = indicator;
      $scope.selectedLocation = location;
      HivSummaryIndicatorService.setIndicatorDetails(getIndicatorDetails(indicator));
      cacheResource(); //cache report before changing view/state
    }

    /**
     * Filters indicator by $scope.selectedIndicatorTags using key value pairs.
     * @property $scope.defaultIndicators, $scope.indicators $scope.selectedIndicatorTags.
     */

    function getIndicatorLabelByName(name) {
      var found = $filter('filter')($scope.indicatorTags, {name: name})[0];
      if (found)return found.label;
    }

    function getIndicatorDetails(name) {
      var found = $filter('filter')($scope.indicatorTags, {name: name})[0];
      if (found)return found;
    }

    /**
     * Method to fetch cached data to avoid round trips.
     */
    function loadCachedData() {
      if (HivSummaryIndicatorService.getIndicatorTags()) {
        $scope.indicators = HivSummaryIndicatorService.getIndicators();
        $scope.indicatorTags = HivSummaryIndicatorService.getIndicatorTags();
        $scope.startDate = HivSummaryIndicatorService.getStartDate();
        $scope.endDate = HivSummaryIndicatorService.getEndDate();
        buildDataTable();
        return true;
      }
    }

    /**
     * Function to cache data in order to prevent app from hitting the server when a resource is requested
     */
    function cacheResource() {
      HivSummaryIndicatorService.setIndicatorTags($scope.indicatorTags);
      HivSummaryIndicatorService.setIndicators($scope.indicators);
      HivSummaryIndicatorService.setStartDate($scope.startDate);
      HivSummaryIndicatorService.setEndDate($scope.endDate);
    }

    /**
     * Functions to populate and define bootstrap data table
     */
    function buildDataTable() {
      buildColumns();
      buildTableControls();

    }

    function buildColumns() {
      $scope.columns = [];
      _.each($scope.indicatorTags, function (header) {
        var visible =(header.name!=='location_uuid');
        $scope.columns.push({
          field: header.name.toString(),
          title: $filter('titlecase')(header.name.toString().split('_').join(' ')),
          align: 'center',
          valign: 'center',
          class:header.name==='location'?'bst-table-min-width':undefined,
          sortable:true,
          visible:visible,
          tooltip: true,
          formatter: function (value, row, index) {
            return cellFormatter(value, row, index, header);
          }
        });
      });
    }

    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data: $scope.indicators,
          rowStyle: function (row, index) {
            return {classes: 'none'};
          },
          tooltip: true,
          classes: 'table table-hover',
          cache: false,
          height: 550,
          detailView: false,
          detailFormatter: detailFormatter,
          striped: true,
          selectableRows: true,
          showFilter: true,
          pagination: true,
          pageSize: 20,
          pageList: [5, 10, 25, 50, 100, 200],
          search: true,
          trimOnSearch: true,
          singleSelect: false,
          showColumns: true,
          showRefresh: true,
          showMultiSort: true,
          showPaginationSwitch: true,
          smartDisplay: true,
          idField: 'location',
          minimumCountColumns: 2,
          clickToSelect: true,
          showToggle: false,
          maintainSelected: true,
          showExport: true,
          toolbar: '#toolbar',
          toolbarAlign: 'left',
          exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
          columns: $scope.columns,
          exportOptions: {fileName: 'hivSummaryIndicators'},
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
          fixedColumns: true,
          fixedNumber:1,
          onExpandRow:function onExpandRow(index, row, $detail) {
            //$scope.fixedColumns=false;
            //$('#bsTable').bootstrapTable('hideColumn','encounter_datetime');

          }
        }
      };
    }

    /**
     * Function to format detailed view
     */
    function detailFormatter(index, row) {
      var html = [];
      _.each(row, function (value, key) {
        if (key === 'location_uuid' || key === 'state') return;
        var label = getIndicatorLabelByName(key) || key;
        label = $filter('titlecase')(label.toString().split('_').join(' '));
        var key = $filter('titlecase')(key.toString().split('_').join(' '));
        html.push('<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
          '<p><b>' + key + '</b> (<span class="text-info">' + label + '</span>): ' + value + '</p></div>');
      });
      return html.join('');
    }

    /**
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      if (header.name === 'location') return '<div class="text-center" style="height:43px!important;" >' +
        '<span class="text-info text-capitalize">' + value + '</span></div>';
      if (header.name === 'state') return;
      return ['<a class="btn btn-large btn-default" style="padding: inherit; width:100%; max-width: 300px"',
        'title="' + getIndicatorLabelByName(header.name) + ' (in ' + row.location + ')" data-toggle="tooltip"',
        'data-placement="top"',
        'href="#/admin-dashboard/hiv-summary-indicators/location/' + row.location_uuid + '/indicator/' + header.name
        + '">' + value + '</a>'
      ].join('');
    }
  }
})();
