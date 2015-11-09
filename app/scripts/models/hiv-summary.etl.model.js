/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('HivSummaryModel', factory);

  factory.$inject = ['UtilService'];

  function factory(UtilService) {
    var service = {
      hivSummary: hivSummary,
      toArrayOfModels:toArrayOfModels
    };

    return service;

    //madnatory fields givenName, familyName
    function hivSummary(hivSummaryEtl) {
      var modelDefinition = this;

      //initialize private members
      var _personId = !UtilService.isNullOrUndefined(hivSummaryEtl.person_id) ?
       hivSummaryEtl.person_id : '';
      var _uuid = !UtilService.isNullOrUndefined(hivSummaryEtl.uuid) ?
       hivSummaryEtl.uuid : '';
      var _encounterId = !UtilService.isNullOrUndefined(hivSummaryEtl.encounter_id) ?
       hivSummaryEtl.encounter_id : '';
      var _encounterDatetime = !UtilService.isNullOrUndefined(hivSummaryEtl.encounter_datetime) ? 
      hivSummaryEtl.encounter_datetime : '';
      var _locationId = !UtilService.isNullOrUndefined(hivSummaryEtl.location_id) ?
       hivSummaryEtl.location_id : '';
      var _locationUuid = !UtilService.isNullOrUndefined(hivSummaryEtl.location_uuid) ? 
      hivSummaryEtl.location_uuid : '';

      var _visitNum = !UtilService.isNullOrUndefined(hivSummaryEtl.visit_num) ? 
      hivSummaryEtl.visit_num : '';
      var _deathDate = hivSummaryEtl.death_date ? hivSummaryEtl.death_date : '';
      var _scheduledVisit = !UtilService.isNullOrUndefined(hivSummaryEtl.scheduled_visit) ?
       hivSummaryEtl.scheduled_visit : '';
      var _transferOut = !UtilService.isNullOrUndefined(hivSummaryEtl.transfer_out) ?
       hivSummaryEtl.transfer_out : '';
      var _outOfCare = !UtilService.isNullOrUndefined(hivSummaryEtl.out_of_care) ?
       hivSummaryEtl.out_of_care : '';
      var _prevRtcDate = !UtilService.isNullOrUndefined(hivSummaryEtl.prev_rtc_date) ?
       hivSummaryEtl.prev_rtc_date : '';

      var _rtcDate = !UtilService.isNullOrUndefined(hivSummaryEtl.rtc_date) ?
       hivSummaryEtl.rtc_date : '';
      var _arvStartDate = !UtilService.isNullOrUndefined(hivSummaryEtl.arv_start_date) ?
       hivSummaryEtl.arv_start_date : '';
      var _arvFirstRegimen = !UtilService.isNullOrUndefined(hivSummaryEtl.arv_first_regimen) ?
       hivSummaryEtl.arv_first_regimen : '';
      var _curArvMeds = !UtilService.isNullOrUndefined(hivSummaryEtl.cur_arv_meds) ?
       hivSummaryEtl.cur_arv_meds : '';
      var _curArvLine = !UtilService.isNullOrUndefined(hivSummaryEtl.cur_arv_line) ?
       hivSummaryEtl.cur_arv_line : '';
      var _firstEvidencePatientPregnant = 
      !UtilService.isNullOrUndefined(hivSummaryEtl.first_evidence_patient_pregnant) ?
       hivSummaryEtl.first_evidence_patient_pregnant : '';

      var _edd = !UtilService.isNullOrUndefined(hivSummaryEtl.edd) ? hivSummaryEtl.edd : '';
      var _screenedForTb = !UtilService.isNullOrUndefined(hivSummaryEtl.screened_for_tb) ?
       hivSummaryEtl.screened_for_tb : '';
      var _tbTxStartDate = !UtilService.isNullOrUndefined(hivSummaryEtl.tb_tx_start_date) ?
       hivSummaryEtl.tb_tx_start_date : '';
      var _pcpProphylaxisStartDate = 
      !UtilService.isNullOrUndefined(hivSummaryEtl.pcp_prophylaxis_start_date) ?
       hivSummaryEtl.pcp_prophylaxis_start_date : '';
      var _cd4Resulted = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_resulted) ?
       hivSummaryEtl.cd4_resulted : '';
      var _cd4ResultedDate = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_resulted_date) ?
       hivSummaryEtl.cd4_resulted_date : '';

      var _cd4_1 = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_1) ?
       hivSummaryEtl.cd4_1 : '';
      var _cd4_1Date = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_1_date) ?
       hivSummaryEtl.cd4_1_date : '';
      var _cd4_2Date = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_2_date) ?
       hivSummaryEtl.cd4_2_date : '';
      var _cd4Percent_1 = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_percent_1) ?
       hivSummaryEtl.cd4_percent_1 : '';
      var _cd4Percent_1Date = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_percent_1_date) ?
       hivSummaryEtl.cd4_percent_1_date : '';
      var _cd4Percent_2 = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_percent_2) ?
       hivSummaryEtl.cd4_percent_2 : '';

      var _cd4Percent_2Date = 
      !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_percent_2_date) ? 
      hivSummaryEtl.cd4_percent_2_date : '';
      var _vlResulted = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_resulted) ?
       hivSummaryEtl.vl_resulted : '';
      var _vlResultedDate = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_resulted_date) ?
       hivSummaryEtl.vl_resulted_date : '';
      var _vl_1 = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_1) ?
       hivSummaryEtl.vl_1 : '';
      var _vl_1Date = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_1_date) ?
       hivSummaryEtl.vl_1_date : '';
      var _vl_2 = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_2) ?
       hivSummaryEtl.vl_2 : '';

      var _vl_2Date = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_2_date) ?
       hivSummaryEtl.vl_2_date : '';
      var _vlOrderDate = !UtilService.isNullOrUndefined(hivSummaryEtl.vl_order_date) ?
       hivSummaryEtl.vl_order_date : '';
      var _cd4OrderDate = !UtilService.isNullOrUndefined(hivSummaryEtl.cd4_order_date) ?
       hivSummaryEtl.cd4_order_date : '';


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

      modelDefinition.locationUuid = function (value) {
        if (angular.isDefined(value)) {
          _locationUuid = value;
        }
        else {
          return _locationUuid;
        }
      };

      modelDefinition.visitNum = function (value) {
        if (angular.isDefined(value)) {
          _visitNum = value;
        }
        else {
          return _visitNum;
        }
      };

      modelDefinition.deathDate = function (value) {
        if (angular.isDefined(value)) {
          _deathDate = value;
        }
        else {
          return _deathDate;
        }
      };

      modelDefinition.scheduledVisit = function (value) {
        if (angular.isDefined(value)) {
          _scheduledVisit = value;
        }
        else {
          return _scheduledVisit;
        }
      };

      modelDefinition.transferOut = function (value) {
        if (angular.isDefined(value)) {
          _transferOut = value;
        }
        else {
          return _transferOut;
        }
      };

      modelDefinition.outOfCare = function (value) {
        if (angular.isDefined(value)) {
          _outOfCare = value;
        }
        else {
          return _outOfCare;
        }
      };

      modelDefinition.prevRtcDate = function (value) {
        if (angular.isDefined(value)) {
          _prevRtcDate = value;
        }
        else {
          return _prevRtcDate;
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

      modelDefinition.arvFirstRegimen = function (value) {
        if (angular.isDefined(value)) {
          _arvFirstRegimen = value;
        }
        else {
          return _arvFirstRegimen;
        }
      };

      modelDefinition.curArvMeds = function (value) {
        if (angular.isDefined(value)) {
          _curArvMeds = value;
        }
        else {
          return _curArvMeds;
        }
      };

      modelDefinition.curArvLine = function (value) {
        if (angular.isDefined(value)) {
          _curArvLine = value;
        }
        else {
          return _curArvLine;
        }
      };

      modelDefinition.firstEvidencePatientPregnant = function (value) {
        if (angular.isDefined(value)) {
          _firstEvidencePatientPregnant = value;
        }
        else {
          return _firstEvidencePatientPregnant;
        }
      };

      modelDefinition.edd = function (value) {
        if (angular.isDefined(value)) {
          _edd = value;
        }
        else {
          return _edd;
        }
      };

      modelDefinition.screenedForTb = function (value) {
        if (angular.isDefined(value)) {
          _screenedForTb = value;
        }
        else {
          return _screenedForTb;
        }
      };

      modelDefinition.tbTxStartDate = function (value) {
        if (angular.isDefined(value)) {
          _tbTxStartDate = value;
        }
        else {
          return _tbTxStartDate;
        }
      };

      modelDefinition.pcpProphylaxisStartDate = function (value) {
        if (angular.isDefined(value)) {
          _pcpProphylaxisStartDate = value;
        }
        else {
          return _pcpProphylaxisStartDate;
        }
      };

      modelDefinition.cd4Resulted = function (value) {
        if (angular.isDefined(value)) {
          _cd4Resulted = value;
        }
        else {
          return _cd4Resulted;
        }
      };

      modelDefinition.cd4ResultedDate = function (value) {
        if (angular.isDefined(value)) {
          _cd4ResultedDate = value;
        }
        else {
          return _cd4ResultedDate;
        }
      };

      modelDefinition.cd4_1 = function (value) {
        if (angular.isDefined(value)) {
          _cd4_1 = value;
        }
        else {
          return _cd4_1;
        }
      };

      modelDefinition.cd4_1Date = function (value) {
        if (angular.isDefined(value)) {
          _cd4_1Date = value;
        }
        else {
          return _cd4_1Date;
        }
      };

      modelDefinition.cd4_2Date = function (value) {
        if (angular.isDefined(value)) {
          _cd4_2Date = value;
        }
        else {
          return _cd4_2Date;
        }
      };

      modelDefinition.cd4Percent_1 = function (value) {
        if (angular.isDefined(value)) {
          _cd4Percent_1 = value;
        }
        else {
          return _cd4Percent_1;
        }
      };

      modelDefinition.cd4Percent_1Date = function (value) {
        if (angular.isDefined(value)) {
          _cd4Percent_1Date = value;
        }
        else {
          return _cd4Percent_1Date;
        }
      };

      modelDefinition.cd4Percent_2 = function (value) {
        if (angular.isDefined(value)) {
          _cd4Percent_2 = value;
        }
        else {
          return _cd4Percent_2;
        }
      };

      modelDefinition.cd4Percent_2Date = function (value) {
        if (angular.isDefined(value)) {
          _cd4Percent_2Date = value;
        }
        else {
          return _cd4Percent_2Date;
        }
      };

      modelDefinition.vlResulted = function (value) {
        if (angular.isDefined(value)) {
          _vlResulted = value;
        }
        else {
          return _vlResulted;
        }
      };

      modelDefinition.vlResultedDate = function (value) {
        if (angular.isDefined(value)) {
          _vlResultedDate = value;
        }
        else {
          return _vlResultedDate;
        }
      };

      modelDefinition.vl_1 = function (value) {
        if (angular.isDefined(value)) {
          _vl_1 = value;
        }
        else {
          return _vl_1;
        }
      };

      modelDefinition.vl_1Date = function (value) {
        if (angular.isDefined(value)) {
          _vl_1Date = value;
        }
        else {
          return _vl_1Date;
        }
      };

      modelDefinition.vl_2 = function (value) {
        if (angular.isDefined(value)) {
          _vl_2 = value;
        }
        else {
          return _vl_2;
        }
      };

      modelDefinition.vl_2Date = function (value) {
        if (angular.isDefined(value)) {
          _vl_2Date = value;
        }
        else {
          return _vl_2Date;
        }
      };

      modelDefinition.vlOrderDate = function (value) {
        if (angular.isDefined(value)) {
          _vlOrderDate = value;
        }
        else {
          return _vlOrderDate;
        }
      };

      modelDefinition.cd4OrderDate = function (value) {
        if (angular.isDefined(value)) {
          _cd4OrderDate = value;
        }
        else {
          return _cd4OrderDate;
        }
      };

    }

    function toArrayOfModels(unwrappedObjects) {
      var wrappedObjects = [];

      for (var i = 0; i < unwrappedObjects.length; i++) {
        wrappedObjects.push(new service.hivSummary(unwrappedObjects[i]));
      }

      return wrappedObjects;
    }
  }
})();
