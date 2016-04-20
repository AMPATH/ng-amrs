(function() {
    'use strict';

    angular
        .module('app.clinicDashboard', [
            'app.openmrsRestServices',
            'app.etlRestServices',
            'models',
            'ui.bootstrap',
            'darthwade.dwLoading',
            'gridshore.c3js.chart',
            'kendo.directives'
        ]);
})();
