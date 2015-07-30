/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('LocationResService', LocationResService);

  LocationResService.$inject = ['OpenmrsSettings', '$resource'];

  function LocationResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      searchResource: searchResource,
      getLocationByUuid: getLocationByUuid,
      findLocation: findLocation
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'location/:uuid',
        { uuid: '@uuid' },
        { query: { method: "GET", isArray: false } });
    }

    function searchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'location?q=:search&v=default',
        { search: '@search' },
        { query: { method: "GET", isArray: false } });
    }

    function getLocationByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
        successCallback(response);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }

    function findLocation(searchText, successCallback, failedCallback) {
      var resource = searchResource();
      return resource.get({ search: searchText }).$promise
        .then(function (response) {
        successCallback(response.results? response.results: response);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }
  }
})();
