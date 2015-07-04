/*
jshint -W098, -W117, -W003, -W026
*/
(function() {
  'use strict';

  // Mocked Service
  angular
  .module('mock.authentication', [])
  .factory('AuthService', AuthService);
  AuthService.$inject = ['$q'];
  function AuthService($q) {
    var service = {
      isAuthenticated: isAuthenticated
    };
    return service;

    function isAuthenticated(user, callback) {
      jasmine.log(user);
      if ((user.username === 'test') && (user.password === 'test'))
      {
        callback(true);
      }
      else {
        callback(false);
      }
    }
  }
})();
