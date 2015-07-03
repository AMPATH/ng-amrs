/*jshint -W003 */
/*jshint -W026 */
(function() {
    'use strict';

    angular
        .module('OpenMRS_RestServices')
        .service('OpenMRS_Settings', Service);

    Service.$inject = [];

    function Service() {
        var serviceDefinition;
        var restUrlBaseList = ['https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/'];
        var restUrlBase = restUrlBaseList[0];

        serviceDefinition = {
          getCurrentRestUrlBase:getCurrentRestUrlBase,
          setCurrentRestUrlBase:setCurrentRestUrlBase,
          restUrlBase:restUrlBase
        };
        return serviceDefinition;

        function getCurrentRestUrlBase() {
          return restUrlBase;
        }

        function setCurrentRestUrlBase(url) {
          restUrlBase = url;
        }

    }
})();
