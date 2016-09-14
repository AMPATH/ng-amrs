/* global sinon */
/* global afterEach */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';

  describe('Manage Person Attributes Directive Unit Tests', function () {

    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.patientdashboard');
      module('mock.openmrsRestServices');
      module('my.templates');
    });

    var elm, element, scope, personAttributesRestService;

    beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<manager-person-attributes  patient="patient">'+
        '</manager-person-attributes>' );
      scope = $rootScope.$new();
      scope.patient = { uuid: 'uuid' };
      element = $compile(elm)(scope);
      scope.$digest();
      personAttributesRestService = $injector.get('PersonAttributesRestService');
    }));

    afterEach(function () {
      personAttributesRestService.returnErrorOnNextCall = false;
    });

    it('should have PersonAttributesRestService defined', function () {
      expect(personAttributesRestService).to.exist;
    });

    it('should have all the scope members defined', function () {
      var isolateScope = element.scope();
      console.log(isolateScope);
      expect(isolateScope.patient).to.exist;

    });
    it('should have save button', function () {
      var elm = element.find('button');
        expect(elm).to.exist;
    });
  });
})();
