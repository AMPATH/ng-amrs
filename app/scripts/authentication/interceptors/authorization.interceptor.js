(function () {
    'use strict';

    angular
        .module('app.authentication')
        .factory('AuthorizationInterceptor', AuthorizationInterceptor);

    AuthorizationInterceptor.$inject = ['$log', '$rootScope','$q'];
    function AuthorizationInterceptor($log, $rootScope, $q) {
        var interceptor = {
            responseError: responseError
        };

        return interceptor;

        function responseError(config) {

            if (config.status === 403) {
                console.error('Authorization Error!', config.config.url);
                var errorDetails=config.data.message||'';
                var message = 'You require certain privileges to'+
                ' access this feature without errors. ' +errorDetails+
                  '. Please contact IT support if you think this is an error';

                $rootScope.$broadcast('Unauthorized', message);
            }

            return $q.reject(config);
        }
    }
})();
