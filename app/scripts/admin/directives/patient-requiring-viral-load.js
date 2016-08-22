/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('patientRequiringViralLoad', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        selectedLocations: "=",
        startAge: "=",
        endAge: "=",
        startDate: "=",
        endDate: "=",
        gender: "=",
        indicator: "="
      },
      controller: patientRequiringViralLoadController,
      link: patientListLink,
      templateUrl: "views/admin/patient-requiring-viral-load.html"
    };
  }

  patientRequiringViralLoadController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientRequiringViralLoadService', '$state', 'OpenmrsRestService', 'moment', '$timeout', '$stateParams'];

  function patientRequiringViralLoadController($scope, $rootScope, EtlRestService, PatientRequiringViralLoadService, $state, OpenmrsRestService,
                                               moment, $timeout, $stateParams) {

    //non-function types scope members
    $scope.patients = [];
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;
    $scope.reportName = 'labs-report';
    $scope.selectedLocation = $stateParams.locationuuid || ''; //state param check
    $scope.startDate = PatientRequiringViralLoadService.getStartDate();
    $scope.endDate = PatientRequiringViralLoadService.getEndDate();
    $scope.selectedLocations = PatientRequiringViralLoadService.getSelectedLocations();

    //function types scope members
    $scope.loadPatientList = loadPatientList;

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

    //init
    loadPatientList();

    function loadPatientList(loadNextOffset) {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      if (loadNextOffset !== true)resetPaging();
      var locations = $scope.selectedLocation !== '' ? $scope.selectedLocation : getSelectedLocations($scope.selectedLocations);
      if (locations && $scope.indicator !== '' && $scope.startDate && $scope.startDate !== '') {
        $scope.isBusy = true;
        EtlRestService.getPatientListReportByIndicatorAndLocation(null,
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'), $scope.reportName,
          $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError, locations, $scope.nextStartIndex, 300);
      }
      else {
        $scope.isBusy = false;
      }
    }

    function resetPaging() {
      $scope.nextStartIndex = 0;
      $scope.patients = [];
      $scope.allDataLoaded = false;
    }

    /**
     * before navigation cache parameters
     */
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        PatientRequiringViralLoadService.setStartDate($scope.startDate);
        PatientRequiringViralLoadService.setEndDate($scope.endDate);
        if ($scope.selectedLocations.locations.length > 0)
          PatientRequiringViralLoadService.setSelectedLocations($scope.selectedLocations);
      });

    /**
     * converts wrapped selected locations to comma separated strings
     */
    function getSelectedLocations(selectedLocationObject) {
      var locations;
      if (selectedLocationObject.locations)
        for (var i = 0; i < selectedLocationObject.locations.length; i++) {
          if (i === 0) {
            locations = '' + selectedLocationObject.locations[i].uuId();
          } else {
            locations =
              locations + ',' + selectedLocationObject.locations[i].uuId();
          }
        }
      return locations;
    }

    function onFetchPatientsListSuccess(patients) {
      $scope.isBusy = false;
      console.log("Sql query for PatientList request=======>", patients.sql, patients.sqlParams);
      //update pagination parameters
      if (patients.size === 0) {
        $scope.allDataLoaded = true;
      } else {
        $scope.patients.length != 0 ? $scope.patients.push.apply($scope.patients, patients.result) :
          $scope.patients = patients.result;
        $scope.nextStartIndex += patients.size;
      }
      $timeout(function () {
        $rootScope.$broadcast("patient", $scope.patients);
      }, 100)


    }

    function onFetchPatientsListError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }
  }

  function patientListLink(scope, element, attrs, vm) {
    scope.onLoadPatientList = function () {

    }
  }
})();
