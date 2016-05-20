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
      templateUrl: 'views/clinic-dashboard/appointments-calendar.html'
    };
  }
  appointmentCalendarController.$inject = [
    '$scope', '$rootScope', 'moment', '$filter', '$http', '$q', 'ClinicDashboardService',
    'EtlRestServicesSettings', 'calendarConfig', '$state','$loading'
  ];

  function appointmentCalendarController($scope, $rootScope, moment, $filter, $http,
    $q, ClinicDashboardService, EtlRestServicesSettings, calendarConfig, $state,$loading) {
    calendarConfig.templates.calendarMonthCell = 'customMonthCell.html';
    calendarConfig.templates.calendarSlideBox = 'calendarSlideBox.html';
    $scope.events = [];
    $scope.calendarView = 'month';
    $scope.viewDate = ClinicDashboardService.getStartDate();
    //TODO: Find out why the following was necessary
    // $scope.$on('$destroy', function() { 
    //   calendarConfig.templates.calendarSlideBox = 'mwl/calendarSlideBox.html';
    //   calendarConfig.templates.calendarMonthCell = 'mwl/customMonthCell.html';
    // });
    $scope.getAppointments = function(event) {
      getAppointments();
    }
    $scope.eventClicked = function(event) {
      if (event.type === 'info') {
        $state.go('clinical-dashboard.daily-appointments.appointments', {view:'appointments'})
      } else if (event.type === 'success') {
        $state.go('clinical-dashboard.daily-appointments.visits', {view:'attended'})
      } else if (event.type === 'warning') {
          $state.go('clinical-dashboard.daily-appointments.has-not-returned',{view:'notReturned'});
      } else if (event.type === 'important') {
        //Redirect to important
      }
      ClinicDashboardService.setStartDate(event.startsAt);
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
      var attended = $http.get(path, {cache: true,
        params: {
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          groupBy: 'groupByPerson,groupByAttendedDate,groupByEncounter',
          locationUuids: $scope.locationUuid,
          report: 'attended',
          limit: 1000000
        }
      });
      var appointments = $http.get(path, {cache: true,
        params: {
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          groupBy: 'groupByPerson,groupByAttendedDate,groupByRtcDate',
          locationUuids: $scope.locationUuid,
          report: 'scheduled',
          limit: 1000000
        }
      });
      isBusy(true);
      $q.all([attended, appointments]).then(function(arrayOfResults) {
        for (var i in arrayOfResults) {
          var results = arrayOfResults[i].data.result;
          for (var j in results) {
            var result = results[j];
            if (result.attended) {
              var attended = {
                title: result.attended + ' ',
                type: 'success',
                labelType: 'success',
                label: 'Visits',
                startsAt: new Date(result.attended_date),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false,
                locationUuid:$scope.locationUuid,
                tab:'visits'
              };
              if (result.attended > 0)
                events.push(attended);
            } else if (result.scheduled) {
              var scheduled = {
                title: result.scheduled + ' ',
                type: 'info',
                labelType: 'info',
                label: 'Appointments',
                startsAt: new Date(result.scheduled_date),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false,
                locationUuid:$scope.locationUuid,
                tab:'appointments'
              };

              var hasNotReturned = {
                title: result.has_not_returned + ' ',
                type: 'warning',
                labelType: 'warning',
                label: 'Not Returned',
                startsAt: new Date(result.scheduled_date),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false,
                locationUuid:$scope.locationUuid,
                tab:'has-not-returned'
              };

              var defaulted = {
                title: result.defaulted + ' ',
                type: 'important',
                labelType: 'danger',
                label: 'Defaulted',
                startsAt: new Date(result.scheduled_date),
                draggable: false,
                incrementsBadgeTotal: false,
                resizable: false,
                locationUuid:$scope.locationUuid
              };
              if(result.scheduled > 0)
                events.push(scheduled);
              if(result.has_not_returned > 0)
                events.push(hasNotReturned);
              // events.push(defaulted);
            }
          }
        }
        $scope.isBusy = false;
        isBusy(false);
        $scope.events = events;
      },function () {
        $scope.isBusy = false;
        isBusy(false);
        $scope.experiencedLoadingError = true;
      });
    }
    function isBusy(val) {
      if (val === true) {
        $loading.start('calendarViewLoader');
      } else {
        $loading.finish('calendarViewLoader');
      }
    }

  }


})();
