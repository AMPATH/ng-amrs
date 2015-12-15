/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
  'use strict';

  angular
    .module('app.formentry')
    .controller('FormentryCtrl', FormentryCtrl);

  FormentryCtrl.$inject = ['$translate', 'dialogs', '$location',
    '$rootScope', '$stateParams', '$state', '$scope', 'FormentryService',
    'OpenmrsRestService', '$timeout', 'FormsMetaData',
    'CurrentLoadedFormService', 'UtilService', '$loading',
    'PersonAttributesRestService', '$anchorScroll'];

  function FormentryCtrl($translate, dialogs, $location,
    $rootScope, $stateParams, $state, $scope, FormentryService,
    OpenmrsRestService, $timeout, FormsMetaData, CurrentLoadedFormService,
    UtilService, $loading, PersonAttributesRestService, $anchorScroll) {

    FormentryService.currentFormModel = {};
    $scope.vm = {};
    $scope.vm.isBusy = true;
    $scope.vm.submittingForm = false;
    $scope.vm.errorSubmit = '';
    $scope.vm.errorMessage = 'The form has some validation errors, see the list above';
    $scope.vm.model = {};
    CurrentLoadedFormService.formModel = $scope.vm.model;
    $scope.vm.patient = $rootScope.broadcastPatient;
    $scope.vm.submitLabel = 'Save';
    $scope.vm.encounterType;
    var formSchema;
    $scope.vm.formlyFields = [];
    $scope.vm.tabs = [];
    $scope.vm.encounter;
    $scope.vm.encData;
    $scope.vm.savedOrUpdated = false;
    $scope.vm.updatedFailed = false;
    $scope.vm.voidFailed = false;
    $scope.vm.currentTab = 0;
    $scope.vm.displayedTabs = [];
    //BEGIN PATIENT SUMMARY
    $scope.HivHistoricalExpanded = true;

    $scope.showHivHistoricalSummary = false;

    $scope.$on('viewHivHistoricalSummary', viewHivHistoricalSummary);

    $scope.vm.hasClickedSubmit = false;

    function viewHivHistoricalSummary() {
      $scope.showHivHistoricalSummary = true;
    }
    //END PATIENT SUMMARY
    $scope.vm.tabSelected = function ($index) {
      $scope.vm.currentTab = $index;
      if ($scope.vm.displayedTabs.indexOf($index) === -1) {
        $scope.vm.displayedTabs.push($index);
      }

      $scope.vm.tabs[$index]['form'] = $scope.vm.formlyFields[$index].form;
    };

    var isLastTab = function () {
      return $scope.vm.currentTab === $scope.vm.tabs.length - 1;
    };

    var isFirstTab = function () {
      return $scope.vm.currentTab === 0;
    };

    $scope.vm.isLastTab = isLastTab;
    $scope.vm.isFirstTab = isFirstTab;

    $scope.vm.activateTab = function (button) {
      if (button === 'next') {
        if (!isLastTab()) {
          $scope.vm.currentTab++;
          $scope.vm.tabs[$scope.vm.currentTab].active = true;
          $scope.vm.tabs[$scope.vm.currentTab]['form'] = $scope.vm.formlyFields[$scope.vm.currentTab].form;
          /*move to the top of the selected page*/
          $location.hash('top');
          $anchorScroll();
        }
      } else if (button === 'prev') {
        if (!isFirstTab()) {
          $scope.vm.currentTab--;
          $scope.vm.tabs[$scope.vm.currentTab].active = true;
          $scope.vm.tabs[$scope.vm.currentTab]['form'] = $scope.vm.formlyFields[$scope.vm.currentTab].form;
          /*move to the top of the selected page*/
          $location.hash('top');
          $anchorScroll();
        }
      }
    };
    $scope.vm.anyFieldsInError = function (fields) {
      if (fields && fields.length !== 0) {
        var hasError = false;
        _.each(fields, function (field) {
          if (field.formControl && field.formControl.$error && Object.keys(field.formControl.$error).length > 0) {
            hasError = true;
          }
        });
        return hasError;
      }
      return false;
    };

    //Checking user navigations
    var userConfirmedChange = false;
    var usedStateChange = false;
    $scope.$on('$stateChangeStart', function (event, toState, toParams) {
      usedStateChange = true;
      if ($scope.vm.form.$dirty && $scope.vm.savedOrUpdated === false) {
        if (userConfirmedChange === false) {
          //prevent transition to new url before saving data
          event.preventDefault();
          var dialogPromise = dialogs.confirm('Changes Not Saved',
            'Do you want to close this form?');
          dialogPromise.result.then(function (btn) {
            userConfirmedChange = true;
            $state.go(toState.name, { onSuccessRout: toState, onSuccessParams: toParams });
          }, function (btn) {
            //Prevent any transition to new url
            event.preventDefault();
            userConfirmedChange = false;
          });
        }
      }
    });

    if (usedStateChange === false) {
      UtilService.confirmBrowserExit(function (data) {
        if (data) {
          var dlg = dialogs.confirm('Close Form',
            'Do you want to close this form?');
        }
      });
    }

    var params = {
      uuid: $stateParams.encuuid,
      visitUuid: $stateParams.visitUuid
    };
    //var params = {uuid: '18a1f142-f2c6-4419-a5db-5f875020b887'};
    var encData;
    var selectedForm; //= $stateParams.formuuid;
    if (params.uuid !== undefined) {
      $scope.vm.encounter = $rootScope.activeEncounter;
      var encFormUuid = $scope.vm.encounter.formUuid();
      if (encFormUuid === undefined || encFormUuid === '') {
        encFormUuid = $scope.vm.encounter.encounterTypeUuid();
      }

      console.log('selected form', encFormUuid);
      selectedForm = FormsMetaData.getForm(encFormUuid);
      $scope.vm.encounterType = $scope.vm.encounter.encounterTypeName();
    } else {
      selectedForm = FormsMetaData.getForm($stateParams.formuuid);
      $scope.vm.encounterType = selectedForm.encounterTypeName;
      console.log('selected form', selectedForm);
    }

    //load the selected form
    activate();

    $scope.vm.cancel = function () {
      console.log($state);
      $scope.vm.savedOrUpdated = true;
      var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
      dlg.result.then(function (btn) {
        $location.path($rootScope.previousState + '/' + $rootScope.previousStateParams.uuid);
      },

        function (btn) {
          //$scope.vm.confirmed = 'You confirmed "No."';
        });
    };

    $scope.vm.scrollToTop = function () {
      $location.hash('top');
      $anchorScroll();
    };

    $scope.vm.scrollToAnchorByKey = function (key) {
      //var newHash = 'obs120_a8a666ban1350n11dfna1f1n0026b9348838';
      if ($location.hash() !== key) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash(key);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    };

    $scope.vm.selectTabByTitle = function (title) {
      _.each($scope.vm.tabs, function (tab) {
        if (tab.title === title) {
          tab.active = true;
        }
      });
    };

    $rootScope.$on("navigateToQuestion", function (args, param) {
      $scope.vm.selectTabByTitle(param.tabTitle);
      $scope.vm.scrollToAnchorByKey(param.questionKey);
    });

    $scope.vm.scrollToElementByKey = function (key) {
      //var newHash = 'obs120_a8a666ban1350n11dfna1f1n0026b9348838';
      if ($location.hash() !== key) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash(key);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    };

    $scope.vm.submit = function () {
      if ($scope.vm.form.$valid === false) {
        $location.hash('top');
        $anchorScroll();
      }

      $scope.vm.hasClickedSubmit = true;
      $scope.vm.savedOrUpdated = true;
      var undisplayedTabs = [];
      angular.copy($scope.vm.tabs, undisplayedTabs);
      var removeDisplayedTabsByIndex = $scope.vm.displayedTabs;
      var tabReviewMessage = '';
      for (var i = removeDisplayedTabsByIndex.length - 1; i >= 0; i--) {
        undisplayedTabs.splice(removeDisplayedTabsByIndex[i], 1);
      }

      tabReviewMessage = 'Please review The following tabs';
      for (var i = 0, len = undisplayedTabs.length; i < len; i++) {
        var index = _.findIndex($scope.vm.tabs, { title: undisplayedTabs[i]['title'] });
        tabReviewMessage = tabReviewMessage + '<br>' + undisplayedTabs[i]['title'];

        //$scope.vm.tabs[index]['form'] = $scope.vm.formlyFields[index].form;
      }

      if ($scope.vm.form.$valid) {
        if ($scope.vm.displayedTabs.length === $scope.vm.tabs.length) {
          var form = selectedForm;
          console.log('Selected form', form);
          var payLoadData = FormentryService.updateFormPayLoad($scope.vm.model, $scope.vm.formlyFields, $scope.vm.patient, form, params);
          var payLoad = payLoadData.formPayLoad;
          console.log('PayLoad', JSON.stringify(payLoad));
          if (!_.isEmpty(payLoad.obs)) {
            /*
            submit only if we have some obs
            */

            if (payLoad.encounterType !== undefined) {
              isBusy(true);
              $scope.vm.submittingForm = true;
              payLoad.form = form.uuid;
              OpenmrsRestService.getEncounterResService().saveEncounter(JSON.stringify(payLoad),
                function (data) {
                  isBusy(false);
                  $scope.vm.submittingForm = false;
                  if (data) {
                    if ($scope.vm.submitLabel === 'Update') {
                      $scope.vm.savedOrUpdated = true;
                      var cPayload = angular.copy(payLoad);
                      voidObs(cPayload, function (voidFailed) {
                        if (voidFailed) {
                          $scope.vm.errorSubmit = 'An error occured when trying to void obs';
                        }
                      });

                      updateObs(cPayload, function (updateFailed) {
                        if (updateFailed) {
                          $scope.vm.errorSubmit = 'An error occured when trying to update the record';
                        } else {
                          if ($scope.vm.updatedFailed === false && $scope.vm.voidFailed === false) {
                            $scope.vm.success = '| Form Submitted successfully';
                            var dlg = dialogs.notify('Success', $scope.vm.success);
                            if (payLoadData.personAttributes.length > 0) {
                              PersonAttributesRestService.getPersonAttributeFieldValues(payLoadData.personAttributes, $scope.vm.patient);
                            }
                            // console.log('Previous State')
                            // console.log($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid)
                            $location.path($rootScope.previousState + '/' + $rootScope.previousStateParams.uuid);
                          }
                        }
                      });

                    } else {
                      if (payLoadData.personAttributes.length > 0) {
                        PersonAttributesRestService.getPersonAttributeFieldValues(payLoadData.personAttributes, $scope.vm.patient);
                      }

                      $scope.vm.success = '| Form Submitted successfully';
                      var dlg = dialogs.notify('Success', $scope.vm.success);
                      // console.log('Previous State')
                      // console.log($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid)
                      $location.path($rootScope.previousState + '/' + $rootScope.previousStateParams.uuid);
                    }
                  }
                },
                //error callback
                function (error) {
                  // body...
                  isBusy(false);
                  $scope.vm.submittingForm = false;
                  $scope.vm.errorSubmit = 'An Error occured while trying to save the form';
                }
                );
            }
          } else {
            var dlg = dialogs.notify('Info', 'Can\'t submit, no obs entered. ' +
              ' To submit enter some obs');
          }
        } else {
          var dlg = dialogs.notify('Info', tabReviewMessage);
        }
      } else {

        $scope.hasValidationError = true;
        //only activate this for debugging purposes
        if ($scope.vm.form.$error !== undefined) {
          var err = $scope.vm.form.$error;
          console.log('errrr', err);
          if (err.js_expression1) {
            _.each(err.js_expression1[0].$error.js_expression1, function (_errFields) {
              console.log('errr 2', _errFields);
              console.log('errror_fields:', getErrorField(_errFields.$name));
            });
          }
        }
      }

    };

    function activate() {
      $timeout(function () {
        var start = new Date().getTime();
        FormentryService.getFormSchema(selectedForm.name, function (schema) {
          formSchema = schema;
          FormentryService.createForm(formSchema, $scope.vm.model,
            function (formlySchema) {
              $scope.vm.formlyFields = formlySchema;
              if (formlySchema.length > 0) {
                var i = 0;
                angular.forEach(formlySchema, function (tab) {
                  if (i === 0) {
                    $scope.vm.tabs.push(formlySchema[i]);
                  } else {
                    $scope.vm.tabs.push({ form: {}, title: tab.title });
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

              if (params.uuid !== undefined && params.uuid !== '') {
                OpenmrsRestService.getEncounterResService().getEncounterByUuid(params,
                  function (data) {
                    $scope.vm.encData = data;
                    if (data) {
                      $scope.vm.submitLabel = 'Update';
                      var existingPersonAttributes = [];
                      existingPersonAttributes = $scope.vm.patient.getPersonAttributes();
                      if (existingPersonAttributes) {
                        FormentryService.getEncounter($scope.vm.encData, formlySchema, existingPersonAttributes);
                      } else {
                        FormentryService.getEncounter($scope.vm.encData, formlySchema);
                      }
                    }
                  },
                  //error callback
                  function (error) {
                    $scope.vm.errorSubmit = 'An Error occured when trying to get encounter data';
                  }
                  );
              } else {
                //set the current user as the default provider
                setProvider();
              }
            });
        });
      }, 1000);
    }

    function isBusy(val) {
      if (val === true) {
        $loading.start('formEntryLoader');
      } else {
        $loading.finish('formEntryLoader');
      }
    }

    /*
    private methdd to set the current user as the selected provider
    */
    function setProvider() {
      var done = false;
      _.some($scope.vm.tabs, function (page) {
        var model = page.form.model;
        _.some(page.form.fields, function (_section) {
          if (_section.type === 'section') {
            var secKey = _section.key;
            var secData = model[secKey] = {};
            _.some(_section.data.fields, function (_field) {
              if (_field.key === 'encounterProvider') {
                secData['encounterProvider'] = OpenmrsRestService.getUserService().user.personUuId();
                done = true;
                return true;
              }
            });
          }

          if (done) {
            return true;
          }
        });

        if (done) {
          return true;
        }
      });
    }

    /*
      private methdd to void obs
    */
    function voidObs(_payLoad, callback) {
      var obsToVoid = _.where(_payLoad.obs, { voided: true });
      //console.log('Obs to Void: ', obsToVoid);
      if (obsToVoid !== undefined) {
        _.each(obsToVoid, function (obs) {
          OpenmrsRestService.getObsResService().voidObs(obs, function (data) {
            if (data) {
              console.log('Voided Obs uuid: ', obs.uuid);
            }
          },
            //error callback
            function (error) {
              $scope.vm.errorSubmit = 'An error occured when trying to void obs';
              $scope.vm.voidFailed = true;
              callback($scope.vm.voidFailed);
            });
        });

        callback($scope.vm.voidFailed);
      } else {
        callback($scope.vm.voidFailed);
      }
    }

    /*
      private methdd to update individual obs
    */
    function updateObs(_payLoad, callback) {
      var obsToUpdate = _.filter(_payLoad.obs, function (obs) {
        // console.log(obs);
        if (obs.uuid !== undefined && obs.voided === undefined) {
          return obs;
        }
      });
      //console.log('Obs to Void: ', obsToVoid);
      if (obsToUpdate !== undefined) {
        _.each(obsToUpdate, function (obs) {
          OpenmrsRestService.getObsResService().saveUpdateObs(obs, function (data) {
            if (data) {
              console.log('Updated Obs uuid: ', data);
            }
          },
            //error callback
            function (error) {
              $scope.vm.updatedFailed = true;
              $scope.vm.errorSubmit = 'An error occured when trying to update the record';
              callback($scope.vm.updatedFailed);
            });
        });

        callback($scope.vm.updatedFailed);
      } else {
        callback($scope.vm.updatedFailed);
      }
    }

    /*
    private methdd to get the error field
    */
    function getErrorField(_fieldKey) {

      //  console.log('++++fieldKey', _fieldKey);

      var errorField;
      var fieldKey;
      if (_.contains(_fieldKey, 'ui-select-extended')) {
        errorField = _fieldKey.split('ui-select-extended_')[1];
        fieldKey = errorField.split('_')[0];
      } else {
        if (_fieldKey.startsWith('obs')) {
          errorField = _fieldKey.split('obs')[1];
          fieldKey = 'obs' + errorField.split('_')[0] + '_' + errorField.split('_')[1];
        }
      }

      var field = FormentryService.getFieldByIdKey(fieldKey, $scope.vm.tabs);
      // console.log('error Field ', field);
      return field;
    }

  }
})();
