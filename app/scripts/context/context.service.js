/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.context')
        .factory('ContextService', ContextService);

  ContextService.$inject = ['SessionResService', 'AuthService', 'PatientResService', 'UserResService', 'EncounterService'];

  function ContextService(session, authService, PatientResService, UserResService, EncounterService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService,
          getUserService: getUserService,
          getEncounterService: getEncounterService
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
  }
}) ();
