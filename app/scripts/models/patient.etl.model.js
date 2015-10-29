/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('PatientEtlModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      patient: patient,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function patient(patientEtl) {

      var modelDefinition = this;
      //initialize private members
      var _personId = patientEtl.person_id ? patientEtl.person_id : '';
      var _encounterId = patientEtl.encounter_id ? patientEtl.encounter_id : '';
      var _locationId = patientEtl.location_id ? patientEtl.location_id : '';
      var _locationUuid = patientEtl.location_uuid ? patientEtl.location_uuid : '';
      var _personName = patientEtl.person_name ? patientEtl.person_name : '';
      var _identifiers = patientEtl.identifiers ? patientEtl.identifiers : '';
      var _patientUuid = patientEtl.patient_uuid ? patientEtl.patient_uuid : '';

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

      modelDefinition.personName = function (value) {
        if (angular.isDefined(value)) {
          _personName = value;
        }
        else {
          return _personName;
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
    }

    function toArrayOfModels(unwrappedObjects) {
      var wrappedObjects = [];

      for (var i = 0; i < unwrappedObjects.length; i++) {
        wrappedObjects.push(new service.patient(unwrappedObjects[i]));
      }

      return wrappedObjects;
    }
  }
})();
