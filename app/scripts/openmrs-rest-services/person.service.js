/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .service('PersonRestService', PersonRestService);

  PersonRestService.$inject = ['OpenmrsSettings', '$resource'];

  function PersonRestService(OpenmrsSettings, $resource) {
    var service = {
      getPersonResource: getPersonResource,
      updatePerson: updatePerson
    };

    return service;

    function getPersonResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid',
        { uuid: '@uuid'}
    );}

    function updatePerson(person,payload, successCallback, errorCallback) {
      var personUuid= person.uuid();
      console.log('person payload in service',payload);
      var resource = getPersonResource();
      resource.save({ uuid: personUuid }, payload).$promise.then(function(success) {
        console.log('person updated successfully')
        if (typeof successCallback === 'function') successCallback(success);
      },
      function(error) {
        console.log('Error updating person');
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }
  }
})();
