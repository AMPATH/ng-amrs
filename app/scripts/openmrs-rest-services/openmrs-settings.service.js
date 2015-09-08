/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('OpenmrsSettings', OpenmrsSettings);

  OpenmrsSettings.$inject = ['$cookieStore'];

  function OpenmrsSettings($cookieStore) {
    var serviceDefinition;
    var restUrlBaseList = ['https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/', 'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/', 'http://localhost:8080/openmrs/ws/rest/v1/'];
    var restUrlBase = restUrlBaseList[0];
    
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
    
    function initialize(){
      
      var lastSetUrl = $cookieStore.get('restUrlBase');
      
      if(lastSetUrl) 
        restUrlBase = lastSetUrl;
    }
    
    function hasCoockiePersistedCurrentUrlBase(){
      var lastSetUrl = $cookieStore.get('restUrlBase');
      
      if(lastSetUrl)
        return true;
        
      return false;
    }

    function getCurrentRestUrlBase() {
      return restUrlBase;
    }

    function setCurrentRestUrlBase(url) {
      restUrlBase = url;
      $cookieStore.put('restUrlBase',url);
    }

    function getUrlBaseList() {
      return restUrlBaseList;
    }

    function addUrlToList(url) {
      restUrlBaseList.push(url);
    }
  }
})();
