/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('VitalModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      vital: vital
    };

    return service;

    function vital(vitalEtl) {
      
      var modelDefinition = this;
      
      //initialize private members
      var _personId = vitalEtl.person_id ? vitalEtl.person_id : '';
      var _uuid = vitalEtl.uuid ? vitalEtl.uuid : '';
      var _encounterId = vitalEtl.encounter_id ? vitalEtl.encounter_id : '';
      var _encounterDatetime = vitalEtl.encounter_datetime ? vitalEtl.encounter_datetime : '';
      var _locationId = vitalEtl.location_id ? vitalEtl.location_id : '';

      var _weight = vitalEtl.weight ? vitalEtl.weight : '';
      var _height = vitalEtl.height ? vitalEtl.height : '';
      var _temperature = vitalEtl.temp ? vitalEtl.temp : '';
      var _oxygenSat = vitalEtl.oxygen_sat ? vitalEtl.oxygen_sat : '';
      var _systolicBp = vitalEtl.systolic_bp ? vitalEtl.systolic_bp : '';
      var _diastolicBp = vitalEtl.diastolic_bp ? vitalEtl.diastolic_bp : '';

      var _pulse = vitalEtl.pulse ? vitalEtl.pulse : '';

      modelDefinition.personId = function (value) {
        if (angular.isDefined(value)) {
          _personId = value;
        }
        else {
          return _personId;
        }
      };

      modelDefinition.uuid = function (value) {
        if (angular.isDefined(value)) {
          _uuid = value;
        }
        else {
          return _uuid;
        }
      };

      modelDefinition.encounterId = function (value) {
        if (angular.isDefined(value)) {
          _encounterId = value;
        }
        else {
          return _encounterId;
        }
      };

      modelDefinition.encounterDatetime = function (value) {
        if (angular.isDefined(value)) {
          _encounterDatetime = value;
        }
        else {
          return _encounterDatetime;
        }
      };

      modelDefinition.locationId = function (value) {
        if (angular.isDefined(value)) {
          _locationId = value;
        }
        else {
          return _locationId;
        }
      };

      modelDefinition.weight = function (value) {
        if (angular.isDefined(value)) {
          _weight = value;
        }
        else {
          return _weight;
        }
      };

      modelDefinition.height = function (value) {
        if (angular.isDefined(value)) {
          _height = value;
        }
        else {
          return _height;
        }
      };

      modelDefinition.temperature = function (value) {
        if (angular.isDefined(value)) {
          _temperature = value;
        }
        else {
          return _temperature;
        }
      };

      modelDefinition.oxygenSat = function (value) {
        if (angular.isDefined(value)) {
          _oxygenSat = value;
        }
        else {
          return _oxygenSat;
        }
      };

      modelDefinition.systolicBp = function (value) {
        if (angular.isDefined(value)) {
          _systolicBp = value;
        }
        else {
          return _systolicBp;
        }
      };

      modelDefinition.diastolicBp = function (value) {
        if (angular.isDefined(value)) {
          _diastolicBp = value;
        }
        else {
          return _diastolicBp;
        }
      };

      modelDefinition.pulse = function (value) {
        if (angular.isDefined(value)) {
          _pulse = value;
        }
        else {
          return _pulse;
        }
      };

    }

  }
})();