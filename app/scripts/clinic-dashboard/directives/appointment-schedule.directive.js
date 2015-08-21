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

    appointmentScheduleController.$inject = ['$scope', 'EtlRestService', 'AppointmentScheduleModel'];

    function appointmentScheduleController($scope, EtlRestService, AppointmentScheduleModel) {
        $scope.patients = [];
        $scope.isBusy = false;
        $scope.loadSchedule = loadSchedule;
        $scope.experiencedLoadingError = false;
        $scope.startDate = new Date();
        $scope.endDate = new Date();

        $scope.status = {
            endOpened: false,
            startOpened: false
        };

        $scope.startOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.startOpened = true;
        };

        $scope.endOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.endOpened = true;
        };

        function loadSchedule() {
            if ($scope.isBusy === true) return;

            $scope.isBusy = true;
            $scope.experiencedLoadingError = false;

            if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getAppointmentSchedule($scope.locationUuid, $scope.startDate, $scope.endDate, onFetchAppointmentsScheduleSuccess, onFetchAppointmentScheduleFailed);
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