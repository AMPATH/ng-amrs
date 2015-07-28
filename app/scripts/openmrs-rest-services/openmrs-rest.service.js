/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.openmrsRestServices')
        .factory('OpenmrsRestService', OpenmrsRestService);

  OpenmrsRestService.$inject = ['SessionResService', 'AuthService', 'PatientResService', 'UserResService', 'EncounterService','LocationResService'];

  function OpenmrsRestService(session, authService, PatientResService, UserResService, EncounterService, LocationResService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService,
          getUserService: getUserService,
          getEncounterService: getEncounterService,
          getLocationService: getLocationService
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
      return EncounterService;
    }
    
     function getLocationService() {
      return LocationResService;
    }
  }
}) ();
