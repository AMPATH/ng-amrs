/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('ProviderResService', ProviderResService);

  ProviderResService.$inject = ['OpenmrsSettings', '$resource'];

  function ProviderResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      searchResource: searchResource,
      getProviderByUuid: getProviderByUuid,
      getProviderByPersonUuid: getProviderByPersonUuid,
      findProvider: findProvider
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'provider/:uuid?v=full',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getPersonResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function searchResource() {
        return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'provider?q=:search&v=default',
        { search: '@search' },
        { query: { method: 'GET', isArray: false } });
    }

    function getProviderByUuid(uuid, successCallback, failedCallback) {
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

    function getProviderByPersonUuid(uuid, successCallback, failedCallback) {
      var resource = getPersonResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
        var provider = {person:response, display:response.display };
        successCallback(provider);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }

    function findProvider(searchText, successCallback, failedCallback) {
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
