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
            scope: {locationUuid: '@', selected: '='},
            controller: monthlyAppointmentController,
            link: monthlyAppointmentLink,
            templateUrl: 'views/clinic-dashboard/monthly-appointment.html'
        };
    }

    monthlyAppointmentController.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        'EtlRestService',
        'MonthlyAppointmentVisitModel',
        'moment',
        '$filter',
        'ClinicDashboardService'
    ];

    function monthlyAppointmentController($scope, $rootScope, $state, EtlRestService,
            MonthlyAppointmentVisitModel, moment, $filter, ClinicDashboardService) {
        var _this = this;
        _this.moment = moment;
        _this.loadSchedule = loadSchedule;
        _this.ClinicDashboardService = ClinicDashboardService;
        _this.selectedMonth = ClinicDashboardService.getSelectedMonth();
        _this.loadSchedule = loadSchedule;
        $scope.selectedMonth = ClinicDashboardService.getSelectedMonth();
        $scope.locationUuid = ClinicDashboardService.getSelectedLocation().Uuid;
        $scope.loadSchedule = loadSchedule;
        _this.viewDaysAppointments = viewDaysAppointments;
        _this.viewDaysNotReturnedAppointments = viewDaysNotReturnedAppointments;
        function viewDaysAppointments(day) {
            ClinicDashboardService.setStartDate(day);
            $rootScope.$broadcast('viewDayAppointments', day);
            $state.go('clinical-dashboard.daily-appointments');
        }

        function viewDaysNotReturnedAppointments(day) {
            ClinicDashboardService.setStartDate(day);
            $rootScope.$broadcast('viewDayNotReturnedAppointments', day);
            $state.go('clinical-dashboard.daily-appointments');
        }


        $scope.navigateMonth = function (value) {
            if (value) {
                $scope.selectedMonth(new Date(_this.selectedMonth).addMonths(value));
                var selectedDateField = document.getElementById('appointment-date');
                var element = angular.element(selectedDateField);
                element.val($filter('date')(_this.selectedMonth, 'mediumDate'));
                element.triggerHandler('input');
            }
        };

        function loadSchedule() {
            if ($scope.isBusy === true)
                return;
            $scope.isBusy = true;
            $scope.experiencedLoadingError = false;
            $scope.appointments = [];

            if ($scope.locationUuid && $scope.locationUuid !== '')
                var endDate = this.moment(this.selectedMonth).endOf('month').toDate().toISOString();
            var startDate = this.moment(this.selectedMonth).startOf('month').toDate();
            startDate = $filter('date')(startDate, 'yyyy-MM-dd', '+0300');
            endDate = $filter('date')(endDate, 'yyyy-MM-dd', '+0300');
            EtlRestService.getMonthlyAppointmentAndVisits($scope.locationUuid,
                    startDate, endDate, onFetchAppointmentsScheduleSuccess,
                    onFetchAppointmentScheduleFailed);
        }

        function onFetchAppointmentsScheduleSuccess(appointmentSchedule) {
            console.log('Loading appointments========>' + appointmentSchedule.size);
            $scope.nextStartIndex +=
                    appointmentSchedule.startIndex + appointmentSchedule.size;
            for (var e in appointmentSchedule.result) {
                $scope.appointments.push(
                        new MonthlyAppointmentVisitModel.MonthlyAppointmentVisit(
                                appointmentSchedule.result[e]));
            }

            $scope.isBusy = false;
        }

        function onFetchAppointmentScheduleFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
        }
    }

    function monthlyAppointmentLink(scope, element, attrs, _this) {
        attrs.$observe('locationUuid', onLocationUuidChanged);

        function onLocationUuidChanged(newVal, oldVal) {
            if (newVal && newVal != '') {
                _this.loadSchedule();
            }
        }

        //date selection
        scope.status = {
            startOpened: false,
        };

        scope.startOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            scope.status.startOpened = true;
        };

        scope.appointments = [];
        scope.viewDaysAppointments = function (day) {
            scope.$parent.switchTabByIndex(1);
            _this.ClinicDashboardService.setStartDate(day);
            _this.viewDaysAppointments(day.date.format());
        };
//view patients that dint return{as  scheduled} on a  given specified  date
        scope.viewDaysNotReturnedAppointments = function (day) {
            scope.$parent.switchTabByIndex(1);
            _this.ClinicDashboardService.setStartDate(day);
            _this.viewDaysAppointments(day.date.format());
        };

        scope.selectedMonth = function (value) {
            if (value) {
               console.log('Selected Date',value)
                _this.selectedMonth = value;
                _this.ClinicDashboardService.setSelectedMonth(new _this.moment(value));
                _this.ClinicDashboardService.setMonth(new _this.moment(value));
                _this.loadSchedule();
                scope.bringCurrentMonthIntoView(new _this.moment(value));
            } else {
                return _this.selectedMonth;
            }
        };

        //calender view
        scope.selected = _removeTime(scope.selected || _this.ClinicDashboardService.getMonth() || _this.moment());
        scope.month = scope.selected.clone();
        var start = scope.selected.clone();
        scope.month_title = _this.selectedMonth;
        scope.month.date();
        start.date(1);
        _removeTime(start.day(0));
        _buildMonth(scope, start, scope.month);
        scope.select = function (day) {
            this.ClinicDashboardService.setStartDate(day);
            scope.selected = day;

        };

        scope.next = function () {
            var next = _this.moment().month.clone();
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
            return '';
        };

        scope.bringCurrentMonthIntoView = function (day) {
            scope.selected = day;
            scope.month_title = _this.selectedMonth;
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);
        };

    }

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false;
        var date = start.clone();
        var monthIndex = date.month();
        var count = 0;
        while (!done) {
            scope.weeks.push({days: _buildWeek(date.clone(), month)});
            date.add(1, 'w');
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format('dd').substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), 'day'),
                date: date,
            });
            date = date.clone();
            date.add(1, 'd');
        }

        return days;
    }
})();
