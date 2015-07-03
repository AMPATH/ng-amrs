//jshint -W003
//jshint -W098
(function() {
    'use strict';

    angular
        .module('OpenMRS_RestServices')
        .service('SessionResService', Service);

    Service.$inject = ['OpenMRS_Settings','$resource'];

    function Service(OpenmrsSettings, $resource) {
        var serviceDefinition;
        var currentSession;
        serviceDefinition ={
          getResource:getResource,
          getSession:getSession,
          currentSession:currentSession,
          logout:logout
        };
        return serviceDefinition;

        function getResource(){
          return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'session');
        }

        function getSession(successCallback, failedCallback) {
          var resource = getResource();
          return resource.get({}).$promise
          .then(function(response){
            serviceDefinition.currentSession = response.sessionId;
            successCallback(response);
          })
          .catch(function(error){
            serviceDefinition.currentSession = null;
            failedCallback('Error processing request',error);
            console.error(error);
          });
        }
        function logout(callback) {
          var resource = getResource();
          return resource.delete({}).$promise
          .then(function(response){
            callback(response);
          })
          .catch(function(error){
            callback(error);
            console.error(error);
          });
        }
      }
})();
