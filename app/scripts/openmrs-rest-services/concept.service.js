/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('ConceptResService', ProviderResService);

  ProviderResService.$inject = ['OpenmrsSettings', '$resource'];

  function ProviderResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getConceptClassResource: getConceptClassResource,
      getSearchResource: getSearchResource,
      getConceptClasses: getConceptClasses,
      getConceptByUuid: getConceptByUuid,
      findConcept: findConcept,
      findConceptByConceptClassesUuid: findConceptByConceptClassesUuid,
      filterResultsByConceptClassesUuid: filterResultsByConceptClassesUuid,
      filterResultsByConceptClassesName:filterResultsByConceptClassesName,
      getConceptAnswers:getConceptAnswers
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept/:uuid?v=custom:(uuid,name,conceptClass)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept?q=:q&v=custom:(uuid,name,conceptClass)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClassResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'conceptclass',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptWithAnswersResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept/:uuid?v=custom:(uuid,name,answers)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClasses(successCallback, failedCallback) {
      var resource = getConceptClassResource();
      return resource.get({ v: 'default' }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getConceptByUuid(uuid, successCallback, failedCallback) {
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

    function getConceptAnswers(uuid, successCallback, failedCallback) {
      var resource = getConceptWithAnswersResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findConcept(searchText, successCallback, failedCallback) {
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

    function findConceptByConceptClassesUuid(searchText, conceptClassesUuidArray, successCallback, failedCallback) {
      var resource = getSearchResource();

      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? filterResultsByConceptClassesUuid(response.results, conceptClassesUuidArray) : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesUuidArray, function (uuid) {
          return result.conceptClass.uuid === uuid;
        });
      });
      return res;
    }

    function filterResultsByConceptClassesName(results, conceptClassesNameArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesNameArray, function (name) {
          return result.conceptClass.name === name;
        });
      });
      return res;
    }

    function filterConceptAnswersByConcept(results, conceptUuid) {
      var res = _.filter(results, function (result) {
        return _.find(conceptUuid, function (name) {
          return result.uuid === name;
        });
      });
      return res;
    }

  }
})();
