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

  describe('Open MRS Location Service Unit Tests', function() {
    beforeEach(function() {
      module('app.openmrsRestServices');
      module('app.etlRestServices');
      module('mock.data');
    });

    var callbacks;
    var mockData;
    var httpBackend;
    var locationService;
    var settingsService;
    var etlSettingsService;
    var testLocations;
    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      locationService = $injector.get('LocationResService');
      settingsService = $injector.get('OpenmrsSettings');
      etlSettingsService = $injector.get('EtlRestServicesSettings');
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

      testLocations = [
        {
          uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          name: 'Location-1',
          display: 'Location-1'
        },
        {
          uuid: '00b47ef5-a29b-40a2-a7f4-6851df8d6532',
          name: 'Location-100',
          display: 'Location-100'
        },
        {
          uuid: '9fcf21c-8a00-44ba-9555-dde4dd877c4a',
          name: 'Location-101',
          display: 'Location-101'
        }
      ];

    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();

      // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
    });

    it('should have Location service defined', function() {
      expect(locationService).to.exist;
    });

    it('should have EtlSettings Service defined', function() {
      expect(etlSettingsService).to.exist;
    });

    it('should make an api call to the location resource' +
    'when getLocationByUuid is called with a uuid', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location/passed-uuid').respond({});
      locationService.getLocationByUuid('passed-uuid', function() { }, function() { });

      httpBackend.flush();
    });

    it('should make an api call to the location resource when findLocation' +
    'is called with a search text', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?q=passed-text&v=default').respond({});
      locationService.findLocation('passed-text', function() { }, function() { });

      httpBackend.flush();
    });

    it('should make an api call to the location resource when getLocations is' +
    'called with refreshCache param being true', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?v=default').respond({});
      locationService.getLocations(function() { }, function() { }, true);

      httpBackend.flush();
    });

    it('should make an api call to the location resource when getLocations is' +
    'called with refreshCache param being false and there are no cachedLocations',
    function() {
      locationService.cachedLocations = []; //clear cached locations

      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?v=default').respond({});
      locationService.getLocations(function() { }, function() { }, false);

      httpBackend.flush();
    });

    it('should not make an api call to the location resource when getLocations' +
    'is called with refreshCache param being false and there are cachedLocations',
    function() {
      locationService.cachedLocations = testLocations; //set cachedLocations
      var returnedLocations = [];
      locationService.getLocations(function(locations) {returnedLocations = locations;}, function() { }, false);

      expect(returnedLocations).to.deep.equal(testLocations);
    });

    it('should set the cachedLocations when getLocations is called with' +
    'refreshCache param being true', function() {
      locationService.cachedLocations = []; //reset cachedLocations

      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?v=default').respond({ results: testLocations });
      locationService.getLocations(function() { }, function() { }, true);

      httpBackend.flush();
      expect(locationService.cachedLocations).to.deep.equal(testLocations);
    });

    it('should call the onSuccess callback getLocationByUuid request' +
    'successfully returns', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location/passed-uuid').respond({});
      locationService.getLocationByUuid('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getLocationByUuid request' +
    'is not successfull', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location/passed-uuid').respond(500);
      locationService.getLocationByUuid('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should call the onSuccess callback findLocation request' +
    'successfully returns', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?q=passed-text&v=default').respond({});
      locationService.findLocation('passed-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findLocation request is' +
    'not successfull', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?q=passed-text&v=default').respond(500);
      locationService.findLocation('passed-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should call the onSuccess callback getLocations request' +
    'successfully returns', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?v=default').respond({});
      locationService.getLocations(callbacks.onSuccess, callbacks.onFailure, true);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getLocations' +
    'request is not successfull', function() {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'location?v=default').respond(500);
      locationService.getLocations(callbacks.onSuccess, callbacks.onFailure, true);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the  is called with a uuid', function() {
      httpBackend.expectGET(etlSettingsService.getCurrentRestUrlBase() +
      'custom_data/location/uuid/passed-uuid').respond(mockData.getMockEtlLocations());
      locationService.getLocationByUuidFromEtl('passed-uuid', function(data) {
        expect(data.result[0].uuid).to.equal('passed-uuid');
        expect(data.result[0].locationId).to.equal(1);
      });

      httpBackend.flush();
    });

  });
})();
