(function() {
    'use strict';

    angular
        .module('app.dataAnalytics', [
            'app.openmrsRestServices',
            'app.formentry',
            'app.etlRestServices',
            'models',
            'ui.bootstrap'
        ]);
})();