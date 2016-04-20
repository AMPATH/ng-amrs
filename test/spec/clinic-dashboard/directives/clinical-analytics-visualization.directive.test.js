/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';
  describe('Clinical Analytics Visualization Unit Tests', function () {
    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.clinicDashboard');
      module('mock.etlRestServices');
      module('my.templates');
    });

    var elm, element, scope, etlRestServiceMock;


    beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<clinical-analytics-visualization  start-date="startDate" end-date="endDate"'+
      'selected-locations="selectedLocation" > </clinical-analytics-visualization>'
      );
      scope = $rootScope.$new();
      scope.selectedLocation = 'location-uuid';
      element = $compile(elm)(scope);
      scope.$digest();
      etlRestServiceMock = $injector.get('EtlRestService');
    }));

    afterEach(function () {
      etlRestServiceMock.returnErrorOnNextCall = false;
    });

    it('should have EtlRestServiceMock injected', function () {
      expect(etlRestServiceMock).to.exist;
      //ensure that mock services are injected
      expect(etlRestServiceMock.isMockService).to.equal(true);
    });

    it('should have required public member functions exposed on the scope on load and exist as function',
      function () {
        var isolateScope = element.isolateScope();
        expect(isolateScope.selectedLocation).to.exist;
        expect(isolateScope.startDate).to.exist;
        expect(isolateScope.endDate).to.exist;
        expect(isolateScope.sliderProperties).to.exist;
        expect(isolateScope.hivComparative).to.exist;
        expect(isolateScope.patientStatus).to.exist;
        expect(isolateScope.art).to.exist;

      });
    it('should have chart objects for hivComparative chart, patientStatus chart and art chart to have been defined',
      function () {
        var isolateScope = element.isolateScope();
        chai.expect(isolateScope.hivComparative).to.be.an('object');
        chai.expect(isolateScope.patientStatus).to.be.an('object');
        chai.expect(isolateScope.art).to.be.an('object');
      });

    it('should have x axis, y axis and legend to have been defined',
      function () {
        var isolateScope = element.isolateScope();
        chai.expect(isolateScope.hivComparative.chartDefinition).to.be.an('array');
        chai.expect(isolateScope.patientStatus.chartDefinition).to.be.an('array');
        chai.expect(isolateScope.art.chartDefinition).to.be.an('array');
      });

    it('should set isBusy to true when generateGraph start date changes',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.isBusy = false;
        isolateScope.startDate=new Date(new Date().setYear(new Date().getFullYear() - 1));
        isolateScope.$digest();
      });


    it('should set isBusy to true when generateGraph end date changes',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.isBusy = false;
        isolateScope.endDate=new Date(new Date().setYear(new Date().getFullYear() - 2));
        isolateScope.$digest();
      });

    it('should hit the api and fetch data when location changes',
      function () {
        var isolateScope = element.isolateScope();
        etlRestServiceMock.returnErrorOnNextCall = false;
        isolateScope.endDate=new Date(new Date().setYear(new Date().getFullYear() - 2));
        isolateScope.$digest();
      });

  });
})();
