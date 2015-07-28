/*
jshint -W003, -W026
*/
(function() {
'use strict';

angular
        .module('ngAmrsApp')
        .directive('patientDemographics', patientDemographics);

function patientDemographics() {
      var patientDemographicsDefinition = {
        restrict: 'EA',
        templateUrl: 'views/patient-dashboard/patient-demographics.html',
        scope: {
          patientuuids: '='
        },
        controller: PatientDemographicsCtrl
      };

      return patientDemographicsDefinition;
    }

PatientDemographicsCtrl.$inject = ['$scope', '$stateParams', 'OpenmrsRestService'];

function PatientDemographicsCtrl(scope, $stateParams,  OpenmrsRestService) {
     var patient=OpenmrsRestService.getPatientService().getPatientByUuid({uuid:$stateParams.uuid},function (data) {
       scope.patient = data;
       scope.personAttributes=data.getPersonAttributes();

     }

    ) ;


}
})();
