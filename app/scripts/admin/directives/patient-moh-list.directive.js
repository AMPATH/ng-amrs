/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.admin')
        .directive('patientMohList', directive);

    function directive() {
        return {
            restrict: "E",
            scope: { locationUuid: "@",
                      indicator:"@"

            },
            controller: patientMohListController,
            link: patientListLink,
            templateUrl: "views/admin/patient-moh-list.html"
        };
    }

  patientMohListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', '$state', 'OpenmrsRestService', 'moment',
      'Moh731ReportService'];

    function patientMohListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService,
                                   moment, Moh731ReportService) {

        //non-function types scope members
        $scope.patients = [];
        $scope.isBusy = false;
        $scope.experiencedLoadingErrors = false;
        $scope.currentPage = 1;
        $scope.startDate = Moh731ReportService.getStartDate();
        $scope.endDate = Moh731ReportService.getEndDate();
        //function types scope members
        $scope.loadPatientList = loadPatientList;
        $scope.loadPatient = loadPatient;
        $scope.loadIndicatorView=loadIndicatorView;
        $scope.getIndicatorDetails = getIndicatorDetails;

        //Pagination Params
        $scope.nextStartIndex = 0;
        $scope.allDataLoaded = false;
        $scope.reportName = 'MOH-731-report';


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
          $state.go('admin.moh-731-report.report');
        }

        function loadPatientList(loadNextOffset) {
            $scope.experiencedLoadingErrors = false;
            if($scope.isBusy === true) return;
            $scope.isBusy = true;
            if(loadNextOffset!==true)resetPaging();
            if ($scope.locationUuid && $scope.locationUuid !== ''&& $scope.indicator && $scope.indicator!==''
              && $scope.startDate && $scope.startDate!=='' ) {
              EtlRestService.getPatientListReportByIndicatorAndLocation($scope.locationUuid,
                moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                $scope.reportName,
                $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError,$scope.locationUuid,
                $scope.nextStartIndex, 300);

            }
            else{
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
            $scope.patients.length!=0?$scope.patients.push.apply($scope.patients,PatientEtlModel.toArrayOfModels(patients.result)):
            $scope.patients = PatientEtlModel.toArrayOfModels(patients.result);
            $scope.nextStartIndex +=  patients.size;
          }


        }

        function onFetchPatientsListError(error) {
               $scope.isBusy = false;
             $scope.experiencedLoadingErrors = true;
        }
        function getIndicatorDetails() {
            return Moh731ReportService.getIndicatorDetails();
        }
	}

        function patientListLink(scope, element, attrs, vm) {
              scope.onLoadPatientList= function() {

              }
          }
})();
