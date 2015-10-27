/*jshint -W003, -W117, -W098, -W026 */
(function() {
'use strict';

	angular
	.module('app.patientsearch')
	.factory('PatientSearchService', PatientSearchService);
	PatientSearchService.$inject = [];
	function PatientSearchService() {
  var patients = [];
  var serviceDefinition;
  var searchString = '';
  serviceDefinition = {
     getPatients: getPatients,
     setPatients: setPatients,
     resetPatients: resetPatients,
     setSearchString: setSearchString,
     getSearchString: getSearchString,
   };
  return serviceDefinition;

  function getPatients() {
    return patients;
  }

  function setPatients(newPatients) {
    patients = newPatients;
  }

  function resetPatients() {
    patients = [];
  }

  function setSearchString(search) {
  searchString = search;
}

  function getSearchString() {
    return searchString;
  }
}

})();
