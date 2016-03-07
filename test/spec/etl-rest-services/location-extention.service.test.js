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
      module('app.etlRestServices');
      module('mock.data');
    });

    var mockData;
    var httpBackend;
    var locationService;
    var etlSettingsService;
    var testLocations;
    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      locationService = $injector.get('LocationExtensionService');
      etlSettingsService = $injector.get('EtlRestServicesSettings');
      mockData = $injector.get('mockData');
    }));

    beforeEach(inject(function() {
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
    });

    it('should make an api call to the etl location endpoint when '+
    'getLocationByUuidFromEtl is called with a uuid', function() {
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
