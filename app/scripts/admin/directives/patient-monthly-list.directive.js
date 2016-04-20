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
                      indicator:"@"
            },
            controller: patientMonthlyListController,
            link: patientListLink,
            templateUrl: "views/admin/patient-monthly-list.html"
        };
    }

  patientMonthlyListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', '$state', 'OpenmrsRestService', 'moment',
      'HivMonthlySummaryIndicatorService','$timeout','$stateParams'];

    function patientMonthlyListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService,
                                   moment, HivMonthlySummaryIndicatorService,$timeout,$stateParams) {

        //non-function types scope members
        $scope.patients = [];
        $scope.isBusy = false;
        $scope.experiencedLoadingErrors = false;
        $scope.currentPage = 1;
        $scope.selectedMonth=new Date(HivMonthlySummaryIndicatorService.getSelectedMonth());
        $scope.startDate= new Date($scope.selectedMonth.getFullYear(), $scope.selectedMonth.getMonth(), 1);
        $scope.endDate= new Date($scope.selectedMonth.getFullYear(), $scope.selectedMonth.getMonth()+1, 1)-1;
        //function types scope members
        $scope.loadPatientList = loadPatientList;
        //$scope.loadPatient = loadPatient;
        $scope.loadIndicatorView=loadIndicatorView;
        $scope.getIndicatorDetails = getIndicatorDetails;
        $scope.selectedLocationName = $stateParams.locationName || '';

        //Pagination Params
        $scope.nextStartIndex = 0;
        $scope.allDataLoaded = false;


      //load data
        loadPatientList();


        function loadIndicatorView ()
        {
          $state.go('admin.hiv-monthly-summary-indicators.monthly');
        }

        function loadPatientList(loadNextOffset) {
            $scope.experiencedLoadingErrors = false;
            if($scope.isBusy === true) return;
            $scope.locationUuid=getSelectedLocations(HivMonthlySummaryIndicatorService.getSelectedLocation());
            $scope.isBusy = true;
            if(loadNextOffset!==true)resetPaging();
            if ($scope.indicator && $scope.indicator!=='' && $scope.startDate && $scope.startDate!=='' ) {
              EtlRestService.getPatientByIndicatorAndLocation($scope.locationUuid,
                moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError,$scope.locationUuid, $scope.nextStartIndex, 300);
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

        function getSelectedLocations(selectedLocationObject) {
          var locations;
          try {
            if (angular.isDefined(selectedLocationObject.locations)) {
              for (var i = 0; i < selectedLocationObject.locations.length; i++) {
                if (i === 0) {
                  locations = '' + selectedLocationObject.locations[i].uuId();
                }
                else {
                  locations =
                    locations + ',' + selectedLocationObject.locations[i].uuId();
                }
              }
            }
          } catch (e) {

          }
          return locations;
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
            console.log('patients======>>>>',$scope.patients);
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
            return HivMonthlySummaryIndicatorService.getIndicatorDetails();
        }
	}

        function patientListLink(scope, element, attrs, vm) {
              scope.onLoadPatientList= function() {

              }
          }
})();
