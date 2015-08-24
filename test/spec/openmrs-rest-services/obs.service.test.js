/*jshint -W026, -W030 */
(function() {
    'use strict';
    describe('OpenMRS Obs Service unit tests', function(){
      beforeEach(function(){
          module('app.openmrsRestServices');
          module('mock.data');
      });
      var httpBackend;
      var obsService;
      var settingsService;
      var v = 'custom:(uuid,concept:(uuid,uuid),groupMembers,value:ref)';
      var mockData;

      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        obsService = $injector.get('ObsResService');
        settingsService = $injector.get('OpenmrsSettings');
        mockData = $injector.get('mockData');
      }));

      afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        //httpBackend.verifyNoOutstandingRequest();
      });

      it('should have obs service defined', function () {
        expect(obsService).to.exist;
      });

      it('should make an api call to the obs resource when getObsByUuid is called with a uuid', function () {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'obs?v='+v).respond(mockData.getMockObs());
        obsService.getObsByUuid('passed-uuid', function (data){
          expect(data.uuid).to.equal('passed-uuid')
         });
        httpBackend.flush();
      });

    });
})();
