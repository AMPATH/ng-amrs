/*jshint -W003, -W098, -W033 */
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
    .module('app.clinicDashboard')
    .controller('PatientListModalCtrl', PatientListModalCtrl);
  PatientListModalCtrl.$nject = ['$rootScope', '$scope', 'EtlRestService', '$loading', '$timeout', '$modalInstance', 'data'];

  function PatientListModalCtrl($rootScope, $scope, EtlRestService, $loading, $timeout, $modalInstance, data) {
    //non-function types scope members
    $scope.patients = [];
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;
    $scope.startDate = data.chartObject.startDate;
    $scope.endDate = data.chartObject.endDate;
    $scope.locationUuid = data.chartObject.selectedLocations;
    $scope.indicator = data.selectedPoint.id;
    $scope.indicatorName = data.selectedPoint.name;
    $scope.totalCount = data.selectedPoint.value;
    $scope.reportName = data.chartObject.reportName;
    //function types scope members
    $scope.loadPatientList = loadPatientList;

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

    //load data
    loadPatientList();

    $scope.ok = function () {
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


    function loadPatientList(loadNextOffset) {
      if (!data.selectedPoint) return;
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      isBusy(true, 'busyIndicator');
      $scope.isBusy = true;
      if (loadNextOffset !== true)resetPaging();
      if ($scope.indicator && $scope.indicator!=='' && $scope.startDate && $scope.startDate!=='' ) {
      EtlRestService.getPatientListReportByIndicatorAndLocation($scope.locationUuid,
        moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'), $scope.reportName,
        $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError, $scope.locationUuid, $scope.nextStartIndex, 300);
      } else{
        $scope.experiencedLoadingErrors = true;
        $scope.isBusy = false;
        isBusy(false, 'busyIndicator');
      }
    }

    function resetPaging() {
      $scope.nextStartIndex = 0;
      $scope.patients = [];
      $scope.allDataLoaded = false;
    }

    function onFetchPatientsListSuccess(patients) {
      $scope.isBusy = false;
      isBusy(false, 'busyIndicator');
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
      isBusy(false, 'busyIndicator');
      $scope.experiencedLoadingErrors = true;
    }

    $scope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        $modalInstance.dismiss('cancel');
      });

    function isBusy(val, elem) {
      if (val === true) {
        $loading.start(elem);
      } else {
        $loading.finish(elem);
      }
    }

  }
})();
