/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.clinicDashboard')
        .directive('appointmentSchedule', appointmentSchedule);

    function appointmentSchedule() {
        return {
            restict: "E",
            scope: { locationUuid: "@"
            },
            controller: appointmentScheduleController,
            link: appointmentScheduleLink,
            templateUrl: "views/clinic-dashboard/appointment-schedule.html"
        };
    }

    appointmentScheduleController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'AppointmentScheduleModel', 'moment', '$state'];

    function appointmentScheduleController($scope, $rootScope, EtlRestService, AppointmentScheduleModel, moment, $state) {

        //scope members region
        $scope.patients = [];
        $scope.searchString='';
        $scope.isBusy = false;
        $scope.experiencedLoadingError = false;
        $scope.currentPage = 1;

        $scope.loadSchedule = loadSchedule;
        $scope.loadPatient = loadPatient;
        $scope.$on('viewDayAppointments',onViewDayAppointmentBroadcast);


        $scope.utcDateToLocal = utcDateToLocal;

        $scope.startDate = new Date();
        $scope.selectedDate = function (value) {
            if (value) {
                $scope.startDate = value;
                loadSchedule();
            }
            else {
                return $scope.startDate;
            }
        };

        $scope.openDatePopup = openDatePopup;
        $scope.dateControlStatus = {
            startOpened: false
        };

        //end scope members region

        function onViewDayAppointmentBroadcast(event, arg) {
            $scope.selectedDate(arg);
        }


        function openDatePopup ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateControlStatus.startOpened = true;
        };



        function utcDateToLocal(date) {
            var day = new moment(date).format();;
            return day;
        }



        function loadPatient(patientUuid) {
            /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
            $rootScope.broadcastPatient = _.find($scope.patients, function (patient) {
                if (patient.uuid() === patientUuid)
                { return patient; }
            });
            $state.go('patient', { uuid: patientUuid });
        }



        function loadSchedule() {


            if ($scope.isBusy === true) return;

            $scope.isBusy = true;
            $scope.patients = [];
            $scope.experiencedLoadingError = false;

            if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getAppointmentSchedule($scope.locationUuid, moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'), moment($scope.startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'), onFetchAppointmentsScheduleSuccess, onFetchAppointmentScheduleFailed);
        }

        function onFetchAppointmentsScheduleSuccess(appointmentSchedule) {
            $scope.nextStartIndex = +appointmentSchedule.startIndex + appointmentSchedule.size;
            for (var e in appointmentSchedule.result) {
                $scope.patients.push(new AppointmentScheduleModel.appointmentSchedule(appointmentSchedule.result[e]));
            }
          console.log("Appointment patient---", $scope.patients);
          $scope.customPatients =[];
          _.each($scope.patients, function(patient)
          {
            var singlePatient={
                uuid:patient.uuid(),
                identifier:patient.identifiers(),
                name:patient.givenName()+' '+patient.familyName()+' '+patient.middleName()
              }
            $scope.customPatients.push(singlePatient);

          });
            $scope.isBusy = false;
        }

        function onFetchAppointmentScheduleFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
        }
    }

    function appointmentScheduleLink(scope, element, attrs, vm) {
        attrs.$observe('locationUuid', onLocationUuidChanged);


        function onLocationUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.isBusy = false;
                scope.patients = [];
                scope.loadSchedule();
            }
        }
    }

})();
