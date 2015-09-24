/* global it */
/* global inject */
/* global describe */
/* global beforeEach */
/* global expect */
/*
jshint -W030
*/
(function () {
  'use strict';

  describe('PatientTestModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var patientTestModelFactory;
    var patientTestEtl;  // jshint ignore:line

    beforeEach(inject(function ($injector) {
      patientTestModelFactory = $injector.get('PatientTestModel');
    }));

    beforeEach(inject(function () {
      /* jshint ignore:start */
      patientTestEtl = {
        person_id: 'person_id',
        uuid: 'uuid',
        encounter_id: 'encounter_id',
        encounter_datetime: 'encounter_datetime',
        encounter_type: 'encounter_type',
        location_id: '_location_id',
        location_uuid: 'location_uuid',
        hiv_viral_load: 'hiv_viral_load',
        cd4_count: 'cd4_count',
        cd4_percent: 'cd4_percent',
        hemoglobin: 'hemoglobin',
        ast: 'ast',
        creatinine: 'creatinine',
        chest_xray: 'chest_xray',
        tests_ordered: 'tests_ordered'
      };
      /* jshint ignore:end */
    }));

    it('should have PatientTest Model Factory defined', function () {
      expect(patientTestModelFactory).to.exist;
    });

    it('should always create etl patien test model with all required members defined ', function () {
      /* jshint ignore:start */
      var model = new patientTestModelFactory.patientTest(patientTestEtl);

      expect(model.personId()).to.equal(patientTestEtl.person_id);
      expect(model.uuid()).to.equal(patientTestEtl.uuid);
      expect(model.encounterId()).to.equal(patientTestEtl.encounter_id);
      expect(model.encounterDatetime()).to.equal(patientTestEtl.encounter_datetime);
      expect(model.encounterType()).to.equal(patientTestEtl.encounter_type);
      expect(model.locationId()).to.equal(patientTestEtl.location_id);
      expect(model.locationUuid()).to.equal(patientTestEtl.location_uuid);
      expect(model.hivViralLoad()).to.equal(patientTestEtl.hiv_viral_load);
      expect(model.cd4Count()).to.equal(patientTestEtl.cd4_count);
      expect(model.cd4Percent()).to.equal(patientTestEtl.cd4_percent);
      expect(model.hemoglobin()).to.equal(patientTestEtl.hemoglobin);
      expect(model.ast()).to.equal(patientTestEtl.ast);
      expect(model.creatinine()).to.equal(patientTestEtl.creatinine);
      expect(model.chestXray()).to.equal(patientTestEtl.chest_xray);
      expect(model.testsOrdered()).to.equal(patientTestEtl.tests_ordered);
		
      /* jshint ignore:end */
    });

  });

})();
