/*
jshint -W026, -W116, -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict'

  describe('Open MRS Visit Service Unit Tests', function() {
      beforeEach(function() {
        module('app.openmrsRestServices');
      });

      var testRestUrl = 'http://testingurl/openmrs/ws/rest/v1/';
      var httpBackend;
      var visitResService;
      var OpenmrsSettings;
      var visit = {
        uuid:'visit-test-uuid',
        patient: 'test-patient-uuid'
      }

      /* jshint ignore:start */
      var singleResponse = {
          "uuid": "visit-test-uuid",
          "display": "Test type ? - 22/09/2015 08:30",
          "links": [
            {
              "uri": "http://testingurl/openmrs/ws/rest/v1/visit/8fe950c2-76cd-4fc2-b853-4f6e3d3c8546",
              "rel": "self"
            }
          ]
     };


     var visitsResponse = {
      "results": [
        {
          "uuid": "visit-test-uuid-1",
          "display": "Follow Up ? - 22/09/2015 08:30",
          "links": [
            {
              "uri": "http://testingurl/openmrs/ws/rest/v1/visit/visit-test-uuid-1",
              "rel": "self"
            }
          ]
        },
        {
          "uuid": "visit-test-uuid-2",
          "display": "Follow Up ? - 22/09/2015 08:30",
          "links": [
            {
              "uri": "http://testingurl/openmrs/ws/rest/v1/visit/visit-test-uuid-2",
              "rel": "self"
            }
          ]
        }
      ]
    };
    /* jshint ignore:end */

    beforeEach(inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
        visitResService = $injector.get('VisitResService');
        OpenmrsSettings = $injector.get('OpenmrsSettings');
        //  Set restangular URL
        $injector.get('Restangular').setBaseUrl(testRestUrl);
    }));

    afterEach (function() {
        httpBackend.verifyNoOutstandingExpectation ();
    });

    it('Should have visit service defined', function(){
        expect(visitResService).to.exists;
    });

    it('Should call the appropriate rest end point when getVisitByUuid is' +
        'called', function() {
        httpBackend.expectGET(testRestUrl + 'visit/visit-test-uuid?v=' +
        visitResService.defaultCustomRep()).respond(singleResponse);

        visitResService.getVisitByUuid('visit-test-uuid', function(data) {
            expect(data.uuid).to.equal(singleResponse.uuid);
        });
        httpBackend.flush();
    });

    it('getPatientVisits() should return a list of patient visits', function() {
        httpBackend.expectGET(testRestUrl + 'visit?patient=test-patient-uuid' +
            '&v=' + visitResService.defaultCustomRep()).respond(visitsResponse);

        visitResService.getPatientVisits('test-patient-uuid', function(data) {
            expect(data).to.be.array;
            expect(data.length).to.equal(visitsResponse.results.length);
        });
        httpBackend.flush();
    });

    it('getPatientVisits should return visits given object params', function() {
        httpBackend.expectGET(testRestUrl + 'visit?patient=test-patient-uuid' +
            '&v=' + visitResService.defaultCustomRep()).respond(visitsResponse);

        var params = {
            'patientUuid': 'test-patient-uuid'
        }
        visitResService.getPatientVisits(params, function(data) {
            expect(data).to.be.array;
            expect(data.length).to.equal(visitsResponse.results.length);
        });
        httpBackend.flush();
    })

    it('saveVisit should create a new visit', function() {
        var payload = {
            'patient': 'test-patient-uuid',
            'visitType': 'visittype-test-uuid',
            'startDatetime': '2015-09-22 08:30:00'
        };

        httpBackend.expectPOST(testRestUrl + 'visit', payload)
            .respond(singleResponse);
        visitResService.saveVisit(payload, function(data) {
            expect(data).to.be.object;
            expect(data.uuid).to.equal(singleResponse.uuid);
        });
        httpBackend.flush();
    });

    it('saveVisit should update an existing visit', function() {
        var payload = {
            'uuid': 'visit-test-uuid',
            'location': 'test-location-uuid'
        };

        var expected = { 'location': payload.location };

        httpBackend.expectPOST(testRestUrl + 'visit/'+payload.uuid, expected)
            .respond(payload);

        visitResService.saveVisit(payload, function(data) {
            expect(data).to.be.object;
            expect(data.location).to.equal('test-location-uuid');
        });
        httpBackend.flush();
    });

    it('should set default custom representation', function() {
        visitResService.defaultCustomRep('test representation');
        expect(visitResService.defaultCustomRep()).to.equal('test representation');
    });

    it('getVisitEncounters should return list of encounters', function() {
        /* jshint ignore:start */
        var response = {
            "encounters": [{
                    "uuid": "encounter-1-uuid",
                }, {
                    "uuid": "encounter-2-uuid"
                }
            ]
        };
        /* jshint ignore:end */
        var defaultRep = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                'encounterRole:(uuid,name)),location:(uuid,name),' +
                'visit:(uuid,visitType:(uuid,name))))';

        var params = {
            visitUuid: 'visit-test-uuid',
        };
        httpBackend.expectGET(testRestUrl + 'visit/' + params.visitUuid + '?v='+
            defaultRep).respond(response);

        visitResService.getVisitEncounters(params, function(encounters) {
            expect(encounters).to.be.array;
            expect(encounters.length).to.equal(response.encounters.length);
        });
    });

    it('getVisitTypes should return list of visit types', function() {
        /* jshint ignore: start */
        var visitTypesResponse = {
              "results": [{
                  "uuid": "test-visit-uuid-1",
                  "name": "Visit type 1",
                  "description": "visit type one"
              }, {
                    "uuid": "test-visit-uuid-2",
                    "name": "Visit type 2",
                    "description": "visit type two"
              }, {
                    "uuid": "test-visit-uuid-3",
                    "name": "Visit type 3",
                    "description": "visit type three"
              }]
        };
        /* jshint ignore: end */
        var defaultCustomRep = 'custom:(uuid,name,description)';
        httpBackend.expectGET(testRestUrl + 'visittype?v=' + defaultCustomRep)
            .respond(visitTypesResponse);

        visitResService.getVisitTypes(function(data) {
            expect(data).to.be.array;
            expect(data.length).to.equal(visitTypesResponse.results.length);
        });
    });
  });
})();
