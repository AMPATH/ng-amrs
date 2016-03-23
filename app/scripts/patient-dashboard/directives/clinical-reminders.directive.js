/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('clinicalReminders', clinicalReminders);

  function clinicalReminders() {
    var directive = {
      restrict: 'E',
      scope: {patientUuid: '@'},
      controller: clinicalRemindersController,
      templateUrl: "views/patient-dashboard/clinical-reminders.html"
    };

    return directive;
  }

  clinicalRemindersController.$inject = ['$scope', '$rootScope', 'EtlRestService', '$state', '$filter'];

  function clinicalRemindersController($scope, $rootScope, EtlRestService, $state, $filter) {
    //report params
    $scope.reportName='clinical-reminder-report';
    $scope.reminderIndicators='needs_vl_coded,overdue_vl_lab_order'; //comma separated indicators
    $scope.referenceDate= new Date();
    $scope.criticalReminders =[];
    $scope.isBusy=false;

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
      $scope.criticalReminders =[];
      EtlRestService.getPatientLevelReminders($scope.referenceDate, $scope.patientUuid, $scope.reportName,
        $scope.reminderIndicators, onFetchPatientLevelRemindersSuccess, onFetchPatientLevelRemindersError, 0, 1);
    }

    function onFetchPatientLevelRemindersSuccess(result) {
      console.log('Sql query for PatientLevelReminder request=======>', result.sql, result.sqlParams);
      $scope.indicator = result.result[0];
      if(result.result.length>0 && $scope.indicator.person_uuid === $scope.patientUuid) {
        constructReminders($scope.indicator); //transform coded reminders to meaningful msg
      }
    }

    function onFetchPatientLevelRemindersError(error) {
      console.log('An error occurred while fetching indicator, etl might be inaccessible', error)
    }

    function pushReminderNotification(title,message,labs,type, isCritical){
      //conditionally pops up/animate the reminder as notification
      if(isCritical) $scope.notification.show({
        title: title,
        message: message,
        labs: labs
      }, type);

      //Pushes reminder to the critical reminder panel
      $scope.criticalReminders.push({
        message:message,
        title:title,
        labs:labs
      });
    }

    function constructReminders(reminders){
      //Viral Load Followups
      var labs ='Last Viral Load ('+ $filter('date')(reminders.last_vl_date, "dd/MM/yyyy")+'): '+reminders.viral_load;
      switch (reminders.needs_vl_coded)
      {
        case 1:
          var title = 'Viral Load Reminder';
          var message ='Patient requires a viral load test. Reason: patient\'s previous viral load was >1000';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        case 2:
          var title = 'Viral Load Reminder';
          var message ='Patient requires viral load test.  Reason: patient needs 6 months viral load test follow-up.';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        case 3:
          var title = 'Viral Load Reminder';
          var message ='Patient requires viral load test.  Reason: patient has been on ART for more than 1 year without Viral Load follow-ups.';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        default: console.info('No Clinical Reminder For Selected Patient'+reminders.needs_vl_coded);
      }

      //Pending Viral Load Order
      if(reminders.overdue_vl_lab_order>0){
        var title = 'Overdue Viral Load Order';
        var message ='Patient\'s viral load test drawn on '+ $filter('date')( reminders.vl_order_date, "dd/MM/yyyy")+', ' +reminders.overdue_vl_lab_order+' days ago is missing. ' +
          'Please follow up with lab or redraw new specimen';
        var labs='';
        pushReminderNotification(title,message,labs,'warning',true);
      }


    }

    function onStateChangeStart(event, toState, toParams) {
      if(!(toState.name === 'forms' || toState.name === 'visits' || toState.name === 'encounter' || toState.name === 'patient')) {
        //close all notifications here
        $scope.notification.hide();
      }
    }

    //initialize
    init();
  }
})();
