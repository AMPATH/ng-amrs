/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('VitalModel', factory);

  factory.$inject = ['UtilService'];

  function factory(UtilService) {
    var service = {
      vital: vital
    };

    return service;

    function vital(vitalEtl) {

      var modelDefinition = this;

      //initialize private members
      var _personId = !UtilService.isNullOrUndefined(vitalEtl.person_id) ?
       vitalEtl.person_id : '';
      var _uuid = !UtilService.isNullOrUndefined(vitalEtl.uuid) ? vitalEtl.uuid : '';
      var _encounterId = !UtilService.isNullOrUndefined(vitalEtl.encounter_id) ?
       vitalEtl.encounter_id : '';
      var _encounterDatetime = !UtilService.isNullOrUndefined(vitalEtl.encounter_datetime) ?
       vitalEtl.encounter_datetime : '';
      var _locationId = !UtilService.isNullOrUndefined(vitalEtl.location_id) ?
       vitalEtl.location_id : '';

      var _weight = !UtilService.isNullOrUndefined(vitalEtl.weight) ? vitalEtl.weight : '';
      var _height = !UtilService.isNullOrUndefined(vitalEtl.height) ? vitalEtl.height : '';
      var _temperature = !UtilService.isNullOrUndefined(vitalEtl.temp) ? vitalEtl.temp : '';
      var _oxygenSat = !UtilService.isNullOrUndefined(vitalEtl.oxygen_sat) ?
       vitalEtl.oxygen_sat : '';
      var _systolicBp = !UtilService.isNullOrUndefined(vitalEtl.systolic_bp) ?
      vitalEtl.systolic_bp : '';
      var _diastolicBp = !UtilService.isNullOrUndefined(vitalEtl.diastolic_bp) ?
      vitalEtl.diastolic_bp : '';

      var _pulse = !UtilService.isNullOrUndefined(vitalEtl.pulse) ? vitalEtl.pulse : '';

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
