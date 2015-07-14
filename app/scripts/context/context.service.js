/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.context')
        .factory('ContextService', ContextService);

  ContextService.$inject = ['SessionResService', 'AuthService', 'PatientResService', 'UserResService'];

  function ContextService(session, authService, PatientResService, UserResService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService,
          getUserService: getUserService
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
  }
}) ();
