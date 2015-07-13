(function() {
  'use strict'

  describe('Open MRS Encounter Service Unit Tests', function() {
      beforeEach(function() {
        module('OpenmrsRestServices');
      });

      var baseURl = 'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/';
      var httpBackend
      var encounterService;
      
      var dummyEncounter = {
        uuid:'encounter-test-uuid',
        patient: {
          uuid: 'test-patient-uuid'
        }
      }
      
      beforeEach(inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
        encounterService = $injector.get('EncounterService');
      }));

      afterEach (function() {
        httpBackend.verifyNoOutstandingExpectation ();

        //httpBackend.verifyNoOutstandingRequest (); expectation is sufficient for now
      });
      
      it('Should have encounter service defined', function(){
        expect(encounterService).to.exists;
      });
      
      it('Should call the rest end point when getEncounter is called', function() {
        httpBackend.expectGET(baseURl + 'encounter/encounter-test-uuid').respond(dummyEncounter);
        httpBackend.flush();
        encounterService.getEncounterByUuid('encounter-test-uuid', function(data){
          expect(data.uuid).to.equal(dummyEncounter.uuid);
        }));
      });
  });
})();
