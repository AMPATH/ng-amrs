(function() {
'use strict';

angular
        .module('app.labordersearch', [
          'app.openmrsRestServices',
          'app.etlRestServices',
          'angular-bar-code-scanner'
        ]);
})();
