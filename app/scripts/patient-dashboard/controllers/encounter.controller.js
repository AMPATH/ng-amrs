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
    vm.experiencedLoadingError = false;
    vm.setSelected = function(encounter) {
      vm.selectedEncounter = encounter;
    }

    $timeout(function(){
      var params = {
        patientUuid: $stateParams.uuid,
        rep: 'full'
      }
      vm.experiencedLoadingError = false;
      EncounterResService.getPatientEncounters(params, function(data) {
        vm.encounterList = data;
        vm.status = {
          isOpen: new Array(vm.encounterList.length)
        }

        for (var i = 0; i < vm.status.isOpen.length; i++) {
          vm.status.isOpen[i] = (i === 0);
        }
      }, function(error) {
          vm.experiencedLoadingError = true; 
          console.error('An error ' + error +' occured');
      })
    }, 1000);
  }
})()
