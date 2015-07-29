/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.openmrsRestServices')
        .factory('OpenmrsRestService', OpenmrsRestService);

<<<<<<< HEAD
  OpenmrsRestService.$inject = ['SessionResService', 'AuthService', 'PatientResService', 'UserResService', 'EncounterService','LocationResService'];

  function OpenmrsRestService(session, authService, PatientResService, UserResService, EncounterService, LocationResService) {
=======
  OpenmrsRestService.$inject = ['SessionResService', 'AuthService', 'PatientResService', 'UserResService', 'EncounterResService'];

  function OpenmrsRestService(session, authService, PatientResService, UserResService, EncounterResService) {
>>>>>>> Cleaning-up: Renaming files and service to agreed conventions. for example, using dash for directories and files
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService,
          getUserService: getUserService,
<<<<<<< HEAD
          getEncounterService: getEncounterService,
          getLocationService: getLocationService
=======
          getEncounterResService: getEncounterService
>>>>>>> Cleaning-up: Renaming files and service to agreed conventions. for example, using dash for directories and files
        };

    return service;

    function getSession() {
      return session;
    }

    function getAuthService() {
      return authService;
    }

    function getPatientService() {
      return PatientResService;
    }

    function getUserService() {
      return UserResService;
    }

    function getEncounterService() {
      return EncounterResService;
    }
    
     function getLocationService() {
      return LocationResService;
    }
  }
}) ();
