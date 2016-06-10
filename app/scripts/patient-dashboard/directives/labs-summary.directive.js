/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('labsSummary', labsSummary);

    function labsSummary() {
        return {
            restict: "E",
            scope: {
              patientUuid: "@",
              isBusy:"=",
              encounters:"="
            },
            controller: labsSummaryController,
            link: labsSummaryLink,
            templateUrl: "views/patient-dashboard/labs-summary-pane.html"
        };
    }

    labsSummaryController.$inject = ['$scope', 'EtlRestService', 'PatientTestModel', 'UtilService','$filter'];
    function labsSummaryController($scope, EtlRestService, patientTestModel, UtilService,$filter) {
        $scope.injectedEtlRestService = EtlRestService;
        $scope.encounters = [];
        $scope.isBusy = false;
        $scope.nextStartIndex = 0;
        $scope.loadMoreLabs = loadMoreLabs;
        $scope.allDataLoaded = false;
        $scope.experiencedLoadingError = false;
        $scope.fixedColumns=true;
       // $scope.testLength;

      $scope.labTestTags =[
        {
          name: 'test_datetime',
          headers:'Date'
        },
        {
          name: 'hiv_dna_pcr',
          headers:'DNA PCR'
        },
        {
          name: 'cd4_count',
          headers:'CD4'
        },
        {
          name: 'cd4_percent',
          headers:'CD4 %'
        },
        {
          name: 'hiv_viral_load',
          headers:'HIV VL'
        },
        {
          name: 'hemoglobin',
          headers:'Hb'
        },
        {
          name: 'ast',
          headers:'AST'
        },
        {
          name: 'creatinine',
          headers:'Cr'
        },
        {
          name: 'chest_xray',
          headers:'CXR'
        },
        {
          name: 'tests_ordered',
          headers:'Tests Ordered'
        }
      ] ;
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

      function loadMoreLabs(loadNextOffset) {
        $scope.experiencedLoadingErrors = false;
            if ($scope.isBusy === true) return;
          //  $scope.experiencedLoadingError = false;
        if(loadNextOffset!==true)resetPaging();
         $scope.isBusy = true;

            if ($scope.patientUuid && $scope.patientUuid !== '')
                  EtlRestService.getPatientTests($scope.patientUuid, $scope.nextStartIndex, 20,
                    onFetchPatientTestsSuccess, onFetchPatientTestsFailed);
        }

      function resetPaging(){
        $scope.nextStartInts = [];
        $scope.allDataLoaded = false;
        $scope.nextStartIndex = 0;
        $scope.encounters = [];
      }
        function onFetchPatientTestsSuccess(patientTestsData) {
          $scope.isBusy = false;
          if (patientTestsData.size === 0){
            $scope.allDataLoaded = true;
          }else {
            $scope.encounters.length != 0 ? $scope.encounters.push.apply($scope.encounters, patientTestsData.result) :
             $scope.encounters = patientTestsData.result;
            $scope.nextStartIndex +=  patientTestsData.size;

          }
          buildDataTable();

        }

        function onFetchPatientTestsFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
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
        _.each($scope.labTestTags, function (header) {
          //var visible =(header!=='location_uuid');
          $scope.columns.push({
            field: header.name,
            title: header.headers.toString().split('_').join(' '),
            align: 'center',
            valign: 'center',
           // class: header.name === 'test_datetime' ? 'bst-table-min-width' : undefined,
            sortable:true,
            visible:true,
            tooltip: true,
            formatter: function (value, row, index) {
              // console.log('this is the value ',value,row);
              return cellFormatter(value, row, index, header);

            }
          });
        });
      }

      function buildTableControls() {
        $scope.bsTableControl = {
          options: {
            data: $scope.encounters,
            rowStyle: function (row, index) {
              return {classes: 'none'};
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
            exportOptions: {fileName: ''},
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
        if (value === null) return '<span class="text-success"></span>';
        return value
      }

      /**
       * Function to add button on each cell
       */
      function cellFormatter(value, row, index, header) {

        if(header.name==='test_datetime') return '<div class="text-center" style="height:43px;width: 100px;!important;" ><span ' +
          'class="">'+ $filter('date')(row.test_datetime, 'dd-MM-yyyy')+'</span></div>';
        if (header.name === 'hiv_viral_load') return '<div class="text-center" style="height:43px!important;" >' +
          nullToEmptyString (row.hiv_viral_load) + '</div>';
        if (header.name === 'cd4_percent') return '<div class="text-center" style="height:43px!important;" >' +
          nullToEmptyString (row.cd4_percent) + '</div>';

        return ['<',
          ''  +row.patient_uuid +'">' + nullToEmptyString(value)
        ].join('');
      }

    }

    function labsSummaryLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);
        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.isBusy = false;
                scope.allDataLoaded = false;
                scope.nextStartIndex = 0;
                scope.encounters = [];
                scope.loadMoreLabs();
            }
        }
    }
})();
