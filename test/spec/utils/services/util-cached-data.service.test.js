/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';
  describe('util-cached data Service unit tests', function() {
    beforeEach(function() {
      module('app.utils');
      module('mock.util-service');
      module('app.openmrsRestServices');
    });

    var cachedDataService;

    beforeEach(inject(function($injector) {
        // mockData = $injector.get('mockData');
        // scope = $rootScope.$new();
        cachedDataService = $injector.get('mockCachedDataService');
      }));

    it('should be able to search from CachedLocations given the location name',
    function() {
        var locations;
        var searchText = 'loc';
        cachedDataService.getCachedLocations(searchText,
          function(locations_) {
            locations = locations_;
          });

        expect(locations).to.be.an('array');
        expect(locations.length).to.equal(3);
      });

    it('should be able to search from CachedLocations given the location description',
    function() {
        var locations;
        var searchText = 'Mock';
        cachedDataService.getCachedLocations(searchText,
          function(locations_) {
            locations = locations_;
          });

        expect(locations).to.be.an('array');
        expect(locations.length).to.equal(3);
      });

    it('should get cached Location given the uuid', function() {
        var uuid = 'uuid_100';
        var location;
        cachedDataService.getCachedLocationByUuid(uuid,
          function(location_) {
          location = location_;
        });

        expect(location).to.be.an('object');
        expect(location.name).to.equal('Location-100');
        expect(location.uuid).to.equal(uuid);
        expect(location.description).to.equal('Mock Location 2');
      });

  });
})();
