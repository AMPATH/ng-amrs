(function () {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .directive('clinicLabOrder', clinicLabOrder);

  clinicLabOrder.$inject = [];
  function clinicLabOrder() {
    var directive = {
      bindToController: false,
      controller: labOrdersController,
      link: labOrdersLink,
      restrict: 'E',
      templateUrl: 'views/clinic-dashboard/clinic-lab-orders.html',
      scope: {
        locationUuid: '@',
        selectedLocations:"="
      }
    };
    return directive;

    function labOrdersLink(scope, element, attrs, vm) {

      attrs.$observe('locationUuid', onLocationUuidChanged);

      function onLocationUuidChanged(newVal, oldVal) {
        if (newVal && newVal != '') {
          scope.loadLabOrders();
        };
      }
    }
  }
  labOrdersController.$inject = ['$scope', '$rootScope', '$stateParams',
    '$state', 'EtlRestService', 'moment', 'ClinicDashboardService',
    'OpenmrsRestService', '$filter'];
  function labOrdersController($scope, $rootScope, $stateParams,
                                 $state, EtlRestService, moment, ClinicDashboardService, OpenmrsRestService,
                                 $filter) {

    //scope variables
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.labOrders =[];

    //getter setter binding
    $scope.startDate = ClinicDashboardService.getStartDate() || new Date();
    $scope.selectedDate = function (value) {
      if (value) {
        $scope.startDate = value;
        ClinicDashboardService.setStartDate(value);
        $scope.loadLabOrders();
      } else {
        return $scope.startDate;
      }
    };
    //
    //DataTable Options for providers
    $scope.columns = [];
    $scope.bsTableControls = {options: {}};
    $scope.exportList = [
      {name: 'Export Basic', value: ''},
      {name: 'Export All', value: 'all'},
      {name: 'Export Selected', value: 'selected'}];
    $scope.exportDataType = $scope.exportList[1];
    $scope.updateSelectedType = function () {
      console.log($scope.exportDataType.value, $scope.exportDataType.name);
      var bsTable = document.getElementById('bsTable1');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType: $scope.exportDataType.value
      });
    };

    //date controll functions

    $scope.openDatePopup = openDatePopup;
    $scope.dateControlStatus = {
      startOpened: false,
    };
    $scope.navigateDay = navigateDay;

    //columns for locations stats wait time
    $scope.labOrdersColumn =[
      {
        name: '#',
        headers:'#'
      },
      {
        name: 'location',
        headers:'location'
      },
      {
        name: 'identifiers',
        headers:'identifiers'
      },
      {
        name: 'person_name',
        headers:'person_name'
      },
      {
        name: 'order_no',
        headers:'order_no'
      },

      {
        name: 'date_activated',
        headers:'date_Ordered'
      }
    ];

    //methods
    $scope.loadLabOrders = loadLabOrders;
    $scope.utcDateToLocal = utcDateToLocal;

    activate();

    function activate() {

    }

    function openDatePopup($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dateControlStatus.startOpened = true;
    }


    function utcDateToLocal(date) {
      var day = new moment(date).format();
      return day;
    }

    function navigateDay(value) {
      if (value) {
        $scope.selectedDate(new Date($scope.startDate).addDays(value));
        var selectedDateField = document.getElementById('start-date');
        var element = angular.element(selectedDateField);
        element.val($filter('date')($scope.startDate, 'mediumDate'));
        element.triggerHandler('input');
      }
    }

    function loadLabOrders() {
      if ($scope.isBusy) return;

      $scope.isBusy = true;
      var selectedLocations = getSelectedLocations();

      EtlRestService.
        getClinicLabOrdersData(selectedLocations, $scope.startDate,
        loadLabOrdersSuccessful, loadLabOrdersFailed);

    }

    function loadLabOrdersSuccessful(results) {

      $scope.labOrders=results.result;
      console.log('labOrders', $scope.labOrders);
      $scope.isBusy = false;
      buildLabOrdersTable();

    }

    function loadLabOrdersFailed(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function getSelectedLocations() {
      if ($stateParams.locationuuid) {
        return $stateParams.locationuuid;
      }
      if ($scope.selectedLocations) {
        var selectedLocationObject = $scope.selectedLocations;
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
      } else {
        return undefined;
      }

    }

    function buildLabOrdersTable() {
      buildColumns();
      buildTableControls();


    }

    function buildColumns() {
      $scope.columns = [];
      _.each($scope.labOrdersColumn, function (header) {
        //var visible =(header!=='location_uuid');
        $scope.columns.push({
          field: header.name,
          title: $filter('titlecase')(header.headers.toString().split('_').join(' ')),
          align: 'center',
          valign: 'center',
          sortable:true,
          visible:true,
          tooltip: true,
          formatter: function (value, row, index) {
            return cellFormatter(value, row, index, header);

          },
          events:'actionEvents'
        });
      });

    }

    //addding click event to bootstrap-table links
    window.actionEvents = {
      'click .clickLink': function (e, value, row, index) {
        console.log('row',row);
        //fetch patient based on uuid
        OpenmrsRestService.getPatientService().getPatientByUuid({
            uuid: row.patient_uuid
          },
          function(data) {
            $rootScope.broadcastPatient = data;
            $state.go('patient', {uuid: row.patient_uuid});
          });
      }
    };


    function buildTableControls() {
      $scope.bsTableControls = {
        options: {
          data: $scope.labOrders,
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
          pagination: false,
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
          idField: 'visit_id',
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
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      var numbers = 1 + (index);
      if (header.name === '#') return '<div class="text-center" style="width:43px;height:23px!important;" >' +
        '<span class="text-info text-capitalize">' + numbers + '</span></div>';

      if(header ==='location'){
        return '<div class="" style="padding: inherit; width:100%; max-width: 300px" ><span ' +
          'class="text-info text-capitalize">'+value+'</span></div>';

      }
      if(header.name==='date_activated') return '<div class="text-center" style="height:43px!important;" ><span ' +
        'class="text-info text-capitalize">'+ $filter('date')(row.date_activated, 'dd-MM-yyyy')+'</span>';

      if (value === null || value === undefined) {
        return '-';
      }

      return ['<a class="clickLink"',
        'title="  " data-toggle="tooltip"',
        'data-placement="top"',
        'href="javascript:void(0)" >' + value + '</a>'
      ].join('');

    }

  }
})();
