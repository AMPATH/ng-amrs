/*
jshint -W106, -W098, -W109, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {

    'use strict';

    var mod =
        angular
            .module('app.formentry');

    mod.run(function (formlyConfig) {
        formlyConfig.setType({
            name: 'ui-select-extended',
            wrapper: ['bootstrapLabel','bootstrapHasError','validation'],
            template: '<ui-select ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}" reset-search-input="false"> <ui-select-match placeholder="{{to.placeholder}}"> {{evaluateFunction($select.selected[to.labelProp || \'name\'])}} </ui-select-match> <ui-select-choices refresh="refreshItemSource($select.search)" group-by="to.groupBy" repeat="(evaluateFunction(option[to.valueProp || \'value\'])) as option in itemSource" > <div ng-bind-html="evaluateFunction(option[to.labelProp || \'name\']) | highlight: $select.search"></div> </ui-select-choices> </ui-select>',
            link: function (scope, el, attrs, vm) {
                //incase we need link function
            },
            controller: function ($scope) {
                var vm = this;
                $scope.itemSource = [];
                $scope.refreshItemSource = refreshItemSource;
                $scope.evaluateFunction = evaluateFunction;
                vm.getSelectedObject = getSelectedObject;

                $scope.$watch(
                function(scope){
                    return evaluateFunction(scope.model[scope.options.key]);
                },
                function (val) {
                   //console.log('changed:' + val);
                   if($scope.itemSource !== undefined && $scope.itemSource.length === 0){
                       getSelectedObject();
                   }
                });

                activate();
                function activate() {
                    validateTemplateOptions();
                    getSelectedObject();
                }

                function getSelectedObject() {
                    var selectedValue = typeof $scope.model[$scope.options.key] === 'function' ? $scope.model[$scope.options.key]() : $scope.model[$scope.options.key];
                    if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '')
                        $scope.to.getSelectedObjectFunction(selectedValue,
                            function (object) {
                                $scope.itemSource = [object];
                            },
                            function (error) {
                                console.error(error);
                            });
                }

                function refreshItemSource(value) {
                    if (isBlank(value) === false)
                        $scope.to.deferredFilterFunction(value,
                            function (results) {
                                $scope.itemSource = results;
                            },
                            function (error) {
                                console.error(error);
                            });
                }

                function evaluateFunction(obj) {
                    if (obj && (typeof obj) === 'function') {
                        return obj();
                    }
                    return obj;
                }

                function isBlank(str) {

                    if (str === null || str.length === 0 || str === " ") return true;
                    return false;

                }

                function validateTemplateOptions() {
                    if (!$scope.to.deferredFilterFunction) {
                        console.error('Template Options must define deferredFilterFunction');
                        console.error($scope.to);
                    }
                    if ($scope.to.deferredFilterFunction && (typeof $scope.to.deferredFilterFunction) !== 'function') {
                        console.error('Template Options deferredFilterFunction is a function');
                        console.error($scope.to);
                    }
                    if (!$scope.to.getSelectedObjectFunction) {
                        console.error('Template Options must define getSelectedObjectFunction');
                        console.error($scope.to);
                    }
                    if ($scope.to.getSelectedObjectFunction && (typeof $scope.to.getSelectedObjectFunction) !== 'function') {
                        console.error('Template Options getSelectedObjectFunction is a function');
                        console.error($scope.to);
                    }
                }
            }
        });

    });


})();
