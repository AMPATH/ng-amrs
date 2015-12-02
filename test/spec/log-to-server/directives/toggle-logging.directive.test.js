/* global afterEach */
/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function() {
  'use strict';
  describe('Toggle Logging Directive Unit Tests', function() {
    beforeEach(function() {
      module('app.logToServer');
    });

    var elm, element, scope, _window;

    beforeEach(function() {

    });

    beforeEach(inject(function($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element("<div class=\"switch\" ng-class=\"{\'switch-left\': !model, \'switch-right\': model}\">\n  <div class=\"switch-button\">&nbsp;</div>\n</div>");
      scope = $rootScope.$new();
      element = $compile(elm)(scope);
      _window = $injector.get('$window');
      scope.$digest();
    }));

    it('should have $window injected', function() {
      expect(_window).to.exist;
    });

  });
})();
