(function() {
    'use strict';

    angular
        .module('app.patientdashboard', [
            'app.openmrsRestServices',
            'app.etlRestServices',
            'dialogs.main'
        ]);
})();
