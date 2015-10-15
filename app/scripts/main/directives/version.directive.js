/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('ngAmrsApp')
        .directive('version', directive);

    function directive() {
        return {
            template: 'Version {{v.version}}-build.{{v.revision}} {{v.date}}',
            restrict: 'EA',
            controller: Controller,
            bindToController: true
        }
    }

    Controller.$inject = ['$scope', '$http', '$filter'];

    function Controller($scope, $http, $filter) {
        $scope.v = {};
        $http.get('version.json').success(function(data) {
            $scope.v = data;
            //Format date
            var parsed = Date.parse(data.date);
            $scope.v.date = $filter('date')(parsed,'dd-MMM-yyyy hh:mm','+0300');
        });
    }
})();
