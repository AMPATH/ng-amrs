/*jshint -W003, -W098 */
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
  .module('app.patientdashboard')
  .controller('PatientDashboardCtrl', PatientDashboardCtrl);
  PatientDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams','$timeout', 'OpenmrsRestService'];

  function PatientDashboardCtrl($rootScope, $scope, $stateParams, $timeout, OpenmrsRestService) {
    $scope.patient = {};
    $scope.p = null;
    $scope.encounters = [];

    $timeout(function () {
      OpenmrsRestService.getPatientService().getPatientByUuid({uuid:$stateParams.uuid},
        function (data) {
          $scope.patient = data;
          //console.log(data);
          $rootScope.broadcastPatient = $scope.patient; // trying to broadcast
        });

      OpenmrsRestService.getEncounterService().getPatientEncounter({patient:$stateParams.uuid},
        function (data) {
          // body...
          $scope.encounters = data;
          $rootScope.$broadcast('encounterData',  {data: $scope.encounters}); // trying to broadcast
        });


    },1000);


    // $rootScope.encounters = $scope.encounters; //trying to this available throughout the app
    // $rootScope.patient = $scope.patient; //trying to this available throughout the app

    }
})();
