/*
jshint -W003, -W026, -W117, -W098
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('medicationHistory', directive);

  function directive() {
    return {
      restrict: 'E',
      scope: {
        patientUuid: '@'
      },
      templateUrl: 'views/patient-dashboard/medication-history.html',
      controller: medicationHistoryController,
      link: medicationHistoryLink
    };
  }

  medicationHistoryController.$inject = [
    '$scope', 'EtlRestService', 'PatientTestModel'
  ];

  function medicationHistoryController($scope, EtlRestService, PatientTestModel) {
    $scope.injectedEtlRestService = EtlRestService;
    $scope.fetchMedicationHistory = fetchMedicationHistory;
    $scope.bsTableControl = {
      options: {}
    };
    $scope.encounters = [];
    $scope.isBusy = false;
    $scope.nextStartIndex = 0;
    $scope.pageSize = 10;
    $scope.experiencedLoadingError = false;
    $scope.tableTags = [{
      name: 'encounter_datetime',
      headers: 'Encounter Date'
    }, {
      name: 'previous_vl',
      headers: 'Previous VL'
    }, {
      name: 'previous_vl_date',
      headers: 'Previous Vl Date'
    }, {
      name: 'current_regimen',
      headers: 'Current Regimen'
    }, {
      name: 'previous_regimen',
      headers: 'Previous Regimen'
    }];

    function fetchMedicationHistory() {
      $scope.isBusy = true;
      $scope.allDataLoaded = false;
      EtlRestService.getReport({
        report: 'medical-history-report',
        patientUuid: $scope.patientUuid
      }, onFetchMedicationHistorySuccess, onFetchMedicationHistoryError);
    }

    function onFetchMedicationHistorySuccess(result) {
      if (result.size === 0) {
        $scope.allDataLoaded = true;
      } else {
        $scope.encounters = result.result;
        $scope.allDataLoaded = true;
        buildDataTable();
      }
      $scope.isBusy = false;
    }

    function onFetchMedicationHistoryError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingError = true;
    }

    function buildDataTable() {
      buildColumns();
      buildTableControls();
    }

    function buildColumns() {
      $scope.columns = [];
      _.each($scope.tableTags, function(header) {
        var visible =(header.name!=='previous_regimen');
        $scope.columns.push({
          field: header.name,
          title: header.headers.toString().split('_').join(' '),
          align: 'center',
          valign: 'center',
          // class: header.name === 'test_datetime' ? 'bst-table-min-width' : undefined,
          sortable: true,
          visible: visible,
          tooltip: true
        });
      });
    }

    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data: $scope.encounters,
          rowStyle: function(row, index) {
            return {
              classes: 'none'
            };
          },
          tooltip: true,
          classes: 'table table-hover',
          cache: false,
          height: 550,
          detailView: false,
          //detailFormatter: detailFormatter,
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
          idField: 'patientUuid',
          minimumCountColumns: 2,
          clickToSelect: true,
          showToggle: false,
          maintainSelected: true,
          showExport: true,
          toolbar: '#toolbar',
          toolbarAlign: 'left',
          exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
          columns: $scope.columns,
          exportOptions: {
            fileName: ''
          },
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
          }
        }
      };
    }


    /**
     * Converts null to empty string on display
     */
    function nullToEmptyString(value) {
      if (value === null) {
        return '<span class="text-success"></span>';
      }
      return value;
    }
  }

  function medicationHistoryLink(scope, element, attrs, vm) {
    attrs.$observe('patientUuid', onPatientUuidChanged);

    function onPatientUuidChanged(newVal, oldVal) {
      if (newVal && newVal !== '') {
        scope.fetchMedicationHistory();
      }
    }
  }
})();
