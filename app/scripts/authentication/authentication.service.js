/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
        .module('authentication')
        .factory('AuthService', AuthService);

  AuthService.$inject = ['$base64', '$http', 'SessionResService', '$location', 'SessionModel'];

  function AuthService(base64, $http, session, $location, SessionModel) {
    var service = {
      isAuthenticated: isAuthenticated,
      setCredentials: setCredentials,
      clearCredentials: clearCredentials,
      authenticated: false
    };

    return service;

    function isAuthenticated(CurrentUser, callback) {
      //authenticate user
      setCredentials(CurrentUser);
      session.getSession(function(data) {
        //console.log(data);
        var session = new SessionModel.session(data.sessionId,data.authenticated);
        service.authenticated = session.isAuthenticated();
        if (service.authenticated)
        {
          $location.path('/'); //go to the home page if user is authenticated
        }

        callback(data.authenticated); //return authentication status (true/false)

        //console.log(service.authenticated);
      },

      function(error) {
        console.log(error);
        callback(error);
      });

    }

    function setCredentials(CurrentUser) {
      //set user credentials
      //console.log('set credentials base64 log');
      //console.log(base64.encode(CurrentUser.username + ':' + CurrentUser.password));
      $http.defaults.headers.common.Authorization = 'Basic ' + base64.encode(CurrentUser.username + ':' + CurrentUser.password);

    }

    function clearCredentials() {
      //clear user credentials
      $http.defaults.headers.common.Authorization = 'Basic';
    }

  }
})();
