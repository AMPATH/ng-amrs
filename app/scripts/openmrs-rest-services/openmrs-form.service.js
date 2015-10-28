/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('FormResService', FormResService);

  FormResService.$inject = ['OpenmrsSettings','$resource'];

  function FormResService(OpenmrsSettings, $resource) {
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
        .then(function(response) {
          var wrapped = wrapForms(response.results ? response.results : response);
          // successCallback(response.results ? response.results : response);
          successCallback(wrapped);
        })
        .catch(function(error) {
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
        .then(function(response) {
          var _form = response;
          var form = {
            uuid:_form.uuid,
            name: _form.name,
            encounterTypeUuid: _form.encounterType.uuid,
            encounterTypeName: _form.encounterType.display,
            version: _form.version
          };
          successCallback(form);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function wrapForms(forms) {
      var wrappedObjects = [];
      _.each(forms, function(_form) {
        var form = {
          uuid:_form.uuid,
          name: _form.name,
          encounterTypeUuid: _form.encounterType.uuid,
          encounterTypeName: _form.encounterType.display,
          version: _form.version
        };
        wrappedObjects.push(form);
      });

      return wrappedObjects;
    }

  }
})();
