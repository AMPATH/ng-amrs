(function() {
  'use strict';

  angular
    .module('app.administration', [
      'app.openmrsRestServices',
      'app.etlRestServices',
      'models',
      'ui.bootstrap',
      'darthwade.dwLoading',
      'gridshore.c3js.chart',
      'kendo.directives'
    ]);
})();
