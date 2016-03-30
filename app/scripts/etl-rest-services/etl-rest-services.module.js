(function () {
  'use strict';

  angular
    .module('app.etlRestServices', [
      'ngResource',
      'ngCookies',
      'openmrs-ngresource.utils',
      'angular-cache'
    ]).config(['$httpProvider', function ($httpProvider) {
            // enable http caching
           //$httpProvider.defaults.cache = true;
      }]);
})();
