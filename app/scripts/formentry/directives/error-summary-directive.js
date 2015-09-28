/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .directive('formlyErrorSummary', formlyErrorSummary);

    function formlyErrorSummary() {
        var directive = {
            templateUrl: 'formly-error-summary.html',
            scope: {},
            bindToController: {
              form: '=',
              fields: '='
            },
            controllerAs: 'vm',
            controller: Controller

        };

        return directive;

    }

    function Controller() {
      console.log('+++++Loading Error summary Controller');
      var vm = this;
      console.log('directive Scope', vm);
      vm.getErrorAsList = getErrorAsList;

      function getErrorAsList(field) {
        console.log('selected field', field)

        return Object.keys(field.formControl.$error).map(function(error) {
          // note, this only works because the customInput type we have defined.
          return field.data.getValidationMessage(error);
        }).join(', ');
      }
    }
})();
