/* global angular */
(function() {

  'use strict';
  var mod =
    angular
      .module('app.formentry');

  mod.run(function (formlyConfig) {
    formlyConfig.setType({
      name: 'concept-search-select',
      wrapper: ['bootstrapLabel','bootstrapHasError','validation'],
      extends: 'select',
      defaultOptions: {
        templateOptions: {

        }
      },
      controller:function ($scope,$filter) {
        activate();
        function activate(){
          validateTemplateOptions();
          fetchOptions();
        }

        function fetchOptions(){
          $scope.to.fetchOptionsFunction($scope.to.questionConceptUuid,fetchOptionsSuccess,fetchOptionsFail);
        }

        function fetchOptionsSuccess(options){
          $scope.to.options=[];
          angular.forEach(options, function(value, key) {
            var valueMember=$scope.to.valueMember;
            var displayMember=$scope.to.displayMember;
            var val=evaluateFunction(value[valueMember]);
            var display=evaluateFunction(value[displayMember]);
            var displayFormated=$filter('titlecase')(display)
            var option={name:displayFormated,value:val};
            $scope.to.options.push(option);

          });
        }

        function fetchOptionsFail(error){
          console.log(error);
        }

        function validateTemplateOptions() {
          if (!$scope.to.fetchOptionsFunction) {
            console.error('Template Options must define fetchOptionsFunction function');
            console.error($scope.to);
          }
          if ($scope.to.fetchOptionsFunction && (typeof $scope.to.fetchOptionsFunction) !== 'function') {
            console.error('Template Options fetchOptionsFunction is Not a function');
            console.error($scope.to);
          }
          if (!$scope.to.questionConceptUuid) {
            console.error('Template Options must define questionConceptUuid');
            console.error($scope.to);
          }

        }

        function evaluateFunction(obj) {
          if (obj && (typeof obj) === 'function') {
            return obj();
          }
          return obj;
        }

        function isBlank(str) {

          if (str === null || str.length  === 0 || str === " ") return true;
          return false;

        }
      }
    });
  });



})();
