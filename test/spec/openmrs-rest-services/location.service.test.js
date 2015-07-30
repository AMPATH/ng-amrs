/*jshint -W026, -W030 */
(function () {
  'use strict';

  describe('Open MRS Location Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });

    var callbacks;

    var httpBackend;
    var locationService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      locationService = $injector.get('LocationResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));

    beforeEach(inject(function ($injector) {
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

    it('should have Location service defined', function () {
      expect(locationService).to.exist;
    });

    it('should make an api call to the location resource when getLocationByUuid is called with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid').respond({});
      locationService.getLocationByUuid('passed-uuid', function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the location resource when findLocation is called with a search text', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location?q=passed-text&v=default').respond({});
      locationService.findLocation('passed-text', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getLocationByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid').respond({});
      locationService.getLocationByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getLocationByUuid request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid').respond(500);
      locationService.getLocationByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });
    
        it('should call the onSuccess callback findLocation request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location?q=passed-text&v=default').respond({});
      locationService.findLocation('passed-text',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findLocation request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location?q=passed-text&v=default').respond(500);
      locationService.findLocation('passed-text',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

  });
})();
