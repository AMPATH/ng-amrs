/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    var mod =
          angular
              .module('app.formentry');

    mod.run(function config(formlyConfig) {
    formlyConfig.setType({
      name: 'section',
      templateUrl: 'section.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.copyFields = copyFields;
        // console.log('section scope', $scope)
        function copyFields(fields) {
          // console.log('fields');
          // console.log(fields);
          return angular.copy(fields);
        }
      }
    });

  });
})();
