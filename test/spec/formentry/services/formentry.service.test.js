/*jshint -W026, -W030, -W106 */
(function() {
    'use strict';
    describe('Formentry Service unit tests', function(){
      beforeEach(function(){
          module('app.formentry');
          module('mock.data');
      });

      var searchDataService;
      var httpBackend;
      var mockData;
      var moment;
      var formentryService;

      beforeEach(inject(function ($injector) {
        moment = $injector.get('moment');
        httpBackend = $injector.get('$httpBackend');
        searchDataService = $injector.get('SearchDataService');
        mockData = $injector.get('mockData');
        formentryService = $injector.get('FormentryService');
      }));

      afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        //httpBackend.verifyNoOutstandingRequest();
      });

      it('should have formentry service defined', function () {
        expect(formentryService).to.exist;
      });

      it('should make an api call to the forms local resource when getFormSchema is called with a formName', function () {
        httpBackend.expectGET('scripts/formentry/formschema/test-form.json').respond(mockData.getMockSchema);
        formentryService.getFormSchema('test-form', function (data){
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


      it('Formentry Service should have getFormSchema method', function () {
        expect(formentryService.getFormSchema).to.be.an('function');
        expect(formentryService).to.have.property('getFormSchema');
      });

      it('Formentry Service should have createForm method', function () {
        expect(formentryService.createForm).to.be.an('function');
        expect(formentryService).to.have.property('createForm');
      });

      it('Formentry Service should have getEncounter method', function () {
        expect(formentryService.getEncounter).to.be.an('function');
        expect(formentryService).to.have.property('getEncounter');
      });

      it('Formentry Service should have updateFormPayLoad method', function () {
        expect(formentryService.updateFormPayLoad).to.be.an('function');
        expect(formentryService).to.have.property('updateFormPayLoad');
      });

      it('CreateForm method should return a tabbed form', function(){
        var schema = mockData.getMockSchema();
        //console.log(schema);
        var tabs;
        formentryService.createForm(schema, function(data){
          tabs=data;
          //console.log(tabs);
          expect(tabs).to.be.an('array');
          expect(tabs[0]).to.have.property('title');
          expect(tabs[0]).to.have.property('form');
          expect(tabs[0].form.fields).to.be.an('array');
          expect(tabs[0]).to.be.an('object');
        });

      });

      describe('CreateForm method should return a tabbed form various input', function(){
        var tabs;
        beforeEach(function(){
          var schema = mockData.getMockSchema();
          //console.log(schema);
          formentryService.createForm(schema, function(data){
            tabs=data;
            //console.log(tabs);
          });
        });

        it('Should be able to add sections to a page', function(){
          expect(tabs).to.be.an('array');
          expect(tabs[0].form.fields).to.be.an('array');
          expect(tabs[0].form.fields[0].type).to.equal('section');
        });

        it('Should be able to add fields to sections in a page', function(){
          expect(tabs[0].form.fields[0].templateOptions.fields[0].fieldGroup).to.be.an('array');
        });

        it('Should be able to add fields of type date to sections in a page', function(){
          expect(tabs[0].form.fields[0].templateOptions.fields[0].fieldGroup[0].type).to.equal('datepicker');
        });

        it('Should be able to add fields of type select/dropdown to sections in a page', function(){
          expect(tabs[1].form.fields[0].templateOptions.fields[0].fieldGroup[0].type).to.equal('select');
        });

        it('Should be able to add repeating section to sections in a page', function(){
          expect(tabs[1].form.fields[1].templateOptions.fields[0].fieldGroup[0].type).to.equal('repeatSection');
        });
      });

      describe('updateFormPayLoad method should be able to create a payLoad', function(){
        var model;
        var schema;
        var formly_schema;
        var form = {encounterType:'xx1234'};
        var payLoad;
        var patient = {uuid:'xxxx'};
        beforeEach(function(){
          schema = mockData.getMockSchema();
          model = mockData.getMockModel();
          console.log(model);
          formentryService.createForm(schema, function(data){
            formly_schema = data;
            console.log('FORMLY SCHEMAS');
            console.log(formly_schema);
            payLoad = formentryService.updateFormPayLoad(model,formly_schema, patient, form);
          });

        });

        it('Should have form payLoad as an object', function(){
          expect(payLoad).to.exist;
          expect(payLoad).to.be.an('object');
        });
        it('Should return a payLoad that has obs', function(){
          expect(payLoad).to.have.property('obs');
          expect(payLoad.obs).to.be.an('array');
        });
        it('Payload Should have encounterType as one of its property', function(){
          expect(payLoad).to.have.property('encounterType');
        });
        it('Payload Should have patient as one of its property', function(){
          expect(payLoad).to.have.property('patient');
        });
        it('Payload Should have encounterDatetime as one of its property', function(){
          expect(payLoad).to.have.property('encounterDatetime');
        });
        it('Payload Should have encounterProvider as one of its property', function(){
          expect(payLoad).to.have.property('provider');
        });
        it('Payload Should have encounterLocation as one of its property', function(){
          expect(payLoad).to.have.property('location');
        });

      });


    });
})();
