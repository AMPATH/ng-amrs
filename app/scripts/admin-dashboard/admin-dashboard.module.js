(function() {
    'use strict';

    angular
        .module('app.adminDashboard', [
            'app.openmrsRestServices',
            'app.etlRestServices',
            'models',
            'ui.bootstrap'
        ]);
})();
