(function() {
    'use strict';

    angular
        .module('app.clinicDashboard', [
            'app.openmrsRestServices',
            'app.etlRestServices',
            'models',
            'ui.bootstrap'
        ]);
})();
