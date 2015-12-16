/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';
  describe('stats HivSummary Filters Unit Tests', function () {
    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.admin');
      module('mock.etlRestServices');
      module('my.templates');
    });

    var elm, element, scope, etlRestServiceMock;

    beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<stats-hiv-summary-filters enabled-controls="\'start-date, end-date\'" ' +
        'start-date="2015-04-01" end-date="2015-04-01" report-name="hiv-summary-report">  ' +
        '</stats-hiv-summary-filters>'
      );
      scope = $rootScope.$new();
      scope.location = {uuid: 'uuid'};
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
        expect(isolateScope.loadIndicatorsSchema).to.exist;
        expect(isolateScope.selectAllForms).to.exist;
        expect(isolateScope.selectAllEncounterTypes).to.exist;
        expect(isolateScope.selectAllLocations).to.exist;
        expect(isolateScope.findProviders).to.exist;
        expect(isolateScope.canView).to.exist;
        expect(isolateScope.onSelectedIndicatorTagChanged).to.exist;
        expect(isolateScope.selectAllTags).to.exist;

      });

    it('should set experiencedLoadingErrors to false when loadIndicatorsSchema is called',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.experiencedLoadingErrors = true;
        etlRestServiceMock.returnErrorOnNextCall = false;
        isolateScope.loadIndicatorsSchema();
        expect(isolateScope.experiencedLoadingErrors).to.equal(false);
      });

    it('should set isBusy to true when loadIndicatorsSchema is called once',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.isBusy = false;
        etlRestServiceMock.returnErrorOnNextCall = false;
        isolateScope.loadIndicatorsSchema();
        expect(isolateScope.isBusy).to.equal(true);
      });

    it('should set indicatorTags and selectedIndicatorTags.indicatorTags to [] when loadIndicatorsSchema is called once',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.indicatorTags=[{},{}];
        isolateScope.selectedIndicatorTags.indicatorTags=[{},{}];
        etlRestServiceMock.returnErrorOnNextCall = false;
        isolateScope.loadIndicatorsSchema();
        expect(isolateScope.indicatorTags.length).to.equal(0);
        expect(isolateScope.selectedIndicatorTags.indicatorTags.length).to.equal(0);
      });

    it('should set isBusy to true when fetchLocations is called once',
      function () {
        var isolateScope = element.isolateScope();
        isolateScope.isBusy = false;
        etlRestServiceMock.returnErrorOnNextCall = false;
        isolateScope.fetchLocations();
        expect(isolateScope.isBusy).to.equal(true);
      });

  });
})();
