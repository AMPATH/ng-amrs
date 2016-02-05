/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('ngAmrsApp')
        .directive('connectivity', directive);

    function directive() {
        return {
            template: '<div class="offline-ui  offline-ui-up"></div>',
            restrict: 'EA',
            controller: Controller,
            bindToController: true
        }
    }

    Controller.$inject = ['$scope', 'OfflineService'];

    function Controller($scope,  OfflineService) {
        $scope.offline = false;
        $scope.$on('offline', function(ev, offline) {
          console.log('offline check', offline);
          $scope.offline = offline?'Offline': 'Online';
          if(!$scope.$$phase) {
            $scope.$digest();
          }
        });

    }
})();
