/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
  'use strict';

  angular
    .module('models')
    .factory('AppointmentScheduleModel', factory);

  factory.$inject = ['HivSummaryModel'];

  function factory(HivSummaryModel) {
    var service = {
      appointmentSchedule: appointmentSchedule
    };

    //http://www.bennadel.com/blog/1566-using-super-constructors-is-critical-in-prototypal-inheritance-in-javascript.htm
    //inheritanc logic goes here

    // Create sub-class and extend base class.
    appointmentSchedule.prototype = new HivSummaryModel.hivSummary({});
    appointmentSchedule.constructor = appointmentSchedule;


    return service;

    //madnatory fields givenName, familyName
    function appointmentSchedule(appointmentScheduleEtl) {

      //call the inherited object contructor
      // Call super constructor.
      HivSummaryModel.hivSummary.call(this, appointmentScheduleEtl);

      var modelDefinition = this;

      //initialize private members
      var _givenName = appointmentScheduleEtl.given_name ? appointmentScheduleEtl.given_name : '';
      var _middleName = appointmentScheduleEtl.middle_name ? appointmentScheduleEtl.middle_name : '';
      var _familyName = appointmentScheduleEtl.family_name ? appointmentScheduleEtl.family_name : '';
      var _identifiers = appointmentScheduleEtl.identifiers ? appointmentScheduleEtl.identifiers : '';
      var _rtc_date= formatDate(appointmentScheduleEtl.rtc_date) || '';
      var _next_encounter_datetime= formatDate(appointmentScheduleEtl.next_encounter_datetime) || '';
      modelDefinition.givenName = function (value) {
        if (angular.isDefined(value)) {
          _givenName = value;
        }
        else {
          return _givenName;
        }
      };

      modelDefinition.middleName = function (value) {
        if (angular.isDefined(value)) {
          _middleName = value;
        }
        else {
          return _middleName;
        }
      };

      modelDefinition.familyName = function (value) {
        if (angular.isDefined(value)) {
          _familyName = value;
        }
        else {
          return _familyName;
        }
      };

      modelDefinition.rtc_date = function (value) {
        if (angular.isDefined(value)) {
          _rtc_date = value;
        }
        else {
          return _rtc_date;
        }
      };

      modelDefinition.next_encounter_datetime = function (value) {
        if (angular.isDefined(value)) {
          _next_encounter_datetime = value;
        }
        else {
          return _next_encounter_datetime;
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

      //format dates
      function formatDate(dateString){
        var formattedDate='';
        if(dateString!==null) {
          var date = new Date(dateString);
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();

          if (10 > monthIndex) {
            monthIndex = '0' + monthIndex;
          }
          if (10 > day) {
            day = '0' + day;
          }
          formattedDate = day + '-' + monthIndex + '-' +year ;
        }

        return formattedDate;
      }

    }
  }
})();
