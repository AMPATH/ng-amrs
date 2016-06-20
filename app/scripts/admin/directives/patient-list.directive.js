/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('patientList', directive);

  function directive() {
    return {

      restrict: "E",
      scope: {
        locationUuid: "@",
        startDate: "@",
        endDate: "@",
        indicator: "@",
        selectedLocationName:"@"

      },
      controller: patientListController,
      link: patientListLink,
      templateUrl: "views/admin/patient-list.html"
    };
  }

  patientListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', '$state', 'OpenmrsRestService', 'moment',
      'HivSummaryIndicatorService','$filter','$stateParams','$timeout'];

  function patientListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService,
                                 moment, HivSummaryIndicatorService,$filter,$stateParams,$timeout) {

    //non-function types scope members
    $scope.patients = [];
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;
    $scope.startDate = HivSummaryIndicatorService.getStartDate();
    $scope.endDate = HivSummaryIndicatorService.getEndDate();
    $scope.startAge = HivSummaryIndicatorService.getReportFilters().startAge;
    $scope.endAge = HivSummaryIndicatorService.getReportFilters().endAge;
    $scope.gender = HivSummaryIndicatorService.getReportFilters().gender;


    //function types scope members
    $scope.loadPatientList = loadPatientList;
  //  $scope.loadPatient = loadPatient;
    $scope.loadIndicatorView = loadIndicatorView;
    $scope.getIndicatorDetails = getIndicatorDetails;
    $scope.getIndicatorLabelByName = getIndicatorLabelByName;
    $scope.getSelectedLocation =getSelectedLocation;
    $scope.selectedLocationName = $stateParams.locationName || '';
    $scope.stateChange='';

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

    //Dynamic DataTable Params
   // $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function (val) {
      $scope.countBy = val;
     // loadHivSummaryIndicators()
    };
    //load data
    loadPatientList();


    function loadIndicatorView() {
      history.back();
    }

    function loadPatientList(loadNextOffset) {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      if(loadNextOffset!==true)resetPaging();
      $scope.isBusy = true;
      if ($scope.locationUuid && $scope.locationUuid !== '' && $scope.indicator && $scope.indicator !== ''
        && $scope.startDate && $scope.startDate !== '') {
        EtlRestService.getPatientListByIndicator($scope.locationUuid,
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError, $scope.nextStartIndex, 300,
          $scope.startAge, $scope.endAge,  $scope.gender);

      }
      else {
        $scope.experiencedLoadingErrors = true;
        $scope.isBusy = false;
      }
    }

    function resetPaging(){
      $scope.nextStartIndex = 0;
      $scope.patients = [];
      $scope.allDataLoaded = false;
    }


    function onFetchPatientsListSuccess(patients) {
      $scope.isBusy = false;
      console.log("Sql query for PatientList request=======>", patients.sql, patients.sqlParams);

      //update pagination parameters
      if (patients.size === 0){
        $scope.allDataLoaded = true;
      }else{
        $scope.patients.length!=0?$scope.patients.push.apply($scope.patients,patients.result):
          $scope.patients = patients.result;

        $scope.nextStartIndex +=  patients.size;
      }
      $timeout(function(){
      $rootScope.$broadcast("patient", $scope.patients);
      },100)
    }

    function onFetchPatientsListError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function getIndicatorDetails() {
      return HivSummaryIndicatorService.getIndicatorDetails();
    }

    function getSelectedLocation (){
      return HivSummaryIndicatorService.getSelectedLocation();
    }



    function getIndicatorLabelByName(name) {
      var found = $filter('filter')($scope.patientTags, {name: name})[0];
      if (found)return found.label;
    }


    }

  function patientListLink(scope, element, attrs, vm,$ctrl) {
    scope.onLoadPatientList = function () {

    }
  }


})();
