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
        FormentryService.currentFormModel = {};
        $scope.vm = {};
        $scope.vm.isBusy = true;
        $scope.vm.error = '';
        $scope.vm.model = FormentryService.currentFormModel;
        $scope.vm.patient = $rootScope.broadcastPatient;
        $scope.vm.submitLabel = 'Save';
        $scope.vm.encounterType;
        var formSchema;
        $scope.vm.formlyFields;
        $scope.vm.tabs = [];
        $scope.vm.encounter;

        $scope.vm.currentTab = 0;

        $scope.vm.tabSelected = function($index) {
          $scope.vm.currentTab = $index;
        }

      var isLastTab = function() {
        return $scope.vm.currentTab === $scope.vm.tabs.length-1;
      }

      var isFirstTab = function() {
        return $scope.vm.currentTab === 0;
      }

      $scope.vm.isLastTab = isLastTab;
      $scope.vm.isFirstTab = isFirstTab;

      $scope.vm.activateTab = function(button) {
        if(button === 'next')
        {
          if(!isLastTab()){
          $scope.vm.currentTab++;
          $scope.vm.tabs[$scope.vm.currentTab].active = true;
          }
        }
        else if(button === 'prev')
        {
          if(!isFirstTab()){
          $scope.vm.currentTab--;
          $scope.vm.tabs[$scope.vm.currentTab].active = true;
          }
        }
      };

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

          FormentryService.createForm(formSchema, $scope.vm.model, function(formlySchema){
            //$scope.vm.formlyFields = formlySchema;
            if(formlySchema)  {
              $scope.vm.tabs = formlySchema;

              // var i = 0;
              // angular.forEach($scope.vm.tabs, function(tab){
              //   // console.log('Tab Structure');
              //   // console.log(tab);
              //   if (i===0) {
              //     tab.active = true;
              //   }
              //   i++;
              //   tab.form['model'] = $scope.vm.model;
              // });
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
              },
              //error callback
              function (error){
                $scope.vm.error = 'An Error occured when trying to get encounter data';
              }
            );
            }
            else {
              //set the current user as the default provider
              var done = false;
              _.some($scope.vm.tabs, function(page){
                var model = page.form.model;
                _.some(page.form.fields, function(_section){
                  if (_section.type === 'section')
                  {
                    var sec_key = _section.key;
                    var sec_data = model[sec_key] = {};
                    _.some(_section.templateOptions.fields[0].fieldGroup, function(_field){
                      if(_field.key === 'encounterProvider'){
                        sec_data['encounterProvider'] = OpenmrsRestService.getUserService().user.personUuId();
                        done = true;
                        return true;
                      }
                    });
                  }
                  if (done) return true;
                });
                if (done) return true;
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
            console.log($scope.vm.form)

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
                    },
                    //error callback
                    function (error) {
                      // body...
                      $scope.vm.error = 'An Error occured while trying to save the form';
                    }
                  );
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
              // console.log('FormLy Form',$scope.vm);
              // console.log('FormLy Scope',$scope);
              // console.log('FormLy Json',$scope.vm.form.$validate());
              // console.log('FormLy Field',$scope.vm.tabs);
              //
              // $scope.vm.form.setValidity()
              $scope.vm.error = '';
              var error_required = $scope.vm.form.$error;
              var error_date = $scope.vm.form.$error;
              if(error_required !== undefined && error_required.required !== undefined)
              {
                  var i = 0;
                  _.some(error_required.required[0].$error.required, function(error_field){
                    if (i === 0) {
                      var field = getErrorField(error_field.$name);
                      if(field !== undefined)
                      {
                        $scope.vm.error= 'Missing required field: '+ field.templateOptions.label;
                        return true;
                      }
                    }
                    i = i + 1;
                  });
                  return;

              }

              if(error_date !== undefined && error_date.date !== undefined)
              {
                var i = 0;
                _.some(error_date.date[0].$error.date, function(error_field){
                  if (i === 0) {
                    var field = getErrorField(error_field.$name);
                    if(field !== undefined)
                    {
                      $scope.vm.error= 'Error on field: '+ field.templateOptions.label;
                      return true;
                    }

                  }
                  i = i + 1;
                });
                return;
              }

              if(error_date !== undefined && error_date.dateValidator !== undefined)
              {
                var i = 0;
                _.some(error_date.dateValidator[0].$error.dateValidator, function(error_field){
                  if (i === 0) {
                    var field = getErrorField(error_field.$name);
                    if(field !== undefined)
                    {
                      $scope.vm.error= 'Error on field: '+ field.templateOptions.label;
                      return true;
                    }

                  }
                  i = i + 1;
                });
                return;
              }
              if(error_date !== undefined)
              {
                var i = 0;
                _.some(error_date.js_expression[0].$error.js_expression, function(error_field){
                  if (i === 0) {
                    var field = getErrorField(error_field.$name);
                    if(field !== undefined)
                    {
                      $scope.vm.error= 'Error on field: '+ field.templateOptions.label;
                      return true;
                    }

                  }
                  i = i + 1;
                });
                _.some(error_date.js_expression1[0].$error.js_expression1, function(error_field){
                  if (i === 0) {
                    var field = getErrorField(error_field.$name);
                    if(field !== undefined)
                    {
                      $scope.vm.error= 'Error on field: '+ field.templateOptions.label;
                      return true;
                    }

                  }
                  i = i + 1;
                });
                 _.some(error_date.js_expression2[0].$error.js_expression2, function(error_field){
                  if (i === 0) {
                    var field = getErrorField(error_field.$name);
                    if(field !== undefined)
                    {
                      $scope.vm.error= 'Error on field: '+ field.templateOptions.label;
                      return true;
                    }

                  }
                  i = i + 1;
                });

                return;
              }

            }

        }


function getErrorAsList(field) {
_.each(Object.keys(field.formControl.$error), function(t){
  console.log(t)
});
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
      },
      //error callback
      function(error)
      {
        $scope.vm.error = 'An error occured when trying to void obs';
      }
    );
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
      },
      //error callback
      function(error)
      {
        $scope.vm.error = 'An error occured when trying to void obs';
      }
    );
    })
  }
}
function getErrorField(fieldKey)
{

  //  console.log('++++field_key', fieldKey);
   var errorField;
   var field_key;
   if(_.contains(fieldKey,'ui-select-extended'))
   {
      errorField = fieldKey.split('ui-select-extended_')[1];
      field_key = errorField.split('_')[0];
      // console.log(errorField)
      // console.log(field_key)
   }
   else
   {
     errorField = fieldKey.split('obs')[1];
     field_key = 'obs'+errorField.split('_')[0] + '_' + errorField.split('_')[1]
   }


   var field = FormentryService.getFieldById_Key(field_key, $scope.vm.tabs);
  //  console.log('error Field ', field);
   return field;
}

//$scope.vm.userFields = $scope.vm.formlyFields;
 //console.log(JSON.stringify($scope.vm.userFields));
}

})();
