/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.context')
        .factory('ContextService', ContextService);

  ContextService.$inject = ['SessionResService', 'AuthService', 'PatientService'];

  function ContextService(session, authService, patientService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService
        };

    return service;

    function getSession() {
      return session;
    }

    function getAuthService() {
      return authService;
    }

    function getPatientService() {
      return patientService;
    }
  }
}) ();