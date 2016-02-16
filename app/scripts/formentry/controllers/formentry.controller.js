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
        '$rootScope', '$stateParams', '$state', '$scope',
        'OpenmrsRestService', '$timeout', 'FormsMetaData'
        , '$loading', '$anchorScroll', 'UserDefaultPropertiesService'
        , 'FormentryUtilService', 'configService', 'SearchDataService',
        '$log', 'FormEntry', 'PersonAttributesRestService',
        'CurrentLoadedFormService'
    ];

    function FormentryCtrl($translate, dialogs, $location,
        $rootScope, $stateParams, $state, $scope,
        OpenmrsRestService, $timeout, FormsMetaData,
        $loading, $anchorScroll, UserDefaultPropertiesService, FormentryUtilService,
        configService, SearchDataService,
        $log, FormEntry, PersonAttributesRestService, CurrentLoadedFormService) {
        var vm = $scope;
        
        //Patient variables
        vm.patient = $rootScope.broadcastPatient;
        
        //Form variables
        vm.model = {};
        vm.questionMap = {};
        vm.encounterType = '';
        var formModes = {
            newForm: {
                submitLabel: 'Save'
            },
            existingForm: {
                submitLabel: 'Update'
            }
        };
        vm.currentMode = formModes.newForm;
        vm.tabs = [];
        vm.lastFormlyFormSchema = [];//usually is an array of tabs

        var selectedFormMetadata;
        var selectedFormSchema;
        var selectedFormUuid = $stateParams.formuuid;
        var lastPayload;
        var lastPersonAttributePayload;
        
        //Loaded encounter/visit variables
        vm.encounter = $rootScope.activeEncounter;
        var selectedEncounterUuid = $stateParams.encuuid;
        var currentVisitUuid = $stateParams.visitUuid;
        var selectedEncounterData;
        var selectedPersonAttributes;
        
        //Navigation parameters
        vm.hasClickedSubmit = false;
        vm.submitLabel = 'Save';
        vm.submit = submit;
        vm.isBusy = false;
        vm.hasFailedNewingRequest = false;
        vm.hasFailedVoidingRequest = false;
        vm.hasFailedUpdatingingRequest = false;
        vm.hasFailedPersonAttributeRequest = false;
        vm.errorMessage = '';
        vm.validationErrorMessage = 'The form has some validation errors. See the error list above.';
        vm.fourStageSubmitProcess = {
            submittingNewObs: false,
            submittingUpdatedObs: false,
            submittingVoidedObs: false,
            submittingPersonAttributes: false
        };
        vm.formSubmitSuccessMessage = '';

        vm.isCurrentTabLast = isCurrentTabLast;
        vm.isCurrentTabFirst = isCurrentTabFirst;
        vm.currentTabIndex = 0;
        vm.displayedTabsIndices = [];
        vm.onTabSelected = onTabSelected;
        vm.loadNextTab = loadNextTab;
        vm.loadPreviousTab = loadPreviousTab;
        vm.scrollToTop = scrollToTop;
        
        //navigation confirmation
        var userConfirmedChange = false;
        //var usedStateChange = false;
        var changesSaved = false;
        vm.$on('$stateChangeStart', onStateChangeStart);
        vm.cancel = cancel;
        
        //error
        vm.anyFieldsInError = anyFieldsInError;
        vm.isFormInvalid = isFormInvalid;
        
        //Patient Summary
        vm.showHivHistoricalSummary = false;
        vm.$on('viewHivHistoricalSummary', viewHivHistoricalSummary);

        activate();

        function activate() {
            $log.log('Initializing form entry controller..');
            subsribeToRootScopeMessages();
            
            //determine form to load
            determineFormToLoad();
            isSpinnerBusy(true);
            loadPreFormInitializationData(
                function () {
                    loadFormSchemaForSelectedForm(true);
                }, function () {
                    loadFormSchemaForSelectedForm(true);
                });

        }
        
        //Region: Navigation functions
        function isSpinnerBusy(val) {
            if (val === true) {
                $loading.start('formEntryLoader');
                vm.isBusy = true;
            } else {
                $loading.finish('formEntryLoader');
                vm.isBusy = false;
            }
        }


        function isCurrentTabLast() {
            return vm.currentTabIndex === vm.tabs.length - 1;
        }

        function isCurrentTabFirst() {
            return vm.currentTabIndex === 0;
        }


        function initializeDisplayedTabs() {
            vm.tabs = [];
            vm.currentTabIndex = 0;
            angular.forEach(vm.lastFormlyFormSchema, function (formlyTab) {
                vm.tabs.push({
                    form: {},
                    title: formlyTab.title
                });
            });
            loadCurrentTab();
        }

        function onTabSelected($index) {
            vm.currentTabIndex = $index;
            if (vm.displayedTabsIndices.indexOf($index) === -1) {
                vm.displayedTabsIndices.push($index);
            }

            if (vm.tabs[$index]['form'] !== vm.lastFormlyFormSchema[$index].form) {
                isSpinnerBusy(true);
                $timeout(function () {
                    vm.tabs[$index]['form'] = vm.lastFormlyFormSchema[$index].form;
                    isSpinnerBusy(false);
                }, 200, false);
                return;
            }

        }

        function loadNextTab() {
            if (!isCurrentTabLast()) {
                vm.currentTabIndex++;
                loadCurrentTab();
            }
        }

        function loadPreviousTab() {
            if (!isCurrentTabFirst()) {
                vm.currentTabIndex--;
                loadCurrentTab();
            }
        }

        function loadCurrentTab() {
            vm.tabs[vm.currentTabIndex].active = true;

            if (vm.tabs[vm.currentTabIndex]['form'] !== vm.lastFormlyFormSchema[vm.currentTabIndex].form) {
                isSpinnerBusy(true);
                $timeout(function () {
                    vm.tabs[vm.currentTabIndex]['form'] = vm.lastFormlyFormSchema[vm.currentTabIndex].form;
                    /*move to the top of the selected page*/
                    $location.hash('top');
                    $anchorScroll();
                    isSpinnerBusy(false);
                }, 200, false);
                return;
            }

        }

        function loadAllTabs() {
            var i = 0;
            angular.forEach(vm.lastFormlyFormSchema, function (formlyTab) {
                if (vm.displayedTabsIndices.indexOf(i) === -1) {
                    vm.displayedTabsIndices.push(i);
                    vm.tabs[i]['form'] = vm.lastFormlyFormSchema[i].form;
                }

                i++;
            });
        }

        function areAllTabsLoaded() {
            return vm.displayedTabsIndices.length === vm.tabs.length;
        }

        function anyFieldsInError(fields) {
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
        }

        function scrollToTop() {
            $location.hash('top');
            $anchorScroll();
        }
        function scrollToAnchorByKey(key) {
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
        }

        function selectTabByTitle(title) {
            _.each(vm.tabs, function (tab) {
                if (tab.title === title) {
                    tab.active = true;
                }
            });
        }

        function onNavigateToQuestionRequest(args, param) {
            selectTabByTitle(param.tabTitle);
            scrollToAnchorByKey(param.questionKey);
        }

        function subsribeToRootScopeMessages() {
            //navigate to question request from form entry module
            $rootScope.$on("navigateToQuestion", onNavigateToQuestionRequest);
        }


        function cancel() {
            vm.changesSaved = true;
            var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
            dlg.result.then(function (btn) {
                $location.path($rootScope.previousState + '/' + $rootScope.previousStateParams.uuid);
            },

                function (btn) {
                    //$scope.vm.confirmed = 'You confirmed "No."';
                });
        }

        function onStateChangeStart(event, toState, toParams) {
            // usedStateChange = true;
            if (vm.form.$dirty && changesSaved === false) {
                if (userConfirmedChange === false) {
                    //prevent transition to new url before saving data
                    event.preventDefault();
                    var dialogPromise = dialogs.confirm('Changes Not Saved',
                        'Do you want to close this form?');
                    dialogPromise.result.then(function (btn) {
                        userConfirmedChange = true;
                        $state.go(toState.name, {
                            onSuccessRout: toState,
                            onSuccessParams: toParams
                        });
                    }, function (btn) {
                        //Prevent any transition to new url
                        event.preventDefault();
                        userConfirmedChange = false;
                    });
                }
            }
        }

        function registerConfirmationExit() {
            // if (usedStateChange === false) {
                UtilService.confirmBrowserExit(function (data) {
                    if (data) {
                        var dlg = dialogs.confirm('Close Form',
                            'Do you want to close this form?');
                    }
                });
            // }
        }
        //EndRegion: Navigation functions
        
        //Region: Form loading functions
        function loadFormSchemaForSelectedForm(createFormAfterLoading) {
            isSpinnerBusy(true);
            $log.log('Loading form schema for ' + selectedFormMetadata.name);
            FormsMetaData.getFormSchema(selectedFormMetadata.name,
                function (schema) {
                    isSpinnerBusy(false);
                    selectedFormSchema = schema;
                    $log.info('Form schema loadded..', selectedFormSchema);
                    if (createFormAfterLoading) {
                        createFormFromSchema();
                    }
                });
        }

        function determineFormToLoad() {
            if (selectedEncounterUuid !== undefined) {
                var encFormUuid = vm.encounter.formUuid();
                selectedFormMetadata = FormsMetaData.getForm(encFormUuid);
                vm.encounterType = vm.encounter.encounterTypeName();
                vm.currentMode = formModes.existingForm;
            } else {
                selectedFormMetadata = FormsMetaData.getForm($stateParams.formuuid);
                vm.encounterType = selectedFormMetadata.encounterTypeName;
                vm.currentMode = formModes.newForm;
            }
            $log.info('Form to load determined', selectedFormMetadata);
        }

        function createFormFromSchema() {
            $log.log('Creating form for loaded form schema');
            var formObject = FormEntry.createForm(selectedFormSchema, vm.model);
            vm.lastFormlyFormSchema = formObject.formlyForm;
            $log.debug('Created formly form...', vm.lastFormlyFormSchema);
            //vm.tabs = newForm;
            initializeDisplayedTabs();
            vm.questionMap = formObject.questionMap;
            $log.debug('Created question map', vm.questionMap);

            if (vm.currentMode === formModes.existingForm) {
                populateModelWithData();
            }
            loadPatientRequiredValuesToModelAndQuestionMap();
            if (vm.currentMode === formModes.newForm) {
                loadDefaultValues();
            }
            
        }
        
        function loadPatientRequiredValuesToModelAndQuestionMap() {
            //load gender to model
            vm.model.sex = vm.patient.gender();
            
            //load ender to QuestionMap
            vm.questionMap['sex'] = {
                key: 'sex'
            };
        }
        
        function loadDefaultValues() {
            setCurrentProvider();
            setCurrentDate();
            setCurrentLocation();
        }

        function setCurrentProvider() {
            var currentUserUuid = OpenmrsRestService.getUserService().user.personUuId();
            if (currentUserUuid) {
                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(vm.model, 'encounterProvider');
                sectionModel['encounterProvider'].value = currentUserUuid;
            }
        }

        function setCurrentDate() {
            var currentDate = new Date();
            if (currentDate) {
                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(vm.model, 'encounterDatetime');
                sectionModel['encounterDatetime'].value = currentDate;
            }
        }

        function setCurrentLocation() {
            var definedDefaultUserLocation =
                UserDefaultPropertiesService.getCurrentUserDefaultLocation();
            if (angular.isDefined(definedDefaultUserLocation)) {
                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(vm.model, 'encounterLocation');

                sectionModel['encounterLocation'].value = definedDefaultUserLocation.uuid;
            }
        }
        //EndRegion: Form loading and creation functions
        
        //Region: Load existing form
        function loadEncounterData(encounterUuid, callback) {
            OpenmrsRestService.getEncounterResService().getEncounterByUuid(encounterUuid,
                function (data) {
                    selectedEncounterData = data;
                    callback(true);
                },
                //error callback
                function (error) {
                    vm.errorMessage =
                    'An Error occured when trying to get encounter data';
                    callback(false);
                }
                );
        }

        function loadPersonAttribute(patient) {
            selectedPersonAttributes = patient.getPersonAttributes();
        }

        function loadPreFormInitializationData(successCallback, errorCallback) {
            var numberOfRequests = 0;
            var hasLoadingError = false;
            if (vm.currentMode === formModes.existingForm) {
                numberOfRequests++;
                loadEncounterData(selectedEncounterUuid, function (isSuccessful) {
                    if (!isSuccessful) {
                        hasLoadingError = true;
                    }
                    numberOfRequests--;
                    if (numberOfRequests === 0) {
                        if (hasLoadingError) {
                            errorCallback();
                        } else {
                            successCallback();
                        }
                    }
                });
            }
            loadPersonAttribute(vm.patient);
            if (numberOfRequests === 0) {
                successCallback();
            }
        }

        function populateModelWithData() {
            FormEntry.updateFormWithExistingObs(vm.model, selectedEncounterData);
            FormEntry.updateFormWithExistingPersonAttributes(vm.model,
                selectedPersonAttributes);
        }
        
        //Endregion: Load existing form
        
        //Region: Payload generation
        
        function isFormInvalid() {
            return vm.form.$valid === false;
        }

        function experiencedSubmitError() {
            return vm.hasFailedNewingRequest || vm.hasFailedVoidingRequest || vm.hasFailedUpdatingingRequest || vm.hasFailedPersonAttributeRequest;
        }

        function resetErrorFlags() {
            vm.hasFailedNewingRequest = false;
            vm.hasFailedVoidingRequest = false;
            vm.hasFailedUpdatingingRequest = false;
            vm.hasFailedPersonAttributeRequest = false;
        }

        function getVoidedObsFromPayload(payload) {
            return _.where(payload.obs, {
                voided: true
            });
        }

        function getUpdatedObsFromPayload(payload) {
            return _.filter(payload.obs, function (obs) {
                if (obs.uuid !== undefined && obs.voided === undefined) {
                    return obs;
                }
            });
        }

        function generatePayload() {
            $log.log('Generating payload for form..');
            lastPayload = FormEntry.getFormPayload(vm.model);
            if (currentVisitUuid !== undefined) {
                updatePayloadVisitUuid(lastPayload, currentVisitUuid);
            }

            if (vm.patient !== undefined) {
                updatePayloadPatientUuid(lastPayload, vm.patient.uuid());
            } else {
                throw new Error('No patient', 'A form requires a patient');
            }

            if (selectedFormMetadata.encounterTypeUuid !== undefined) {
                updatePayloadEncounterTypeUuid(lastPayload, selectedFormMetadata.encounterTypeUuid);
            } else {
                throw new Error('No encounter type', 'Form does not have associated encountertype');
            }

            if (vm.currentMode === formModes.existingForm) {
                updatePayloadEncounterUuid(lastPayload, selectedEncounterUuid);
            }
            $log.info('PayLoad', JSON.stringify(lastPayload));

            $log.log('Generating payload for person attributes..');
            var payload = FormEntry.getPersonAttributesPayload(vm.model);
            lastPersonAttributePayload =
            getFinalPersonattributePayload(payload, vm.patient);
            $log.info('Person PayLoad', JSON.stringify(lastPersonAttributePayload));
        }

        function hasObsPayload(payload) {
            return !_.isEmpty(payload.obs);
        }

        function updatePayloadFormUuid(payload, formUuid) {
            payload.form = formUuid;
        }

        function updatePayloadPatientUuid(payload, patientUuid) {
            payload.patient = patientUuid;
        }

        function updatePayloadEncounterTypeUuid(payload, encounterTypeUuid) {
            payload.encounterType = encounterTypeUuid;
        }

        function updatePayloadEncounterUuid(payload, encounterUuid) {
            payload.uuid = encounterUuid;
        }

        function updatePayloadVisitUuid(payload, visitUuid) {
            payload.visit = visitUuid;
        }

        function getFinalPersonattributePayload(payload, patient) {
            var updatedPayload = [];
            _.each(payload, function (attribute) {
                var personAttribute = { attribute: attribute, person: patient };
                updatedPayload.push(personAttribute);
            });
            return updatedPayload;
        }
        
        //debugging helpers
        function logFieldsInError() {
            if (vm.form.$error !== undefined) {
                var err = vm.form.$error;
                $log.log('form error', err);
                if (err.js_expression1) {
                    _.each(err.js_expression1[0].$error.js_expression1, function (_errFields) {
                        $log.debug('js_expression validation error', _errFields);
                        $log.debug('fields in error:', getFieldInError(_errFields.$name));
                    });
                }
            }
        }
        
        //private methdd to get the field in error
        function getFieldInError(_fieldKey) {
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

            var field;
            _.each(vm.questionMap, function (question) {
                if (question.key === fieldKey) {
                    field = question.field;
                }
            });

            return field;
        }
        
        //EndRegion: Payload generation
        
        //Region: Payload submission
        function initializeSubmitStagingObject(obj, value) {
            obj.submittingNewObs = value;
            obj.submittingUpdatedObs = value;
            obj.submittingVoidedObs = value;
            obj.submittingPersonAttributes = value;
        }

        function isFourStageSubmitProcessComplete(obj) {
            return obj.submittingNewObs === false
                && obj.submittingUpdatedObs === false
                && obj.submittingVoidedObs === false
                && obj.submittingPersonAttributes === false;

        }

        function submit() {
            if (!areAllTabsLoaded()) {
                isSpinnerBusy(true);
                $timeout(function () {
                    loadAllTabs();
                    submit();
                }, 200, false);
                return;
            }
            isSpinnerBusy(false);
            vm.hasClickedSubmit = true;
            if (isFormInvalid()) {
                scrollToTop();
                return;
            }
            
            //check if there are unvisited tabs
            
            generatePayload();
            if (hasObsPayload(lastPayload)) {
                updatePayloadFormUuid(lastPayload, selectedFormUuid);
                submitFormPayload();
            } else {
                dialogs.notify('Info', 'Can\'t submit, no obs entered. ' +
                    ' To submit enter some obs');
            }

        }

        function onSubmitStageUpdated() {
            if (isFourStageSubmitProcessComplete(vm.fourStageSubmitProcess)) {
                onSubmitProcessCompleted();
            }
        }

        function onSubmitProcessCompleted() {
            isSpinnerBusy(false);
            vm.changesSaved = true;
            if (!experiencedSubmitError()) {
                vm.formSubmitSuccessMessage = '| Form Submitted successfully';
                dialogs.notify('Success', vm.formSubmitSuccessMessage);
                $location.path($rootScope.previousState + '/' + $rootScope.previousStateParams.uuid);
            }
        }

        function submitFormPayload() {
            initializeSubmitStagingObject(vm.fourStageSubmitProcess, true);
            resetErrorFlags();
            isSpinnerBusy(true);
            
            //first stage of submitting is to save new obs
            
            $log.log('Submitting new obs...');
            OpenmrsRestService.getEncounterResService()
                .saveEncounter(JSON.stringify(lastPayload),
                    submitNewObsPayloadSuccessful, submitNewObsPayloadFailed);

        }

        function submitNewObsPayloadSuccessful(data) {
            $log.log('Submitting new obs successful');
            vm.fourStageSubmitProcess.submittingNewObs = false;
            onSubmitStageUpdated();

            if (data) {
                if (vm.currentMode === formModes.existingForm) {
                    var payloadCopy = angular.copy(lastPayload);
                    
                    //second stage of submitting is to delete voided obs
                    var voidedObs = getVoidedObsFromPayload(payloadCopy);
                    if (voidedObs !== undefined) {
                        $log.log('Submitting deleted obs...');
                        submitVoidedObs(voidedObs, function (voidFailed) {
                            $log.log('Submitting deleted obs complete');
                            if (voidFailed) {
                                $log.error('Submitting deleted obs failed');
                                vm.errorMessage =
                                'An error occured when trying to void obs';
                            }
                            vm.fourStageSubmitProcess.submittingVoidedObs = false;
                            onSubmitStageUpdated();
                        });
                    }
                    else {
                        vm.fourStageSubmitProcess.submittingVoidedObs = false;
                        onSubmitStageUpdated();
                    }
                    
                    //third stage of submitting is to update voided obs
                    var updatedObs = getUpdatedObsFromPayload(payloadCopy);
                    if (updatedObs !== undefined) {
                        $log.log('Submitting updated obs...');
                        submitUpdatedObs(updatedObs, function (updateFailed) {
                            $log.log('Submitting updated obs complete');
                            if (updateFailed) {
                                $log.error('Submitting deleted obs failed');
                                vm.errorMessage =
                                'An error occured when trying to update the record';
                            }
                            vm.fourStageSubmitProcess.submittingUpdatedObs = false;
                            onSubmitStageUpdated();
                        });
                    } else {
                        vm.fourStageSubmitProcess.submittingUpdatedObs = false;
                        onSubmitStageUpdated();
                    }


                } else {
                    vm.fourStageSubmitProcess.submittingUpdatedObs = false;
                    vm.fourStageSubmitProcess.submittingVoidedObs = false;
                    onSubmitStageUpdated();
                }
                //forth stage of submitting is to submit person attributes
                if (lastPersonAttributePayload !== undefined &&
                    lastPersonAttributePayload.length > 0) {
                    $log.log('Submitting person attributes..');
                    submitPersonAttributes(lastPersonAttributePayload,
                        function (submitFailed) {
                            $log.log('Submitting person attributes completed');
                            if (submitFailed) {
                                $log.error('Submitting person attributes failed');
                                vm.errorMessage =
                                'An error occured when trying to save person attribute';
                            }
                            vm.fourStageSubmitProcess.submittingPersonAttributes = false;
                            onSubmitStageUpdated();
                        });
                } else {
                    vm.fourStageSubmitProcess.submittingPersonAttributes = false;
                    onSubmitStageUpdated();
                }
            } else {
                submitNewObsPayloadFailed('an unknown erro occured while submitting obs');
            }
        }

        function submitNewObsPayloadFailed(error) {
            $log.error('Submitting new obs failed', error);
            initializeSubmitStagingObject(vm.fourStageSubmitProcess, false);
            vm.hasFailedNewingRequest = true;
            vm.errorMessage =
            'An error occured when trying to save the obs';
            onSubmitStageUpdated();
        }

        function submitVoidedObs(voidedObsPayload, finalCallback) {
            var numberOfVoidRequests = 0;
            vm.hasFailedVoidingRequest = false;

            _.each(voidedObsPayload, function (obs) {
                numberOfVoidRequests++;
                $log.log('sending void request for obs', obs);
                OpenmrsRestService.getObsResService().voidObs(obs, function (data) {
                    if (data) {
                        $log.log('Voided Obs uuid: ', obs.uuid);
                    }
                    numberOfVoidRequests--;
                    //call final callback by voting
                    if (numberOfVoidRequests === 0) {
                        finalCallback(vm.hasFailedVoidingRequest);
                    }
                },
                    //error callback
                    function (error) {
                        $log.log('Error voiding obs: ', obs.uuid);
                        vm.hasFailedVoidingRequest = true;
                        numberOfVoidRequests--;
                        //call final callback by voting
                        if (numberOfVoidRequests === 0) {
                            finalCallback(vm.hasFailedVoidingRequest);
                        }
                    });
            });
        }

        function submitUpdatedObs(updatedObsPayload, finalCallback) {
            var numberOfUpdatingRequests = 0;
            vm.hasFailedUpdatingingRequest = false;

            _.each(updatedObsPayload, function (obs) {
                numberOfUpdatingRequests++;
                $log.log('Sending update request for obs', obs);
                OpenmrsRestService.getObsResService().saveUpdateObs(obs, function (data) {
                    if (data) {
                        $log.log('Updated Obs uuid: ', data);
                    }
                    numberOfUpdatingRequests--;
                    //call final callback by voting
                    if (numberOfUpdatingRequests === 0) {
                        finalCallback(vm.hasFailedUpdatingingRequest);
                    }
                },
                    //error callback
                    function (error) {
                        $log.log('Error voiding obs: ', obs.uuid);
                        vm.hasFailedUpdatingingRequest = true;

                        numberOfUpdatingRequests--;
                        //call final callback by voting
                        if (numberOfUpdatingRequests === 0) {
                            finalCallback(vm.hasFailedVoidingRequest);
                        }
                    });
            });
        }

        function submitPersonAttributes(payload, finalCallback) {
            var numberOfRequests = 0;
            vm.hasFailedPersonAttributeRequest = false;

            _.each(payload, function (attribute) {
                numberOfRequests++;
                $log.log('Sending request for person attribute', attribute);
                PersonAttributesRestService
                    .saveUpdatePersonAttribute(attribute, function (data) {
                        if (data) {
                            $log.log('Updated attribute: ', data);
                        }
                        numberOfRequests--;
                        //call final callback by voting
                        if (numberOfRequests === 0) {
                            finalCallback(vm.hasFailedPersonAttributeRequest);
                        }
                    },
                        //error callback
                        function (error) {
                            $log.log('Error saving attribute: ', attribute);
                            vm.hasFailedPersonAttributeRequest = true;

                            numberOfRequests--;
                            //call final callback by voting
                            if (numberOfRequests === 0) {
                                finalCallback(vm.hasFailedPersonAttributeRequest);
                            }
                        });
            });
        }
        
        //Endregion: Payload submission
        
        //Beginregion: PatientSummary
        function viewHivHistoricalSummary() {
            vm.showHivHistoricalSummary = true;
        }

        //Endregion: PatientSummary
    }
})();
