/*
jshint -W030
*/
(function () {
  'use strict';

  describe('EncounterModel Factory Unit Tests', function () {
    var EncounterModelFactory;
    var testOpenmrsEncounterJson = {
      "uuid": "encounter-test-uuid",
      "encounterDatetime": "2010-05-07T00:00:00.000+0300",
      "patient": {
        "uuid": "test-patient-uuid"
      },
      "form": {
        "uuid": "test-form-uuid",
        "name": "Test Form"
      },
      "location": {
        "uuid": "test-location-uuid",
        "display": "Test Location",
        "links": [
          {
            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/test-location-uuid",
            "rel": "self"
          }
        ]
      },
      "encounterType": {
        "uuid": "encounter-type-uuid",
        "display": "Adult Test Encounter",
        "links": [
          {
            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/encountertype/encounter-type-uuid",
            "rel": "self"
          }
        ]
      },
      "provider": {
        "uuid": "test-provider-uuid",
        "display": "Musa Ally",
        "links": [
          {
            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/person/test-provider-uuid",
            "rel": "self"
          }
        ]
      }
    };
    
    beforeEach(function () {
      module('models');
    });

    beforeEach(inject(function ($injector) {
      EncounterModelFactory = $injector.get('EncounterModel');
    }));
    
    it('It should have Encounter Model Factory defined & injected', function () {
      expect(EncounterModelFactory).to.exist;
    });

    it('It should create encounter model with correct values', function() {
      var model = new EncounterModelFactory.encounter(testOpenmrsEncounterJson);
      var expectedOpenmrsModel = {
        "uuid" : testOpenmrsEncounterJson.uuid,
        "encounterDatetime" : testOpenmrsEncounterJson.encounterDatetime,
        "encounterType" : testOpenmrsEncounterJson.encounterType.uuid,
        "provider" : testOpenmrsEncounterJson.provider.uuid,
        "location" : testOpenmrsEncounterJson.location.uuid,
        "form" : testOpenmrsEncounterJson.form.uuid
      };
      
      expect(model.uuid).to.exist;
      expect(model.encounterTypeName).to.exist;
      expect(model.encounterTypeUuid).to.exist;
      expect(model.locationName).to.exist;
      expect(model.locationUuid).to.exist;
      expect(model.encounterDate).to.exist;
      expect(model.providerName).to.exist;
      expect(model.providerUuid).to.exist;
      expect(model.openmrsModel).to.exist;

      expect(model.uuid()).to.equal(testOpenmrsEncounterJson.uuid);
      expect(model.encounterDate()).to.equal(
                    testOpenmrsEncounterJson.encounterDatetime);
      expect(model.encounterTypeName()).to.equal(
                    testOpenmrsEncounterJson.encounterType.display);
      expect(model.encounterTypeUuid()).to.equal(
                    testOpenmrsEncounterJson.encounterType.uuid);
      expect(model.locationUuid()).to.equal(
                    testOpenmrsEncounterJson.location.uuid);
      expect(model.locationName()).to.equal(
                    testOpenmrsEncounterJson.location.display);
      expect(model.providerUuid()).to.equal(
                    testOpenmrsEncounterJson.provider.uuid);
      expect(model.providerName()).to.equal(
                    testOpenmrsEncounterJson.provider.display); 
      expect(model.openmrsModel()).to.deep.equal(expectedOpenmrsModel);
    });
    
    it('toArrayOfModels should generate an array of models from array of ' +
       'openmrs models', function(){
      var encounterArray = [{
          "uuid": "encounter-uuid-1"
        }, {
          "uuid": "encounter-uuid-2"
        }, {
          "uuid": "encounter-uuid-3"
        }
      ];
        
      var modelArray = EncounterModelFactory.toArrayOfModels(encounterArray);
      
      expect(modelArray).to.be.an('array');
      assert(modelArray[0], EncounterModelFactory.encounter, 'Should be ' +
            'instance of EncounterModel array');
      expect(modelArray.length).to.equal(encounterArray.length);    
    });
  });
})();
