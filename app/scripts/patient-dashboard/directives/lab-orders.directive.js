/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('labOrders', labOrders);

  function labOrders() {
    return {
      restict: 'E',
      scope: { 
        patientUuid: '@',
        currentPatient: '=',
        hivSummary: '='
      },
      controller: labOrdersController,
      link: labOrdersLink,
      templateUrl: 'views/patient-dashboard/lab-orders-pane.html'
    };
  }

  labOrdersController.$inject = ['$scope', 'IdentifierResService', 'UtilService',
    '$http', 'OpenmrsRestService', '$uibModal'];

  function labOrdersController($scope, IdentifierResService, UtilService,
    $http, OpenmrsRestService, $uibModal) {
    $scope.loadIdentifiers = loadIdentifiers;
    $scope.postOrderToEid = openPostLabOrderModal;
    $scope.fetchAllLabOrders = fetchAllLabOrders;

    $scope.selectedEidServer = null;
    $scope.eidServers = [];
    $scope.labOrders = [];

    function fetchAllLabOrders(patientUuid) {
      OpenmrsRestService.getOrderResService().getOrdersByPatientUuid(patientUuid,
        function (result) {
          $scope.isBusy = false;
          console.log('--->', result);
          $scope.labOrders = result.results || [];
        },
        function (error) {
          $scope.isBusy = false;
          $scope.labOrders = [];
        }
      );
    }

    function loadIdentifiers() {
      if ($scope.isBusy === true) return;

      $scope.isBusy = true;
      $scope.experiencedLoadingError = false;

      if ($scope.patientUuid && $scope.patientUuid !== '') {
        IdentifierResService.getPatientIdentifiers($scope.patientUuid,
          onFetchIdentifiersSuccess, onFetchIdentifiersFailed);
      }
    }

    function onFetchIdentifiersSuccess(identifiers) {
      $scope.isBusy = false;
      $scope.identifiers = identifiers.results;
    }

    function onFetchIdentifiersFailed(error) {
      $scope.experiencedLoadingError = true;
      $scope.isBusy = false;
    }

    function openPostLabOrderModal(order) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/post-lab-order-modal.html',
        controller: function ($uibModalInstance, $scope) {
          $scope.order = order;
          $scope.patient = scope.currentPatient;
          $scope.hivSummary = scope.hivSummary;
          $scope.modalObject = $uibModalInstance;
          $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'md',
        resolve: {
          patient: function () {
            return {
              name: 'Name'
            };
          }
        }
      });
    }

  }

  function labOrdersLink(scope, element, attrs, vm) {
    attrs.$observe('patientUuid', onPatientUuidChanged);
    function onPatientUuidChanged(newVal, oldVal) {
      if (newVal && newVal != "") {
        scope.isBusy = false;
        scope.fetchAllLabOrders(newVal);
      }
    }
  }

})();
