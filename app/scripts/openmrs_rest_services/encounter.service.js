(function() {
  'use strict';

  angular
    .module('OpenmrsRestServices')
          .factory('EncounterService', EncounterService);

  EncounterService.$inject = ['Restangular'];

  function EncounterService(Restangular) {
    var service = {
      getEncounterByUuid: getEncounterByUuid,
      saveEncounter: saveEncounter,
      getPatientEncounters: getPatientEncounters
    }

    return service;

    function getEncounterByUuid(uuid, successCallback, errorCallback) {
      Restangular.one('encounter', uuid).get().then(function(data) {
        _successCallbackHandler(successCallback, data);
      },
      function(error) {
        console.log('An error occured while attempting to fetch encounter ' +
                    'with uuid ' + uuid);
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function saveEncounter(encounter, successCallback, errorCallback) {
      Restangular.service('encounter').post(encounter).then(function(success) {
        console.log('Encounter saved successfully');
        if (typeof successCallback === 'function') successCallback(success);
      },
      function(error) {
        console.log('Error saving encounter');
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function getPatientEncounters(patientUuid, successCallback, errorCallback) {
      Restangular.one('encounter').get({'patient':patientUuid}).then(function(data) {
        _successCallbackHandler(successCallback, data);
      },
      function(error) {
        console.log('An error occured while attempting to fetch encounter ' +
                    'with uuid ' + uuid);
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function _successCallbackHandler(successCallback, data) {
      if (typeof successCallback !== 'function') {
        console.log('Error: You need a callback function to process' +
        ' results');
        return;
      }
      if(data.results) {
        // Just return the array (i.e unwrap the object returned by openmrs)
        successCallback(data.results);
      } else {
        successCallback(data);
      }
    }
  }
})();
