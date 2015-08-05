(function() {
  'use strict';

  angular
        .module('app.openmrsRestServices', [
            'base64',
            'ngResource',
            'models',
            'restangular'
        ])
        .run(RestangularConfig);

  RestangularConfig.$inject = ['Restangular', 'OpenmrsSettings'];

  function RestangularConfig(Restangular, OpenmrsSettings) {  // jshint ignore:line
    // Should of the form /ws/rest/v1 or https://host/ws/rest/v1
    Restangular.setBaseUrl(OpenmrsSettings.getCurrentRestUrlBase());
  }
})();
