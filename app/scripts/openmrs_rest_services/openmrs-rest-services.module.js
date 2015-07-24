(function() {
  'use strict';

  angular
        .module('OpenmrsRestServices', [
            'base64',
            'ngResource',
            'models',
            'restangular'
        ])
        .run(RestangularConfig);

  RestangularConfig.$inject = ['Restangular', 'OpenmrsSettings'];

  function RestangularConfig(Restangular, OpenmrsSettings) {
    //Should of the form /ws/rest/v1 or https://host/ws/rest/v1
    Restangular.setBaseUrl(OpenmrsSettings.getCurrentRestUrlBase());
  }
})();
