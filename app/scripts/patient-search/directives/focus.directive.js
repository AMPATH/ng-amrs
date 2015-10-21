/*
jshint -W003, -W098, -W117, -W109, -W026
*/
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
      .module('app.patientsearch')
      .directive('focus', focus);

  function focus($timeout) {
    var directive = {
      scope: {
        trigger: '@focus'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
      scope.$watch('trigger', function(value) {
        if (value === 'true') {
          $timeout(function() {
            el[0].focus();
          });
        }
      });
    }
  }
})();
