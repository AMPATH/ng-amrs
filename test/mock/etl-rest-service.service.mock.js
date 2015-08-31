/*
jshint -W098, -W117, -W003, -W026
*/
(function () {
  'use strict';

  var mockedModule = angular
    .module('mock.etlRestServices', []);

  mockedModule.factory('EtlRestService', EtlRestService);
  EtlRestService.$inject = ['$q'];
  function EtlRestService($q) {
    var numberOfVitalsToReturn = 40;
    var numberOfPatientTestsToReturn = 40;
    var returnErrorOnNextCall = false;
    var service = {
      isMockService: true,
      getVitals: getVitals,
      numberOfVitalsToReturn: numberOfVitalsToReturn,
      
      getPatientTests: getPatientTests,
      numberOfPatientTestsToReturn: numberOfPatientTestsToReturn,
      
      getAppointmentSchedule:getAppointmentSchedule,
      numberOfAppointmentsToReturn: 20,
      
      returnErrorOnNextCall: returnErrorOnNextCall
    };
    //debugger;
    return service;

    function getVitals(patientUuid, startIndex, limit, successCallback, failedCallback) {
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }
      if (returnErrorOnNextCall === true) {
        console.log('returning error on get vitals');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var vitals = [];

      var numberOfRecords = limit;

      if (startIndex >= numberOfVitalsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > numberOfVitalsToReturn) {
        numberOfRecords = numberOfVitalsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        vitals.push(getVitalRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: vitals
      });

    }

    function getPatientTests(patientUuid, startIndex, limit, successCallback, failedCallback) {
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }
      if (returnErrorOnNextCall === true) {
        console.log('returning error on get vitals');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var patientTests = [];

      var numberOfRecords = limit;

      if (startIndex >= numberOfPatientTestsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > numberOfPatientTestsToReturn) {
        numberOfRecords = numberOfPatientTestsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patientTests.push(getPatientTestRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: patientTests
      });

    }

    function getAppointmentSchedule(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on get vitals');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var appointments = [];

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfAppointmentsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfAppointmentsToReturn) {
        numberOfRecords = service.numberOfAppointmentsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        appointments.push(getAppointmentScheduleRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: appointments
      });

    }

    function getVitalRecord(index) {
      var vitalRecord = {
        person_id: 'person_id',
        uuid: 'uuid',
        encounter_id: 'encounter_id' + index,
        encounter_datetime: 'encounter_datetime' + index,
        location_id: '_location_id' + index,
        weight: 'weight' + index,
        height: 'height' + index,
        temp: 'temp' + index,
        oxygen_sat: 'oxygen_sat' + index,
        systolic_bp: 'systolic_bp' + index,
        diastolic_bp: 'diastolic_bp' + index,
        pulse: 'pulse' + index
      };
      return vitalRecord;
    }

    function getPatientTestRecord(index) {
      var patientTestEtl = {
        person_id: 'person_id',
        uuid: 'uuid',
        encounter_id: 'encounter_id' + index,
        encounter_datetime: 'encounter_datetime' + index,
        encounter_type: 'encounter_type' + index,
        location_id: '_location_id' + index,
        location_uuid: 'location_uuid' + index,
        hiv_viral_load: 'hiv_viral_load' + index,
        cd4_count: 'cd4_count' + index,
        cd4_percent: 'cd4_percent' + index,
        hemoglobin: 'hemoglobin' + index,
        ast: 'ast' + index,
        creatinine: 'creatinine' + index,
        chest_xray: 'chest_xray' + index,
        tests_ordered: 'tests_ordered' + index
      };
      return patientTestEtl;
    }

    function getAppointmentScheduleRecord(index) {
      /* jshint ignore:start */
      var appointmentScheduleEtl = {
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
      return appointmentScheduleEtl;
    }



  }
})();
