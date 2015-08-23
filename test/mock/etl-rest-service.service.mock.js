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
      getVitals: getVitals,
      getPatientTests: getPatientTests,
      numberOfVitalsToReturn: numberOfVitalsToReturn,
      numberOfPatientTestsToReturn: numberOfPatientTestsToReturn,
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

  }
})();
