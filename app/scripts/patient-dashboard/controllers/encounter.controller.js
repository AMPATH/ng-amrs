(function(){
  'use strict';

  angular
    .module('app.patientdashboard')
    .controller('EncounterCtrl', EncounterCtrl);

  EncounterCtrl.$inject = [
                        '$scope',
                        '$stateParams',
                        '$timeout',
                        'EncounterResService',
                        'EncounterModel'
                      ];

  function EncounterCtrl($scope, $stateParams, $timeout, EncounterResService,
                         EncounterModel) {
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
        patientUuid: $stateParams.uuid
      }
      vm.experiencedLoadingError = false;
      EncounterResService.getPatientEncounters(params, function(data) {
        vm.encounterList = EncounterModel.toArrayOfModels(data);
      }, function(error) {
          vm.experiencedLoadingError = true; 
          console.error('An error ' + error +' occured');
      })
    }, 1000);
  }
})();
