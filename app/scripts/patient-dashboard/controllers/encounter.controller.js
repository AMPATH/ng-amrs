(function(){
  'use strict';

  angular
    .module('app.patientdashboard')
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
    vm.selectedEncounter = null;
    vm.setSelected = function(encounter) {
      vm.selectedEncounter = encounter;
    }
    
    $timeout(function(){
      EncounterResService.getPatientEncounters($stateParams.uuid, function(data) {
        vm.encounterList = data;
      }, function(error) {
          console.error('An error ' + error +' occured');
      })
    }, 1000);
  }
})()
