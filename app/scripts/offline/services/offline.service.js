/*jshint -W003, -W098, -W117, -W026, -W033 */
(function() {
  'use strict';

  angular
    .module('app.offline')
    .factory('OfflineService', OfflineService);

  OfflineService.$inject = ['$rootScope', '$log', 'OpenmrsSettings'];

  function OfflineService($rootScope, $log, OpenmrsSettings) {
    var service;
    var offline = false;
    var url = OpenmrsSettings.getCurrentRestUrlBase().trim();

    service = {
      checkStatus: checkStatus
    };


    Offline.options = {
        game: false,
        checkOnLoad: true,
        // checks: {xhr:{url:'https://test1.ampath.or.ke:8002'}}
        checks: {xhr:{url:url+'session'}}
    };

    Offline.on('up', function () {
        $log.info('Internet is up.');
        offline = false;
        $rootScope.$broadcast('offline', offline);
    });
    Offline.on('down', function () {
        $log.info('Internet is down.');
        offline = true;
        $rootScope.$broadcast('offline', offline);
    });

    var checkOfflineStatus = function() {
        Offline.check();
        if (Offline.state === 'up') {
          offline = false;
          $rootScope.$broadcast('offline', offline);
        } else {
          offline = true;
          $rootScope.$broadcast('offline', offline);
        }
    };

    function checkStatus() {
      $log.info('Method called')
        setInterval(checkOfflineStatus, 30000);
    }
    checkStatus();
    return service;
  }
})();
