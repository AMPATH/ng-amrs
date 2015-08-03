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
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'provider/:uuid?v=full',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getPersonResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'person/:uuid?v=default',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function searchResource() {
        return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'provider?q=:search&v=default',
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
        successCallback(response);
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
          if(response.results)
          {
            var provList=[];
            //console.log('testing provider result output');
            _.each(response.results,function(data){

              var provider = {
                uuid:data.uuid,
                display:data.display,
                personUuid:data.person.uuid
                };
                //console.log(provider);
                provList.push(provider);
            })
            successCallback(provList);
          }
          else {
            successCallback(response);
          }

      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }
  }
})();
