/* global expect */
/* global inject */
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


    //getMonthlyAppointmentSchedule method unit tests
    it('should make an api call to the monthly appointment schedule etl rest endpoint when getMonthlyAppointmentSchedule is called with a location uuid and a date', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the monthly appointment schedule etl rest endpoint when getMonthlyAppointmentSchedule is called with a location uuid, date and paging parameters', function () {
      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?limit=10&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', function () { }, function () { }, 0, 10);
      httpBackend.flush();


      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', function () { }, function () { }, 0, undefined);
      httpBackend.flush();

      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?limit=10&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', function () { }, function () { }, undefined, 10);
      httpBackend.flush();
    });

    it('should call the onSuccess callback getMonthlyAppointmentSchedule request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getMonthlyAppointmentSchedule request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/monthly-appointment-schedule?startDate=2014-08-05T21:00:00.000Z').respond(500);
      etlRestService.getMonthlyAppointmentSchedule('passed-uuid', '2014-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    //getDefaultersList method unit tests
    it('should make an api call to the defaulters etl rest endpoint when getDefaultersList is called with a location uuid and numberOfDaysDefaulted', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30').respond({});
      etlRestService.getDefaultersList('passed-uuid', 30, function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the defaulters etl rest endpoint when getDefaultersList is called with a location uuid, numberOfDaysDefaulted and paging parameters', function () {
      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30&limit=10&startIndex=0').respond({});
      etlRestService.getDefaultersList('passed-uuid', 30, function () { }, function () { }, 0, 10);
      httpBackend.flush();


      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30&startIndex=0').respond({});
      etlRestService.getDefaultersList('passed-uuid', 30, function () { }, function () { }, 0, undefined);
      httpBackend.flush();

      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30&limit=10').respond({});
      etlRestService.getDefaultersList('passed-uuid', 30, function () { }, function () { }, undefined, 10);
      httpBackend.flush();
    });

    it('should call the onSuccess callback getMonthlyAppointmentSchedule request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30').respond({});
      etlRestService.getDefaultersList('passed-uuid', 30, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getMonthlyAppointmentSchedule request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/defaulter-list?defaulterPeriod=30').respond(500);
      etlRestService.getDefaultersList('passed-uuid', 30, callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    //getMonthlyAppointmentAndVisits method unit tests
    it('should make an api call to the monthly appointment schedule etl rest ' +
      'endpoint when getMonthlyAppointmentAndVisits is called with a ' +
      'location uuid and a date', function () {

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'startDate=2014-08-05T21:00:00.000Z').respond({});

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', function () { }, function () { });
        httpBackend.flush();
      });

    it('should make an api call to the monthly appointment schedule etl ' +
      'rest endpoint when getMonthlyAppointmentAndVisits is called with ' +
      'a location uuid, date and paging parameters', function () {
      
        //case startIndex and limit are defined
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'limit=10&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', function () { }, function () { }, 0, 10);
        httpBackend.flush();
      
        //case startIndex defined only
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', function () { }, function () { },
          0, undefined);
        httpBackend.flush();
      
        //case limit defined only
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'limit=10&startDate=2014-08-05T21:00:00.000Z').respond({});

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', function () { }, function () { },
          undefined, 10);
        httpBackend.flush();
      });

    it('should call the onSuccess callback getMonthlyAppointmentAndVisits ' +
      'request successfully returns', function () {

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'startDate=2014-08-05T21:00:00.000Z').respond({});

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(true);
        expect(callbacks.onFailedCalled).to.equal(false);
      });

    it('should call the onFailed callback when getMonthlyAppointmentAndVisits ' +
      'request is not successfull', function () {

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'location/passed-uuid/monthly-appointment-visits?' +
          'startDate=2014-08-05T21:00:00.000Z').respond(500);

        etlRestService.getMonthlyAppointmentAndVisits('passed-uuid',
          '2014-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);

        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(false);
        expect(callbacks.onFailedCalled).to.equal(true);
        expect(callbacks.message).to.exist;
        expect(callbacks.message.trim()).not.to.equal('');
      });
      
      // getPatientListByIndicator method unit tests
    it('should make an api call to the patient-by-indicator etl rest endpoint when getPatientListByIndicator is ' +
      'called with location uuid report-indicator, and date range', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-indicator', function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the patient-by-indicator etl rest endpoint when getPatientListByIndicator is ' +
      'called with a location uuid, report-indicator, date range and paging parameters', function () {

      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&limit=10&startDate=2014-08-05T21:00:00.000Z' +
        '&startIndex=0').respond({});
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-indicator', function () { }, function () { }, 0, 10);
      httpBackend.flush();

      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&startDate=2014-08-05T21:00:00.000Z&startIndex=0')
        .respond({});
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-indicator', function () { }, function () { }, 0, undefined);
      httpBackend.flush();

      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&limit=10&startDate=2014-08-05T21:00:00.000Z')
        .respond({});
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-indicator', function () { }, function () { }, undefined, 10 );
      httpBackend.flush();
    });

    it('should call the onSuccess callback getPatientListByIndicator request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
       'passed-indicator', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getPatientListByIndicator request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location/passed-uuid/patient-by-indicator?' +
        'endDate=2015-09-05T21:00:00.000Z&indicator=passed-indicator&startDate=2014-08-05T21:00:00.000Z').respond(500);
      etlRestService.getPatientListByIndicator('passed-uuid', '2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-indicator', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    // getHivSummaryIndicators unit tests
    it('should make an api call to the hiv-summary-indicators etl rest endpoint when getHivSummaryIndicators is ' +
      'called with countBy, report, and date range', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&report=passed-report&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report','passed-countBy', function () { }, function () { });
      httpBackend.flush();
    });

    it('should make an api call to the hiv-summary-indicators etl rest endpoint when getHivSummaryIndicators is ' +
      'called with a countBy, report-indicator, date range and paging parameters', function () {

      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&limit=10&report=passed-report&startDate=2014-08-05T21:00:00.000Z' +
        '&startIndex=0').respond({});
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report','passed-countBy', function () { }, function () { }, 0, 10);
      httpBackend.flush();

      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&report=passed-report&startDate=2014-08-05T21:00:00.000Z&startIndex=0')
        .respond({});
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report', 'passed-countBy', function () { }, function () { }, 0, undefined);
      httpBackend.flush();

      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&limit=10&report=passed-report&startDate=2014-08-05T21:00:00.000Z')
        .respond({});
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report', 'passed-countBy',function () { }, function () { }, undefined, 10 );
      httpBackend.flush();
    });

    it('should call the onSuccess callback getHivSummaryIndicators request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&report=passed-report&startDate=2014-08-05T21:00:00.000Z').respond({});
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report', 'passed-countBy', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getHivSummaryIndicators request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'hiv-summary-indicators?countBy=passed-countBy&' +
        'endDate=2015-09-05T21:00:00.000Z&report=passed-report&startDate=2014-08-05T21:00:00.000Z').respond(500);
      etlRestService.getHivSummaryIndicators('2014-08-05T21:00:00.000Z', '2015-09-05T21:00:00.000Z',
        'passed-report', 'passed-countBy', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should build the correct query param object by sub-type when ' +
      'getDataEntryStatisticsQueryParam is invoked with report params', function () {

        var locationIds = 'id1,id2,id3';
        var encounterTypes = 'type1,type2,type3,type4';
        var formIds = 'form1,form2,form3,form4';
        var providerUuid = 'providerUuid';
        var creatorUuid = 'creatorUuid';
        var startDate = '2015-01-01';
        var endDate = '2015-06-01';
        var subType;
        var queryParam;
        var expectedParam;
        
        //VIEW1
        //subtype by-date-by-encounter-type
        subType = 'by-date-by-encounter-type';
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          encounterTypeIds: encounterTypes,
          formIds: formIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, encounterTypes, formIds, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //case missing parameter 
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, null, null, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //VIEW2
        //subtype by-month-by-encounter-type
        subType = 'by-month-by-encounter-type';
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          encounterTypeIds: encounterTypes,
          formIds: formIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, encounterTypes, formIds, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //case missing parameter 
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, null, null, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        
        //VIEW3
        //subtype by-provider-by-encounter-type
        subType = 'by-provider-by-encounter-type';
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          encounterTypeIds: encounterTypes,
          formIds: formIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, encounterTypes, formIds, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //case missing parameter 
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          providerUuid: providerUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, null, null, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //VIEW4
        //by-creator-by-encounter-type
        subType = 'by-creator-by-encounter-type';
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          encounterTypeIds: encounterTypes,
          formIds: formIds,
          creatorUuid: creatorUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, encounterTypes, formIds, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);
        
        //case missing parameter 
        expectedParam = {
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          locations: locationIds,
          creatorUuid: creatorUuid
        };

        queryParam = etlRestService.getDataEntryStatisticsQueryParam(subType, startDate,
          endDate, locationIds, null, null, providerUuid, creatorUuid);
                
        //assertions
        expect(queryParam).to.deep.equal(expectedParam);


      });

    it('should make an api call to the data entry statistics etl ' +
      'rest endpoint when getDataEntryStatistics is called with ' +
      'a subType, date range, location uuid, and optional parameters', function () {
        var locationIds = 'id1,id2,id3';
        var startDate = '2015-01-01';
        var endDate = '2015-06-01';

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'data-entry-statistics/by-date-by-encounter-type?' +
          'endDate=' + endDate + '&locations=' + locationIds +
          '&startDate=' + startDate).respond({});

        etlRestService.getDataEntryStatistics('by-date-by-encounter-type',
          startDate, endDate, locationIds, undefined, undefined, undefined,
          undefined, function () { }, function () { });
        httpBackend.flush();
      });

    it('should call the onSuccess callback getDataEntryStatistics ' +
      'request successfully returns', function () {
        var locationIds = 'id1,id2,id3';
        var startDate = '2015-01-01';
        var endDate = '2015-06-01';

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'data-entry-statistics/by-date-by-encounter-type?' +
          'endDate=' + endDate + '&locations=' + locationIds +
          '&startDate=' + startDate).respond({});

        etlRestService.getDataEntryStatistics('by-date-by-encounter-type',
          startDate, endDate, locationIds, undefined, undefined, undefined,
          undefined, callbacks.onSuccess, callbacks.onFailure);
        httpBackend.flush();
        
        expect(callbacks.onSuccessCalled).to.equal(true);
        expect(callbacks.onFailedCalled).to.equal(false);
      });

    it('should call the onFailed callback when getDataEntryStatistics ' +
      'request is not successfull', function () {
        var locationIds = 'id1,id2,id3';
        var startDate = '2015-01-01';
        var endDate = '2015-06-01';

        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
          'data-entry-statistics/by-date-by-encounter-type?' +
          'endDate=' + endDate + '&locations=' + locationIds +
          '&startDate=' + startDate).respond(500);

        etlRestService.getDataEntryStatistics('by-date-by-encounter-type',
          startDate, endDate, locationIds, undefined, undefined, undefined,
          undefined, callbacks.onSuccess, callbacks.onFailure);
        httpBackend.flush(); 
        
        expect(callbacks.onSuccessCalled).to.equal(false);
        expect(callbacks.onFailedCalled).to.equal(true);
        expect(callbacks.message).to.exist;
        expect(callbacks.message.trim()).not.to.equal('');
      });
    
   //getPatientsCreatedByPeriod method unit tests
    it('should make an api call to the patient creation statistics etl rest ' +
        'endpoint when getPatientsCreatedByPeriod is called with a ' +
        'start and a end date', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
        
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z',function () { }, function () { });
      httpBackend.flush();
    });
    
    it('should make an api call to the patient creation statistics etl ' +
        'rest endpoint when getPatientsCreatedByPeriod is called with ' +
        'a start date,end date and paging parameters', function () {
      
      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
        
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { }, 0, 10);
      httpBackend.flush();
      
      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
        
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { },
        0, undefined);
      httpBackend.flush();
      
      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z').respond({});
        
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { },
        undefined, 10);
      httpBackend.flush();
    });

     it('should call the onSuccess callback getPatientsCreatedByPeriod ' +
        'request successfully returns', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
      
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getPatientsCreatedByPeriod ' +
        'request is not successfull', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond(500);
        
      etlRestService.getPatientsCreatedByPeriod(
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
        
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });    
    
    //getDetailsOfPatientsCreatedInLocation method unit tests
    it('should make an api call to the Details Of Patients Created In Location etl rest ' +
        'endpoint when getDetailsOfPatientsCreatedInLocation is called with a ' +
        'start and a end date', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
        
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z',function () { }, function () { });
      httpBackend.flush();
    });
    
    it('should make an api call to the Details Of Patients Created In Location etl ' +
        'rest endpoint when getDetailsOfPatientsCreatedInLocation is called with ' +
        'a start date,end date and paging parameters', function () {
      
      //case startIndex and limit are defined
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
        
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { }, 0, 10);
      httpBackend.flush();
      
      //case startIndex defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z&startIndex=0').respond({});
        
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { },
        0, undefined);
      httpBackend.flush();
      
      //case limit defined only
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&limit=10&startDate=2014-08-05T21:00:00.000Z').respond({});
        
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', function () { }, function () { },
        undefined, 10);
      httpBackend.flush();
    });

     it('should call the onSuccess callback getDetailsOfPatientsCreatedInLocation ' +
        'request successfully returns', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond({});
      
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getDetailsOfPatientsCreatedInLocation ' +
        'request is not successfull', function () {
            
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
        'location/passed-uuid/patient/creation/statistics?' +
        'endDate=2015-08-05T21:00:00.000Z&startDate=2014-08-05T21:00:00.000Z').respond(500);
        
      etlRestService.getDetailsOfPatientsCreatedInLocation('passed-uuid',
        '2014-08-05T21:00:00.000Z','2015-08-05T21:00:00.000Z', callbacks.onSuccess, callbacks.onFailure);
        
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });    
    
  });
})();
