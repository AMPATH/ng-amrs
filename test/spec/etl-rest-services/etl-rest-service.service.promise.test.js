/* global expect */
/* global inject */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('ETL REST Service Promise Unit Tests', function() {
    beforeEach(function() {
      module('app.etlRestServices');
    });

    var callbacks;

    var httpBackend;
    var etlRestService;
    var settingsService;
    var successResponse = { data:'∑••Ω=§≈ç√4=2' };
    var errorResponse = '∑rrºoççµ®';
    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      etlRestService = $injector.get('EtlRestService');
      settingsService = $injector.get('EtlRestServicesSettings');
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

      // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
    });


    //etl service definition
    it('should have ETL service defined', function() {
      expect(etlRestService).to.exist;
    });

    //hiv summary methods
    it('should make an api call to the hiv summary etl rest endpoint when ' +
       'getHivSummary is called with a uuid', function() {
      
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond(successResponse);
      
      var promise = etlRestService.getHivSummary('passed-uuid');
      expect(promise).to.be.an.object;

      promise.then(function(response) {
        expect(response.data).to.equal(successResponse.data);
      }).catch(function() {});
      httpBackend.flush();
    });

    it('should return a promise that calls the onSuccess callback ' +
      'getHivSummary request successfully returns',
      function() {

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond(successResponse);

        etlRestService.getHivSummary('passed-uuid')
          .then(callbacks.onSuccess).catch(callbacks.onFailure);

        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(true);
        expect(callbacks.onFailedCalled).to.equal(false);
      });

    it('should return a promise that calls the onFailed callback when ' +
      'getHivSummary request is not successfull',
      function() {
        var message = 'Call failure';

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond(500, errorResponse);

        etlRestService.getHivSummary('passed-uuid')
          .then(callbacks.onSuccess).catch(function(error) {
            callbacks.onFailure(error.data);
          });

        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(false);
        expect(callbacks.onFailedCalled).to.equal(true);
        expect(callbacks.message.trim()).to.equal(errorResponse);
      });

    it('should make an api call to the hiv summary end point with default ' +
      'params when getHivSummary is called with a uuid, without paging params',
      function() {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond(successResponse);

        var promise = etlRestService.getHivSummary('passed-uuid');
        promise.then(callbacks.onSuccess);
        httpBackend.flush();

        expect(callbacks.onSuccessCalled).to.equal(true);
      });

    it('should make an api call to the hiv summary end point with passed in ' +
      'params when getHivSummary is called with a uuid, and paging params',
      function() {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=5&startIndex=20').respond(successResponse);

        var promise = etlRestService.getHivSummary('passed-uuid', 20, 5);
        promise.then(callbacks.onSuccess);
        httpBackend.flush();

        expect(callbacks.onSuccessCalled).to.equal(true);
      });


    //getVitals methods unit tests
    it('should make an api call to the vitals etl rest endpoint when ' +
       'getVitals is called with a patient uuid', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid').then(callbacks.onSuccess);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
    });

    it('should call the onSuccess callback getVitals request successfully ' +
       'returns', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid').then(callbacks.onSuccess).catch(callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getVitals request is not ' +
       'successfull', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond(500, errorResponse);
      
      var promise = etlRestService.getVitals('passed-uuid');
      promise.then(callbacks.onSuccess).catch(function(error){
        callbacks.onFailure(error.data);
      });
      
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the vitals end point with default params ' +
       'when getVitals is called with a patient uuid, without paging params', 
       function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid');
      httpBackend.flush();
    });

    it('should make an api call to the vitals end point with passed in params'+
       'when getVitals is called with a patient uuid, and paging params', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=5&startIndex=20').respond({});
      etlRestService.getVitals('passed-uuid', 20, 5);
      httpBackend.flush();
    });
  });
})();
