/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.admin')
        .directive('patientMonthlyList', directive);

    function directive() {
        return {
            restrict: "E",
            scope: { locationUuid: "@",
                      startDate: "@",
                      endDate:"@",
                      indicator:"@"
            },
            controller: patientMonthlyListController,
            link: patientListLink,
            templateUrl: "views/admin/patient-monthly-list.html"
        };
    }

  patientMonthlyListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', '$state', 'OpenmrsRestService', 'moment',
      'HivMonthlySummaryIndicatorService'];

    function patientMonthlyListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService,
                                   moment, HivMonthlySummaryIndicatorService) {

        //non-function types scope members
        $scope.patients = [];
        $scope.isBusy = false;
        $scope.experiencedLoadingErrors = false;
        $scope.currentPage = 1;
        $scope.startDate=HivMonthlySummaryIndicatorService.getStartDate();
        $scope.endDate=HivMonthlySummaryIndicatorService.getEndDate();

        //function types scope members
        $scope.loadPatientList = loadPatientList;
        $scope.loadPatient = loadPatient;
        $scope.loadIndicatorView=loadIndicatorView;
        $scope.getIndicatorDetails = getIndicatorDetails;

        //load data
        loadPatientList();

        function loadPatient(patientUuid) {
           OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
              function (data) {
                $rootScope.broadcastPatient = data;
                $state.go('patient', { uuid: patientUuid });

              });
          }
        function loadIndicatorView ()
        {
          $state.go('admin.hiv-monthly-summary-indicators.monthly');
        }
        function loadPatientList() {
            $scope.experiencedLoadingErrors = false;
            if($scope.isBusy === true) return;
            $scope.isBusy = true;
            $scope.patients = [];
            if ($scope.locationUuid && $scope.locationUuid !== '' && $scope.indicator && $scope.indicator!==''
              && $scope.startDate && $scope.startDate!=='' ) {
              EtlRestService.getPatientListByIndicator($scope.locationUuid,
                moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError);
            }
            else{
              $scope.experiencedLoadingErrors = true;
              $scope.isBusy = false;
              }
        }

        function onFetchPatientsListSuccess(patients) {
             $scope.isBusy = false;
              console.log("Sql query for PatientList request=======>", patients.sql, patients.sqlParams);
            $scope.patients = PatientEtlModel.toArrayOfModels(patients.result);
        }

        function onFetchPatientsListError(error) {
               $scope.isBusy = false;
             $scope.experiencedLoadingErrors = true;
        }
        function getIndicatorDetails() {
            return HivMonthlySummaryIndicatorService.getIndicatorDetails();
        }
	}

        function patientListLink(scope, element, attrs, vm) {
              scope.onLoadPatientList= function() {

              }
          }
})();
