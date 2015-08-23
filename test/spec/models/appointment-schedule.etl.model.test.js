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

  describe('AppointmentScheduleModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var appointmentScheduleModelFactory;
    var appointmentScheduleEtl;  // jshint ignore:line

    beforeEach(inject(function ($injector) {
      appointmentScheduleModelFactory = $injector.get('AppointmentScheduleModel');
    }));

    beforeEach(inject(function () {
      /* jshint ignore:start */
      appointmentScheduleEtl = {
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
        cd4_order_date: '_cd4_order_date',
        given_name: 'anex',
        middle_name: 'test',
        family_name: 'anex',
        identifiers: '2524040'
      };
      /* jshint ignore:end */
    }));

    it('should have Appointment Schedule Model Factory defined', function () {
      expect(appointmentScheduleModelFactory).to.exist;
    });

    it('should always create appointment schedule model with all required members defined ', function () {
      /* jshint ignore:start */
      var model = new appointmentScheduleModelFactory.appointmentSchedule(appointmentScheduleEtl);

      expect(model.personId()).to.equal(appointmentScheduleEtl.person_id);
      expect(model.uuid()).to.equal(appointmentScheduleEtl.uuid);
      expect(model.encounterId()).to.equal(appointmentScheduleEtl.encounter_id);
      expect(model.encounterDatetime()).to.equal(appointmentScheduleEtl.encounter_datetime);
      expect(model.locationId()).to.equal(appointmentScheduleEtl.location_id);
      expect(model.locationUuid()).to.equal(appointmentScheduleEtl.location_uuid);

      expect(model.visitNum()).to.equal(appointmentScheduleEtl.visit_num);
      expect(model.deathDate()).to.equal(appointmentScheduleEtl.death_date);
      expect(model.scheduledVisit()).to.equal(appointmentScheduleEtl.scheduled_visit);
      expect(model.transferOut()).to.equal(appointmentScheduleEtl.transfer_out);
      expect(model.outOfCare()).to.equal(appointmentScheduleEtl.out_of_care);
      expect(model.prevRtcDate()).to.equal(appointmentScheduleEtl.prev_rtc_date);

      expect(model.rtcDate()).to.equal(appointmentScheduleEtl.rtc_date);
      expect(model.arvStartDate()).to.equal(appointmentScheduleEtl.arv_start_date);
      expect(model.arvFirstRegimen()).to.equal(appointmentScheduleEtl.arv_first_regimen);
      expect(model.curArvMeds()).to.equal(appointmentScheduleEtl.cur_arv_meds);
      expect(model.curArvLine()).to.equal(appointmentScheduleEtl.cur_arv_line);
      expect(model.firstEvidencePatientPregnant()).to.equal(appointmentScheduleEtl.first_evidence_patient_pregnant);


      expect(model.edd()).to.equal(appointmentScheduleEtl.edd);
      expect(model.screenedForTb()).to.equal(appointmentScheduleEtl.screened_for_tb);
      expect(model.tbTxStartDate()).to.equal(appointmentScheduleEtl.tb_tx_start_date);
      expect(model.pcpProphylaxisStartDate()).to.equal(appointmentScheduleEtl.pcp_prophylaxis_start_date);
      expect(model.cd4Resulted()).to.equal(appointmentScheduleEtl.cd4_resulted);
      expect(model.cd4ResultedDate()).to.equal(appointmentScheduleEtl.cd4_resulted_date);

      expect(model.cd4_1()).to.equal(appointmentScheduleEtl.cd4_1);
      expect(model.cd4_1Date()).to.equal(appointmentScheduleEtl.cd4_1_date);
      expect(model.cd4_2Date()).to.equal(appointmentScheduleEtl.cd4_2_date);
      expect(model.cd4Percent_1()).to.equal(appointmentScheduleEtl.cd4_percent_1);
      expect(model.cd4Percent_1Date()).to.equal(appointmentScheduleEtl.cd4_percent_1_date);

      expect(model.cd4Percent_2()).to.equal(appointmentScheduleEtl.cd4_percent_2);
      expect(model.cd4Percent_2Date()).to.equal(appointmentScheduleEtl.cd4_percent_2_date);
      expect(model.vlResulted()).to.equal(appointmentScheduleEtl.vl_resulted);
      expect(model.vlResultedDate()).to.equal(appointmentScheduleEtl.vl_resulted_date);
      expect(model.vl_1()).to.equal(appointmentScheduleEtl.vl_1);
      expect(model.vl_1Date()).to.equal(appointmentScheduleEtl.vl_1_date);

      expect(model.vl_2()).to.equal(appointmentScheduleEtl.vl_2);
      expect(model.vl_2Date()).to.equal(appointmentScheduleEtl.vl_2_date);
      expect(model.vlOrderDate()).to.equal(appointmentScheduleEtl.vl_order_date);
      expect(model.cd4OrderDate()).to.equal(appointmentScheduleEtl.cd4_order_date);
      
      expect(model.givenName()).to.equal(appointmentScheduleEtl.given_name);
      expect(model.middleName()).to.equal(appointmentScheduleEtl.middle_name);
      expect(model.familyName()).to.equal(appointmentScheduleEtl.family_name);
      expect(model.identifiers()).to.equal(appointmentScheduleEtl.identifiers);
      /* jshint ignore:end */
    });

  });

})();
