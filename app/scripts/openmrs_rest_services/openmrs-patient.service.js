/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
    .module('OpenmrsRestServices')
    .service('PatientResService', PatientResService);

  PatientResService.$inject = ['OpenmrsSettings','SessionResService', '$resource', 'PatientModel'];

  function PatientResService(OpenmrsSettings,session, $resource, PatientModel) {
    var serviceDefinition;
    var currentSession;
    serviceDefinition = {
      getPatient:getPatient
    };
    return serviceDefinition;

    function getPatientResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'patient?q=:name&v=custom:(uuid,person)',
        {name: '@patientUuid'},
        {query: {method: 'GET',
          isArray: false}});
    }

    function getPatient(patientUuid) {
      console.log("Entered UUUID"+patientUuid);
      var resource = getPatientResource();
      var patients=[];
       resource.get({name:patientUuid}).$promise
        .then(function(response) {
          //success call
          angular.forEach(response.results, function(value, key) {
           var myperson=value.person;
            var p=new PatientModel.patient(value.person);
            console.log('Attedmted'+patientUuid);
            console.log("New UUUID"+value.person.uuid+"d"+value.person.display);
                patients.push(p);
          });

        })
        .catch(function(error) {
          //error call
           alert('There was error');
        });
      return patients;//.length>0?patients:null;
    }


  }
})();
