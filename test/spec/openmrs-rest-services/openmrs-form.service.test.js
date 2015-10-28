/* global afterEach */
/* global describe */
/* global inject */
/* global beforeEach */
/* global expect */
/* global it */
/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  describe('OpenMRS Form Service Unit Tests', function() {
    beforeEach(function() {
      module('app.openmrsRestServices');
      module('mock.data');
    });

    var callbacks;
    var mockData;
    var httpBackend;
    var formService;
    var settingsService;
    var v = 'custom:(uuid,name,encounterType,version)';

    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      formService = $injector.get('FormResService');
      settingsService = $injector.get('OpenmrsSettings');
      mockData = $injector.get('mockData');
    }));

    beforeEach(inject(function() {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function() {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function(message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };

    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('should have form service defined', function() {
      expect(formService).to.exist;
    });

    it('should make an api call to the form resource when ' +
     'getFormByUuid is called with a uuid', function() {
      var selectedForm = mockData.getMockedFormList();
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'form/passed-uuid?v=' + v).respond(selectedForm.results[0]);
      formService.getFormByUuid('passed-uuid',
        function(data) {
          expect(data.uuid).to.equal('passed-uuid');
          expect(data.encounterTypeUuid).to.equal('0010c6dffd0f');
          expect(data.encounterTypeName).to.equal('ADULTRETURN');
          expect(data.name).to.equal('AMPATH POC Adult Return Visit Form v0.01');
        });

      httpBackend.flush();
    });

    it('should make an api call to the form resource when ' +
     'findPocForms is called with a passed-text', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'form?q=passed-text&v=' + v).respond(mockData.getMockedFormList());
      formService.findPocForms('passed-text', function(data) {
          expect(data[0].uuid).to.equal('passed-uuid');
          expect(data[0].encounterTypeUuid).to.equal('0010c6dffd0f');
          expect(data[0].encounterTypeName).to.equal('ADULTRETURN');
          expect(data[0].name).to.equal('AMPATH POC Adult Return Visit Form v0.01');
        });

      httpBackend.flush();
    });

    it('Form service should have the following  methods',
    function() {
      expect(formService.findPocForms).to.be.an('function');
      expect(formService.getFormByUuid).to.be.an('function');
    });

  });
})();
