/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('IdentifierResService',IdentifierResService);

  IdentifierResService.$inject = ['OpenmrsSettings', '$resource'];

  function IdentifierResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getPatientIdentifiers: getPatientIdentifiers
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'patient/:uuid/identifier',
        {q: '@q'},
        {query: {method: 'GET', isArray: false}});
    }

    function getPatientIdentifiers(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({uuid: uuid}).$promise
        .then(function (response) {
          console.log('This is Identifier Object', response);
          successCallback(response);

        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }
  }
})();

