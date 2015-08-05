/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('FormentryCtrl', FormentryCtrl);

    FormentryCtrl.$inject = ['$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'EncounterResService', '$timeout', 'FormsMetaData'];

    function FormentryCtrl($location, $rootScope, $stateParams, $state, $scope, FormentryService, EncounterResService, $timeout, FormsMetaData) {

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
            var form = FormsMetaData.getForm($stateParams.formuuid);
            console.log('Selected Form');
            console.log(form);
            var payLoad = FormentryService.getPayLoad($scope.vm.userFields,$scope.vm.patient, form, params.uuid);
            EncounterResService.saveEncounter(payLoad,function (data) {
              // body...
              console.log(data);
              $scope.vm.success = 'Form Submitted successfully'
            })

        }

 var formSchema;

 /*
 Test logic to get either a blank form or form filled with existing data.
 */
 var params={uuid: '8a79e511-edb1-4b9d-a94e-ab51e4f6528c' /*$stateParams.encuuid */}; //drop after testing
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
   if ((params.uuid !== undefined) && (params.uuid !== ''))
   {
     EncounterResService.getEncounterByUuid(params,
       function(data){
       encData = data;
       console.log('Rest Feeback')
       console.log(encData);
       FormentryService.getEncounter(encData,$scope.vm.formlyFields);
      });
    }
    $scope.vm.userFields = $scope.vm.formlyFields;

 },1000);

 console.log(JSON.stringify($scope.vm.userFields));
}

})();
