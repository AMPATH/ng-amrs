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

  describe('Outreach Locator Form Directive Unit Tests', function () {

    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.patientdashboard');
      module('mock.etlRestServices');
      module('my.templates');
    });

    var elm, element, scope, etlRestServiceMock;

    beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<outreach-locator-form patient-uuid="{{patient.uuid}}">' +
        '</outreach-locator-form>');
      scope = $rootScope.$new();
      scope.patient = { uuid: 'uuid' };
      element = $compile(elm)(scope);
      scope.$digest();
      etlRestServiceMock = $injector.get('EtlRestService');
    }));

    afterEach(function () {
      etlRestServiceMock.returnErrorOnNextCall = false;
    });
  });
})();
