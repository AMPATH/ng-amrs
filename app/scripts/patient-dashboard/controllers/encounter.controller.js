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
    vm.status = {};
    vm.selectedEncounter = null;
    vm.setSelected = function(encounter) {
      vm.selectedEncounter = encounter;
    }

    $timeout(function(){
      EncounterResService.getPatientEncounters($stateParams.uuid, function(data) {
        vm.encounterList = data;
        vm.status = {
          isOpen: new Array(vm.encounterList.length)
        }

        for (var i = 0; i < vm.status.isOpen.length; i++) {
          vm.status.isOpen[i] = (i === 0);
        }
      }, function(error) {
          console.error('An error ' + error +' occured');
      })
    }, 1000);
  }
})()
