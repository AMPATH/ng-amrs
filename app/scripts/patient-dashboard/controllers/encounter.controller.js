(function(){
  'use strict';

  angular
    .module('app.patientdashboard')
    .controller('EncounterCtrl', EncounterCtrl);

  EncounterCtrl.$inject = [
    '$stateParams',
    '$timeout',
    'EncounterResService',
    'EncounterModel',
    '$location',
    '$rootScope'
  ];

  function EncounterCtrl($stateParams, $timeout, EncounterResService,
                         EncounterModel, $location, $rootScope) {
    var vm = this;
    vm.encounterList = [];
    vm.selectedEncounter = null;
    vm.experiencedLoadingError = false;
    vm.isBusy = true;
    vm.hasEncounters = false;
    //Pagination Variables
    vm.currentPage = 1;
    vm.entryLimit = 10;
    vm.totalItems=0;
    vm.noOfPages=0;
    vm.setSelected = function(encounter) {
      vm.selectedEncounter = encounter;

    }

    vm.loadEncounterForm = function(EncounterModel) {
      $rootScope.activeEncounter = EncounterModel;
      $location.path('/encounter/' + EncounterModel.uuid() + '/patient/' +
        EncounterModel.patientUuid());
    }

    vm.showNoEncounters = function() {
      return !vm.isBusy && !vm.experiencedLoadingError && !vm.hasEncounters;
    }

    $timeout(function(){
      var params = {
        patientUuid: $stateParams.uuid
      }
      vm.experiencedLoadingError = false;
      EncounterResService.getPatientEncounters(params, onLoadEncountersSuccess,
        onLoadEncountersError);
    }, 1000);

    function onLoadEncountersSuccess(data) {
      vm.isBusy = false;
      vm.encounterList = EncounterModel.toArrayOfModels(data);
      vm.hasEncounters = vm.encounterList.length > 0 ? true : false;
      vm.totalItems =  vm.encounterList.length;
      vm.noOfPages = Math.ceil(vm.totalItems / vm.entryLimit);

    }

    function onLoadEncountersError(error) {
      vm.isBusy = false;
      vm.experiencedLoadingError = true;
      console.error('Error: EncounterController An error' + error +
        'occured while loading');
    }
  }
})();
