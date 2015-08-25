/*jshint -W026, -W030 */
(function () {
  'use strict';

  describe('Open MRS Provider Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });

    var callbacks;

    var httpBackend;
    var providerService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      providerService = $injector.get('ProviderResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));

    beforeEach(inject(function() {
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

    it('should have Provider service defined', function () {
      expect(providerService).to.exist;
    });

    it('should make an api call to the provider resource when getProviderByUuid is called with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider/passed-uuid?v=full').respond({});
      providerService.getProviderByUuid('passed-uuid', function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the provider resource when findProvider is called with a search text', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider?q=passed-text&v=default').respond({});
      providerService.findProvider('passed-text', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getProviderByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider/passed-uuid?v=full').respond({});
      providerService.getProviderByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getProviderByUuid request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider/passed-uuid?v=full').respond(500);
      providerService.getProviderByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should call the onSuccess callback findProvider request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider?q=passed-text&v=default').respond({});
      providerService.findProvider('passed-text',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findProvider request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'provider?q=passed-text&v=default').respond(500);
      providerService.findProvider('passed-text',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

  });
})();
