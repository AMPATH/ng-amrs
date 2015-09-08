/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('app.etlRestServices')
    .service('EtlRestServicesSettings', EtlRestServicesSettings);

  EtlRestServicesSettings.$inject = ['$cookieStore'];

  function EtlRestServicesSettings($cookieStore) {
    var serviceDefinition;
    var restUrlBaseList = ['https://etl.ampath.or.ke:8002/etl/', 'https://test1.ampath.or.ke:8002/etl/'];
    var restUrlBase = restUrlBaseList[1];

    initialize();
    serviceDefinition = {
      reInitialize: initialize,
      getCurrentRestUrlBase: getCurrentRestUrlBase,
      setCurrentRestUrlBase: setCurrentRestUrlBase,
      restUrlBase: restUrlBase,
      addUrlToList: addUrlToList,
      getUrlBaseList: getUrlBaseList,
      hasCoockiePersistedCurrentUrlBase: hasCoockiePersistedCurrentUrlBase
    };
    return serviceDefinition;

    function initialize() {

      var lastSetUrl = $cookieStore.get('restEtlUrlBase');

      if (lastSetUrl)
        restUrlBase = lastSetUrl;
    }

    function hasCoockiePersistedCurrentUrlBase() {
      var lastSetUrl = $cookieStore.get('restEtlUrlBase');

      if (lastSetUrl)
        return true;

      return false;
    }

    function getCurrentRestUrlBase() {
      return restUrlBase;
    }

    function setCurrentRestUrlBase(url) {
      restUrlBase = url;
      $cookieStore.put('restEtlUrlBase', url);
    }

    function getUrlBaseList() {
      return restUrlBaseList;
    }

    function addUrlToList(url) {
      restUrlBaseList.push(url);
    }
  }
})();
