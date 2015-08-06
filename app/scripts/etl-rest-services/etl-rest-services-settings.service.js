/*jshint -W003, -W026, -W117, -W098 */
(function() {
  'use strict';

  angular
        .module('app.etlRestServices')
        .service('EtlRestServicesSettings', EtlRestServicesSettings);

  EtlRestServicesSettings.$inject = [];

  function EtlRestServicesSettings() {
    var serviceDefinition;
    var restUrlBaseList = ['https://etl.ampath.or.ke:8002/etl/', 'https://test1.ampath.or.ke:8002/etl/'];
    var restUrlBase = restUrlBaseList[1];

    serviceDefinition = {
          getCurrentRestUrlBase: getCurrentRestUrlBase,
          setCurrentRestUrlBase: setCurrentRestUrlBase,
          restUrlBase: restUrlBase
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
