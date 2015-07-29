(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('EncounterResService', EncounterResService);

  EncounterResService.$inject = ['Restangular'];

  function EncounterResService(Restangular) {
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
      Restangular.one('encounter').get({'patient':patientUuid, 'v':'default'}).then(function(data) {
        if(angular.isDefined(data.results)) data = data.results;
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

      successCallback(data);
    }
  }
})();
