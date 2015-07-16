/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
    .module('OpenmrsRestServices')
    .service('PatientResService', PatientResService);

  PatientResService.$inject = ['OpenmrsSettings', '$resource', 'PatientModel'];

  function PatientResService(OpenmrsSettings, $resource, PatientModel) {
    var service;
    var currentSession;
    service = {
      getPatientByUuid: getPatientByUuid,
      getPatientQuery: getPatientQuery
    };
    return service;
    function getResource() {
          var v = 'custom:(uuid,identifiers:ref,person:(uuid,gender,birthdate,dead,age,deathDate,preferredName:(givenName,middleName,familyName),';
          v = v  + 'attributes:(uuid,value,attributeType:ref)))';
          var r = $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'patient/:uuid',
                {uuid: '@uuid', v: v},
                {query: {method: 'GET', isArray: false}});
          return r;

        }

    function getPatientByUuid(params, callback) {
        var PatientRes = getResource();

        PatientRes.get(params, function(data) {
          //console.log(data);
          var p = {uuid:data.uuid,
            identifiers:data.identifiers,
            person:data.person};
          console.log(p);
          var d = new PatientModel.patient(p);
          callback(d);
        });
      }

    function getPatientQuery(params, callback) {
      var PatientRes = getResource();
      var patients = [];
      //console.log(params);
      PatientRes.query(params, false, function(data) {
        //console.log(data.results);
        angular.forEach(data.results, function(value, key) {
          //console.log(value);
          var myperson = value.person;
          var p = new PatientModel.patient(value);
          //console.log('Attedmted'+patientUuid);
          //console.log("New UUUID"+value.person.uuid+"d"+value.person.display);
          patients.push(p);
      });

        callback(patients);
      });
    }
  }
})();
