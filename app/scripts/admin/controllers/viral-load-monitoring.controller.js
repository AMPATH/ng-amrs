/*jshint -W003, -W098, -W033 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViralLoadMonitoringCtrl', ViralLoadMonitoringCtrl);
  ViralLoadMonitoringCtrl.$nject =

    ['$scope','$stateParams'];

  function ViralLoadMonitoringCtrl($scope,$stateParams) {
    $scope.selectedLocation = $stateParams.locationuuid || '';
  }
})();
