/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
        .module('authentication')
        .factory('AuthService', AuthService);

  AuthService.$inject = ['$resource'];

  function AuthService($resource) {
    var baseUrl = 'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/'; //this should be configurable moving forward but we'll use it as it is for now
    var service = {
      getSession: getSession,
      isAuthenticated: isAuthenticated
    };

    return service;

    function getSessionResource() {
      return $resource(baseUrl + 'session', {}, {query:{method: 'GET', isArray:false}});
    }

    function getSession() {
      //to do stuff

    }

    function isAuthenticated(CurrentUser) {
      //authenticate user
    }
  }
})();
