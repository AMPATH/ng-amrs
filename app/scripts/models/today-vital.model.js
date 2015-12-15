/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
    .module('models')
    .factory('TodayVitalModel', TodayVitalModel);

  TodayVitalModel.$inject = [];

  function TodayVitalModel() {
    var service = {
      getVitalsFromObs: getVitalsFromObs,
    };

    return service;

    function getVitalsFromObs(obsArray) {
      var modelDefinition = {};
      for (var i = 0; i < obsArray.length; i++) {
        var ob = obsArray[i];
        if (ob.concept.uuid === 'a8a65d5a-1350-11df-a1f1-0026b9348838') {
          modelDefinition.systolic = ob.value;
        } else if (ob.concept.uuid === 'a8a65e36-1350-11df-a1f1-0026b9348838') {
          modelDefinition.diastolic = ob.value;
        } else if (ob.concept.uuid === 'a8a65f12-1350-11df-a1f1-0026b9348838') {
          modelDefinition.pulse = ob.value;
        } else if (ob.concept.uuid === 'a8a65fee-1350-11df-a1f1-0026b9348838') {
          modelDefinition.temperature = ob.value;
        } else if (ob.concept.uuid === 'a8a66354-1350-11df-a1f1-0026b9348838') {
          modelDefinition.oxygenSaturation = ob.value;
        } else if (ob.concept.uuid === 'a8a6619c-1350-11df-a1f1-0026b9348838') {
          modelDefinition.height = ob.value;
        } else if (ob.concept.uuid === 'a8a660ca-1350-11df-a1f1-0026b9348838') {
          modelDefinition.weight = ob.value;
        } else if (ob.concept.uuid === 'a89c60c0-1350-11df-a1f1-0026b9348838') {
          modelDefinition.bmi = ob.value;
        }
      }

      return modelDefinition;
    }
  }
})();
