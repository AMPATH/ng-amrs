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
    var returnErrorOnNextCall = false;
    var service = {
      getVitals: getVitals,
      numberOfVitalsToReturn: numberOfVitalsToReturn,
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

  }
})();
