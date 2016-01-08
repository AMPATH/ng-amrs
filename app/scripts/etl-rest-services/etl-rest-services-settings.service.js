/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('app.etlRestServices')
    .service('EtlRestServicesSettings', EtlRestServicesSettings);

  EtlRestServicesSettings.$inject = ['$cookies'];

  function EtlRestServicesSettings($cookies) {
    var serviceDefinition;
    var restUrlBaseList = [
      'https://etl.ampath.or.ke:8002/etl/',
      'https://test1.ampath.or.ke:8002/etl/',
      'https://test1.ampath.or.ke:8003/etl/',
      'https://amrsreporting.ampath.or.ke:8002/etl/',
      'https://amrsreporting.ampath.or.ke:8003/etl/'
    ];
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

      var lastSetUrl = $cookies.get('restEtlUrlBase');

      if (lastSetUrl) {
        restUrlBase = lastSetUrl;
      }
    }

    function hasCoockiePersistedCurrentUrlBase() {
      var lastSetUrl = $cookies.get('restEtlUrlBase');

      if (lastSetUrl) {
        return true;
      }

      return false;
    }

    function getCurrentRestUrlBase() {
      return restUrlBase;
    }

    function setCurrentRestUrlBase(url) {
      restUrlBase = url;
      var d = new Date();
      d.setFullYear(2050);//expires in 2050
      $cookies.put('restEtlUrlBase', url, { 'expires': d });
    }

    function getUrlBaseList() {
      return restUrlBaseList;
    }

    function addUrlToList(url) {
      restUrlBaseList.push(url);
    }
  }
})();
