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
      var v = 'custom:(uuid,obsDatetime,concept:(uuid,uuid),groupMembers,value:ref)';
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
          expect(data.uuid).to.equal('passed-uuid');
         });
        httpBackend.flush();
      });

      it('should make an api call to the obs resource when voidObs is called with a uuid', function () {
        httpBackend.expectDELETE(settingsService.getCurrentRestUrlBase() + 'obs?v='+v).respond(mockData.getMockObs());
        obsService.voidObs('passed-uuid', function (data){
          expect(data.uuid).to.equal('passed-uuid');
         });
        httpBackend.flush();
      });

      it('ObsService should have getObsByUuid method', function () {
        expect(obsService.getObsByUuid).to.be.an('function');
      });

      it('ObsService should have voidObs method', function () {
        expect(obsService.voidObs).to.be.an('function');
      });

      it('ObsService should have saveUpdateObs method', function () {
        expect(obsService.saveUpdateObs).to.be.an('function');
      });

      it('should Call errorCallback when getObsByUuid fails', function () {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'obs?v='+v).respond(500);
        obsService.getObsByUuid('passed-uuid', function (){},
        function(error){
          expect(error).to.equal('Error processing request',500);
        });
        httpBackend.flush();
      });



    });
})();
