(function() {
  angular.module('OpenmrsRestServices')
          .service('EncounterService', EncounterService);

  EncounterService.$inject = ['Restangular'];

  function EncounterService(Restangular) {
    var _service = this;
    _service = getEncounterByUuid;

    function getEncounterByUuid(uuid, callback) {
      Restangular.one('encounter',uuid).get().then(function(data) {
        if (typeof callback !== 'function') {
          console.log('Error: You need a callback function to process' +
          ' results');
          return;
        }

        callback(data);
      },
      function(error) {
        console.log('An error occured while attempting to fetch encounter ' +
                    'with uuid ' + uuid);
      });
    }
  }
})();
