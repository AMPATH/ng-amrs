(function(){
  'use strict';

  angular
    .module('ngAmrsApp')
    .controller('EncounterCtrl', EncounterCtrl)

    EncounterCtrl.$inject = [
                        '$scope',
                        '$stateParams',
                        '$timeout',
                        'EncounterResService'
                      ]

  function EncounterCtrl($scope, $stateParams, $timeout, EncounterResService) {
    var vm = this;
    vm.encounterList = [];
    $timeout(function(){
      EncounterResService.getPatientEncounters($stateParams.uuid, function(data) {
        vm.encounterList = data;
      }, function(error) {
          console.error('An error ' + error +' occured');
      })
    }, 1000);
  }
})()
