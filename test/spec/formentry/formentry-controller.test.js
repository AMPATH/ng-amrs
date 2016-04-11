/* global sinon */
/* global expect */
/* global it */
/* global beforeEach */
/* global describe */
/*
jshint -W098, -W117, -W030
*/
(function () {
    'use strict';
    describe('Controller: FormEntry Controller Unit Tests, New Encounter Mode', function () {

        var controller;
        var controllerScope;
        var rootScope;
        var selectedPatient;
        var patientModelFactory;
        var mockData;
        var mockFormSchema;
        var $stateParams, $state;
        var OpenmrsRestService, userResService, unilServiceRegistrationStub;
        var selectedPatientGetPersonAttributesStub;
        var UtilService, FormEntry, createFormSpy, CurrentLoadedFormService;
        var dialogService, $timeout, PersonAttributesRestService;
        var httpBackend;
        var mockFormMetadata = {
            encounterTypeName: 'adultEncounter',
            name: 'test-form',
            encounterTypeUuid: 'encounterTypeUuid'
        };



        var FormsMetadataMock = {
            getFormSchema: function(schemaName, callback) {
                console.log('schemaName', schemaName);
                callback(mockFormSchema);
            },
            getForm: function(uuid) {
                return mockFormMetadata;
            }
        };

        var formsMetaDataGetFormSchemaStub;
        formsMetaDataGetFormSchemaStub = sinon.spy(FormsMetadataMock, 'getFormSchema');

        beforeEach(function(){
           module('ngAmrsApp');
           module('app.formentry');
           module('mock.data');
           module('ngMock');

        });
        beforeEach(function(){
            /*
            Apperently underscore.string is not loading in thr headless browser during the tests
            this library has specific classes for handling string comparison.
            To solve this problem am adding simple hack to able to load following two functions
            when running the tests.
            NB: as pointed out in the comments ECMAScript 2015 (ES6) introduces startsWith,
            however, at the time of writing this update (2015) browser-support is
            far from complete.
            */
            if (typeof String.prototype.startsWith !== 'function') {
                String.prototype.startsWith = function (str) {
                    return this.slice(0, str.length) === str;
                };

                if (typeof String.prototype.endsWith !== 'function') {
                    String.prototype.endsWith = function (str) {
                        return this.slice(-str.length) === str;
                    };
                }
            }
        });

        beforeEach(inject(function ($controller, $injector, $rootScope) {

            httpBackend = $injector.get('$httpBackend');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            $stateParams.visitUuid = 'test-visit-uuid';
            $stateParams.formuuid = 'formuuid';

            mockData = $injector.get('mockData');
            FormEntry = $injector.get('FormEntry');
            CurrentLoadedFormService = $injector.get('CurrentLoadedFormService');

            createFormSpy = sinon.spy(FormEntry, 'createForm');

            OpenmrsRestService = $injector.get('OpenmrsRestService');
            userResService = OpenmrsRestService.getUserService();

            userResService.user = {
                personUuId: function() {
                    return 'user uuid';
                }
            };

            patientModelFactory = $injector.get('PatientModel');
            UtilService = $injector.get('UtilService');
            unilServiceRegistrationStub =  sinon.spy(UtilService, 'confirmBrowserExit');

            selectedPatient =
            new patientModelFactory.patient(mockData.getMockPatient());
            selectedPatientGetPersonAttributesStub = sinon.spy(selectedPatient, 'getPersonAttributes');

            mockFormSchema = mockData.getMockSchema();
            console.log('mock schema', mockFormSchema);
            rootScope =  $rootScope;
            rootScope.broadcastPatient = selectedPatient;
            rootScope.latestEncounterPerType = {};
			controllerScope = $rootScope.$new();
            console.log('patient', controllerScope.patient);
            dialogService = $injector.get('dialogs');
            $timeout = $injector.get('$timeout');
            PersonAttributesRestService = $injector.get('PersonAttributesRestService');

			controller = $controller('FormentryCtrl',
            { $rootScope: $rootScope,
            $scope: controllerScope,
            $state: $state,
            $stateParams: $stateParams,
            FormsMetaData: FormsMetadataMock,
            OpenmrsRestService: OpenmrsRestService,
            UtilService: UtilService,
            FormEntry: FormEntry
            });

		}));


        var setUpObsUserInputToForm = function() {
                //simulate valid form state after user has input some valid obs
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.form.$valid = true;
                controllerScope.changesSaved = false;

                //fill one obs to enable submit process to continue
                var q1Key =  CurrentLoadedFormService.
                        getFieldKeyFromGlobalById('q1');

                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, q1Key);

                sectionModel[q1Key].value = 'question one';
        };

        var setUpPersonAttributeUserInputToForm = function() {
                //fill one obs to enable submit process to continue
                var personAttributeKey =  CurrentLoadedFormService.
                        getFieldKeyFromGlobalById('first_person_attribute');

                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, personAttributeKey);

                sectionModel[personAttributeKey].value = 'question one';
        };

        var getEncounterServiceSaveEncounterStub = function(returnFailureOnNextCall) {
            var encounterService = OpenmrsRestService.getEncounterResService();
               return sinon.stub(encounterService, 'saveEncounter',
                function(payload, onSucesss, onFailure){
                    if(!returnFailureOnNextCall)
                        onSucesss({});
                    else
                        onFailure('Error');
                });
        };

        it('FormEntry controller should be defined and have all required services injected',
        function () {
			expect(controller).to.exist;
			expect(controllerScope).to.exist;
			expect(rootScope).to.exist;
		});

        describe('Controller: FormEntry Controller Loading and activation Unit Tests', function () {

            it('should subscribe to rootscope messages upon loading',
            function () {
                //test subscription to navigateToQuestion message
                //this message changes the current page to param.tabTitle
                var param = {
                    tabTitle: controllerScope.tabs[1].title //mockschema contains 2pages
                };
                console.log('controllerScope', controllerScope.tabs);
                rootScope.$broadcast('navigateToQuestion',param);

                expect(controllerScope.tabs[1].active).to.equal(true);

            });

            it('should register with utilservice to triger confirmation before' +
            ' browser exit when loading controller',
            function () {
                 expect(unilServiceRegistrationStub).to.have.been.calledOnce;
            });

            it('should determine the correct form to load correctly' +
            ' when loading controller',
            function () {
                 expect(controllerScope.encounterType).to.equal(mockFormMetadata.encounterTypeName);
            });

             it('should determine the correct form mode' +
            ' when loading controller',
            function () {
                 expect(controllerScope.currentMode.submitLabel).to.equal('Save');
            });

            it('should load pre-form initialization data' +
            ' when loading controller',
            function () {
                 expect(selectedPatientGetPersonAttributesStub).to.have.been.calledOnce;
            });


        });

         describe('Controller: FormEntry Controller Form Loading Functions Unit Tests', function () {

            it('should load a form schema when schema is determined correctly',
            function () {
                expect(formsMetaDataGetFormSchemaStub).to.have.been.calledOnce;
            });

            it('should create a formly schema when a schema has been loaded',
            function () {
                expect(createFormSpy).to.have.been.calledOnce;
                expect(createFormSpy.firstCall.calledWithExactly(mockFormSchema, controllerScope.model)).to.be.true;
                expect(controllerScope.lastFormlyFormSchema).to.exist;
                expect(controllerScope.questionMap).to.exist;
                expect(controllerScope.lastFormlyFormSchema.length > 0).to.be.true;
                expect(controllerScope.tabs[controllerScope.currentTabIndex].active).to.equal(true);
                expect(controllerScope.tabs[0].title).to.equal(mockFormSchema.pages[0].label);
            });

            it('should load required patient  values to model after formly schema creation',
            function () {
                //load sex to model
                expect(controllerScope.model.sex).to.equal(selectedPatient.gender());

                //load sex to questionmap
                 expect(controllerScope.questionMap['sex']).to.exist;
            });

             it('should load current provider value to model after schema creation',
            function () {
                 var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, 'encounterProvider');

                 expect(sectionModel['encounterProvider'].value).to.equal('user uuid');
            });

            it('should load current date value to model after schema creation',
            function () {
                 var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, 'encounterDatetime');

                 expect(sectionModel['encounterDatetime'].value).to.exist;

                 var today = new Date();
                today.setHours(0, 0, 0, 0);
                var setDate = new Date(sectionModel['encounterDatetime'].value);
                setDate.setHours(0, 0, 0, 0);
                console.log('setDate', setDate);
                console.log('today', today);
                expect(today.toISOString() === setDate.toISOString()).to.be.true;
            });

        });

        describe('Controller: FormEntry Controller Navigation Functions Unit Tests', function () {

            it('should return correct state of current tab when isCurrentTabLast is invoked',
            function () {
                //case last tab
                controllerScope.currentTabIndex = controllerScope.tabs.length - 1;
                expect(controllerScope.isCurrentTabLast()).to.equal(true);

                //case not last tab
                controllerScope.currentTabIndex = 0;
                expect(controllerScope.isCurrentTabLast()).to.equal(false);
            });

            it('should return correct state of current tab when isCurrentTabFirst is invoked',
            function () {
                //case last tab
                controllerScope.currentTabIndex = 0;
                expect(controllerScope.isCurrentTabFirst()).to.equal(true);

                //case not last tab
                controllerScope.currentTabIndex = controllerScope.tabs.length - 1;
                expect(controllerScope.isCurrentTabFirst()).to.equal(false);
            });

            it('should load the next tab when loadNextTab is invoked',
            function () {
                controllerScope.currentTabIndex = 0;
                controllerScope.loadNextTab();

                expect(controllerScope.isCurrentTabFirst()).to.equal(false);
                expect(controllerScope.currentTabIndex).to.equal(1);
                expect(controllerScope.tabs[controllerScope.currentTabIndex].active).to.equal(true);

            });

            it('should load the previous tab when loadPreviousTab is invoked',
            function () {
                controllerScope.currentTabIndex = 2;
                controllerScope.loadPreviousTab();

                expect(controllerScope.isCurrentTabLast()).to.equal(false);
                expect(controllerScope.currentTabIndex).to.equal(1);
                expect(controllerScope.tabs[controllerScope.currentTabIndex].active).to.equal(true);

            });

            it('should launch confirmation dialog when user clicks cancel',
            function () {
                var dialogConfirmationStub = sinon.spy(dialogService, 'confirm');
                controllerScope.cancel();

                expect(dialogConfirmationStub.callCount).to.equal(1);

            });

             it('should launch confirmation when navigation away from the formentry starts ' +
             'and there are unsaved changes',
            function () {

                //simulate unsaved changes state
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.changesSaved = false;

                var dialogConfirmationStub = sinon.spy(dialogService, 'confirm');
                controllerScope.$broadcast('$stateChangeStart',
                {preventDefault: function(){}}, {name:'name'}, {});

                expect(dialogConfirmationStub.callCount).to.equal(1);

            });

        });


        describe('Controller: FormEntry Form Submission Functions Unit Tests', function () {
            it('should load all tabs not loaded through lazy loading when submit is triggered',
            function () {
                 //simulate unsaved changes state
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.changesSaved = false;

                //simulate some tabs not loaded
                controllerScope.displayedTabsIndices = [];
                controllerScope.submit();

                $timeout.flush();
                expect(controllerScope.displayedTabsIndices.length).to.equal(controllerScope.tabs.length);

            });

            it('should not begin the sumit process when theres one in progress',
            function () {
                //simulate unsaved changes state
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.changesSaved = false;

                //simulate a submit process in progress
                controllerScope.fourStageSubmitProcess.submittingNewObs = true;

                //use this to monitor whether the submit process began
                controllerScope.hasClickedSubmit = false;
                controllerScope.submit();

                 $timeout.flush();
                 expect(controllerScope.hasClickedSubmit).to.equal(false);


            });


            it('should generate payload when the form is valid and submit is initiated',
            function () {

                //simulate valid form state after user has input some valid obs
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.form.$valid = true;
                controllerScope.changesSaved = false;


                //set-up spy to see whether the formentry generate payload will be called
                //meaning a payload has been generated
                var formentryGeneratePayloadStub = sinon.spy(FormEntry, 'getFormPayload');
                var personAttributeGeneratePayloadStub = sinon.spy(FormEntry, 'getPersonAttributesPayload');

                controllerScope.submit();

                 $timeout.flush();

                 expect(formentryGeneratePayloadStub.callCount).to.equal(1);
                 expect(personAttributeGeneratePayloadStub.callCount).to.equal(1);
            });

            it('should call the notify method of dialog to notify user when no obs entered and submit is triggers',
            function () {

                //simulate valid form state after user has input some valid obs
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.form.$valid = true;
                controllerScope.changesSaved = false;

                //Not filling in any obs to trigger

                var dialogServiceNotifySpy = sinon.spy(dialogService, 'notify');

                controllerScope.submit();

                $timeout.flush();

                expect(dialogServiceNotifySpy.callCount).to.equal(1);

            });

            it('should updated the payload with current form, patient, encountertype, visit' +
            'when payload is generating',
            function () {
                setUpObsUserInputToForm();

                var submittedPayload;
                var encounterService = OpenmrsRestService.getEncounterResService();
                var encounterServiceStub = sinon.stub(encounterService, 'saveEncounter',
                function(payload, onSucesss, onFailure){
                     submittedPayload = JSON.parse(payload);
                });

                controllerScope.submit();

                $timeout.flush();

                //check payload for patient, form, visit, encountertype
                expect(submittedPayload.patient).to.equal(selectedPatient.uuid());
                expect(submittedPayload.form).to.equal($stateParams.formuuid);
                expect(submittedPayload.encounterType).to.equal(mockFormMetadata.encounterTypeUuid);
                expect(submittedPayload.visit).to.equal($stateParams.visitUuid);

                encounterServiceStub.restore();
            });

             it('should call the encounter service saveEncounter when submit is initiated',
            function () {
                setUpObsUserInputToForm();

                var encounterService = OpenmrsRestService.getEncounterResService();
                var encounterServiceMock = sinon.mock(encounterService);

                encounterServiceMock.expects("saveEncounter").once();

                console.log('saveEncounterStub', encounterServiceMock);

                controllerScope.submit();

                $timeout.flush();

                encounterServiceMock.verify();
                encounterServiceMock.restore();

            });

             it('should call the personAttribute service saveUpdatePersonAttribute when submit is initiated',
            function () {
                setUpObsUserInputToForm();
                setUpPersonAttributeUserInputToForm();

                var encounterServiceStub = getEncounterServiceSaveEncounterStub(false);

                //prevent test from failing
                rootScope.previousStateParams = {};

                var called = false;
                var personAttributesServiceStub = sinon.stub(PersonAttributesRestService,
                'saveUpdatePersonAttribute', function(payload, person, callback) {
                    called = true;
                    callback({});
                });


                controllerScope.submit();

                $timeout.flush();

                expect(called).to.equal(true);

                encounterServiceStub.restore();
                personAttributesServiceStub.restore();

            });

            it('should notify user of successful submission when submitting is complete',
            function () {
                setUpObsUserInputToForm();

                var encounterServiceStub = getEncounterServiceSaveEncounterStub(false);
                //prevent test from failing
                rootScope.previousStateParams = {};

                //mock personAttributesService saveUpdatePersonAttribute to return success
                var personAttributesServiceStub = sinon.stub(PersonAttributesRestService,
                'saveUpdatePersonAttribute', function(payload, person, callback) {
                    callback({});
                });

                //setup spy for notify
                var dialogServiceNotifySpy = sinon.spy(dialogService, 'notify');

                controllerScope.submit();

                $timeout.flush();

                expect(dialogServiceNotifySpy.firstCall.calledWithExactly('Success',
                controllerScope.formSubmitSuccessMessage)).to.be.true;

                encounterServiceStub.restore();

            });

            it('should notify user of unsuccessful submission when submitting is complete',
            function () {
                setUpObsUserInputToForm();
                var encounterServiceStub = getEncounterServiceSaveEncounterStub(true);

                //prevent test from failing
                rootScope.previousStateParams = {};
                httpBackend.expectGET('views/main/url-selector.html').respond('');

                controllerScope.submit();

                $timeout.flush();

                expect(controllerScope.errorMessage).to.exist;
                expect(controllerScope.hasFailedNewingRequest).to.be.true;

                encounterServiceStub.restore();

            });

             it('should not have any pending request when submitting is successful',
            function () {
                setUpObsUserInputToForm();

                var encounterServiceStub = getEncounterServiceSaveEncounterStub(false);
                //prevent test from failing
                rootScope.previousStateParams = {};
                
                //mock personAttributesService saveUpdatePersonAttribute to return success
                var personAttributesServiceStub = sinon.stub(PersonAttributesRestService,
                'saveUpdatePersonAttribute', function(payload, person, callback) {
                    callback({});
                });
                controllerScope.submit();

                $timeout.flush();

                expect(controllerScope.fourStageSubmitProcess.submittingNewObs).to.be.false;
                expect(controllerScope.fourStageSubmitProcess.submittingUpdatedObs).to.be.false;
                expect(controllerScope.fourStageSubmitProcess.submittingVoidedObs).to.be.false;
                expect(controllerScope.fourStageSubmitProcess.submittingPersonAttributes).to.be.false;

                encounterServiceStub.restore();

            });
        });

    });

    describe('Controller: FormEntry Controller Unit Tests, Existing Encounter Mode', function () {

        var controller;
        var controllerScope;
        var rootScope;
        var selectedPatient;
        var patientModelFactory;
        var mockDataService;
        var mockFormSchema;
        var mockRestObs;
        var $stateParams, $state;
        var OpenmrsRestService, userResService, unilServiceRegistrationStub;
        var selectedPatientGetPersonAttributesStub;
        var UtilService, FormEntry, createFormSpy, CurrentLoadedFormService;
        var formEntryUpdateFormWithExistingObsSpy;
        var dialogService, $timeout, PersonAttributesRestService;
        var encounterServiceGetEncouterStub;
        var httpBackend;

        var mockFormMetadata = {
            encounterTypeName: 'adultEncounter',
            name: 'test-form',
            encounterTypeUuid: 'encounterTypeUuid'
        };

        var mockEncounterFromEncountersTab = {
            formUuid: function() {
                return 'formUuid';
            },
            encounterTypeName: function() {
                return 'encounterTypeName';
            }
        };

        var FormsMetadataMock = {
            getFormSchema: function(schemaName, callback) {
                console.log('schemaName', schemaName);
                callback(mockFormSchema);
            },
            getForm: function(uuid) {
                return mockFormMetadata;
            }
        };

        var formsMetaDataGetFormSchemaStub;
        formsMetaDataGetFormSchemaStub = sinon.spy(FormsMetadataMock, 'getFormSchema');

        beforeEach(function(){
           module('ngAmrsApp');
           module('app.formentry');
           module('mock.data');
           module('ngMock');

        });
        beforeEach(function(){
            /*
            Apperently underscore.string is not loading in thr headless browser during the tests
            this library has specific classes for handling string comparison.
            To solve this problem am adding simple hack to able to load following two functions
            when running the tests.
            NB: as pointed out in the comments ECMAScript 2015 (ES6) introduces startsWith,
            however, at the time of writing this update (2015) browser-support is
            far from complete.
            */
            if (typeof String.prototype.startsWith !== 'function') {
                String.prototype.startsWith = function (str) {
                    return this.slice(0, str.length) === str;
                };

                if (typeof String.prototype.endsWith !== 'function') {
                    String.prototype.endsWith = function (str) {
                        return this.slice(-str.length) === str;
                    };
                }
            }
        });

        var getEncounterByUuidCalled = false;
        var setUpEncounterGetEncounterStub = function(encounterService) {
            encounterServiceGetEncouterStub =
             sinon.stub(encounterService, 'getEncounterByUuid',
                function(encUuid, onSuccess, onFailure){
                    getEncounterByUuidCalled = true;
                    onSuccess(mockRestObs);
                });
        };

        beforeEach(inject(function ($controller, $injector, $rootScope) {

            httpBackend = $injector.get('$httpBackend');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            $stateParams.visitUuid = 'test-visit-uuid';
            $stateParams.formuuid = 'formuuid';
            $stateParams.encuuid = 'encuuid';

            mockDataService = $injector.get('mockData');
            FormEntry = $injector.get('FormEntry');
            CurrentLoadedFormService = $injector.get('CurrentLoadedFormService');

            createFormSpy = sinon.spy(FormEntry, 'createForm');
            formEntryUpdateFormWithExistingObsSpy = sinon.spy(FormEntry, 'updateFormWithExistingObs');

            OpenmrsRestService = $injector.get('OpenmrsRestService');
            userResService = OpenmrsRestService.getUserService();

            userResService.user = {
                personUuId: function() {
                    return 'user uuid';
                }
            };

            patientModelFactory = $injector.get('PatientModel');
            UtilService = $injector.get('UtilService');
            unilServiceRegistrationStub =  sinon.spy(UtilService, 'confirmBrowserExit');

            selectedPatient =
            new patientModelFactory.patient(mockDataService.getMockPatient());
            selectedPatientGetPersonAttributesStub = sinon.spy(selectedPatient, 'getPersonAttributes');

            mockFormSchema = mockDataService.getMockTriageSchema();
            mockRestObs = mockDataService.getMockTriageRestObs();

            //stub encounter service to load
            var encounterService = OpenmrsRestService.getEncounterResService();
            setUpEncounterGetEncounterStub(encounterService);


            rootScope =  $rootScope;
            rootScope.broadcastPatient = selectedPatient;
            rootScope.activeEncounter = mockEncounterFromEncountersTab;
			controllerScope = $rootScope.$new();
            dialogService = $injector.get('dialogs');
            $timeout = $injector.get('$timeout');
            PersonAttributesRestService = $injector.get('PersonAttributesRestService');

			controller = $controller('FormentryCtrl',
            { $rootScope: $rootScope,
            $scope: controllerScope,
            $state: $state,
            $stateParams: $stateParams,
            FormsMetaData: FormsMetadataMock,
            OpenmrsRestService: OpenmrsRestService,
            UtilService: UtilService,
            FormEntry: FormEntry
            });

		}));



        afterEach(function(){
            encounterServiceGetEncouterStub.restore();
            formEntryUpdateFormWithExistingObsSpy.restore();
            getEncounterByUuidCalled = false;
        });


        var setUpObsUserInputToForm = function() {
                //simulate valid form state after user has input some valid obs
                controllerScope.form = {};
                controllerScope.form.$dirty = true;
                controllerScope.form.$valid = true;
                controllerScope.changesSaved = false;

                //change value for height
                var q1Key =  CurrentLoadedFormService.
                        getFieldKeyFromGlobalById('height');
                console.log('updated obs key', q1Key);

                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, q1Key);
                console.log('updated obs sectionModel', sectionModel);
                sectionModel[q1Key].value = 150;

        };

        var setUpPersonAttributeUserInputToForm = function() {
                //fill one obs to enable submit process to continue
                var personAttributeKey =  CurrentLoadedFormService.
                        getFieldKeyFromGlobalById('first_person_attribute');

                var sectionModel =
                    CurrentLoadedFormService.
                        getContainingObjectForQuestionKey(controllerScope.model, personAttributeKey);

                sectionModel[personAttributeKey].value = 'question one';
        };

        var getEncounterServiceSaveEncounterStub = function(returnFailureOnNextCall) {
            var encounterService = OpenmrsRestService.getEncounterResService();
               return sinon.stub(encounterService, 'saveEncounter',
                function(payload, onSucesss, onFailure){
                    if(!returnFailureOnNextCall)
                        onSucesss({});
                    else
                        onFailure('Error');
                });
        };

        it('FormEntry controller should be defined and have all required services injected',
        function () {
			expect(controller).to.exist;
			expect(controllerScope).to.exist;
			expect(rootScope).to.exist;
		});

         describe('Controller: FormEntry Controller Form Loading and Saving Functions Unit Tests', function () {

            it('should determine the correct form to load correctly' +
            ' when loading controller',
            function () {
                 expect(controllerScope.encounterType).to.equal(mockEncounterFromEncountersTab.encounterTypeName());
             });

            it('should determine the correct form mode' +
            ' when loading controller',
            function () {
                 expect(controllerScope.currentMode.submitLabel).to.equal('Update');
            });

            it('should call the encounter service getEncounterByUuid to get the encounter obs' +
            ' when loading controller',
            function () {
                 expect(getEncounterByUuidCalled).to.be.true;
                 expect(mockRestObs.form.uuid).to.equal('a2b811ed-6942-405a-b7f8-e7ad6143966c');
            });

            it('should call the FormEntryService updateFormWithExistingObs to populateModelWithData' +
            ' when loading controller',
            function () {
                 expect(formEntryUpdateFormWithExistingObsSpy.callCount >= 1).to.equal(true);
                 expect(Object.keys(controllerScope.model).length > 3).to.be.true;
            });

            it('should call the encounter service saveEncounter when submit is initiated',
            function () {
                setUpObsUserInputToForm();

                var encounterService = OpenmrsRestService.getEncounterResService();
                var encounterServiceMock = sinon.mock(encounterService);

                encounterServiceMock.expects("saveEncounter").once();

                console.log('saveEncounterStub', encounterServiceMock);

                controllerScope.submit();

                $timeout.flush();

                encounterServiceMock.verify();
                encounterServiceMock.restore();

            });

         });
 });
})();
