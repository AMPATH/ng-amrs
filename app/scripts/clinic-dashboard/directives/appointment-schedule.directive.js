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
            scope: { locationUuid: "@" },
            controller: appointmentScheduleController,
            link: appointmentScheduleLink,
            templateUrl: "views/clinic-dashboard/appointment-schedule.html"
        };
    }

    appointmentScheduleController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'AppointmentScheduleModel', 'moment', '$state'];

    function appointmentScheduleController($scope, $rootScope, EtlRestService, AppointmentScheduleModel, moment, $state) {
        $scope.patients = [];
        $scope.isBusy = false;

        $scope.moment = function day(date) {
            var day = new moment(date).format();;
            return day;
        };

        $scope.loadSchedule = loadSchedule;
        $scope.experiencedLoadingError = false;
        $scope.startDate = new Date();


        $scope.$on('viewDayAppointments', function (event, arg) {
            //console.log('view date:' + arg);
            $scope.selectedDate(arg);
        });

        $scope.status = {
            startOpened: false
        };

        $scope.startOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.startOpened = true;
        };


        $scope.selectedDate = function (value) {
            if (value) {
                $scope.startDate = value;
                loadSchedule();
            }
            else {
                return $scope.startDate;
            }
        };

        $scope.loadPatient = function (patientUuid) {
            /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
            $rootScope.broadcastPatient = _.find($scope.patients, function (patient) {
                if (patient.uuid() === patientUuid)
                { return patient; }
            });
            $state.go('patient', { uuid: patientUuid });
        };



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