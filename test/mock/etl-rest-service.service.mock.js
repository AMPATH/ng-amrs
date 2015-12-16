/* global readJSON */
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
    var service = {
      isMockService: true,
      getVitals: getVitals,
      numberOfVitalsToReturn:numberOfVitalsToReturn,

      getHivSummary: getHivSummary,
      numberOfHivSummaryRecordsToReturn: 20,

      getPatientTests: getPatientTests,
      numberOfPatientTestsToReturn: numberOfPatientTestsToReturn,

      getDailyVisits: getDailyVisits,
      getDailyNotReturnedVisits:getDailyNotReturnedVisits,


      getAppointmentSchedule: getAppointmentSchedule,
      numberOfAppointmentsToReturn: 20,

      getDefaultersList: getDefaultersList,
      numberOfDefaultersToReturn: 20,

      getPatientsCreatedByPeriod:getPatientsCreatedByPeriod,
      numberOfPatientCreationRowsToReturn:20,

      getDetailsOfPatientsCreatedInLocation:getDetailsOfPatientsCreatedInLocation,
      numberOfPatientCreationInLocationRowsToReturn:20,

      getPatientListByIndicator: getPatientListByIndicator,
      numberOfPatientsToReturn: 20,

      getPatientByIndicatorAndLocation:getPatientByIndicatorAndLocation,

      getDataEntryStatistics: getDataEntryStatistics,

      returnErrorOnNextCall: false
    };
    //debugger;
    return service;

    function getHivSummary(patientUuid, startIndex, limit, successCallback, failedCallback) {
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on get hivSummary');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var hivSummaryRecords = [];

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfHivSummaryRecordsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfHivSummaryRecordsToReturn) {
        numberOfRecords = service.numberOfHivSummaryRecordsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        hivSummaryRecords.push(getHivSummaryRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: hivSummaryRecords
      });
    }

    function getVitals(patientUuid, startIndex, limit, successCallback, failedCallback) {
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

      var vitals = [];

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfVitalsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfVitalsToReturn) {
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
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on get vitals');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var patientTests = [];

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfPatientTestsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfPatientTestsToReturn) {
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

    function getDefaultersList(locationUuid, defaulterThreshold, successCallback, failedCallback, startIndex, limit) {
      console.log('calling mock getDefaultersList');

      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = service.numberOfDefaultersToReturn;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on getDefaultersList');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var patients = [];

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfDefaultersToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfDefaultersToReturn) {
        numberOfRecords = service.numberOfDefaultersToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patients.push(getDefaulterRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: patients
      });


    }

    function getDataEntryStatistics(subType, startDate, endDate, locationUuids,
      encounterTypeUuids, formUuids, providerUuid, creatorUuid, successCallback, failedCallback) {
      switch (subType) {
        case 'by-date-by-encounter-type':
          if(service.returnErrorOnNextCall === true){
            if(failedCallback)
            failedCallback('simulating error!');
          }else {
            var mockData = readJSON('test/mock/data-entry-stats-view1.json');
            if(successCallback)
            successCallback(mockData);
          }
          break;
      }
      return  readJSON('test/mock/data-entry-stats-view1.json');
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
    //getDailyNotReturnedVisits Mock

    function getDailyNotReturnedVisits(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
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
        appointments.push(getDailyVisitRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: appointments
      });

    }


 function getDailyVisits(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
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
        appointments.push(getDailyVisitRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: appointments
      });

    }





 function getPatientsCreatedByPeriod(startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      console.log('calling mock getPatientsCreatedByPeriod');
      var patientCreationRecords = [];
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = service.numberOfPatientCreationRowsToReturn;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on getPatientsCreatedByPeriod');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfPatientCreationRowsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfPatientCreationRowsToReturn) {
        numberOfRecords = service.numberOfPatientCreationRowsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patientCreationRecords.push(getPatientCreationRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result:patientCreationRecords
      });

    }

    function getDetailsOfPatientsCreatedInLocation(location, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      console.log('calling mock getDetailsOfPatientsCreatedInLocation');
      var patientCreationRecordsDetails = [];
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = service.numberOfPatientCreationInLocationRowsToReturn;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on getDetailsOfPatientsCreatedInLocation');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var numberOfRecords = limit;

      if (startIndex >= service.numberOfPatientCreationRowsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfPatientCreationRowsToReturn) {
        numberOfRecords = service.numberOfPatientCreationRowsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patientCreationRecordsDetails.push(getDetailsOfPatientCreationInLocationRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result:patientCreationRecordsDetails
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

    function getDefaulterRecord(index) {
      /* jshint ignore:start */
      var defaulterEtl = {
        person_id: 'person_id' + index,
        encounter_id: 'encounter_id' + index,
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
        patient_uuid: 'patient_uuid' + index
      };
      /* jshint ignore:end */
      return defaulterEtl;
    }

    function getPatientEtlRecord(index) {
      /* jshint ignore:start */
      var patientEtl = {
        person_id: 'person_id' + index,
        encounter_id: 'encounter_id' + index,
        location_id: '_location_id',
        location_uuid: 'location_uuid',
        patient_uuid: 'patient_uuid' + index,
        person_name: 'person_name',
        identifiers: 'identifiers',

      };
      /* jshint ignore:end */
      return patientEtl;
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
    function getDailyVisitRecord(index) {
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

    function getHivSummaryRecord(index) {
      /* jshint ignore:start */
      var hivSummaryEtl = {
        person_id: 'person_id' + index,
        uuid: 'middleName' + index,
        encounter_id: 'familyName' + index,
        encounter_datetime: 'familyName2' + index,
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
      /* jshint ignore:end */

      return hivSummaryEtl;
    }
    function getPatientByIndicatorAndLocation(locationUuid, startDate, endDate, indicator, successCallback, failedCallback,
                                              startIndex, limit, locationIds){
      console.log('calling mock getPatientByIndicatorAndLocation');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = service.numberOfPatientsToReturn;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on getPatientByIndicatorAndLocation');
        failedCallback({ message: 'An error occurred' });
        return;
      }

      var patients = [];
      var numberOfRecords = limit;
      if (startIndex >= service.numberOfPatientsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfPatientsToReturn) {
        numberOfRecords = service.numberOfPatientsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patients.push(getPatientEtlRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: patients
      });
    }
    function getPatientListByIndicator(locationUuid, startDate, endDate, indicator, successCallback, failedCallback,
      startIndex, limit) {
      console.log('calling mock getPatientListByIndicator');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = service.numberOfPatientsToReturn;
      }
      if (service.returnErrorOnNextCall === true) {
        console.log('returning error on getPatientListByIndicator');
        failedCallback({ message: 'An error occured' });
        return;
      }

      var patients = [];
      var numberOfRecords = limit;
      if (startIndex >= service.numberOfPatientsToReturn) {
        successCallback({
          startIndex: startIndex,
          size: 0,
          result: []
        });
        return;
      }

      if ((startIndex + limit) > service.numberOfPatientsToReturn) {
        numberOfRecords = service.numberOfPatientsToReturn - (startIndex + limit);
      }
      else {
        numberOfRecords = limit;
      }

      for (var i = startIndex; i < (startIndex + numberOfRecords); i++) {
        patients.push(getPatientEtlRecord(i));
      }

      successCallback({
        startIndex: startIndex,
        size: numberOfRecords,
        result: patients
      });
    }

    function getPatientCreationRecord(index) {
      return {
        location_id:'location '+index,
        name:'Clinic '+index,
        total:'Total'+index
      }
    }

    function getDetailsOfPatientCreationInLocationRecord(index) {
      return {
        patient_id:'patient_id '+index,
        given_name:'given_name '+index,
        middle_name:'middle_name '+index,
        family_name:'family_name '+index
      }
    }

  }
})();
