/*
jshint -W003, -W026, -W033, -W098
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';

  angular
        .module('app.patientdashboard')
        .directive('opemrsForms', opemrsForms);

  function opemrsForms() {
      var opemrsFormsDefinition = {
        restrict: 'EA',
        templateUrl: 'views/formentry/forms.html',
        controller: OpemrsFormsCtrl
      };
      return opemrsFormsDefinition;
    }

  OpemrsFormsCtrl.$inject = ['$scope', 'CachedDataService'];

  function OpemrsFormsCtrl(scope, CachedDataService) {
      var forms = CachedDataService.getCachedPocForms();
      var patient = CachedDataService.getCachedPatient();

      if (forms) {
        scope.forms = forms;
      }

      if (patient) {
        scope.patient = patient;
      }

    }
})();
