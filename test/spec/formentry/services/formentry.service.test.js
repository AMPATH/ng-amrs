/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('Formentry Service unit tests', function() {
    beforeEach(function() {
        module('app.formentry');
        module('mock.data');
        module('models');
        module('app.etlRestServices');
      });

    var searchDataService;
    var httpBackend;
    var mockData;
    var moment;
    var formentryService;
    var patientModel;

    beforeEach(inject(function($injector) {
        moment = $injector.get('moment');
        httpBackend = $injector.get('$httpBackend');
        searchDataService = $injector.get('SearchDataService');
        mockData = $injector.get('mockData');
        formentryService = $injector.get('FormentryService');
        patientModel = $injector.get('PatientModel');

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
          String.prototype.startsWith = function(str) {
            return this.slice(0, str.length) === str;
          };

          if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function(str) {
              return this.slice(-str.length) === str;
            };
          }
        }
      }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        //httpBackend.verifyNoOutstandingRequest();
      });

    it('should have formentry service defined', function() {
        expect(formentryService).to.exist;
      });

    it('should make an api call to the forms local resource when getFormSchema is called with a formName', function() {
        httpBackend.expectGET('scripts/formentry/formschema/test-form.json').respond(mockData.getMockSchema);
        formentryService.getFormSchema('test-form', function(data) {
          expect(data.name).to.equal('test-form');
          expect(data).to.be.an('object');
          expect(data).to.have.property('name');
          expect(data).to.have.property('uuid');
          expect(data).to.have.property('pages');
          expect(data).to.have.property('processor');
          expect(data.pages).to.be.an('array');
        });

        httpBackend.flush();
      });

    it('Formentry Service should have getFormSchema method', function() {
        expect(formentryService.getFormSchema).to.be.an('function');
        expect(formentryService).to.have.property('getFormSchema');
      });

    it('Formentry Service should have createForm method', function() {
        expect(formentryService.createForm).to.be.an('function');
        expect(formentryService).to.have.property('createForm');
      });

    it('Formentry Service should have getEncounter method', function() {
        expect(formentryService.getEncounter).to.be.an('function');
        expect(formentryService).to.have.property('getEncounter');
      });

    it('Formentry Service should have updateFormPayLoad method', function() {
        expect(formentryService.updateFormPayLoad).to.be.an('function');
        expect(formentryService).to.have.property('updateFormPayLoad');
      });

    it('CreateForm method should return a tabbed form', function() {
        var schema = mockData.getMockSchema();
        //console.log(schema);
        var model = {};
        var tabs;
        formentryService.createForm(schema, model, function(data) {
          tabs = data;
          //console.log(tabs);
          expect(tabs).to.be.an('array');
          expect(tabs[0]).to.have.property('title');
          expect(tabs[0]).to.have.property('form');
          expect(tabs[0].form.fields).to.be.an('array');
          expect(tabs[0]).to.be.an('object');
        });

      });

    describe('CreateForm method should return a tabbed form various input', function() {
        var tabs;

        beforeEach(function() {
          var schema = mockData.getMockSchema();
          var model = {};
          //console.log(schema);
          formentryService.createForm(schema, model, function(data) {
            tabs = data;
            // console.log('++++++tabs',tabs);
          });

        });

        it('Should be able to add sections to a page', function() {
          expect(tabs).to.be.an('array');
          expect(tabs[0].form.fields).to.be.an('array');
          expect(tabs[0].form.fields[1].type).to.equal('section');
        });

        it('Should be able to add fields to sections in a page', function() {
          expect(tabs[0].form.fields[1].data.fields).to.be.an('array');
        });

        it('Should be able to add fields of type date to sections in a page', function() {
          expect(tabs[0].form.fields[1].data.fields[1].type).to.equal('datetimepicker');
        });

        it('Should be able to add fields of type select/dropdown to sections in a page', function() {
          expect(tabs[1].form.fields[0].data.fields[1].type).to.equal('select');
        });

        it('Should be able to add repeating section to sections in a page', function() {
          expect(tabs[1].form.fields[1].data.fields[1].type).to.equal('repeatSection');
        });
      });

    describe('Should be able to Search any field in the form', function() {
        var tabs;
        var field;
        var skeyField;
        var sidField;
        var id = 'q7a';
        var key = 'obs1_a89ff9a6n1350n11dfna1f1n0026b9348838';

        beforeEach(function() {
          var schema = mockData.getMockSchema();
          field = mockData.getMockObsField();
          var model = {};
          //console.log(schema);
          formentryService.createForm(schema, model, function(data) {
            tabs = data;
            // console.log('++++++tabs',tabs);
          });
          // g_fields=tabs;
        });

        it('Should be able to search field by Id', function() {
          sidField = formentryService.getFieldByIdKey(id);
          expect(sidField).to.be.an('object');
          expect(id).to.equal(sidField.data.id);
          expect(sidField.key).to.equal(field.key);
          expect(sidField.type).to.equal(field.type);
        });

        it('Should be able to search field by key', function() {
          skeyField = formentryService.getFieldByIdKey(key);
          expect(skeyField).to.be.an('object');
          expect(skeyField.key).to.equal(field.key);
          expect(skeyField.type).to.equal(field.type);

        });

        it('Should be able to find EncounterDate Field', function() {
          skeyField = formentryService.getFieldByIdKey('encounterDate');
          expect(skeyField).to.be.an('object');
          expect(skeyField.key).to.equal('encounterDate');
          expect(skeyField.type).to.equal('datetimepicker');
        });

        it('Should be able to return undefined if no field is found', function() {
          skeyField = formentryService.getFieldByIdKey('test');
          // console.log('++++', skeyField);
          expect(skeyField).to.be.an('undefined');
        });

      });

    describe('updateFormPayLoad method should be able to create a payLoad', function() {
        var model;
        var schema;
        var formlySchema;
        var form = {encounterType:'xx1234'};
        var payLoadData;
        var payLoad;
        var patient;

        beforeEach(function() {
          schema = mockData.getMockSchema();
          model = mockData.getMockModel();
          patient = new patientModel.patient(mockData.getMockPatient());

          //console.log(model);
          formentryService.createForm(schema, model, function(data) {
            formlySchema = data;
            console.log('FORMLY SCHEMAS');
            console.log(formlySchema);//, params
            payLoadData = formentryService.updateFormPayLoad(model, formlySchema, patient, form);
            payLoad = payLoadData.formPayLoad;
          });

        });

        it('Should have form payLoadData as an object', function() {
          expect(payLoadData).to.exist;
          expect(payLoadData).to.be.an('object');
          expect(payLoadData).to.have.property('formPayLoad');
          expect(payLoadData).to.have.property('personAttributes');
        });

        it('Should have form payLoad as an object', function() {
          expect(payLoad).to.exist;
          expect(payLoad).to.be.an('object');
        });

        it('person attributes array should be a list of person attributes', function() {
          expect(payLoadData.personAttributes).to.be.an('array');
        });

        it('Should return a payLoad that has obs', function() {
          expect(payLoad).to.have.property('obs');
          expect(payLoad.obs).to.be.an('array');
        });

        it('Payload Should have encounterType as one of its property', function() {
          expect(payLoad).to.have.property('encounterType');
        });

        it('Payload Should have patient as one of its property', function() {
          expect(payLoad).to.have.property('patient');
        });

        it('Payload Should have encounterDatetime as one of its property', function() {
          expect(payLoad).to.have.property('encounterDatetime');
        });

        it('Payload Should have encounterProvider as one of its property', function() {
          expect(payLoad).to.have.property('provider');
        });

        it('Payload Should have encounterLocation as one of its property', function() {
          expect(payLoad).to.have.property('location');
        });

      });

  });

})();
