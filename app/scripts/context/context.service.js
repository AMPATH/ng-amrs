/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.context')
        .factory('ContextService', ContextService);

  ContextService.$inject = ['SessionResService', 'AuthService'];

  function ContextService(session, authService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService
        };

    return service;

    function getSession() {
      return session;
    }

    function getAuthService() {
      return authService;
    }
  }
}) ();
