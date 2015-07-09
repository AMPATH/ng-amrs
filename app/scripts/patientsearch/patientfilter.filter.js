/*
jshint -W026, -W003
*/
(function() {
  'use strict';

  angular
        .module('app.patientsearch')
        .filter('startFrom', startFrom);

  function startFrom() {
      return startFromFilter;

      function startFromFilter(input, start) {
        if (input) {
          start = + start;
          return input.slice(start);
        }

        return [];
      }
    }
})();
