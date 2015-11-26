(function() {
    'use strict';

    angular
        .module('app.admin', [
            'app.openmrsRestServices',
            'app.formentry',
            'app.etlRestServices',
            'models',
            'ui.bootstrap',
            'app.dataAnalytics',
            'bsTable'
        ]);
})();
