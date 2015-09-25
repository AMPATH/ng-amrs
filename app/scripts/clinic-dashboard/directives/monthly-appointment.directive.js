/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.clinicDashboard')
        .directive('monthlyAppointment', appointmentSchedule);

    function appointmentSchedule() {
        return {
            restict: 'E',
            scope: { locationUuid: '@', selected: '=' },
            controller: monthlyAppointmentController,
            link: monthlyAppointmentLink,
            templateUrl: 'views/clinic-dashboard/monthly-appointment.html'
        };
    }

    monthlyAppointmentController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'MonthlyAppointmentModel', 'moment'];

    function monthlyAppointmentController($scope, $rootScope, EtlRestService, MonthlyAppointmentModel, moment) {
        var vm = this;
        vm.moment = moment;

        vm.loadSchedule = loadSchedule;

        vm.selectedMonth = new Date();

        $scope.previousMonth= previousMonth;

        $scope.nextMonth= nextMonth;

        vm.loadSchedule = loadSchedule;

        $scope.loadSchedule = loadSchedule;

        vm.viewDaysAppointments = viewDaysAppointments;

        function viewDaysAppointments(day) {
            $rootScope.$broadcast('viewDayAppointments', day);
        }
        function nextMonth () {
          $scope.selectedMonth(vm.selectedMonth.addMonths(1));

        }
        function previousMonth () {
          $scope.selectedMonth(vm.selectedMonth.addMonths(-1));
        }


      function loadSchedule() {
            if ($scope.isBusy === true) return;

            $scope.isBusy = true;
            $scope.experiencedLoadingError = false;

            $scope.appointments = [];

            if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getMonthlyAppointmentSchedule($scope.locationUuid, this.selectedMonth, onFetchAppointmentsScheduleSuccess, onFetchAppointmentScheduleFailed);
        }

        function onFetchAppointmentsScheduleSuccess(appointmentSchedule) {
            $scope.nextStartIndex = +appointmentSchedule.startIndex + appointmentSchedule.size;
            for (var e in appointmentSchedule.result) {
                $scope.appointments.push(new MonthlyAppointmentModel.monthlyAppointment(appointmentSchedule.result[e]));
            }
            $scope.isBusy = false;
        }

        function onFetchAppointmentScheduleFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
        }
    }

    function monthlyAppointmentLink(scope, element, attrs, vm) {
        attrs.$observe('locationUuid', onLocationUuidChanged);


        function onLocationUuidChanged(newVal, oldVal) {
            if (newVal && newVal != '') {
                vm.loadSchedule();
            }
        }

        //date selection
        scope.status = {
            startOpened: false
        };

        scope.startOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            scope.status.startOpened = true;
        };

        scope.appointments = [];

        scope.viewDaysAppointments = function (day) {
            scope.$parent.switchTabByIndex(1);
            vm.viewDaysAppointments(day.date.format());
        };



        scope.selectedMonth = function (value) {
            if (value) {
                vm.selectedMonth = value;
                //console.log(value);
                vm.loadSchedule();
                scope.bringCurrentMonthIntoView(new vm.moment(value));
            }
            else {
                return vm.selectedMonth;
            }
        };






      //calender view
        scope.selected = _removeTime(scope.selected || vm.moment());
        scope.month = scope.selected.clone();

        var start = scope.selected.clone();
        start.date(1);
        _removeTime(start.day(0));

        _buildMonth(scope, start, scope.month);

        scope.select = function (day) {
            scope.selected = day.date;
        };

        scope.next = function () {
            var next = vm.moment().month.clone();
            _removeTime(next.month(next.month() + 1)).date(1);
            scope.month.month(scope.month.month() + 1);
            _buildMonth(scope, next, scope.month);
        };

        scope.previous = function () {
            var previous = scope.month.clone();
            _removeTime(previous.month(previous.month() - 1).date(1));
            scope.month.month(scope.month.month() - 1);
            _buildMonth(scope, previous, scope.month);
        };

        scope.getData = function (day) {
            return "";

        }

        scope.bringCurrentMonthIntoView = function (day) {

            scope.selected = day;
            scope.month = scope.selected.clone();

            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);
        }


    }

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }



})();
