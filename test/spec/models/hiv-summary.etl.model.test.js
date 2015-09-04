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

  describe('HivSummaryModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var hivSummaryModelFactory;
    var hivSummaryEtl;  // jshint ignore:line
    var hivSummaryRecordsEtl;  // jshint ignore:line

    beforeEach(inject(function ($injector) {
      hivSummaryModelFactory = $injector.get('HivSummaryModel');
    }));

    beforeEach(inject(function () {
      /* jshint ignore:start */
      hivSummaryEtl = {
        person_id: 'person_id',
        uuid: 'middleName',
        encounter_id: 'familyName',
        encounter_datetime: 'familyName2',
        location_id: '_location_id',
        location_uuid: '_location_uuid',
        visit_num: '_visit_num',
        death_date: '_death_date',
        scheduled_visit: '_scheduled_visit',
        transfer_out: '_transfer_out',
        out_of_care: 'out_of_care',
        prev_rtc_date: '_prev_rtc_date',
        rtc_date: '_rtc_date',
        arv_start_date: '_arv_start_date',
        arv_first_regimen: '_arv_first_regimen',
        cur_arv_meds: '_cur_arv_meds',
        cur_arv_line: '_cur_arv_line',
        first_evidence_patient_pregnant: '_first_evidence_patient_pregnant',
        edd: '_edd',
        screened_for_tb: '_screened_for_tb',
        tb_tx_start_date: '_tb_tx_start_date',
        pcp_prophylaxis_start_date: '_pcp_prophylaxis_start_date',
        cd4_resulted: '_cd4_resulted',
        cd4_resulted_date: '_cd4_resulted_date',
        cd4_1: '_cd4_1',
        cd4_1_date: '_cd4_1_date',
        cd4_2_date: '_cd4_2_date',
        cd4_percent_1: '_cd4_percent_1',
        cd4_percent_1_date: '_cd4_percent_1_date',
        cd4_percent_2: '_cd4_percent_2',
        cd4_percent_2_date: '_cd4_percent_2_date',
        vl_resulted: '_vl_resulted',
        vl_resulted_date: '_vl_resulted_date',
        vl_1: '_vl_1',
        vl_1_date: '_vl_1_date',
        vl_2: '_vl_2',
        vl_2_date: '_vl_2_date',
        vl_order_date: '_vl_order_date',
        cd4_order_date: '_cd4_order_date'
      };
      

      hivSummaryRecordsEtl = [];
      hivSummaryRecordsEtl.push(hivSummaryEtl);
      
      var hivSummaryClone = clone(hivSummaryEtl);
      hivSummaryClone.person_id = hivSummaryClone.person_id + '1';
      hivSummaryClone.uuid = hivSummaryClone.uuid + '1';
      
      hivSummaryRecordsEtl.push(hivSummaryClone);
      /* jshint ignore:end */

    }));

    it('should have Hiv Summary Model Factory defined', function () {
      expect(hivSummaryModelFactory).to.exist;
    });

    it('should always create hiv summary model with all required members defined ', function () {
      /* jshint ignore:start */
      var model = new hivSummaryModelFactory.hivSummary(hivSummaryEtl);

      expect(model.personId()).to.equal(hivSummaryEtl.person_id);
      expect(model.uuid()).to.equal(hivSummaryEtl.uuid);
      expect(model.encounterId()).to.equal(hivSummaryEtl.encounter_id);
      expect(model.encounterDatetime()).to.equal(hivSummaryEtl.encounter_datetime);
      expect(model.locationId()).to.equal(hivSummaryEtl.location_id);
      expect(model.locationUuid()).to.equal(hivSummaryEtl.location_uuid);

      expect(model.visitNum()).to.equal(hivSummaryEtl.visit_num);
      expect(model.deathDate()).to.equal(hivSummaryEtl.death_date);
      expect(model.scheduledVisit()).to.equal(hivSummaryEtl.scheduled_visit);
      expect(model.transferOut()).to.equal(hivSummaryEtl.transfer_out);
      expect(model.outOfCare()).to.equal(hivSummaryEtl.out_of_care);
      expect(model.prevRtcDate()).to.equal(hivSummaryEtl.prev_rtc_date);

      expect(model.rtcDate()).to.equal(hivSummaryEtl.rtc_date);
      expect(model.arvStartDate()).to.equal(hivSummaryEtl.arv_start_date);
      expect(model.arvFirstRegimen()).to.equal(hivSummaryEtl.arv_first_regimen);
      expect(model.curArvMeds()).to.equal(hivSummaryEtl.cur_arv_meds);
      expect(model.curArvLine()).to.equal(hivSummaryEtl.cur_arv_line);
      expect(model.firstEvidencePatientPregnant()).to.equal(hivSummaryEtl.first_evidence_patient_pregnant);


      expect(model.edd()).to.equal(hivSummaryEtl.edd);
      expect(model.screenedForTb()).to.equal(hivSummaryEtl.screened_for_tb);
      expect(model.tbTxStartDate()).to.equal(hivSummaryEtl.tb_tx_start_date);
      expect(model.pcpProphylaxisStartDate()).to.equal(hivSummaryEtl.pcp_prophylaxis_start_date);
      expect(model.cd4Resulted()).to.equal(hivSummaryEtl.cd4_resulted);
      expect(model.cd4ResultedDate()).to.equal(hivSummaryEtl.cd4_resulted_date);

      expect(model.cd4_1()).to.equal(hivSummaryEtl.cd4_1);
      expect(model.cd4_1Date()).to.equal(hivSummaryEtl.cd4_1_date);
      expect(model.cd4_2Date()).to.equal(hivSummaryEtl.cd4_2_date);
      expect(model.cd4Percent_1()).to.equal(hivSummaryEtl.cd4_percent_1);
      expect(model.cd4Percent_1Date()).to.equal(hivSummaryEtl.cd4_percent_1_date);

      expect(model.cd4Percent_2()).to.equal(hivSummaryEtl.cd4_percent_2);
      expect(model.cd4Percent_2Date()).to.equal(hivSummaryEtl.cd4_percent_2_date);
      expect(model.vlResulted()).to.equal(hivSummaryEtl.vl_resulted);
      expect(model.vlResultedDate()).to.equal(hivSummaryEtl.vl_resulted_date);
      expect(model.vl_1()).to.equal(hivSummaryEtl.vl_1);
      expect(model.vl_1Date()).to.equal(hivSummaryEtl.vl_1_date);

      expect(model.vl_2()).to.equal(hivSummaryEtl.vl_2);
      expect(model.vl_2Date()).to.equal(hivSummaryEtl.vl_2_date);
      expect(model.vlOrderDate()).to.equal(hivSummaryEtl.vl_order_date);
      expect(model.cd4OrderDate()).to.equal(hivSummaryEtl.cd4_order_date);
      /* jshint ignore:end */
    });
    
    it('should always a valid array of hiv summary model when toArrayOfModels is called ', function () {
			/* jshint ignore:start */
			var model = new hivSummaryModelFactory.hivSummary(hivSummaryRecordsEtl[0]);

			var models = hivSummaryModelFactory.toArrayOfModels(hivSummaryRecordsEtl);

			expect(model.personId()).to.equal(models[0].personId());
			expect(model.uuid()).to.equal(models[0].uuid());

			expect(models.length).to.equal(2);
     
			/* jshint ignore:end */
		});
    
    

  });
/* jshint ignore:start */
  function clone(obj) {
    
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
   
  }
 /* jshint ignore:end */
})();
