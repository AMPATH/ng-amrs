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
    'AppointmentScheduleModel', 'moment', '$state', '$filter', 'ClinicDashboardService', 'OpenmrsRestService','$timeout'
  ];

  function appointmentScheduleController($scope, $rootScope, $stateParams, EtlRestService,
    AppointmentScheduleModel, moment, $state, $filter, ClinicDashboardService, OpenmrsRestService,$timeout) {

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
      $scope.allDataLoaded4DailyNotReturnedVisits = false;
      //Pagination Params 4 getDailyNotReturnedVisits
      $scope.nextIndex = 0;
      $scope.patients = [];
    }

    function loadSchedule(loadNextOffset) {
      $scope.experiencedLoadingError = false;
      $scope.experiencedVisitsLoadingError = false;


      if ($scope.isBusy === true || $scope.isBusyVisits) {
        return;
      }
      if (loadNextOffset !== true) resetPaging();

      $scope.isBusy = true;

      if ($scope.locationUuid && $scope.locationUuid !== '') {

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
          patient_uuid: patient.uuid(),
          identifiers: patient.identifiers(),
          person_name: patient.givenName() + ' ' + patient.familyName() + ' ' + patient.middleName(),
          gender: patient.gender(),
          age : patient.age(),
          rtc_date: patient.rtc_date(),
          status: Math.round(Math.abs((patient.rtc_date()) - (patient.next_encounter_datetime())) / 8.64e7) <= 7
        };
        // console.log('Use (rtc_date - next_encounter_datetime) to determine if the row should be highlighted:', singlePatient.status);
        $scope.customPatients.push(singlePatient);


      });
      $rootScope.$broadcast("patient", $scope.customPatients);
      $scope.isBusyVisits = false;
      $scope.isBusy = false;



    }

    function onLoadPatientsFailed(error) {
      $scope.experiencedVisitsLoadingError = true;
      $scope.isBusyVisits = false;
      $scope.isBusy = false;
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
