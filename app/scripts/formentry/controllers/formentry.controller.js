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
        '$log', 'FormEntry', 'PersonAttributesRestService'
    ];

    function FormentryCtrl($translate, dialogs, $location,
        $rootScope, $stateParams, $state, $scope,
        OpenmrsRestService, $timeout, FormsMetaData,
        $loading, $anchorScroll, UserDefaultPropertiesService, FormentryUtilService,
        configService, SearchDataService,
        $log, FormEntry, PersonAttributesRestService) {
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
        vm.submitErrorMessage = '';
        vm.fourStageSubmitProcess = {
            submittingNewObs: false,
            submittingUpdatedObs: false,
            submittingVoidedObs: false,
            submittingPersonAttributes: false
        };
        vm.formSubmitSuccessMessage = '';

        activate();

        function activate() {
            $log.log('Initializing form entry controller..');
            
            //determine form to load
            determineFormToLoad();

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
            } else {
                $loading.finish('formEntryLoader');
            }
        }
        
        
        //EndRegion: Navigation functions
        
        //Region: Form loading functions
        function loadFormSchemaForSelectedForm(createFormAfterLoading) {
            $log.log('Loading form schema for ' + selectedFormMetadata.name);
            FormsMetaData.getFormSchema(selectedFormMetadata.name,
                function (schema) {
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
            var newForm = formObject.formlyForm;
            $log.debug('Created formly form...', newForm);
            vm.tabs = newForm;
            vm.questionMap = formObject.questionMap;
            $log.debug('Created question map', vm.questionMap);

            if (vm.currentMode === formModes.existingForm) {
                populateModelWithData();
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
                    vm.submitErrorMessage =
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
            if (isFormInvalid()) {
                // $location.hash('top');
                // $anchorScroll();
                return;
            }
            
            //check if there are unvisited tabs
            
            generatePayload();
            if (hasObsPayload(lastPayload)) {
                updatePayloadFormUuid(lastPayload, selectedFormUuid);
                submitFormPayload();
            }

        }

        function onSubmitStageUpdated() {
            if (isFourStageSubmitProcessComplete(vm.fourStageSubmitProcess)) {
                onSubmitProcessCompleted();
            }
        }

        function onSubmitProcessCompleted() {
            isSpinnerBusy(false);
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
            OpenmrsRestService.getEncounterResService()
                .saveEncounter(JSON.stringify(lastPayload),
                    submitNewObsPayloadSuccessful, submitNewObsPayloadFailed);

        }

        function submitNewObsPayloadSuccessful(data) {
            vm.fourStageSubmitProcess.submittingNewObs = false;
            onSubmitStageUpdated();

            if (data) {
                if (vm.currentMode === formModes.existingForm) {
                    var payloadCopy = angular.copy(lastPayload);
                    
                    //second stage of submitting is to delete voided obs
                    var voidedObs = getVoidedObsFromPayload(payloadCopy);
                    if (voidedObs !== undefined) {
                        submitVoidedObs(voidedObs, function (voidFailed) {
                            if (voidFailed) {
                                vm.submitErrorMessage =
                                'An error occured when trying to void obs';
                            }
                            vm.fourStageSubmitProcess.submittingVoidedObs = false;
                            onSubmitStageUpdated();
                        });
                    }
                    
                    //third stage of submitting is to update voided obs
                    var updatedObs = getUpdatedObsFromPayload(payloadCopy);
                    if (updatedObs !== undefined) {
                        submitUpdatedObs(updatedObs, function (updateFailed) {
                            if (updateFailed) {
                                vm.submitErrorMessage =
                                'An error occured when trying to update the record';
                            }
                            vm.fourStageSubmitProcess.submittingUpdatedObs = false;
                            onSubmitStageUpdated();
                        });
                    }


                } else {
                    vm.fourStageSubmitProcess.submittingUpdatedObs = false;
                    vm.fourStageSubmitProcess.submittingVoidedObs = false;
                    onSubmitStageUpdated();
                }
                //forth stage of submitting is to submit person attributes
                if (lastPersonAttributePayload !== undefined &&
                    lastPersonAttributePayload.length > 0) {
                    submitPersonAttributes(lastPersonAttributePayload,
                        function (submitFailed) {
                            if (submitFailed) {
                                vm.submitErrorMessage =
                                'An error occured when trying to save person attribute';
                            }
                            vm.fourStageSubmitProcess.submittingPersonAttributes = false;
                            onSubmitStageUpdated();
                        });
                }
            }
        }

        function submitNewObsPayloadFailed(error) {
            initializeSubmitStagingObject(vm.fourStageSubmitProcess, false);
            vm.hasFailedNewingRequest = true;
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
    }
})();
