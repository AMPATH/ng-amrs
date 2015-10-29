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

	describe('PatientEtlModel Factory Unit Tests', function () {
		beforeEach(function () {
			module('models');
		});

		var patientModelFactory;
		var patientEtl, patientsEtl;  // jshint ignore:line


		beforeEach(inject(function ($injector) {
			patientModelFactory = $injector.get('PatientEtlModel');
		}));

		beforeEach(inject(function () {
			/* jshint ignore:start */
			patientEtl = {

        person_id: 'person_id',
				encounter_id: 'encounter_id',
				location_id: '_location_id',
				location_uuid: 'location_uuid',
        patient_uuid: 'patient_uuid',
				person_name: 'person_name',
        identifiers: 'identifiers'
			};

			patientsEtl = [
				{
          person_id: 'person_id',
          encounter_id: 'encounter_id',
          location_id: '_location_id',
          location_uuid: 'location_uuid',
          patient_uuid: 'patient_uuid',
          person_name: 'person_name',
          identifiers: 'identifiers'
				},
				{
          person_id: 'person_id',
          encounter_id: 'encounter_id',
          location_id: '_location_id',
          location_uuid: 'location_uuid',
          patient_uuid: 'patient_uuid',
          person_name: 'person_name',
          identifiers: 'identifiers'
				}
			];

			/* jshint ignore:end */
		}));


		it('should have Patient Etl Model Factory defined', function () {
			expect(patientModelFactory).to.exist;
		});

		it('should always create etl patient etl model with all required members defined ', function () {
			/* jshint ignore:start */
			var model = new patientModelFactory.patient(patientEtl);

			expect(model.personId()).to.equal(patientEtl.person_id);
			expect(model.encounterId()).to.equal(patientEtl.encounter_id);
			expect(model.locationId()).to.equal(patientEtl.location_id);
			expect(model.locationUuid()).to.equal(patientEtl.location_uuid);
			expect(model.personName()).to.equal(patientEtl.person_name);
			expect(model.identifiers()).to.equal(patientEtl.identifiers);
			expect(model.patientUuid()).to.equal(patientEtl.patient_uuid);

			/* jshint ignore:end */
		});

		it('should always a valid array of patients etl model when toArrayOfModels is called ', function () {
			/* jshint ignore:start */
			var model = new patientModelFactory.patient(patientsEtl[0]);

			var models = patientModelFactory.toArrayOfModels(patientsEtl);

			expect(model.personId()).to.equal(models[0].personId());
			expect(model.encounterId()).to.equal(models[0].encounterId());
			expect(model.patientUuid()).to.equal(models[0].patientUuid());

			expect(models.length).to.equal(2);

			/* jshint ignore:end */
		});

	});


})();
