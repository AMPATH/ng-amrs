/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('FormentryCtrl', FormentryCtrl);

    FormentryCtrl.$inject = ['$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'EncounterResService', '$timeout', 'FormsMetaData'];

    function FormentryCtrl($translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, EncounterResService, $timeout, FormsMetaData) {

        $scope.vm = {};
        $scope.vm.error = '';
        $scope.vm.patient = $rootScope.broadcastPatient;
        //$scope.vm.encounters = $rootScope.encounters;

        $scope.vm.cancel = function ()
        {
          console.log($state);
          var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
					dlg.result.then(function(btn){
						$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
					},function(btn){
						//$scope.vm.confirmed = 'You confirmed "No."';
					});

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
              //console.log(data);
              $scope.vm.success = 'Form Submitted successfully'
              if(data)
              {
                var dlg=dialogs.notify('Success', $scope.vm.success);
                $location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
              }
            })

        }

 var formSchema;

 /*
 Test logic to get either a blank form or form filled with existing data.
 */

 //8a79e511-edb1-4b9d-a94e-ab51e4f6528c
 var params={uuid: $stateParams.encuuid };
 //var params = {uuid: '18a1f142-f2c6-4419-a5db-5f875020b887'};
  var encData;
 $scope.vm.userFields = {};
 var selectedForm = $stateParams.formuuid;
 console.log('testing selected Form')
 console.log(selectedForm);


 $timeout(function () {


   // get form schema data
  //  var selectedForm = $stateParams.formuuid;
  //  console.log('testing selected Form')
  FormentryService.getFormSchema(selectedForm, function(schema){
   formSchema = schema;
   //$scope.vm.userFields = $scope.vm.formlyFields;
   if (Object.keys(formSchema).length>0)
   {
     FormentryService.createForm(formSchema, function(formlySchema){
       $scope.vm.userFields = formlySchema;
     });
   }
  });

   console.log('testing encounter params')
   console.log(params);
   console.log($stateParams);
   if ((params.uuid !== undefined) && (params.uuid !== ''))
   {
     EncounterResService.getEncounterByUuid(params,
       function(data){
       encData = data;
       //console.log('Rest Feeback')
       //console.log(encData);
       if (data)
       {
         FormentryService.getEncounter(encData,$scope.vm.userFields);
       }

      });

    }


},1000);
//$scope.vm.userFields = $scope.vm.formlyFields;
 //console.log(JSON.stringify($scope.vm.userFields));
}

})();
