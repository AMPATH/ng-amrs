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

    function getHivSummary(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/hiv-summary');
      if(!startIndex)
        startIndex = 0;
        
      if(!limit)
        limit = 20;
        
      var params = {startIndex: startIndex, uuid: patientUuid, limit: limit};
      return resource.get(params).$promise
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
