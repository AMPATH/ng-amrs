/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Identifier Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });

    var callbacks;
    var httpBackend;
    var identifierService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      identifierService = $injector.get('IdentifierResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));

    beforeEach(inject(function () {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function () {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function (message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };
    }));

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();

      // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
    });

    it('should have PatientIdentifiers service defined', function () {
      expect(identifierService).to.exist;
    });

    it('should make an api call to the PatientIdentifiers resource with right url when getPatientIdentifiersByUuid is invoked with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond({});
      identifierService.getPatientIdentifiers('passed-uuid', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getPatientIdentifiersByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond({});
      identifierService.getPatientIdentifiers('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getPatientIdentifiersByUuid request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond(500);
      identifierService.getPatientIdentifiers('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });
  });
})();
