(function() {
  'use strict';
  describe.only('Testing notifications directive', function() {
    beforeEach(function() {
      //debugger;
      module('ngAmrsApp');
      module('app.patientdashboard');
      module('mock.etlRestServices');
      module('my.templates');
    });
    var scope, elem, etlRestServiceMock, isolateScope;

    var html = '<medication-history patient-uuid="uuid"></medication-history>';
    var rendered;
    beforeEach(function() {
      inject(function($compile, $rootScope) {
        elem = angular.element(html);
        scope = $rootScope.$new();
        rendered = $compile(elem)(scope);
        scope.$digest();
        etlRestServiceMock = rendered.isolateScope().injectedEtlRestService;
        isolateScope = rendered.isolateScope();
      });
    });
    it('should have EtlRestServiceMock defined', function() {
      expect(etlRestServiceMock).to.exist;
    });
    it('Should Have a table defined', function() {
      var template = rendered.find('table');
      expect(template).to.exist;
      expect(template.length).to.not.equal(0);
    });
    it('fetchMedicationHistory should be a function', function() {
      expect(isolateScope.fetchMedicationHistory).to.be.instanceof(Function);
    });
    it('Patient UUID should exist', function() {
      expect(isolateScope.patientUuid).to.exist;
    });
  });
})();
