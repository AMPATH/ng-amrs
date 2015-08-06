/* global afterEach */
/*jshint -W026, -W030 */
(function () {
  'use strict';

  describe('ETL REST Service Unit Tests', function () {
    beforeEach(function () {
      module('app.etlRestServices');
    });

    var callbacks;

    var httpBackend;
    var etlRestService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      etlRestService = $injector.get('EtlRestService');
      settingsService = $injector.get('EtlRestServicesSettings');
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

    it('should have Provider service defined', function () {
      expect(etlRestService).to.exist;
    });

    it('should make an api call to the hiv summary etl rest endpoint when getHivSummary is called with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getHivSummary request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid',undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getHivSummary request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond(500);
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });
    
    it('should make an api call to the hiv summary end point with default params when getHivSummary is called with a uuid, without other params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });
    
     it('should make an api call to the hiv summary end point with passed in params when getHivSummary is called with a uuid, and other params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=5&startIndex=20').respond({});
      etlRestService.getHivSummary('passed-uuid', 20, 5, function () { }, function () { });
      httpBackend.flush();
    });

  });
})();
