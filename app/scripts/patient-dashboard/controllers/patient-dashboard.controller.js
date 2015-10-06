/*jshint -W003, -W098, -W033 */
(function () {
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
  PatientDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams', '$timeout', 'OpenmrsRestService'];

  function PatientDashboardCtrl($rootScope, $scope, $stateParams, $timeout, OpenmrsRestService) {
    $scope.patient = {};
    $scope.patient = $rootScope.broadcastPatient;
    $scope.p = null;
    $scope.encounters = [];

    $scope.HivHistoricalExpanded = true;

    $scope.showHivHistoricalSummary = false;

    $scope.$on('viewHivHistoricalSummary',viewHivHistoricalSummary);

    function viewHivHistoricalSummary() {
      $scope.showHivHistoricalSummary = true;
    }

  }
})();
