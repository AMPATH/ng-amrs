/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('FormentryCtrl', FormentryCtrl);

    FormentryCtrl.$inject = ['$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'OpenmrsRestService', '$timeout', 'FormsMetaData'];

    function FormentryCtrl($translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, OpenmrsRestService, $timeout, FormsMetaData) {

        $scope.vm = {};
        $scope.vm.isBusy = true;
        $scope.vm.error = '';
        $scope.vm.model = {};
        $scope.vm.patient = $rootScope.broadcastPatient;
        $scope.vm.submitLabel = 'Save';
        $scope.vm.encounterType;
        var formSchema;
        $scope.vm.formlyFields;
        $scope.vm.tabs = [];
        $scope.vm.encounter;
        //console.log('ACTIVE ENCOUNTER', $scope.vm.encounter);

        /*
        Test logic to get either a blank form or form filled with existing data.
        */

        //8a79e511-edb1-4b9d-a94e-ab51e4f6528c
        var params={uuid: $stateParams.encuuid };
        //var params = {uuid: '18a1f142-f2c6-4419-a5db-5f875020b887'};
        var encData;
        var selectedForm //= $stateParams.formuuid;
        if(params.uuid !== undefined)
        {
          $scope.vm.encounter = $rootScope.activeEncounter;
          //var encForm = FormsMetaData.getForm($scope.vm.encounter.encounterTypeUuid());
          selectedForm = FormsMetaData.getForm($scope.vm.encounter.encounterTypeUuid());
          $scope.vm.encounterType = $scope.vm.encounter.encounterTypeName();
        }
        else {
          //selectedForm = $stateParams.formuuid;
          selectedForm = FormsMetaData.getForm($stateParams.formuuid);
          //var encForm = FormsMetaData.getForm($stateParams.formuuid);
          $scope.vm.encounterType = selectedForm.encounterTypeName
        }

        // console.log('testing selected Form')
        // console.log(selectedForm);


        $timeout(function () {
          // get form schema data
         //  var selectedForm = $stateParams.formuuid;
         //  console.log('testing selected Form')
         var start = new Date().getTime();
         FormentryService.getFormSchema(selectedForm.name, function(schema){
          formSchema = schema;

          FormentryService.createForm(formSchema, function(formlySchema){
            //$scope.vm.formlyFields = formlySchema;
            if(formlySchema)  {
              $scope.vm.tabs = formlySchema;

              var i = 0;
              angular.forEach($scope.vm.tabs, function(tab){
                // console.log('Tab Structure');
                // console.log(tab);
                if (i===0) {tab.active = true;}
                i++;
                tab.form['model'] = $scope.vm.model;
              });
              //update sex;
              $scope.vm.model['sex'] = $scope.vm.patient.gender();
              $scope.vm.isBusy = false;
              var end = new Date().getTime();
              var time = end - start;
              console.log('Form Creation Execution time: ' + time + ' ms');
            }
            ///FormentryService.getEncounter('encData', formlySchema)
            //var params = {uuid:'cf3f041c-9c37-44c5-983a-d02507ffe279'};
            if(params.uuid !== undefined && params.uuid !== '')
            {
              OpenmrsRestService.getEncounterResService().getEncounterByUuid(params,
                function(data){
                var encData = data;
                // console.log('Rest Feeback')
                // console.log(encData);
                if (data)
                {
                  $scope.vm.submitLabel = 'Update'
                    FormentryService.getEncounter(encData,formlySchema);
                }
               });
            }
            else {
              //set the current user as the default provider
              _.each($scope.vm.tabs, function(page){
                var model = page.form.model;
                _.each(page.form.fields, function(_section){
                  if (_section.type === 'section')
                  {
                    var sec_key = _section.key;
                    var sec_data = model[sec_key] = {};
                    _.each(_section.templateOptions.fields[0].fieldGroup, function(_field){
                      if(_field.key === 'encounterProvider'){
                        sec_data['encounterProvider'] = OpenmrsRestService.getUserService().user.personUuId();
                        return;
                      }
                    });
                  }
                });
              });

            }
          });
         });
       },1000);


        $scope.vm.cancel = function()
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
            // console.log('Checking form Validity')
            // console.log($scope.vm.form.$valid);
            // console.log($scope.vm.form)

            if ($scope.vm.form.$valid)
            {
              var form = selectedForm;
              // console.log($stateParams.formuuid)
              // console.log('Selected Form');
              // console.log(form);
              var payLoad = FormentryService.updateFormPayLoad($scope.vm.model,$scope.vm.tabs, $scope.vm.patient,form,params.uuid);
              console.log(payLoad);
              if (!_.isEmpty(payLoad.obs))
              {
                  /*
                  submit only if we have some obs
                  */

                  if(payLoad.encounterType !== undefined){
                    OpenmrsRestService.getEncounterResService().saveEncounter(JSON.stringify(payLoad), function(data){
                      if (data)
                      {
                        if($scope.vm.submitLabel === 'Update')
                        {
                          // console.log('Trying to void/update obs')
                          var cPayload = angular.copy(payLoad)
                          voidObs(cPayload);
                          updateObs(cPayload);
                        }
                        $scope.vm.success = '| Form Submitted successfully'
                        var dlg=dialogs.notify('Success', $scope.vm.success);
                        // console.log('Previous State')
                        // console.log($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid)
                        $location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
                      }
                    });
                  }
                  // else {
                  //   //void obs only
                  //   if($scope.vm.submitLabel === 'Update')
                  //   {
                  //     voidObs(payLoad);
                  //     updateObs(payLoad);
                  //   }
                  //   $scope.vm.success = '| Form Submitted successfully'
                  //   var dlg=dialogs.notify('Success', $scope.vm.success);
                  //   $location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
                  // }
              }
              else {
                  var dlg=dialogs.notify('Info', 'No Changes to be Submitted. Please fill the form first....');
              }

            }
            else {
              var error_required = $scope.vm.form.$error;
              var error_date = $scope.vm.form.$error;
              if(error_required !== undefined)
              {
                  var i = 0;
                  _.each(error_required.required[0].$error.required, function(error_field){
                    if (i === 0) {
                      $scope.vm.error= 'required field: '+ error_field.$name;
                    }
                    i = i + 1;
                  });
                  return;

              }

              if(error_date !== undefined)
              {
                var i = 0;
                _.each(error_date.dateValidator[0].$error.dateValidator, function(error_field){
                  if (i === 0) {
                    $scope.vm.error= 'One of the date fields is invalid';
                  }
                  i = i + 1;
                });
                return;
              }
            }

        }

function voidObs(pay_load)
{
  var obsToVoid = _.where(pay_load.obs,{voided:true});
  //console.log('Obs to Void: ', obsToVoid);
  if(obsToVoid !== undefined)
  {
    _.each(obsToVoid, function(obs){
      OpenmrsRestService.getObsResService().voidObs(obs, function(data){
        if (data)
        {
          console.log('Voided Obs uuid: ', obs.uuid);
        }
      });
    })
  }
}

function updateObs(pay_load)
{
  var obsToUpdate = _.filter(pay_load.obs,function(obs){
    // console.log(obs);
    if(obs.uuid !== undefined && obs.voided === undefined)
    { return obs;}
  });
  //console.log('Obs to Void: ', obsToVoid);
  if(obsToUpdate !== undefined)
  {
    _.each(obsToUpdate, function(obs){
      OpenmrsRestService.getObsResService().saveUpdateObs(obs, function(data){
        if (data)
        {
          console.log('Updated Obs uuid: ', data);
        }
      });
    })
  }
}
//$scope.vm.userFields = $scope.vm.formlyFields;
 //console.log(JSON.stringify($scope.vm.userFields));
}

})();
