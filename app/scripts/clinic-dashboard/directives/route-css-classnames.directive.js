(function() {
  'use strict';

  angular.module('app.clinicDashboard').directive('routeCssClassnames', routeCssClassnames);

  function routeCssClassnames($rootScope, $state) {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, elem, attr, ctrl) {
        $rootScope.$on('$stateChangedlink', function() {
          elem.removeClass('panel-info panel-warning panel-success');
          elem.addClass($state.current.data.cssClassnames);
        });
      }
    };
  }
}());
