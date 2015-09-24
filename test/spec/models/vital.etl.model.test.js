/* global it */
/* global inject */
/* global describe */
/* global beforeEach */
/* global expect */
/*
jshint -W030
*/
(function() {
  'use strict';

  describe('VitalModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var vitalModelFactory;
      var vitalEtl;  // jshint ignore:line

      beforeEach(inject(function($injector) {
        vitalModelFactory = $injector.get('VitalModel');
      }));
      
      beforeEach(inject(function() {
        /* jshint ignore:start */
        vitalEtl = {
          person_id : 'person_id',
          uuid : 'uuid',
          encounter_id : 'familyName',
          encounter_datetime : 'familyName2',
          location_id : '_location_id',
          weight : 'weight',
          height : 'height',
          temp : 'temp',
          oxygen_sat : 'oxygen_sat',
          systolic_bp : 'systolic_bp',
          diastolic_bp : 'diastolic_bp',
          pulse : 'pulse'
        };
        /* jshint ignore:end */
      }));

      it('should have Vital Model Factory defined', function() {
        expect(vitalModelFactory).to.exist;
      });

      it('should always create etl vital model with all required members defined ', function() {
        /* jshint ignore:start */
        var model = new vitalModelFactory.vital(vitalEtl);

        expect(model.personId()).to.equal(vitalEtl.person_id);
        expect(model.uuid()).to.equal(vitalEtl.uuid);
        expect(model.encounterId()).to.equal(vitalEtl.encounter_id);
        expect(model.encounterDatetime()).to.equal(vitalEtl.encounter_datetime);
        expect(model.locationId()).to.equal(vitalEtl.location_id);
        expect(model.weight()).to.equal(vitalEtl.weight);
        expect(model.height()).to.equal(vitalEtl.height);
        expect(model.temperature()).to.equal(vitalEtl.temp);
        expect(model.oxygenSat()).to.equal(vitalEtl.oxygen_sat);
        expect(model.systolicBp()).to.equal(vitalEtl.systolic_bp);
        expect(model.diastolicBp()).to.equal(vitalEtl.diastolic_bp);
        expect(model.pulse()).to.equal(vitalEtl.pulse);
		
        /* jshint ignore:end */
      });

    });

})();
