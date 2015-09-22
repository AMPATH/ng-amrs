/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('DefaulterModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      defaulter: defaulter,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function defaulter(defaulterEtl) {

      var modelDefinition = this;
      
      //initialize private members
      var _personId = defaulterEtl.person_id ? defaulterEtl.person_id : '';
      var _encounterId = defaulterEtl.encounter_id ? defaulterEtl.encounter_id : '';
      var _encounterDatetime = defaulterEtl.encounter_datetime ? defaulterEtl.encounter_datetime : '';
      var _encounterType = defaulterEtl.encounter_type ? defaulterEtl.encounter_type : '';
      var _locationId = defaulterEtl.location_id ? defaulterEtl.location_id : '';
      var _locationUuid = defaulterEtl.location_uuid ? defaulterEtl.location_uuid : '';

      var _rtcDate = defaulterEtl.rtc_date ? defaulterEtl.rtc_date : '';
      var _arvStartDate = defaulterEtl.arv_start_date ? defaulterEtl.arv_start_date : '';
      var _encounterTypeName = defaulterEtl.encounter_type_name ? defaulterEtl.encounter_type_name : '';
      var _personName = defaulterEtl.person_name ? defaulterEtl.person_name : '';
      var _phoneNumber = defaulterEtl.phone_number ? defaulterEtl.phone_number : '';
      var _identifiers = defaulterEtl.identifiers ? defaulterEtl.identifiers : '';
      var _patientUuid = defaulterEtl.patient_uuid ? defaulterEtl.patient_uuid : '';
      var _daysSinceRtc = defaulterEtl.days_since_rtc ? defaulterEtl.days_since_rtc : '';

      modelDefinition.personId = function (value) {
        if (angular.isDefined(value)) {
          _personId = value;
        }
        else {
          return _personId;
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

      modelDefinition.rtcDate = function (value) {
        if (angular.isDefined(value)) {
          _rtcDate = value;
        }
        else {
          return _rtcDate;
        }
      };

      modelDefinition.arvStartDate = function (value) {
        if (angular.isDefined(value)) {
          _arvStartDate = value;
        }
        else {
          return _arvStartDate;
        }
      };

      modelDefinition.encounterTypeName = function (value) {
        if (angular.isDefined(value)) {
          _encounterTypeName = value;
        }
        else {
          return _encounterTypeName;
        }
      };

      modelDefinition.personName = function (value) {
        if (angular.isDefined(value)) {
          _personName = value;
        }
        else {
          return _personName;
        }
      };

      modelDefinition.phoneNumber = function (value) {
        if (angular.isDefined(value)) {
          _phoneNumber = value;
        }
        else {
          return _phoneNumber;
        }
      };

      modelDefinition.identifiers = function (value) {
        if (angular.isDefined(value)) {
          _identifiers = value;
        }
        else {
          return _identifiers;
        }
      };

      modelDefinition.patientUuid = function (value) {
        if (angular.isDefined(value)) {
          _patientUuid = value;
        }
        else {
          return _patientUuid;
        }
      };

      modelDefinition.daysSinceRtc = function (value) {
        if (angular.isDefined(value)) {
          _daysSinceRtc = value;
        }
        else {
          return _daysSinceRtc;
        }
      };

    }

    function toArrayOfModels(unwrappedObjects) {
      var wrappedObjects = [];

      for (var i = 0; i < unwrappedObjects.length; i++) {
        wrappedObjects.push(new service.defaulter(unwrappedObjects[i]));
      }

      return wrappedObjects;
    }

  }
})();