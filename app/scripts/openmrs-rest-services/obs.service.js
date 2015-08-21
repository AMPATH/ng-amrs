/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('ObsResService', ObsResService);

  ObsResService.$inject = ['OpenmrsSettings', '$resource'];

  function ObsResService(OpenmrsSettings, $resource) {
    var service = {
      getObsByUuid: getObsByUuid,
      voidObs: voidEncounter
    }

    return service;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'obs/:uuid?v=full',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getObsByUuid(params, successCallback, errorCallback) {
      var obsResource = getResource()

      return obsResource.get({ uuid: params.uuid }).$promise
        .then(function (data) {
        successCallback(data);
      })
        .catch(function (error) {
        errorCallback('Error processing request', error);
        console.error(error);
      });
    }

    function voidObs(params, successCallback, errorCallback) {

      var obsResource = getResource();
      obsResource.delete({uuid: params.uuid},
        function (data) {
          if (successCallback) {successCallback(data); }
          else return data;
        });
    }


  }
})();
