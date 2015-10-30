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
          },
          controller: appointmentScheduleController,
          link: appointmentScheduleLink,
          templateUrl: 'views/clinic-dashboard/daily-visits.html',
        };
    }

  appointmentScheduleController.$inject = ['$scope', '$rootScope', 'EtlRestService',
  'AppointmentScheduleModel', 'moment', '$state', '$filter', 'ClinicDashboardService', 'OpenmrsRestService',];

  function appointmentScheduleController($scope, $rootScope, EtlRestService,
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
      $scope.loadPatient = loadPatient;
      $scope.$on('viewDayAppointments', onViewDayAppointmentBroadcast);
      $scope.utcDateToLocal = utcDateToLocal;
      $scope.startDate = ClinicDashboardService.getStartDate();
      $scope.showVisits = false;
      $scope.showAppointments = true;
      $scope.toggleAppointmentVisits = toggleAppointmentVisits;

      $scope.selectedDate = function(value) {
          if (value) {
            $scope.startDate = value;
            ClinicDashboardService.setStartDate(value);
            loadSchedule();
          }else {
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

      //end scope members region

      function toggleAppointmentVisits() {
          if ($scope.showAppointments) {
            $scope.showAppointments = false;
            $scope.showVisits = true;
          }else {
            $scope.showVisits = false;
            $scope.showAppointments = true;
          }
        }

      function onViewDayAppointmentBroadcast(event, arg) {
          $scope.selectedDate(arg);
        }

      function openDatePopup($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.dateControlStatus.startOpened = true;
        };

      function utcDateToLocal(date) {
        var day = new moment(date).format();
        return day;
      }

      function loadPatient(patientUuid) {
          /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
          OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
                        function(data) {
                          $rootScope.broadcastPatient = data;
                          $state.go('patient', { uuid: patientUuid });
                        }

                        );
        }

      function loadSchedule() {

        if ($scope.isBusy === true || $scope.isBusyVisits) return;
        $scope.isBusy = true;
        $scope.isBusyVisits = true;
        $scope.visitPatients = [];
        $scope.appointmentPatients = [];
        $scope.experiencedLoadingError = false;
        $scope.experiencedVisitsLoadingError = false;

        if ($scope.locationUuid && $scope.locationUuid !== '') {
          //Fetch Daily visits
          EtlRestService.getDailyVisits($scope.locationUuid,
                    moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    moment($scope.startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    onFetchDailyVisitsSuccess, onFetchDailyVisitsFailed);

          //Fetch daily appointments
          EtlRestService.getAppointmentSchedule($scope.locationUuid,
                    moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    moment($scope.startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    onFetchAppointmentsScheduleSuccess, onFetchAppointmentScheduleFailed);

        }

      }

      function onFetchAppointmentsScheduleSuccess(appointmentSchedule) {
          $scope.nextStartIndex = +appointmentSchedule.startIndex + appointmentSchedule.size;
          for (var e in appointmentSchedule.result) {
            $scope.appointmentPatients.push(new AppointmentScheduleModel.appointmentSchedule(appointmentSchedule.result[e]));
          }

          $scope.customAppointmentPatients = [];
          _.each($scope.appointmentPatients, function(patient)
          {
            var singlePatient = {
              uuid:patient.uuid(),
              identifier:patient.identifiers(),
              name:patient.givenName() + ' ' + patient.familyName() + ' ' + patient.middleName(),
              rtc_date:patient.rtc_date(),
              status:Math.round(Math.abs((patient.rtc_date()) - (patient.next_encounter_datetime()))/8.64e7) <= 7,

            };
            console.log('Use (rtc_date - next_encounter_datetime) to determine if the row should be highlighted:', singlePatient.status);
            $scope.customAppointmentPatients.push(singlePatient);

          });

          $scope.isBusy = false;
        }

      function onFetchAppointmentScheduleFailed(error) {
          $scope.experiencedLoadingError = true;
          $scope.isBusy = false;
        }

      function onFetchDailyVisitsSuccess(appointmentSchedule) {
          $scope.nextStartIndex = +appointmentSchedule.startIndex + appointmentSchedule.size;
          for (var e in appointmentSchedule.result) {
            $scope.visitPatients.push(new AppointmentScheduleModel.appointmentSchedule(appointmentSchedule.result[e]));
          }

          $scope.customPatients = [];
          _.each($scope.visitPatients, function(patient)
          {
            var singlePatient = {
              uuid:patient.uuid(),
              identifier:patient.identifiers(),
              name:patient.givenName() + ' ' + patient.familyName() + ' ' + patient.middleName(),
              rtc_date:patient.rtc_date(),
              status:Math.round(Math.abs((patient.rtc_date()) - (patient.next_encounter_datetime()))/8.64e7)<=7
            };
            console.log('Use (rtc_date - next_encounter_datetime) to determine if the row should be highlighted:', singlePatient.status);
            $scope.customPatients.push(singlePatient);

          });

          $scope.isBusyVisits = false;
        }

      function onFetchDailyVisitsFailed(error) {
          $scope.experiencedVisitsLoadingError = true;
          $scope.isBusyVisits = false;
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
