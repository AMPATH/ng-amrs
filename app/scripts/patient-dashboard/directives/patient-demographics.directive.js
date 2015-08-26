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

    PatientDemographicsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService'];

    function PatientDemographicsCtrl($rootScope, scope, $stateParams, OpenmrsRestService) {
        /*
        Avoid the round trip and use the rootScope patient selected during
        search process
        */
        //handle the case for unloaded patient
        if (!$rootScope.broadcastPatient.getPersonAttributes) {
            var patient = OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: $stateParams.uuid },
                function (data) {
                    scope.patient = data;
                    scope.personAttributes = data.getPersonAttributes();

                }

                );
        }
        else {
            scope.patient = $rootScope.broadcastPatient;
            scope.personAttributes = scope.patient.getPersonAttributes();
        }




    }
})();
