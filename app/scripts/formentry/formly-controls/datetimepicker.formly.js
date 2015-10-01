/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
  'use strict';

    angular
        .module('app.formentry')
            .run(createDatetimePickerType);
    
    function createDatetimePickerType(formlyConfig, $filter) {
        console.info('A new type is being created!!');
        var attributes = [
            'hour-step',
            'minute-step',
            'show-meridian',
            'date-disabled',
            'enable-date',
            'current-text',
            'time-text',
            'date-text',
            'now-text',
            'today-text',
            'clear-text',
            'close-text',
            'close-on-date-selection',
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
            name: 'datetimepicker',
            template: '<input class="form-control" ng-model="model[options.key]" ' +
                    'is-open="to.isOpen" ng-click="open($event)"  ' +
                    'datetime-picker="dd-MMM-yyyy hh:mm:ss" ' + 
                    'datepicker-options="to.datepickerOptions"></input>',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],          
            overwriteOk: true,
            defaultOptions: {
                parsers: [
                  function parseDate(value) {
                      return $filter('date')(new Date(value), 'yyyy-MM-dd HH:mm:ss', '+0300');     
                  }
                ],
                formatters: [
                    function(value){
                        return $filter('date')(new Date(value),'dd-MMM-yyyy hh:mm:ss','+0300');
                    }
                ],  
                ngModelAttrs: ngModelAttrs,
                templateOptions: {
                    addonLeft: {
                        class: 'glyphicon glyphicon-calendar',
                        onClick: function (options, scope) {
                            options.templateOptions.isOpen = !options.templateOptions.isOpen;
                        }
                    },
                    onFocus: function ($viewValue, $modelValue, scope) {
                        scope.to.isOpen = !scope.to.isOpen;
                        // $modelValue = $filter('date')($viewValue,'yyyy-MM-dd HH:mm:ss','+0300');
                        console.log('View value: ', $viewValue, 'Model value: ', $modelValue);
                    },
                    datepickerOptions: {},
                    timepickerOptions: {},
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
  }
})();
