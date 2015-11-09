/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('PatientTestModel', factory);

  factory.$inject = ['UtilService'];

  function factory(UtilService) {
    var service = {
      patientTest: patientTest
    };

    return service;

    function patientTest(labEtl) {

      var modelDefinition = this;
      
      //initialize private members
      var _personId = !UtilService.isNullOrUndefined(labEtl.person_id) ?
       labEtl.person_id : '';
      var _uuid = !UtilService.isNullOrUndefined(labEtl.uuid) ?
       labEtl.uuid : '';
      var _encounterId = !UtilService.isNullOrUndefined(labEtl.encounter_id) ?
       labEtl.encounter_id : '';
      var _encounterDatetime = !UtilService.isNullOrUndefined(labEtl.encounter_datetime) ?
       labEtl.encounter_datetime : '';
      var _encounterType = !UtilService.isNullOrUndefined(labEtl.encounter_type) ?
       labEtl.encounter_type : '';
      var _locationId = !UtilService.isNullOrUndefined(labEtl.location_id) ?
       labEtl.location_id : '';
      var _locationUuid = !UtilService.isNullOrUndefined(labEtl.location_uuid) ?
       labEtl.location_uuid : '';

      var _hivViralLoad = !UtilService.isNullOrUndefined(labEtl.hiv_viral_load) ?
       labEtl.hiv_viral_load : '';
      var _cd4Count = !UtilService.isNullOrUndefined(labEtl.cd4_count) ?
       labEtl.cd4_count : '';
      var _cd4Percent = !UtilService.isNullOrUndefined(labEtl.cd4_percent) ?
       labEtl.cd4_percent : '';
      var _hemoglobin = !UtilService.isNullOrUndefined(labEtl.hemoglobin) ?
       labEtl.hemoglobin : '';
      var _ast = !UtilService.isNullOrUndefined(labEtl.ast) ?
       labEtl.ast : '';
      var _creatinine = !UtilService.isNullOrUndefined(labEtl.creatinine) ?
       labEtl.creatinine : '';
      var _chestXray = !UtilService.isNullOrUndefined(labEtl.chest_xray) ?
       labEtl.chest_xray : '';
      var _testsOrdered = !UtilService.isNullOrUndefined(labEtl.tests_ordered) ?
       labEtl.tests_ordered : '';

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

      modelDefinition.encounterType = function (value) {
        if (angular.isDefined(value)) {
          _encounterType = value;
        }
        else {
          return _encounterType;
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

      modelDefinition.locationUuid = function (value) {
        if (angular.isDefined(value)) {
          _locationUuid = value;
        }
        else {
          return _locationUuid;
        }
      };

      modelDefinition.hivViralLoad = function (value) {
        if (angular.isDefined(value)) {
          _hivViralLoad = value;
        }
        else {
          return _hivViralLoad;
        }
      };

      modelDefinition.cd4Count = function (value) {
        if (angular.isDefined(value)) {
          _cd4Count = value;
        }
        else {
          return _cd4Count;
        }
      };

      modelDefinition.cd4Percent = function (value) {
        if (angular.isDefined(value)) {
          _cd4Percent = value;
        }
        else {
          return _cd4Percent;
        }
      };

      modelDefinition.hemoglobin = function (value) {
        if (angular.isDefined(value)) {
          _hemoglobin = value;
        }
        else {
          return _hemoglobin;
        }
      };

      modelDefinition.ast = function (value) {
        if (angular.isDefined(value)) {
          _ast = value;
        }
        else {
          return _ast;
        }
      };

      modelDefinition.creatinine = function (value) {
        if (angular.isDefined(value)) {
          _creatinine = value;
        }
        else {
          return _creatinine;
        }
      };

      modelDefinition.chestXray = function (value) {
        if (angular.isDefined(value)) {
          _chestXray = value;
        }
        else {
          return _chestXray;
        }
      };

      modelDefinition.testsOrdered = function (value) {
        if (angular.isDefined(value)) {
          _testsOrdered = value;
        }
        else {
          return _testsOrdered;
        }
      };

    }

  }
})();