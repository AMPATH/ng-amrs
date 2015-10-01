/*
jshint -W098, -W117, -W003, -W026
*/
(function() {
  'use strict';
  // Mocked Service
  angular
  .module('mock.util-service', ['mock.data'])
  .factory('mockCachedDataService', mockCachedDataService);
  mockCachedDataService.$inject = ['mockData'];
  function mockCachedDataService(mockData) {
    var service = {
      getCachedLocations: getCachedLocations,
      getCachedLocationByUuid:getCachedLocationByUuid
    };
    return service;

    function getCachedLocations(searchText, callback) {
      var cachedLocations = mockData.getMockLocations();
      var results = _.filter(cachedLocations, function(l){
        return (_.contains(l.name.toLowerCase(), searchText.toLowerCase()) ||
                _.contains(l.description.toLowerCase(), searchText.toLowerCase()));
      });
      callback(results);
    }

    function getCachedLocationByUuid(uuid, callback) {
      var cachedLocations = mockData.getMockLocations();
      var results = _.find(cachedLocations, function(l){
        return (l.uuid === uuid);
      });
      callback(results);
    }
  }
})();
