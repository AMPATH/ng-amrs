/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .directive('uiSrefActiveIf', ['$state', function($state) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs','$rootScope', function ($scope, $element, $attrs,$rootScope) {
            var state = $attrs.uiSrefActiveIf;

            function update() {
                if ( $state.includes(state) || $state.is(state) ) {
                    $element.addClass('active');
                } else {
                    $element.removeClass('active');
                }
                $rootScope.$broadcast('$stateChangedlink');
            }

            $scope.$on('$stateChangeSuccess', update);
            update();
        }]
    };
}]);
})();
