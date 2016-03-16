/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';

  describe('Labs Reminder Directive Unit Tests', function () {

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
        '<labs-reminder patient-uuid="{{patient.uuid}}">' +
        '</labs-reminder>');
      scope = $rootScope.$new();
      scope.patient = { uuid: 'uuid' };
      element = $compile(elm)(scope);
      scope.$digest();
      etlRestServiceMock = element.isolateScope().injectedEtlRestService;
    }));

    it('should load reminder indicator when patient uuid changes', function () {
      //the describe block sets the uuid = 'uuid'. that triggers load from the directive
      //this means that our directive fetched and bound it correctly
      var currentLength = element.isolateScope().indicator.length;
      expect(currentLength).to.not.equal(0);
    });

    it('should ensure reportName to be defined', function () {
      //without initialising reportName the etl server will not fetch data
      var reportName = element.isolateScope().reportName;
      var isolateScope = scope.$$childHead;
      chai.expect(isolateScope.reportName).to.be.an('string');
      expect(reportName).to.not.equal(null);

    });

    it('should ensure reminderIndicators to be defined', function () {
      //without initialising reminderIndicators the etl server will not fetch data
      var reportName = element.isolateScope().reminderIndicators;
      var isolateScope = scope.$$childHead;
      chai.expect(isolateScope.reminderIndicators).to.be.an('string');
      expect(reportName).to.not.equal(null);
    });

    it('should ensure notificationOptions to exit and bound with an object', function () {
      //without initialising notificationOptions the popup notification will not display properly
      var reportName = element.isolateScope().notificationOptions;
      var isolateScope = scope.$$childHead;
      chai.expect(isolateScope.notificationOptions).to.be.an('object');
      expect(reportName).to.not.equal(null);
      expect(reportName).to.not.equal(undefined);
    });
  });
})();
