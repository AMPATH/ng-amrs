/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('FormentryCtrl', TestFormCtrl);

    TestFormCtrl.$inject = ['$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'EncounterResService', '$timeout'];

    function TestFormCtrl($location, $rootScope, $stateParams, $state, $scope, FormentryService, EncounterResService, $timeout) {
        $scope.vm = {};
        $scope.vm.error = '';
        $scope.vm.patient = $rootScope.broadcastPatient;
        $scope.vm.encounters = $rootScope.encounters;

        $scope.vm.cancel = function ()
        {
          console.log($state);
          $location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
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

 var formSchema;



//trying to get broadcasted data
$scope.$on('patientData', function(event, data) {
    // do something useful here;
    $scope.vm.patient = data;
    console.log('broadcasted Patient data', $scope.vm.patient);
});

 /*
 Test logic to get either a blank form or form filled with existing data.
 */
 var params={uuid: $stateParams.encuuid}; //drop after testing
 var encData;
 $scope.vm.userFields = {};

 $timeout(function () {

   // get form schema data
   var selectedForm = $stateParams.formuuid;
   console.log('testing selected Form')
   console.log(selectedForm);
    FormentryService.getFormSchema(selectedForm, function(schema){
     formSchema = schema;
     $scope.vm.formlyFields = FormentryService.createForm(formSchema);
     $scope.vm.userFields = $scope.vm.formlyFields;
   });

   console.log('testing encounter params')
   console.log(params);
   console.log($stateParams);
   if (params.uuid !== undefined)
   {
     EncounterResService.getEncounter(params,
       function(data){
       encData = data;
       //console.log('Rest Feeback')
       //console.log(encData);
       FormentryService.getEncounter(encData,$scope.vm.formlyFields);
      });
    }
    $scope.vm.userFields = $scope.vm.formlyFields;

 },1000);

 console.log(JSON.stringify($scope.vm.userFields));
}

})();
