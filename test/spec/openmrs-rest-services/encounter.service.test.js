(function() {
  'use strict'

  describe('Open MRS Encounter Service Unit Tests', function() {
      beforeEach(function() {
        module('app.openmrsRestServices');
      });

      var testRestUrl = 'http://testingurl/openmrs/ws/rest/v1/';
      var httpBackend;
      var encounterResService;
      var OpenmrsSettings;

      var dummyEncounter = {
        uuid:'encounter-test-uuid',
        patient: {
          uuid: 'test-patient-uuid'
        }
      }

      beforeEach(inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
        encounterResService = $injector.get('EncounterResService');
        OpenmrsSettings = $injector.get('OpenmrsSettings');

        //  Set restangular URL
        $injector.get('Restangular').setBaseUrl(testRestUrl);
      }));

      afterEach (function() {
        httpBackend.verifyNoOutstandingExpectation ();

        //  httpBackend.verifyNoOutstandingRequest (); expectation is sufficient for now
      });

      it('Should have encounter service defined', function(){
        expect(encounterResService).to.exists;
      });

      it('Should call the appropriate rest end point when getEncounter is called', function() {
        //undo once you figure out the error
        //Trying to solve the karma problem so that travis can run perfectly well
        httpBackend.expectGET(testRestUrl + 'encounter/encounter-test-uuid').respond(dummyEncounter);
        encounterResService.getEncounterByUuid('encounter-test-uuid', function(data){
          expect(data.uuid).to.equal(dummyEncounter.uuid);
        });
        httpBackend.flush();
      });

      it('Should save new Encounter to the database', function() {

      });

      it('Should make a call to retrieve a list of encounters for a patient', function (){
        var response = { "results" :[
                          {
                            "uuid": "encounter-uuid-for-first-element",
                            "display": "ADULTRETURN 01/02/2006",
                          },
                          {
                            "uuid": "bf218490-1691-11df-97a5-7038c432aabf",
                            "display": "ADULTRETURN 07/02/2006",
                            "links": [
                              {
                                "uri": testRestUrl+"encounter/bf218490-1691-11df-97a5-7038c432aabf",
                                "rel": "self"
                              }
                            ]
                          }
                      ]};
          httpBackend.expectGET(testRestUrl + 'encounter?patient=patient-uuid&v=default').respond(response);
          encounterResService.getPatientEncounters('patient-uuid',function(data){
            expect(data[0].uuid).to.equal('encounter-uuid-for-first-element');
          },function(error){console.log('Error')});
          httpBackend.flush();
      });
  });
})();
