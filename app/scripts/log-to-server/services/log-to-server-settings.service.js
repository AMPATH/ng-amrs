/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('app.logToServer')
    .service('LogServerSettings', LogServerSettings);

  LogServerSettings.$inject = ['$cookies'];

  function LogServerSettings($cookies) {
    var serviceDefinition;
    var restUrlBaseList = [
      'https://logs.ampath.or.ke:9000/javascript-errors/',
      'https://localhost:9000/javascript-errors/',
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
      hasCoockiePersistedCurrentUrlBase: hasCoockiePersistedCurrentUrlBase,
    };
    return serviceDefinition;

    function initialize() {

      var lastSetUrl = $cookies.get('restLogUrlBase');

      if (lastSetUrl) {
        restUrlBase = lastSetUrl;
      }
    }

    function hasCoockiePersistedCurrentUrlBase() {
      var lastSetUrl = $cookies.get('restLogUrlBase');

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
      $cookies.put('restLogUrlBase', url, { 'expires': d });
    }

    function getUrlBaseList() {
      return restUrlBaseList;
    }

    function addUrlToList(url) {
      restUrlBaseList.push(url);
    }
  }
})();
