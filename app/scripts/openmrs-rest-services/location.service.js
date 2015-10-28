/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('LocationResService', LocationResService);

  LocationResService.$inject = ['OpenmrsSettings','EtlRestServicesSettings', '$resource'];

  function LocationResService(OpenmrsSettings, EtlRestServicesSettings, $resource) {
    var serviceDefinition;

    var cachedLocations = [];

    serviceDefinition = {
      initialize:initialize,
      getResource: getResource,
      searchResource: searchResource,
      getListResource: getListResource,
      getLocations: getLocations,
      getLocationByUuid: getLocationByUuid,
      getLocationByUuidFromEtl:getLocationByUuidFromEtl,
      findLocation: findLocation,
      cachedLocations: cachedLocations
    };

    return serviceDefinition;

    function initialize() {
      getLocations(function() {}, function() {});
    }

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location/:uuid',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getResourceFromEtl() {
      return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim() + 'custom_data/location/uuid/:uuid',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getListResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location?v=default',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function searchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location?q=:search&v=default',
        { search: '@search' },
        { query: { method: 'GET', isArray: false } });
    }

    function getLocationByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function(response) {
          successCallback(response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getLocationByUuidFromEtl(uuid, successCallback, failedCallback) {
      var resource = getResourceFromEtl();
      return resource.get({ uuid: uuid }).$promise
        .then(function(response) {
          successCallback(response);
        })
        .catch(function(error) {
          alert(JSON.stringify(error));
          console.error(error);
        });
    }

    function findLocation(searchText, successCallback, failedCallback) {
      var resource = searchResource();
      return resource.get({ search: searchText }).$promise
        .then(function(response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getLocations(successCallback, failedCallback, refreshCache) {
      var resource = getListResource();
      //console.log(serviceDefinition.cachedLocations);
      if (refreshCache === false && serviceDefinition.cachedLocations.length !== 0) {
        successCallback(serviceDefinition.cachedLocations);
        return { results: serviceDefinition.cachedLocations };
      }

      return resource.get().$promise
        .then(function(response) {
          serviceDefinition.cachedLocations = response.results ? response.results : response;
          successCallback(response.results ? response.results : response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }
  }
})();
