/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('printLabels', vitals);

    function vitals() {
        return {
            restict: 'E',
            scope: { patientUuid: '@'},
            controller: printLabelsController,
            link: printLabelsLink,
            templateUrl: 'views/patient-dashboard/print-labels-pane.html'
        };
    }

    printLabelsController.$inject = ['$scope', 'IdentifierResService', 'VitalModel', 'UtilService'];

    function printLabelsController($scope, IdentifierResService, vitalModel, UtilService) {
      $scope.loadIdentifers = loadIdentifers;

      function loadIdentifers() {
          if ($scope.isBusy === true) return;

          $scope.isBusy = true;
          $scope.experiencedLoadingError = false;

          if ($scope.patientUuid && $scope.patientUuid !== ''){
              IdentifierResService.getPatientIdentifiers($scope.patientUuid,
                onFetchIdentifersSuccess,onFetchIdentifersFailed);
            }
      }
      function onFetchIdentifersSuccess(identifiers) {
        $scope.identifiers = identifiers.results;
      }

      function onFetchIdentifersFailed(error) {
          $scope.experiencedLoadingError = true;
          $scope.isBusy = false;
      }
    }

    function printLabelsLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);
        function onPatientUuidChanged(newVal, oldVal) {
          if (newVal && newVal != "") {
              scope.isBusy = false;
              scope.loadIdentifers();
          }
        }
    }

})();
