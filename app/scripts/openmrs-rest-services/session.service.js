/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
        .module('app.openmrsRestServices')
        .service('SessionResService', SessionResService);

  SessionResService.$inject = ['OpenmrsSettings', '$resource'];

  function SessionResService(OpenmrsSettings, $resource) {
        var serviceDefinition;
        var currentSession;
        serviceDefinition = {
          getResource:getResource,
          getSession:getSession,
          currentSession:currentSession,
          deleteSession:deleteSession
        };
        return serviceDefinition;

        function getResource() {
          return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'session');
        }

        function getSession(successCallback, failedCallback) {
          var resource = getResource();
          return resource.get({}).$promise
          .then(function(response) {
            serviceDefinition.currentSession = response.sessionId;
            successCallback(response);
          })
          .catch(function(error) {
            serviceDefinition.currentSession = null;
            failedCallback('Error processing request', error);
            console.error(error);
          });
        }

        function deleteSession(callback) {
          var resource = getResource();
          return resource.delete({}).$promise
          .then(function(response) {
            callback(response);
          })
          .catch(function(error) {
            callback(error);
            console.error(error);
          });
        }
      }
})();
