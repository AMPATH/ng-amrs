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
            restict: "E",
            scope: { locationUuid: "@",
                      startDate: "@",
                      endDate:"@",
                      indicator:"@"
            },
            controller: patientListController,
            link: patientListLink,
            templateUrl: "views/admin/patient-list.html"
        };
    }

	patientListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', 'moment', '$state', 'OpenmrsRestService'];

    function patientListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService) {

        //non-function types scope members
        $scope.patients = [];
        $scope.isBusy = false;
        $scope.experiencedLoadingErrors = false;
        $scope.currentPage = 1;

        //function types scope members
        $scope.loadPatientList = loadPatientList;
        $scope.loadPatient = loadPatient;

        function loadPatient(patientUuid) {
           OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
              function (data) {
                $rootScope.broadcastPatient = data;
                $state.go('patient', { uuid: patientUuid });

              });
          }

        function loadPatientList() {
            $scope.experiencedLoadingErrors = false;
            if($scope.isBusy === true) return;
            $scope.isBusy = true;
            $scope.patients = [];
            if ($scope.locationUuid && $scope.locationUuid !== '' && $scope.indicator && $scope.indicator!==''
              && $scope.startDate && $scope.startDate!=='' )

                EtlRestService.getPatientListByIndicator($scope.locationUuid, $scope.startDate, $scope.endDate,
                  $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError);
        }

        function onFetchPatientsListSuccess(patients) {
             $scope.isBusy = false;
            $scope.patients = PatientEtlModel.toArrayOfModels(patients.result);
        }

        function onFetchPatientsListError(error) {
             $scope.isBusy = false;
             $scope.experiencedLoadingErrors = true;
        }
	}

        function patientListLink(scope, element, attrs, vm) {
              attrs.$observe('locationUuid', onLocationUuidChanged);
              function onLocationUuidChanged(newVal, oldVal) {
                  if (newVal && newVal != "") {
                      scope.isBusy = false;
                      scope.patients = [];
                      scope.loadPatientList();
                  }
              }
          }
})();
