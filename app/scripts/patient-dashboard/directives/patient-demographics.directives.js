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

PatientDemographicsCtrl.$inject = ['$scope', 'PatientResService'];

function PatientDemographicsCtrl($scope, PatientResService) {
  $scope.patientUuid = '';
  $scope.patients = [];
  $scope.searchPatient = function() {
    $scope.patients = PatientResService.getPatientQuery($scope.patientUuid);
  };
}
})();
