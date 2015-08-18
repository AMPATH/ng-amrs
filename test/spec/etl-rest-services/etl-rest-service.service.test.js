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
    
    //getAppointmentSchedule method unit tests
    it('should make an api call to the appointment schedule etl rest endpoint when getAppointmentSchedule is called with a location uuid and date range', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', function () { }, function () { });
      httpBackend.flush();
    });
    
     it('should make an api call to the appointment schedule etl rest endpoint when getAppointmentSchedule is called with a location uuid, date range and paging parameters', function () {
      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', function () { }, function () { }, 0, 10);
      httpBackend.flush();
      
      
      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', function () { }, function () { }, 0, undefined);
      httpBackend.flush();
      
      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', function () { }, function () { }, undefined, 10);
      httpBackend.flush();
    });
    
    it('should call the onSuccess callback getAppointmentSchedule request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getAppointmentSchedule request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/appointment-schedule?endDate=2015-09-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond(500);
      etlRestService.getAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });
    


  });
})();
