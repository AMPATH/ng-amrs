/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('TestFormCtrl', TestFormCtrl);

    TestFormCtrl.$inject = ['$rootScope',  '$stateParams', '$state', '$scope', 'TestFormSchema', 'FormentryService', 'EncounterService', '$timeout'];

    function TestFormCtrl($rootScope, $stateParams, $state, $scope, TestFormSchema, FormentryService, EncounterService, $timeout) {
        $scope.vm = {};
        $scope.vm.user = {};
        $scope.vm.error = '';
        $scope.vm.cancel = function ()
        {
          console.log($state);
          //$state.go($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
        }
        $scope.vm.submit = function() {
          //  $scope.vm.error = FormentryService.validateForm($scope.vm.userFields);
            if ($scope.vm.error === '')
            {
              //FormentryService.getPayLoad($scope.vm.userFields);
            }
            else {
              $scope.vm.error = '';
            }
            var payLoad = FormentryService.getPayLoad($scope.vm.userFields);
            EncounterService.postEncounter(payLoad,function (data) {
              // body...
              console.log(data);
            })
        }

 var formSchema=TestFormSchema.getFormSchema();

 $scope.vm.formlyFields = FormentryService.createForm(formSchema);

 /*
 Test logic to get a form filled with existing data.
 */
 var params={uuid: $stateParams.uuid}; //drop after testing
 var encData;

 $timeout(function () {
   console.log('testing encounter params')
   console.log(params);
   console.log($stateParams);
   if (!params.uuid.startsWith('form'))
   {
     EncounterService.getEncounter(params,
       function(data){
       encData = data;
       //console.log('Rest Feeback')
       //console.log(encData);
       FormentryService.getEncounter(encData,$scope.vm.formlyFields);
      });
    }
    $scope.vm.userFields = $scope.vm.formlyFields;

 },1000);

 console.log(JSON.stringify($scope.vm.user));
}

})();
