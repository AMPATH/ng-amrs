(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .controller('PrintLabelsCtrl', PrintLabelsCtrl);

  PrintLabelsCtrl.$inject = [
    '$stateParams',
    '$timeout',
    'EncounterResService',
    '$filter',
    '$cookies',
    '$http',
    '$rootScope',
    '$scope'
  ];

  function PrintLabelsCtrl($stateParams, $timeout, EncounterResService, $filter,
    $cookies, $http, $rootScope, $scope) {
    var vm = this;
    vm.experiencedLoadingError = false;
    vm.isBusy = true;
    vm.printServerConfigured = false;
    vm.patientIdentifer = '';
    vm.getPrinters = getPrinters;
    vm.printServerUrl = $cookies.get('print_server_url');
    vm.defaultPrinter = $cookies.get('default_printer');
    vm.valuationDate = new Date();
    vm.valuationDatePickerIsOpen = false;
    vm.opens = [];
    vm.copies = 2;
    $scope.$watch(function() {
      return vm.valuationDatePickerIsOpen;
    }, function(value) {
      vm.opens.push('valuationDatePickerIsOpen: ' + value + ' at: ' + new Date());
    });

    vm.valuationDatePickerOpen = function($event) {

      if ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // This is the magic
      }
      this.valuationDatePickerIsOpen = true;
    };

    function init() {
      if ($cookies.get('print_server_url')) {
        vm.toggleSettings();
      }
      getPrinters();
      vm.patient = $rootScope.broadcastPatient;
      vm.patientIdentifer = vm.patient.commonIdentifiers().ampathMrsUId;
    }
    $timeout(function() {
      var params = {
        patientUuid: $stateParams.uuid
      };
      vm.experiencedLoadingError = false;
      EncounterResService.getPatientEncounters(params, onLoadEncountersSuccess,
        onLoadEncountersError);
    }, 1000);
    vm.toggleSettings = function() {
      vm.printServerConfigure = !vm.printServerConfigure;
    };
    vm.printServerUrlChange = function() {
      vm.printers = [];
      getPrinters();
    };
    vm.printLabel = function(order) {
      if (!vm.defaultPrinter) {
        vm.toggleSettings();
      }
      var printPayload = {
        template: 'lab_label',
        printer: vm.defaultPrinter,
        mergeData: []
      };
      for (var c = 0; c < vm.copies; c++) {
        printPayload.mergeData.push({
          orderDate: $filter('date')(vm.valuationDate, 'dd/MM/yyyy'),
          testName: order.value.name.display,
          identifier: vm.patientIdentifer
        });
      }
      printLabelPayload(printPayload);
    };
    vm.printMultipleLabels = function() {
      if (!vm.defaultPrinter) {
        vm.toggleSettings();
      }
      var printPayload = {
        template: 'lab_label',
        printer: vm.defaultPrinter,
        mergeData: []
      };
      for (var i = 0; i < vm.testsOrdered.groupMembers.length; i++) {
        var order = vm.testsOrdered.groupMembers[i];
        if (order.isChecked) {
          for (var c = 0; c < vm.copies; c++) {
            printPayload.mergeData.push({
              orderDate: $filter('date')(vm.valuationDate, 'dd/MM/yyyy'),
              testName: order.value.name.display,
              identifier: vm.patientIdentifer
            });
          }
        }
      }
      printLabelPayload(printPayload);
    };
    // This executes when entity in table is checked
    vm.selectEntity = function() {
      // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
      for (var i = 0; i < vm.testsOrdered.groupMembers.length; i++) {
        if (!vm.testsOrdered.groupMembers[i].isChecked) {
          vm.allItemsSelected = false;
          return;
        }
      }

      //If not the check the "allItemsSelected" checkbox
      vm.allItemsSelected = true;
    };
    vm.saveSettings = function() {
      var now = new Date(),
        // this will set the expiration to 12 months
        exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      $cookies.put('print_server_url', vm.printServerUrl, {
        expires: exp
      });
      $cookies.put('default_printer', vm.defaultPrinter, {
        expires: exp
      });
      vm.toggleSettings();
    };
    // This executes when checkbox in table header is checked
    vm.selectAll = function() {
      // Loop through all the entities and set their isChecked property
      for (var i = 0; i < vm.testsOrdered.groupMembers.length; i++) {
        vm.testsOrdered.groupMembers[i].isChecked = vm.allItemsSelected;
      }
    };

    function getPrinters() {
      if (vm.printServerUrl) {
        $http.get(vm.printServerUrl + 'printers').then(function(result) {
          if (result) {
            vm.printers = result.data;
          }
        }).catch(function(error) {
          console.log('error', error);
        });
      }
    }

    function printLabelPayload(payload) {
      $http.post(vm.printServerUrl + 'print_lab_label', payload, {}).then(function(result) {
        console.log('Bingo', result.data);
      }).catch(function(error) {
        console.log('error', error);
      });
    }

    function onLoadEncountersSuccess(data) {
      vm.isBusy = false;
      var filtered = $filter('filter')(data, {
        form: {
          uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7'
        }
      })[0];
      if (filtered) {
        fetchEncounter(filtered.uuid);
      }
    }

    function onLoadEncountersError(error) {
      vm.isBusy = false;
      vm.experiencedLoadingError = true;
      console.error('Error: EncounterController An error' + error +
        'occured while loading');
    }

    function fetchEncounter(encounterUuid) {
      EncounterResService.getEncounterByUuid(encounterUuid, onLoadEncounterSuccess,
        onLoadEncounterError);
    }

    function onLoadEncounterSuccess(encounter) {
      var filtered = $filter('filter')(encounter.obs, {
        concept: {
          uuid: 'af46861e-597a-48a3-b3d4-a134d0b1c5fa'
        }
      })[0];
      vm.patient = encounter.patient;
      vm.provider = encounter.provider;
      vm.testsOrdered = filtered;
    }

    function onLoadEncounterError(error) {
      console.error('Error: EncounterController An error' + error +
        'occured while loading encounter');
    }
    init();
  }
})();
