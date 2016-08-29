/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .directive('patientListFilters', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        startDate: "=",
        endDate: "=",
        enabledControls: "=",
        supplementColumns: "=",
      },
      controller: patientListFiltersController,
      link: reportFiltersLink,
      templateUrl: "views/admin/patient-list-filter-controls.html"
    };
  }

  patientListFiltersController.$inject = ['$scope', '$rootScope', 'SearchDataService', 'moment', '$state', '$filter',
    'CachedDataService', 'LocationModel', 'OpenmrsRestService', 'EtlRestService'
  ];

  function patientListFiltersController($scope, $rootScope, SearchDataService, moment, $state, $filter, CachedDataService,
    LocationModel, OpenmrsRestService, EtlRestService) {


    $scope.canView = canView;
    $scope.patients = [];
    $scope.reInitialize = init;


    //Dynamic DataTable Params
    // $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function(val) {
      $scope.countBy = val;
    };

    $scope.patientTags = [{
      name: '#'
    }, {
      name: 'identifiers'
    }, {
      name: 'person_name'
    }, {
      name: 'gender'
    }, {
      name: 'age'
    }];
    if ($scope.supplementColumns) {
      $scope.patientTags = $scope.patientTags.concat($scope.supplementColumns);
    }
    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {
      options: {}
    };
    $scope.exportList = [{
      name: 'Export Basic',
      value: ''
    }, {
      name: 'Export All',
      value: 'all'
    }, {
      name: 'Export Selected',
      value: 'selected'
    }];
    $scope.exportDataType = $scope.exportList[1];
    $scope.updateSelectedType = function() {
      console.log('updateSelectedType', $scope.exportDataType.value, $scope.exportDataType.name);
      var bsTable = document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType: $scope.exportDataType.value
      });
    };


    $scope.$on("patient", function(event, data) {
      //use the data
      $scope.patients = data;
      buildDataTable();

    });

    //pre-load data
    init();

    function init() {

      if (canView('patientable')) buildDataTable();

    }

    function canView(param) {
      return $scope.enabledControls.indexOf(param) > -1;
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
      _.each($scope.patientTags, function(header) {
        //var visible =(header!=='location_uuid');
        $scope.columns.push({
          field: header.name,
          title: $filter('titlecase')(header.name.toString().split('_').join(' ')),
          align: 'center',
          valign: 'center',
          sortable: true,
          visible: true,
          tooltip: true,
          formatter: function(value, row, index) {
            return cellFormatter(value, row, index, header);

          },
          events: 'actionEvents'
        });
      });
    }

    //addding click event to bootstrap-table links
    window.actionEvents = {
      'click .clickLink': function(e, value, row, index) {
        console.log(row);
        //fetch patient based on uuid
        OpenmrsRestService.getPatientService().getPatientByUuid({
            uuid: row.patient_uuid
          },
          function(data) {
            $rootScope.broadcastPatient = data;
            $state.go('patient', {
              uuid: row.patient_uuid
            });
          });
      }
    };


    function buildTableControls() {
      console.log('got here list directive', $scope.patients)

      $scope.bsTableControl = {
        options: {
          data: $scope.patients,
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
          pagination: false,
          pageSize: 20,
          pageList: [5, 10, 25, 50, 100, 200],
          search: true,
          trimOnSearch: true,
          singleSelect: false,
          showColumns: true,
          showRefresh: true,
          showMultiSort: false,
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
            fileName: 'hivSummaryIndicators'
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
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      var numbers = 1 + (index);
      $scope.selectedLocation = row.location_id;
      if (header.name === '#') return '<div class="text-center" style="width:43px;height:23px!important;" >' +
        '<span class="text-info text-capitalize">' + numbers + '</span></div>';

      return ['<a class="clickLink"',
        'title="  " data-toggle="tooltip"',
        'data-placement="top"',
        'href="javascript:void(0)" >' + value + '</a>'
      ].join('');
    }


  }


  function reportFiltersLink(scope, element, attrs, vm) {

    if (!_.isUndefined(scope.$parent.data) && scope.$parent.data.length > 0) {
      scope.patients = scope.$parent.data;
    }
    scope.reInitialize();
  }
})();
