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

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

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

    function loadDefaulterList(loadNextOffset) {
          $scope.experiencedLoadingErrors = false;

          if ($scope.isBusy === true) return;
          if(loadNextOffset!==true)resetPaging();
          $scope.isBusy = true;

          if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getDefaultersList($scope.locationUuid, $scope.defaulterThreshold,
                  onFetchDefaultersListSuccess, onFetchDefaultersListError, $scope.nextStartIndex, 300);

        }
    function resetPaging(){
      $scope.nextStartInts = [];
      $scope.allDataLoaded = false;
      $scope.nextStartIndex = 0;
      $scope.patients = [];
    }

    function onFetchDefaultersListSuccess(defaulters) {
      $scope.isBusy = false;
      //update pagination parameters
      if (defaulters.size === 0){
        $scope.allDataLoaded = true;
      }else{
        $scope.patients.length!=0?$scope.patients.push.apply($scope.patients,DefaulterModel.toArrayOfModels(defaulters.result)):
          $scope.patients = DefaulterModel.toArrayOfModels(defaulters.result);
        $scope.nextStartIndex +=  defaulters.size;
      }
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
