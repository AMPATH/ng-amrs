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
      scope: {
        patientUuid: '@',
        isBusy:'=',
        criticalReminders:'='
      },
      controller: clinicalRemindersController,
      templateUrl: "views/patient-dashboard/clinical-reminders.html"
    };

    return directive;
  }

  clinicalRemindersController.$inject = ['$scope', '$rootScope', 'EtlRestService', '$state', '$filter'];

  function clinicalRemindersController($scope, $rootScope, EtlRestService, $state, $filter) {
    //report params
    $scope.reportName='clinical-reminder-report';
    $scope.reminderIndicators='needs_vl_coded,overdue_vl_lab_order,months_since_last_vl_date,new_viral_load_present,ordered_vl_has_error,is_on_inh_treatment'; //comma separated indicators
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
      $scope.isBusy=true;
      EtlRestService.getPatientLevelReminders($scope.referenceDate, $scope.patientUuid, $scope.reportName,
        $scope.reminderIndicators, onFetchPatientLevelRemindersSuccess, onFetchPatientLevelRemindersError, 0, 1);
    }

    function onFetchPatientLevelRemindersSuccess(result) {
      console.log('Sql query for PatientLevelReminder request=======>', result.sql, result.sqlParams);
      $scope.isBusy=false;
      $scope.indicator = result.result[0];
      if(result.result.length>0 && $scope.indicator.person_uuid === $scope.patientUuid) {
        constructReminders($scope.indicator); //transform coded reminders to meaningful msg
      }
    }

    function onFetchPatientLevelRemindersError(error) {
      $scope.isBusy=false;
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
        labs:labs,
        type:type
      });
    }

    function constructReminders(reminders){
      console.log('reminders',reminders)
      //Viral Load Followups
      var labs ='Last viral load: none';
      if (reminders.last_vl_date) labs ='Last viral load: '+reminders.viral_load+ ' on '+$filter('date')(reminders.last_vl_date, "dd/MM/yyyy")+', '+reminders.months_since_last_vl_date+' months ago.';
      switch (reminders.needs_vl_coded)
      {
        case 1:
          var title = 'Viral Load Reminder';
          var message ='Patient requires viral load. Viral loads > 1000 must be repeated in three months.';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        case 2:
          var title = 'Viral Load Reminder';
          var message ='Patient requires viral load. Patients newly on ART require a viral load test every 6 months.';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        case 3:
          var title = 'Viral Load Reminder';
          var message ='Patient requires viral load. Patients on ART > 1 year require a viral load test every year.';
          pushReminderNotification(title,message,labs,'warning',true);
          break;

        default: console.info('No Clinical Reminder For Selected Patient'+reminders.needs_vl_coded);
      }

      //Pending Viral Load Order
      if(reminders.overdue_vl_lab_order>0){
        var title = 'Overdue Viral Load Order';
        var message ='No result reported for patient\'s viral load test drawn on '+ $filter('date')( reminders.vl_order_date, "dd/MM/yyyy")+', (' +reminders.overdue_vl_lab_order+' days ago). ' +
          'Please follow up with lab or redraw new specimen.';
        var labs='';
        pushReminderNotification(title,message,labs,'warning',true);
      }

      //New Viral Load Present
      if(reminders.new_viral_load_present){
        var title = 'New Viral Load present';
        var message ='New viral load result: '+reminders.viral_load+' (collected on '+ $filter('date')( reminders.last_vl_date, "dd/MM/yyyy")+').';
        var labs='';
        pushReminderNotification(title,message,labs,'success',true);
      }

      //Viral Load Error
      if(reminders.ordered_vl_has_error ===1){
        var title = 'Lab Error Reminder';
        var message ='Viral load test that was ordered on (' + $filter('date')( reminders.vl_error_order_date, "dd/MM/yyyy")+') resulted to an error. Please re-order.'  ;
        var labs='';
        pushReminderNotification(title,message,labs,'warning',true);
      }

      //INH Treatment Reminder - first 5 months
      if(reminders.is_on_inh_treatment > 0 && reminders.is_on_inh_treatment <=5){
        var title = 'INH Treatment Reminder';
        var message ='Patient started INH treatment on (' + $filter('date')( reminders.tb_prophylaxis_start_date, "dd/MM/yyyy")+'). Expected to end on (' + $filter('date')( reminders.tb_prophylaxis_end_date, "dd/MM/yyyy")+'), '+reminders.inh_treatment_days_remaining+' days remaining.' ;
        var labs='';
        pushReminderNotification(title,message,labs,'warning',true);
      }

      //INH Treatment Reminder - last month
      if(reminders.is_on_inh_treatment > 0 && reminders.is_on_inh_treatment > 5){
        var title = 'INH Treatment Reminder';
        var message ='Patient has been on INH treatment for the last 5 months, expected to end on (' + $filter('date')( reminders.tb_prophylaxis_end_date, "dd/MM/yyyy")+').';
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
