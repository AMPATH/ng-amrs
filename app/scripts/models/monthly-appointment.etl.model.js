/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
	'use strict';

	angular
		.module('models')
		.factory('MonthlyAppointmentModel', factory);

	factory.$inject = [];

	function factory() {
		var service = {
			monthlyAppointment: monthlyAppointment,
			toArrayOfModels : toArrayOfModels
		};

		return service;

		function monthlyAppointment(monthlyAppointmentEtl) {

			var modelDefinition = this;
      
			//initialize private members
			var _rtcDate = monthlyAppointmentEtl.rtc_date ? monthlyAppointmentEtl.rtc_date : '';
			var _dayOfWeek = monthlyAppointmentEtl.day_of_week ? monthlyAppointmentEtl.day_of_week : '';
			var _total = monthlyAppointmentEtl.total ? monthlyAppointmentEtl.total : '';
			
			modelDefinition.rtcDate = function (value) {
				if (angular.isDefined(value)) {
					_rtcDate = value;
				}
				else {
					return _rtcDate;
				}
			};

			modelDefinition.dayOfWeek = function (value) {
				if (angular.isDefined(value)) {
					_dayOfWeek = value;
				}
				else {
					return _dayOfWeek;
				}
			};

			modelDefinition.total = function (value) {
				if (angular.isDefined(value)) {
					_total = value;
				}
				else {
					return _total;
				}
			};
			
		}
		
		function toArrayOfModels(unwrappedObjects){
			var wrappedObjects = [];
			
			for(var i = 0; i < unwrappedObjects.length; i++){
				wrappedObjects.push(new service.monthlyAppointment(unwrappedObjects[i]));
			}
			
			return wrappedObjects;
		}

	}
})();