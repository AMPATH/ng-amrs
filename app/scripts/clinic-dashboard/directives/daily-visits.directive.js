/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .directive('dailyVisits', appointmentSchedule);

  function appointmentSchedule() {
    return {
      restict: 'E',
      scope: {
        locationUuid: '@',
        reportName: '@',
        viewTitle: '@'
      },
      controller: appointmentScheduleController,
      link: appointmentScheduleLink,
      templateUrl: 'views/clinic-dashboard/daily-visits.html'
    };
  }

  appointmentScheduleController.$inject = ['$scope', '$rootScope', '$stateParams', 'EtlRestService',
    'AppointmentScheduleModel', 'moment', '$state', '$filter', 'ClinicDashboardService', 'OpenmrsRestService',
  ];

  function appointmentScheduleController($scope, $rootScope, $stateParams, EtlRestService,
    AppointmentScheduleModel, moment, $state, $filter, ClinicDashboardService, OpenmrsRestService) {

    //scope members region
    $scope.visitPatients = [];
    $scope.appointmentPatients = [];
    $scope.searchString = '';
    $scope.visitSearchString = '';
    $scope.appointmentSearchString = '';
    $scope.isBusy = false;
    $scope.isBusyVisits = false;
    $scope.experiencedLoadingError = false;
    $scope.experiencedVisitsLoadingError = false;
    $scope.currentPage = 1;
    $scope.loadSchedule = loadSchedule;
   // $scope.loadPatient = loadPatient;
    $scope.utcDateToLocal = utcDateToLocal;
    $scope.startDate = ClinicDashboardService.getStartDate();
    $scope.showVisits = false;
    $scope.showAppointments = true;
    $scope.showNoreturn = false;
    $scope.currentView = 'Appointments';
    $scope.selectedDate = function(value) {
      if (value) {
        $scope.startDate = value;
        ClinicDashboardService.setStartDate(value);
        loadSchedule();
      } else {
        return $scope.startDate;
      }
    };

    $scope.openDatePopup = openDatePopup;
    $scope.dateControlStatus = {
      startOpened: false,
    };
    $scope.navigateDay = function(value) {
      if (value) {
        $scope.selectedDate(new Date($scope.startDate).addDays(value));
        var selectedDateField = document.getElementById('start-date');
        var element = angular.element(selectedDateField);
        element.val($filter('date')($scope.startDate, 'mediumDate'));
        element.triggerHandler('input');
      }
    };


    //Dynamic DataTable Params
    // $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function (val) {
      $scope.countBy = val;
      // loadHivSummaryIndicators()
    };


    $scope.patientTags = [
      {
        name:'#'
      },
      {
        name:'identifier'
      },
      {
        name:'name'
      }
    ];

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

    function openDatePopup($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dateControlStatus.startOpened = true;
    }

    function utcDateToLocal(date) {
      var day = new moment(date).format();
      return day;
    }

    function resetPaging() {
      $scope.startIndex = 0;
      $scope.allDataLoaded = false;
      //Pagination Params 4 getDailyNotReturnedVisits
      $scope.nextIndex = 0;
      $scope.patients = [];
    }

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        console.log('ToState',toState);
        console.log('FromState',fromState);
        if ((toState.name === 'patient' &&
          fromState.name === 'clinical-dashboard.daily-appointments.visits')||
          (toState.name === 'patient' &&
          fromState.name === 'clinical-dashboard.daily-appointments.appointments')||
          (toState.name === 'patient' &&
          fromState.name === 'clinical-dashboard.daily-appointments.has-not-returned')

        )
        $rootScope.broadcastPatient = _.find($scope.customPatientList, function(p){
          if(p.uuid() === toParams.uuid) return p;
        });

      });

    function loadSchedule(loadNextOffset) {


      if ($scope.isBusy === true || $scope.isBusyVisits) {
        return;
      }
      if (loadNextOffset !== true) resetPaging();
      $scope.experiencedLoadingError = false;
      $scope.experiencedVisitsLoadingError = false;

      if ($scope.locationUuid && $scope.locationUuid !== '') {

        $scope.isBusy = true;
        EtlRestService.getDailyPatientList($scope.locationUuid, $scope.reportName,
          moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment($scope.startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          onLoadPatientsSuccess, onLoadPatientsFailed, $scope.nextIndex, 300);
      }

    }
    function onLoadPatientsSuccess(appointmentSchedule) {
      $scope.nextIndex += appointmentSchedule.size;
      if (appointmentSchedule.size === 0) {
        $scope.allDataLoaded4DailyNotReturnedVisits = true;
      } else {
        for (var e in appointmentSchedule.result) {
          $scope.patients.push(new AppointmentScheduleModel.appointmentSchedule(appointmentSchedule.result[e]));

        }
      }

      $scope.customPatients = [];
      _.each($scope.patients, function(patient) {
        var singlePatient = {
          uuid: patient.uuid(),
          identifier: patient.identifiers(),
          name: patient.givenName() + ' ' + patient.familyName() + ' ' + patient.middleName(),
          rtc_date: patient.rtc_date(),
          status: Math.round(Math.abs((patient.rtc_date()) - (patient.next_encounter_datetime())) / 8.64e7) <= 7
        };
        // console.log('Use (rtc_date - next_encounter_datetime) to determine if the row should be highlighted:', singlePatient.status);
        $scope.customPatients.push(singlePatient);

        _.each($scope.customPatients, function(p){
          $scope.customPatientList = [];
          OpenmrsRestService.getPatientService().getPatientByUuid({
              uuid: p.uuid
            },
            function(patient) {
              $scope.customPatientList.push(patient);
            });
        });

      });

      $scope.isBusyVisits = false;
      $scope.isBusy = false;
      buildDataTable();
    }

    function onLoadPatientsFailed(error) {
      $scope.experiencedVisitsLoadingError = true;
      $scope.isBusyVisits = false;
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
      _.each($scope.patientTags, function (header) {
        //var visible =(header!=='location_uuid');
        $scope.columns.push({
          field: header.name,
          title: $filter('titlecase')(header.name),
          align: 'center',
          valign: 'center',
          sortable:true,
          visible:true,
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
          data: $scope.customPatients,
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
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      var numbers = 1 + (index);
      if (header.name === '#') return '<div class="text-center" style="width:43px;height:23px!important;" >' +
        '<span class="text-info text-capitalize">' + numbers + '</span></div>';
      return ['<a class=""',
        'title="  " data-toggle="tooltip"',
        'data-placement="top"',
        'href="#/patient/'  +row.uuid +'">' + value + '</a>'
      ].join('');
    }




  }

  function appointmentScheduleLink(scope, element, attrs, vm) {
    attrs.$observe('locationUuid', onLocationUuidChanged);

    function onLocationUuidChanged(newVal, oldVal) {
      if (newVal && newVal != '') {
        scope.isBusy = false;
        scope.visitPatients = [];
        scope.appointmentPatients = [];
        scope.loadSchedule();
      };
    }
  }
})();
