/*
jshint -W003, -W026, -W033, -W098
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('patientDemographics', patientDemographics);

    function patientDemographics() {
        var patientDemographicsDefinition = {
            restrict: 'EA',
            templateUrl: 'views/patient-dashboard/patient-demographics.html',
            controller: PatientDemographicsCtrl
        };

        return patientDemographicsDefinition;
    }

    PatientDemographicsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService','$state'];

    function PatientDemographicsCtrl($rootScope, $scope, $stateParams, OpenmrsRestService,$state) {
        /*
        Avoid the round trip and use the rootScope patient selected during
        search process
        */
        //handle the case for unloaded patient

        if (!$rootScope.broadcastPatient.getPersonAttributes) {
            var patient = OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: $stateParams.uuid },
                function (data) {
                    $scope.patient = data;
                    $scope.personAttributes = data.getPersonAttributes();

                }

                );
        }
        else {
            $scope.patient = $rootScope.broadcastPatient;
            $scope.personAttributes = $scope.patient.getPersonAttributes();
        }
        $scope.loadPatient = loadPatient;
        function loadPatient(patientUuid) {
          /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
            console.log("patient uuid clicked id ",patientUuid);
          OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
                 function(data) {
                   $rootScope.broadcastPatient = data;
                   $state.go('patient', { uuid: patientUuid });
                 }
            );
        }
    }
})();
