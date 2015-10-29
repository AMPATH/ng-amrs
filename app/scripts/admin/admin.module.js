(function() {
    'use strict';

    angular
        .module('app.admin', [
            'app.openmrsRestServices',
            'app.etlRestServices',
            'models',
            'ui.bootstrap'
        ]);
})();