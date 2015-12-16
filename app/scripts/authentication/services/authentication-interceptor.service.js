/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
    .module('app.authentication')
    .factory('authenticationErrorInterceptor', AuthenticationErrorInterceptor);
  AuthenticationErrorInterceptor.$inject = ['$q', '$injector'];
  var retries = 0,
         waitBetweenErrors = 500,
         maxRetries = 1;
  function AuthenticationErrorInterceptor($q, $injector) {
    function onResponseError(httpConfig) {
      var $http = $injector.get('$http');
      setTimeout(function() {
        return $http(httpConfig);
      }, waitBetweenErrors);
    }

    return {
      responseError: function(response) {
        if (response.status >= 403 && retries < maxRetries) {
          retries++;
          return onResponseError(response.config);
        }

        retries = 0;
        return $q.reject(response);
      },
    };
  }

})();
