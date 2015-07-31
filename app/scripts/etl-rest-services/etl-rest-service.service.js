/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.etlRestServices')
    .service('EtlRestService', EtlRestService);

  EtlRestService.$inject = ['EtlRestServicesSettings', '$resource'];

  function EtlRestService(EtlRestServicesSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getHivSummary: getHivSummary
    };
    return serviceDefinition;

    function getResource(path) {
      return $resource(EtlRestServicesSettings.getCurrentRestUrlBase() + path,
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getHivSummary(uuid, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/hiv-summary');
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
        successCallback(response);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }
  }
})();
