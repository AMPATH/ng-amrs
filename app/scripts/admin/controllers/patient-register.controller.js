/*jshint -W003, -W098, -W033 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('PatientRegisterCtrl', PatientRegisterCtrl);
  PatientRegisterCtrl.$inject =
    ['$rootScope', '$scope', '$stateParams', 'EtlRestService', 'moment', '$filter', '$state',
      'OpenmrsRestService','$timeout'];

  function PatientRegisterCtrl($rootScope, $scope, $stateParams, EtlRestService,  moment, $filter,
                               $state, OpenmrsRestService,$timeout) {

    //Patient List Directive Properties & Methods
    var date = new Date();
    $scope.startDate = new Date(date.getFullYear(), date.getMonth()-1, 1);
    $scope.endDate  = date;

    //Hiv Summary Indicators Service Properties & Methods
    $scope.reportName = 'patient-register-report';
    $scope.countBy = 'num_persons';
    $scope.groupBy = 'groupByEncounter';
    $scope.loadIndicators = loadIndicators;
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
    loadIndicatorsSchema();
    }

    function loadIndicators() {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      $scope.indicators = [];
      $scope.isBusy = true;
      if ($scope.groupBy && $scope.groupBy !== '' && $scope.reportName && $scope.reportName !== ''
        && $scope.startDate && $scope.startDate !== '' && $scope.selectedIndicatorTags.indicatorTags
        && $scope.selectedIndicatorTags.indicatorTags !== []) {
        var locations = getSelectedLocations($scope.selectedLocations);
        var indicators = getSelectedIndicators($scope.selectedIndicatorTags);
        EtlRestService.getHivSummaryIndicators(
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.reportName, $scope.countBy, onFetchIndicatorsSuccess, onFetchIndicatorsError, $scope.groupBy,
          locations,'', indicators);

      } else {
        $scope.isBusy = false;
      }
    }

    function onFetchIndicatorsSuccess(result) {
      $scope.isBusy = false;
      console.log('Sql query for HivSummaryIndicators request=======>', result.sql, result.sqlParams);
      $scope.indicators = result.result;
      buildDataTable();
    }

    function onFetchIndicatorsError(error) {
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
      //push non indicator columns
      $scope.indicatorTags.unshift({name: 'person_name'},{name: 'identifiers'},{name: 'encounter_date'},
        {name: 'location'},  {name: 'location_uuid'})
    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if ((toState.name === 'admin.patient-register.patient' && fromState.name === 'admin.patient-register')
        ||(toState.name === 'admin.patient-register.patient' && fromState.name === 'admin.patient-register.patient')) {
          OpenmrsRestService.getPatientService().getPatientByUuid({uuid: toParams.uuid},
            function (data) {
              $rootScope.broadcastPatient = data;
              $state.go('patient', {uuid: toParams.uuid});
            });
        }
      });

    /**
     * Filters indicator by $scope.selectedIndicatorTags using key value pairs.
     * @property $scope.defaultIndicators, $scope.indicators $scope.selectedIndicatorTags.
     */

    function getIndicatorLabelByName(name) {
      var found = $filter('filter')($scope.indicatorTags, {name: name})[0];
      if (found)return found.label;
    }

    /**
     * Functions to populate and define bootstrap data table
     */
    function buildDataTable() {
      $timeout(function() {
        buildColumns();
        buildTableControls();
      }, 500);

    }

    function buildSingleColumn(header) {
      $scope.columns.push({
        field: header.name.toString(),
        title: $filter('titlecase')(header.name.toString().split('_').join(' ')),
        align: 'center',
        valign: 'center',
        class:header.name==='person_name'?'bst-table-min-width':undefined,
        visible: true,
        tooltip: true,
        sortable:true,
        formatter: function (value, row, index) {
          return cellFormatter(value, row, index, header);
        }
      });
    }

    function buildColumns() {
      $scope.columns = [];
      _.each($scope.indicatorTags, function (header) {
        if (header.name === 'location' ||  header.name === 'person_name' || header.name === 'encounter_date'
          || header.name === 'identifiers') buildSingleColumn(header);
        _.each($scope.selectedIndicatorTags.indicatorTags, function (selectedIndicator) {
          if (selectedIndicator.name === header.name) {
            buildSingleColumn(header);
          }
        });
      });
    }

    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data: $scope.indicators,
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
          showExport: false,
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
          fixedNumber:1
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
          '<p><b>' + key + '</b> (<span class="text-info">' + label + '</span>): ' + valueToBooleanFormatter(value) + '</p></div>');
      });
      return html.join('');
    }

    /**
     * Converts 0 or 1 to true or false else return value (Fromats
     */
    function valueToBooleanFormatter(value) {
      if (value === 1)return '<span class="text-success">True</span>';
      if (value === 0)return '<span class="text-warning">False</span>';
      return value
    }

    /**
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      if (header.name === 'location') return '<div  style="height:inherit!important;" >' +
        '<span class="text-info text-capitalize" style="white-space: nowrap;">' + value + '</span></div>';
      if (header.name === 'encounter_date') return '<span class="text-info text-capitalize" style="white-space: nowrap;">' +
        $filter('date')(value, 'dd, MMM, y') + '</span></div>';
      if (header.name === 'person_name')
        return '<div class="text-center" style="height:43px!important; " ><a href="#/admin-dashboard/patient-register/patient/'
          + row.person_uuid + '"><span class="text-info text-capitalize">' + value + '  </span><a/></div>';
      return '<div class="text-center" style="height:43px!important;width:100% " ><span style="white-space: nowrap;">'
        +valueToBooleanFormatter(value)+ '</span></div>';
    }

    /**
     * converts wrapped selected indicators and locations to comma separated strings
     */
    function getSelectedIndicators(selectedIndicatorObject) {
      var indicators;
      if (selectedIndicatorObject.indicatorTags)
        for (var i = 0; i < selectedIndicatorObject.indicatorTags.length; i++) {
          if (i === 0) {
            indicators = '' + selectedIndicatorObject.indicatorTags[i].name;
          }
          else {
            indicators =
              indicators + ',' + selectedIndicatorObject.indicatorTags[i].name;
          }
        }
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
          }
          else {
            locations =
              locations + ',' + selectedLocationObject.locations[i].uuId();
          }
        }
      return locations;
    }
  }
})();
