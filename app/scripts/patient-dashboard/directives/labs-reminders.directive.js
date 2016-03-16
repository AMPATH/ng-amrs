/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('labsReminder', labsReminder);

  function labsReminder() {
    var directive = {
      restrict: 'E',
      scope: {patientUuid: '@'},
      controller: labsReminderController,
      templateUrl: "views/patient-dashboard/reminder.html"
    };

    return directive;
  }

  labsReminderController.$inject = ['$scope', '$rootScope', 'EtlRestService', '$state'];

  function labsReminderController($scope, $rootScope, EtlRestService, $state) {
    //report params
    $scope.reportName='clinical-reminder-report';
    $scope.reminderIndicators='needs_vl_coded,overdue_vl_lab_order'; //comma separated indicators
    $scope.referenceDate= new Date();

    //initialize notification options
    $scope.notificationOptions = {
      position: {
        pinned: true,
        bottom: 60,
        right: 30
      },
      animation: {
        open: {
          effects: "slideIn:left fadeIn",
          duration: 1000
        },
        close: {
          effects: "slideIn:left",
          reverse: true
        }
      },
      button: true,
      autoHideAfter: 0,
      stacking: 'up',
      templates: [{
        type: 'info',
        template: $('#infoTemplate').html()
      }, {
        type: 'warning',
        template: $('#warningTemplate').html()
      }, {
        type: 'success',
        template: $('#successTemplate').html()
      }]

    };
    //get notification control object
    $scope.notification = $("#mainNotification").kendoNotification($scope.notificationOptions).data("kendoNotification");

    $rootScope.$on('$stateChangeStart', onStateChangeStart);

    function init() {
      //referenceDate,patientUuid, report,startIndex,limit,
      EtlRestService.getPatientLevelReminders($scope.referenceDate, $scope.patientUuid, $scope.reportName,
        $scope.reminderIndicators, onFetchPatientLevelRemindersSuccess, onFetchPatientLevelRemindersError);
    }

    function onFetchPatientLevelRemindersSuccess(result) {
      console.log('Sql query for PatientLevelReminder request=======>', result.sql, result.sqlParams);
      $scope.indicator = result.result[0];
      if(result.result.length>0 && $scope.indicator.person_uuid === $scope.patientUuid) {
        showReminders($scope.indicator);
      }
    }

    function onFetchPatientLevelRemindersError(error) {
      $scope.notification.show({
        title: 'Error Fetching Reminder',
        message: 'An Error occurred while fetching reminder'
      }, 'warning');
    }

    function showReminders(reminders){
      //Viral Load Followups
      switch (reminders.needs_vl_coded)
      {

        case 1:
          $scope.notification.show({
            title: 'Viral Load Reminder',
            message: 'Patient requires a viral load test when he/she is on ART and had a viral load of >' +
            '1000 during the last viral load test >90 days ago.'
          }, 'warning');
          break;

        case 2:
          $scope.notification.show({
            title: 'Viral Load Reminder',
            message: 'Patient requires viral load test every 6 months when he/she has been on ART for <1 year.'
          }, 'warning');
          break;

        case 3:
          $scope.notification.show({
            title: 'Viral Load Reminder',
            message: 'Patient requires viral load test every 1 year when he/she has been on ART for >1 year.'
          }, 'warning');
          break;

        default: console.info('No Clinical Reminder For Selected Patient'+reminders.needs_vl_coded);
      }

      //Pending Viral Load Order
      if(reminders.overdue_vl_lab_order>0){
        $scope.notification.show({
          title: 'Overdue Viral Load Order',
          message: 'Patient\'s Viral Load Result is Overdue by ' +reminders.overdue_vl_lab_order+' days'
        }, 'warning');
      }


    }

    function onStateChangeStart(event, toState, toParams) {
      if(!(toState.name === 'forms' || toState.name === 'visits' || toState.name === 'encounter' || toState.name === 'patient')) {
        //close all notifications here
        console.log('closing notifications...');
        $scope.notification.hide();
      }
    }

    //initialize
    init();
  }
})();
