/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
        .module('app.openmrsRestServices')
        .factory('PatientService', PatientService);

  PatientService.$inject = ['$resource', 'OpenmrsSettings'];

  function PatientService($resource, settings) {
    var service = {
      getPatientByName: getPatientByName,
      getPatientByUuid: getPatientByUuid,
      getPatientQuery: getPatientQuery
    };

    return service;

    function getResource() {
          var v = 'custom:(uuid,identifiers:ref,person:(uuid,gender,birthdate,age,dead,deathDate,preferredName:(givenName,middleName,familyName),';
          v = v  + 'attributes:(uuid,value,attributeType:ref)))';
          var r = $resource(settings.getCurrentRestUrlBase() + 'patient/:uuid',
                {uuid: '@uuid', v: v},
                {query: {method: 'GET', isArray: false}});
          return r;

        }

    function getPatientByUuid(params, callback) {
      var PatientRes = getResource();

      PatientRes.get(params,
        function (data) {
          //var d = new Patient(data);
          callback(data);
        }
      );
    }

    function getPatientByName(name, successCallback, failedCallback) {
          var resource = getResource();
          return resource.get({uuid:name}).$promise
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

    function getPatientQuery(params, callback) {
      var PatientRes = getResource();
      PatientRes.query(params, false, function(data) {callback(data);});
    }
  }
})();
