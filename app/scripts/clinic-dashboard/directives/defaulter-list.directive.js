/* global angular */
/*
jshint -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.clinicDashboard')
        .directive('defaulterList', appointmentSchedule);

  function appointmentSchedule() {
      return {
          restict: 'E',
          scope: { locationUuid: '@' },
          controller: defaulterListController,
          link: defaulterListLink,
          templateUrl: 'views/clinic-dashboard/defaulter-list.html',
        };
    }

  defaulterListController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'DefaulterModel', 'moment', '$state', 'OpenmrsRestService'];

  function defaulterListController($scope, $rootScope, EtlRestService, DefaulterModel, moment, $state, OpenmrsRestService) {

    //non-function types scope members
    $scope.patients = [];
    $scope.defaulterThreshold = 30;

    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;

    //function types scope members
    $scope.loadDefaulterList = loadDefaulterList;

    $scope.loadPatient = loadPatient;

    $scope.utcDateToLocal = utcDateToLocal;

    activate();

    function activate() {

    }

    function loadPatient(patientUuid) {
          /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
          OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
                 function(data) {
                   $rootScope.broadcastPatient = data;
                   $state.go('patient', { uuid: patientUuid });
                 }

                       );
        }

    function utcDateToLocal(date) {
      var day = new moment(date).format();
      return day;
    }

    function loadDefaulterList() {
          $scope.experiencedLoadingErrors = false;

          if ($scope.isBusy === true) return;

          $scope.isBusy = true;
          $scope.patients = [];

          if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getDefaultersList($scope.locationUuid, $scope.defaulterThreshold, onFetchDefaultersListSuccess, onFetchDefaultersListError);

        }

    function onFetchDefaultersListSuccess(defaulters) {
      $scope.isBusy = false;
      $scope.patients = DefaulterModel.toArrayOfModels(defaulters.result);
    }

    function onFetchDefaultersListError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }
  }

  function defaulterListLink(scope, element, attrs, vm) {
    attrs.$observe('locationUuid', onLocationUuidChanged);

    function onLocationUuidChanged(newVal, oldVal) {
          if (newVal && newVal != '') {
            scope.isBusy = false;
            scope.patients = [];
            scope.loadDefaulterList();
          }
        }
  }

})();
