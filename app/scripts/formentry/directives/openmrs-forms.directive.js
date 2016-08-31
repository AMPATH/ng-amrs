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

  OpemrsFormsCtrl.$inject = ['$scope', 'CachedDataService', 'FormsMetaData'];

  function OpemrsFormsCtrl(scope, CachedDataService, FormsMetaData) {
      var forms = CachedDataService.getCachedPocForms();
      var patient = CachedDataService.getCachedPatient();
      scope.forms=[];

      if (forms) {
        FormsMetaData.getFormOrder(function(formOrder){
          _.each(formOrder, function(order){
            _.each(forms, function(form) {
              if(order.isVisible && order.uuid ===form.uuid)
                scope.forms.push(form);
            });
          });

        },function(error){
          scope.forms = forms;
        });
      }

      if (patient) {
        scope.patient = patient;
      }

    }
})();
