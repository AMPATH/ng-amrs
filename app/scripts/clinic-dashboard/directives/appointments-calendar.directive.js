/*jshint -W003, -W098, -W033 , -W106 ,-W116 */
(function() {
  'use strict';
  angular
    .module('app.clinicDashboard')
    .directive('appointmentsCalendar', appointmentCalendar);

  function appointmentCalendar() {
    return {
      restict: 'E',
      scope: {
        locationUuid: '@',
        selected: '='
      },
      controller: appointmentCalendarController,
      link: monthlyAppointmentLink,
      templateUrl: 'views/clinic-dashboard/appointments-calendar.html'
    };
  }
  appointmentCalendarController.$inject = [
    '$scope', '$rootScope', 'moment', '$filter', '$http', '$q', 'ClinicDashboardService',
    'EtlRestServicesSettings', 'calendarConfig', '$state'
  ];

  function appointmentCalendarController($scope, $rootScope, moment, $filter, $http,
    $q, ClinicDashboardService, EtlRestServicesSettings, calendarConfig, $state) {
    calendarConfig.templates.calendarMonthCell = 'customMonthCell.html';
    calendarConfig.templates.calendarSlideBox = 'calendarSlideBox.html';
    $scope.events = [];
    $scope.calendarView = 'month';
    $scope.viewDate = ClinicDashboardService.getStartDate();
    $scope.$on('$destroy', function() {
      calendarConfig.templates.calendarSlideBox = 'mwl/calendarSlideBox.html';
      calendarConfig.templates.calendarMonthCell = 'mwl/customMonthCell.html';
    });
    $scope.getAppointments = function(event) {
      getAppointments();
    }
    $scope.eventClicked = function(event) {
      if (event.type === 'info') {
        //Redirect Appointments
      } else if (event.type === 'success') {
        //Redirect Attended
      } else if (event.type === 'warning') {
        //Redirect to not attended
      } else if (event.type === 'important') {
        //Redirect to important
      }
      ClinicDashboardService.setStartDate(event.startsAt);
      $state.go('clinical-dashboard.daily-appointments');
    };
    $scope.events = [

    ]
    var selectedDateField = document.getElementById('start-date');
    var element = angular.element(selectedDateField);
    element.val($filter('date')($scope.viewDate, 'mediumDate'));
    element.triggerHandler('input');
    getAppointments();
    $rootScope.$on('location:change', function(event) {
      //console.log('Location Changed====>',ClinicDashboardService.getSelectedLocation());
      getAppointments();
    });
    $scope.calendarEvent = function(event) {
      console.log(event);
    }
    $scope.cellModifier = function(event) {
      console.log('Cell', event);
    }

    function getAppointments() {
      if ($scope.isBusy === true)
        return;
      $scope.isBusy = true;
      $scope.experiencedLoadingError = false;
      var momentDate = moment($scope.viewDate);
      var endDate = momentDate.clone().endOf('month');
      var startDate = momentDate.clone().startOf('month');
      var formatedStartDate = startDate.format('YYYY-MM-DD');
      var formatedEndDate = endDate.format('YYYY-MM-DD');

      var events = [];
      var path = EtlRestServicesSettings.getCurrentRestUrlBase().trim() +
        'get-report-by-report-name';
      var attented = $http.get(path, {
        params: {
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          groupBy: 'groupByPerson,groupByd',
          locationUuids: $scope.locationUuid,
          report: 'attended'
        }
      });
      var appointments = $http.get(path, {
        params: {
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          groupBy: 'groupByd',
          locationUuids: $scope.locationUuid,
          report: 'appointments'
        }
      });
      $q.all([attented, appointments]).then(function(arrayOfResults) {
        for (var i in arrayOfResults) {
          var results = arrayOfResults[i].data.result;
          for (var j in results) {
            var result = results[j];
            if (result.attended) {
              var attended = {
                title: result.attended + ' ',
                type: 'success',
                labelType: 'success',
                startsAt: new Date(result.d),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false
              };
              events.push(attended);
            } else if (result.scheduled) {
              var scheduled = {
                title: result.scheduled + ' ',
                type: 'info',
                labelType: 'info',
                startsAt: new Date(result.d),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false
              };

              var hasNotReturned = {
                title: result.has_not_returned + ' ',
                type: 'warning',
                labelType: 'warning',
                startsAt: new Date(result.d),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false
              };

              var defaulted = {
                title: result.defaulted + ' ',
                type: 'important',
                labelType: 'danger',
                startsAt: new Date(result.d),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false
              };
              events.push(scheduled);
              events.push(hasNotReturned);
              events.push(defaulted);
            }
          }
        }
        $scope.isBusy = false;
        $scope.events = events;
      });
    }

  }

  function monthlyAppointmentLink() {

  }


})();
