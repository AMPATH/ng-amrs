/*jshint -W003, -W098, -W033 */
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
    .controller('ViewEncounterCtrl', ViewEncounterCtrl);
  ViewEncounterCtrl.$nject = ['$rootScope', '$scope', '$stateParams', '$timeout',
    'OpenmrsRestService', '$modal', 'items', 'EncounterResService'
  ];

  function ViewEncounterCtrl($rootScope, $scope, $stateParams, $timeout,
    OpenmrsRestService,$modal, items, EncounterResService) {
    $scope.patient = {};
    $scope.patient = $rootScope.broadcastPatient;
    EncounterResService.getEncounterByUuid(items, function(data) {
      data.obs.sort(function(a, b) {
        var textA = a.concept.name.display.toUpperCase();
        var textB = b.concept.name.display.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      $scope.obs = data.obs;
    });
    $scope.ok = function(modal) {
      console.log('Close',modal);
      //$modal.close('close');
    };
  }
})();
