/*jshint -W026, -W030 */
(function() {
    'use strict';
    describe('OpenMRS Obs Service unit tests', function(){
      beforeEach(function(){
          module('app.openmrsRestServices');
      });
      var httpBackend;
      var obsService;
      var settingsService;

      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        obsService = $injector.get('ObsResService');
        settingsService = $injector.get('OpenmrsSettings');
      }));

      afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        //httpBackend.verifyNoOutstandingRequest();
      });

      it('should have obs service defined', function () {
        expect(obsService).to.exist;
      });

      it('should make an api call to the obs resource when getObsByUuid is called with a uuid', function () {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'obs?uuid=passed-uuid&v=custom:(uuid,concept:(uuid,uuid),groupMembers,value:ref)').respond({});
        obsService.getObsByUuid('passed-uuid', function () { }, function () { });
        httpBackend.flush();
      });

    });
})();
