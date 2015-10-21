/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('FormRestService', FormRestService);

  FormRestService.$inject = ['OpenmrsSettings','$resource'];

  function FormRestService(OpenmrsSettings, $resource) {
    var serviceDefinition;

    serviceDefinition = {    
      getFormByUuid: getFormByUuid,      
      findPocForms: findPocForms
      
    };

    return serviceDefinition;   

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'form?q=:q&v=custom:(uuid,name,encounterType,version)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }    
    
    function findPocForms(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'form/:uuid?v=custom:(uuid,name,encounterType,version)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }
    
    function getFormByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    } 
   
  }
})();
