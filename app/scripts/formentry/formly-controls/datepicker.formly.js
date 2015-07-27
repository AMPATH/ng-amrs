(function () {

  'use strict';

  var mod =
        angular
            .module('app.formentry');

    mod.run(function (formlyConfig) {
        var attributes = [
            'date-disabled',
            'custom-class',
            'show-weeks',
            'starting-day',
            'init-date',
            'min-mode',
            'max-mode',
            'format-day',
            'format-month',
            'format-year',
            'format-day-header',
            'format-day-title',
            'format-month-title',
            'year-range',
            'shortcut-propagation',
            'datepicker-popup',
            'show-button-bar',
            'current-text',
            'clear-text',
            'close-text',
            'close-on-date-selection',
            'datepicker-append-to-body'
        ];

        var bindings = [
            'datepicker-mode',
            'min-date',
            'max-date'
        ];

        var ngModelAttrs = {};

        angular.forEach(attributes, function (attr) {
            ngModelAttrs[camelize(attr)] = { attribute: attr };
        });

        angular.forEach(bindings, function (binding) {
            ngModelAttrs[camelize(binding)] = { bound: binding };
        });

        formlyConfig.setType({
            name: 'datepicker',
            template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],
            defaultOptions: {
                ngModelAttrs: ngModelAttrs,
                templateOptions: {
                    addonLeft: {
                        class: 'glyphicon glyphicon-calendar'
                    },
                    onFocus: function ($viewValue, $modelValue, scope) {
                        scope.to.isOpen = true;
                    },
                    onClick: function ($viewValue, $modelValue, scope) {
                        scope.to.isOpen = true;
                    },
                    datepickerOptions: {}
                }
            }
        });

        function camelize(string) {
            string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
            // Ensure 1st char is always lowercase
            return string.replace(/^([A-Z])/, function (match, chr) {
                return chr ? chr.toLowerCase() : '';
            });
        }
    });


})();
