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

	describe('DefaulterModel Factory Unit Tests', function () {
		beforeEach(function () {
			module('models');
		});

		var defaulterModelFactory;
		var defaulterEtl, defaultersEtl;  // jshint ignore:line
		
		
		beforeEach(inject(function ($injector) {
			defaulterModelFactory = $injector.get('DefaulterModel');
		}));

		beforeEach(inject(function () {
			/* jshint ignore:start */
			defaulterEtl = {
				person_id: 'person_id',
				encounter_id: 'encounter_id',
				encounter_datetime: 'encounter_datetime',
				encounter_type: 'encounter_type',
				location_id: '_location_id',
				location_uuid: 'location_uuid',
				rtc_date: 'rtc_date',
				arv_start_date: 'arv_start_date',
				encounter_type_name: 'encounter_type_name',
				person_name: 'person_name',
				phone_number: 'phone_number',
				identifiers: 'identifiers',
				patient_uuid: 'patient_uuid',
				days_since_rtc: 'days_since_rtc'
			};

			defaultersEtl = [
				{
					person_id: 'person_id',
					encounter_id: 'encounter_id',
					encounter_datetime: 'encounter_datetime',
					encounter_type: 'encounter_type',
					location_id: '_location_id',
					location_uuid: 'location_uuid',
					rtc_date: 'rtc_date',
					arv_start_date: 'arv_start_date',
					encounter_type_name: 'encounter_type_name',
					person_name: 'person_name',
					phone_number: 'phone_number',
					identifiers: 'identifiers',
					patient_uuid: 'patient_uuid',
					days_since_rtc: 'days_since_rtc'
				},
				{
					person_id: 'person_id2',
					encounter_id: 'encounter_id2',
					encounter_datetime: 'encounter_datetime',
					encounter_type: 'encounter_type',
					location_id: '_location_id',
					location_uuid: 'location_uuid',
					rtc_date: 'rtc_date',
					arv_start_date: 'arv_start_date',
					encounter_type_name: 'encounter_type_name',
					person_name: 'person_name',
					phone_number: 'phone_number',
					identifiers: 'identifiers',
					patient_uuid: 'patient_uuid2',
					days_since_rtc: 'days_since_rtc'
				}
			];
			
			/* jshint ignore:end */
		}));


		it('should have Defaulter Model Factory defined', function () {
			expect(defaulterModelFactory).to.exist;
		});

		it('should always create etl defaulter model with all required members defined ', function () {
			/* jshint ignore:start */
			var model = new defaulterModelFactory.defaulter(defaulterEtl);

			expect(model.personId()).to.equal(defaulterEtl.person_id);
			expect(model.encounterId()).to.equal(defaulterEtl.encounter_id);
			expect(model.encounterDatetime()).to.equal(defaulterEtl.encounter_datetime);
			expect(model.encounterType()).to.equal(defaulterEtl.encounter_type);
			expect(model.locationId()).to.equal(defaulterEtl.location_id);
			expect(model.locationUuid()).to.equal(defaulterEtl.location_uuid);
			expect(model.rtcDate()).to.equal(defaulterEtl.rtc_date);
			expect(model.arvStartDate()).to.equal(defaulterEtl.arv_start_date);
			expect(model.encounterTypeName()).to.equal(defaulterEtl.encounter_type_name);
			expect(model.personName()).to.equal(defaulterEtl.person_name);
			expect(model.phoneNumber()).to.equal(defaulterEtl.phone_number);
			expect(model.identifiers()).to.equal(defaulterEtl.identifiers);
			expect(model.patientUuid()).to.equal(defaulterEtl.patient_uuid);
			expect(model.daysSinceRtc()).to.equal(defaulterEtl.days_since_rtc);
		
			/* jshint ignore:end */
		});

		it('should always a valid array of defaulters model when toArrayOfModels is called ', function () {
			/* jshint ignore:start */
			var model = new defaulterModelFactory.defaulter(defaultersEtl[0]);

			var models = defaulterModelFactory.toArrayOfModels(defaultersEtl);

			expect(model.personId()).to.equal(models[0].personId());
			expect(model.encounterId()).to.equal(models[0].encounterId());
			expect(model.patientUuid()).to.equal(models[0].patientUuid());

			expect(models.length).to.equal(2);
     
			/* jshint ignore:end */
		});

	});


})();