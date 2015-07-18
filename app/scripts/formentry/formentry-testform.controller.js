/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('TestFormCtrl', TestFormCtrl);

    TestFormCtrl.$inject = ['$scope', 'TestFormSchema', 'FormentryService'];

    function TestFormCtrl($scope, TestFormSchema, FormentryService) {
        $scope.vm = {};
        $scope.vm.user = {};
        $scope.vm.error = '';
        $scope.vm.submit = function() {
          for(var i=0; i<$scope.vm.userFields.length; i++)
          {
            console.log($scope.vm.userFields[i].model);
          }

            $scope.vm.error = FormentryService.validateForm($scope.vm.userFields);
            if ($scope.vm.error === '')
            {
              FormentryService.getPayLoad($scope.vm.userFields);
            }
            else {
              $scope.vm.error = '';
            }

        }

 // note, these field types will need to be
 // pre-defined. See the pre-built and custom templates
 // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
 var formSchema=TestFormSchema.getFormSchema();

 $scope.vm.userFields = FormentryService.createForm(formSchema);

 console.log(JSON.stringify($scope.vm.user));
}

})();
