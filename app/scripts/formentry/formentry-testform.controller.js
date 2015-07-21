/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('TestFormCtrl', TestFormCtrl);

    TestFormCtrl.$inject = ['$rootScope', '$state', '$scope', 'TestFormSchema', 'FormentryService', 'EncounterService', '$timeout'];

    function TestFormCtrl($rootScope, $state, $scope, TestFormSchema, FormentryService, EncounterService, $timeout) {
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

 $scope.vm.userFields = FormentryService.createForm(formSchema);

 /*
 Test logic to get a form filled with existing data.
 */
 var testParams={uuid:'713aa823-a594-4256-b3d7-364145fbbd2f'}; //drop after testing
 var encData;

 $timeout(function () {
   EncounterService.getEncounter(testParams, function(data){
     encData = data;
     //console.log('Rest Feeback')
     //console.log(encData);
     FormentryService.getEncounter(encData,$scope.vm.userFields);
   });
 },1000);

 console.log(JSON.stringify($scope.vm.user));
}

})();
