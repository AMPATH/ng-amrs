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

    appointmentScheduleController.$inject = ['$scope', 'EtlRestService', 'AppointmentScheduleModel', 'moment'];

    function appointmentScheduleController($scope, EtlRestService, AppointmentScheduleModel, moment) {
        $scope.patients = [];
        $scope.isBusy = false;
        
        $scope.moment = function day(date){
            var day = new moment(date).format();;
            return day;
        };
        
        $scope.loadSchedule = loadSchedule;
        $scope.experiencedLoadingError = false;
        $scope.startDate = new Date();

        $scope.status = {
            startOpened: false
        };

        $scope.startOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.startOpened = true;
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