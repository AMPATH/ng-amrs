(function() {
  angular.module('OpenmrsRestServices')
          .service('EncounterService', EncounterService);

  EncounterService.$inject = ['Restangular'];

  function EncounterService(Restangular) {
    var _service = this;
    _service = getEncounterByUuid;
    _service = saveEncounter;

    function getEncounterByUuid(uuid, successCallback, errorCallback) {
      Restangular.one('encounter', uuid).get().then(function(data) {
        if (typeof successCallback !== 'function') {
          console.log('Error: You need a callback function to process' +
          ' results');
          return;
        }

        successCallback(data);
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
        console.log('Sorry buddy, an error occured while saving encounter');
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }
  }
})();
