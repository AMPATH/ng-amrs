/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('FormentryCtrl', FormentryCtrl);

    FormentryCtrl.$inject = ['$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'OpenmrsRestService', '$timeout', 'FormsMetaData', 'CurrentLoadedFormService','UtilRestService'];

    function FormentryCtrl($translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, OpenmrsRestService, $timeout, FormsMetaData, CurrentLoadedFormService,UtilRestService) {
        FormentryService.currentFormModel = {};
        $scope.vm = {};
        $scope.vm.isBusy = true;
        $scope.vm.errorSubmit = '';
        $scope.vm.errorMessage = 'The form has some validation errors, see the list above';
        $scope.vm.model = {};
        CurrentLoadedFormService.formModel = $scope.vm.model;
        $scope.vm.patient = $rootScope.broadcastPatient;
        $scope.vm.submitLabel = 'Save';
        $scope.vm.encounterType;
        var formSchema;
        $scope.vm.formlyFields=[];
        $scope.vm.tabs = [];
        $scope.vm.encounter;
        $scope.vm.encData;
        $scope.vm.savedOrUpdated=false;

        $scope.vm.currentTab = 0;

        $scope.vm.tabSelected = function($index) {
          $scope.vm.currentTab = $index;
          console.log('Page ', $index)
          $scope.vm.tabs[$index]['form']=$scope.vm.formlyFields[$index].form;
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
          $scope.vm.tabs[$scope.vm.currentTab]['form']=$scope.vm.formlyFields[$scope.vm.currentTab].form;

          }
        }
        else if(button === 'prev')
        {
          if(!isFirstTab()){
          $scope.vm.currentTab--;
          $scope.vm.tabs[$scope.vm.currentTab].active = true;
          $scope.vm.tabs[$scope.vm.currentTab]['form']=$scope.vm.formlyFields[$scope.vm.currentTab].form;
          }
        }
      };

        //Checking user navigations
        var userConfirmedChange=false;
        var usedStateChange=false;
          $scope.$on('$stateChangeStart', function(event,toState,toParams) {
           usedStateChange=true;
           if($scope.vm.form.$dirty&&$scope.vm.savedOrUpdated===false){
            if(userConfirmedChange===false){
              //prevent transition to new url before saving data
              event.preventDefault();
                var dialogPromise =dialogs.confirm('Changes Not Saved','Do you want to close this form?');
                  dialogPromise.result.then(function(btn){
                      userConfirmedChange=true;
                    $state.go(toState.name, {onSuccessRout:toState, onSuccessParams:toParams})
                    },function(btn){
                      //Prevent any transition to new url
                      event.preventDefault();
                      userConfirmedChange=false;
                       });
               }
           }
       });

       if(usedStateChange===false){
              UtilRestService.confirmBrowserExit();
       }

        var params={uuid: $stateParams.encuuid };
        var selectedForm //= $stateParams.formuuid;
        if(params.uuid !== undefined)
        {
          $scope.vm.encounter = $rootScope.activeEncounter;
          selectedForm = FormsMetaData.getForm($scope.vm.encounter.encounterTypeUuid());
          $scope.vm.encounterType = $scope.vm.encounter.encounterTypeName();
        }
        else {
          //selectedForm = $stateParams.formuuid;
          selectedForm = FormsMetaData.getForm($stateParams.formuuid);
          //var encForm = FormsMetaData.getForm($stateParams.formuuid);
          $scope.vm.encounterType = selectedForm.encounterTypeName
        }
        //load the selected form
        activate();


        $scope.vm.cancel = function()
        {
          console.log($state);
          $scope.vm.savedOrUpdated=true;
          var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
					dlg.result.then(function(btn){
						$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
					},function(btn){
						//$scope.vm.confirmed = 'You confirmed "No."';
					});
        }

        $scope.vm.submit = function() {
            $scope.vm.savedOrUpdated=true;
            console.log($scope.vm.form)

          if ($scope.vm.form.$valid)
          {
              var form = selectedForm;
              // console.log($stateParams.formuuid)
              // console.log('Selected Form');
              console.log('current tabs',$scope.vm.tabs);
              console.log('Original tabs',$scope.vm.tabs);
              var payLoad = FormentryService.updateFormPayLoad($scope.vm.model,$scope.vm.formlyFields, $scope.vm.patient,form,params.uuid);
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
                          $scope.vm.savedOrUpdated=true;
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
                      $scope.vm.errorSubmit = 'An Error occured while trying to save the form';
                    }
                  );
                  }
              }
              else {
                  var dlg=dialogs.notify('Info', 'No Changes to be Submitted. Please fill the form first....');
              }
          }
        }

  function getErrorAsList(field) {
  _.each(Object.keys(field.formControl.$error), function(t){
    console.log(t)
  });
  }

  /*
  private method to create the form
  */
  function activate()
  {
      $timeout(function () {
        // get form schema data
       //  console.log('testing selected Form')
       var start = new Date().getTime();
       FormentryService.getFormSchema(selectedForm.name, function(schema){
        formSchema = schema;
        FormentryService.createForm(formSchema, $scope.vm.model, function(formlySchema){
          $scope.vm.formlyFields = formlySchema;
          if(formlySchema.length>0)  {
            var i = 0;
            angular.forEach(formlySchema, function(tab){
              // console.log('Tab Structure');
              // console.log(tab);
              if (i === 0)
              {
                $scope.vm.tabs.push(formlySchema[i]);
              }
              else {
                $scope.vm.tabs.push({form:{},title:tab.title});
              }
              i++;
            });
            //update sex;
            $scope.vm.model['sex'] = $scope.vm.patient.gender();
            $scope.vm.isBusy = false;
            var end = new Date().getTime();
            var time = end - start;
            console.log('Form Creation Execution time: ' + time + ' ms');
          }
          if(params.uuid !== undefined && params.uuid !== '')
          {
            OpenmrsRestService.getEncounterResService().getEncounterByUuid(params,
              function(data){
              $scope.vm.encData = data;
              if (data)
              {
                $scope.vm.submitLabel = 'Update'
                  FormentryService.getEncounter($scope.vm.encData,formlySchema);
              }
            },
            //error callback
            function (error){
              $scope.vm.errorSubmit = 'An Error occured when trying to get encounter data';
            }
          );
          }
          else {
            //set the current user as the default provider
            setProvider();
          }
        });
       });
     },1000);
  }

  /*
  private methdd to set the current user as the selected provider
  */
  function setProvider()
  {
    var done = false;
    _.some($scope.vm.tabs, function(page){
      var model = page.form.model;
      _.some(page.form.fields, function(_section){
        if (_section.type === 'section')
        {
          var sec_key = _section.key;
          var sec_data = model[sec_key] = {};
          _.some(_section.data.fields, function(_field){
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

  /*
  private methdd to void obs
  */
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
          $scope.vm.errorSubmit = 'An error occured when trying to void obs';
        }
      );
      })
    }
  }

  /*
  private methdd to update obs
  */
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
          $scope.vm.errorSubmit = 'An error occured when trying to void obs';
        }
      );
      })
    }
  }

  /*
  private methdd to get the error field
  */
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
}

})();
