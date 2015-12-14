(function() {
  'use strict';
  describe("directive tests", function() {
    module('ngAmrsApp');
    module('app.patientdashboard');
    beforeEach(module('my.templates'));
    var elm, element, scope;

    beforeEach(inject(function($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<current-visit-vitals patient-uuid="{{vm.patient.uuid()}}"></current-visit-vitals>');
      scope = $rootScope.$new();
      element = $compile(elm)(scope);
      scope.$digest();
    }));
    it('should have list group to hold vitals', function() {
      var list = elm.find('list-group');

      expect(list).to.exist;
    });
  });
})();
