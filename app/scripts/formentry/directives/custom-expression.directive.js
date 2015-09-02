/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .directive('customExpression', customExpression);

    function customExpression() {
        var directive = {
            restrict: 'A',
            scope: {
              customExpression: '&'
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr) {
          el.on('click', function() {
            scope.customExpression();
            scope.$apply();
          });
        }
    }
})();
