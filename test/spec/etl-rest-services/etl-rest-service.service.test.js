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


    //etl service definition 
    it('should have ETL service defined', function () {
      expect(etlRestService).to.exist;
    });
    
    //hiv summary methods
    it('should make an api call to the hiv summary etl rest endpoint when getHivSummary is called with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getHivSummary request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
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

    it('should make an api call to the hiv summary end point with default params when getHivSummary is called with a uuid, without paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=20&startIndex=0').respond({});
      etlRestService.getHivSummary('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the hiv summary end point with passed in params when getHivSummary is called with a uuid, and paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/hiv-summary?limit=5&startIndex=20').respond({});
      etlRestService.getHivSummary('passed-uuid', 20, 5, function () { }, function () { });
      httpBackend.flush();
    });
    
    
    //getVitals methods unit tests
    it('should make an api call to the vitals etl rest endpoint when getVitals is called with a patient uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getVitals request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getVitals request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond(500);
      etlRestService.getVitals('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the vitals end point with default params when getVitals is called with a patient uuid, without paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=20&startIndex=0').respond({});
      etlRestService.getVitals('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the vitals end point with passed in params when getVitals is called with a patient uuid, and paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/vitals?limit=5&startIndex=20').respond({});
      etlRestService.getVitals('passed-uuid', 20, 5, function () { }, function () { });
      httpBackend.flush();
    }); 
    
    //getPatientTest methods unit tests
    it('should make an api call to the patientTest etl rest endpoint when getPatientTests is called with a patient uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/data?limit=20&startIndex=0').respond({});
      etlRestService.getPatientTests('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getPatientTests request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/data?limit=20&startIndex=0').respond({});
      etlRestService.getPatientTests('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getPatientTests request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/data?limit=20&startIndex=0').respond(500);
      etlRestService.getPatientTests('passed-uuid', undefined, undefined, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the patientTest end point with default params when getPatientTests is called with a patient uuid, without paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/data?limit=20&startIndex=0').respond({});
      etlRestService.getPatientTests('passed-uuid', undefined, undefined, function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the patientTest end point with passed in params when getPatientTests is called with a patient uuid, and paging params', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/data?limit=5&startIndex=20').respond({});
      etlRestService.getPatientTests('passed-uuid', 20, 5, function () { }, function () { });
      httpBackend.flush();
    });


  });
})();
