/*
jshint -W003, -W026, -W033, -W098
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('opemrsForms', opemrsForms);

  function opemrsForms() {
    var opemrsFormsDefinition = {
      restrict: 'E',
      scope: {
        patient: '=',
        excludedForms: '=',
        currentVisit: '='
      },
      templateUrl: 'views/formentry/forms.html',
      controller: OpemrsFormsCtrl,
      link: link
    };
    return opemrsFormsDefinition;
  }

  OpemrsFormsCtrl.$inject = ['$scope', 'CachedDataService', 'FormOrderMetaData', 'FormListService'];

  function OpemrsFormsCtrl(scope, CachedDataService, FormOrderMetaData, FormListService) {

    //variables
    scope.forms = [];
    scope.isBusy = false;
    scope.hasLoadingError = false;
    scope.patient = null;
    var lastFetchedForms = [];

    //methods
    scope.toggleFavourite = toggleFavourite;
    scope.removeExcludedForms = removeExcludedForms;

    activate();
    function activate() {
      scope.patient = CachedDataService.getCachedPatient();
      loadFormList();
    }


    function loadFormList() {
      scope.isBusy = true;
      scope.hasLoadingError = false;

      FormListService.getFormList()
        .then(function (list) {
          scope.isBusy = false;
          scope.forms = list;
          lastFetchedForms = angular.copy(list);
          removeExcludedForms();
        })
        .catch(function (error) {
          scope.isBusy = false;
          scope.hasLoadingError = true;

        });
    }

    function toggleFavourite(form) {
      if (form === undefined || form === null) throw new Error('Form is required')
      if (form.favourite === true) {
        FormOrderMetaData.removeFavouriteForm(form.name);
      } else {
        FormOrderMetaData.setFavouriteForm(form.name);
      }
      loadFormList();
    }

    function removeExcludedForms() {
      if (Array.isArray(scope.excludedForms)) {
        var formsToDisplay = angular.copy(lastFetchedForms);
        _.each(scope.excludedForms, function (formUuid) {
          var forms = _.filter(lastFetchedForms, function (x) {
            return x.uuid === formUuid;
          });

          if (forms && forms.length > 0) {
            _.each(forms, function (form) {
              formsToDisplay = _.filter(formsToDisplay, function (y) {
                return form.uuid !== y.uuid;
              });
            });
          }
        });
        scope.forms = formsToDisplay;
      }
    }
  }

  function link(scope, element, attrs, vm) {
    scope.$watch('excludedForms', onexcludedFormsChanged, true);
    function onexcludedFormsChanged(newVal, oldVal) {
      scope.removeExcludedForms();
    }
  }
})();
