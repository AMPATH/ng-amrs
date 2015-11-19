/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
/*jshint camelcase: false */
(function () {
	'use strict';

	angular
		.module('models')
			.factory('MonthlyAppointmentVisitModel', factory);

	factory.$inject = [];

	function factory() {
		var service = {
			MonthlyAppointmentVisit: MonthlyAppointmentVisit,
			toArrayOfModels : toArrayOfModels
		};
		return service;

		function MonthlyAppointmentVisit(monthlyAppointmentVisitEtl) {
			var modelDefinition = this;

			//initialize private members
			var _rtcDate = monthlyAppointmentVisitEtl.rtc_date || '';
			var _dayOfWeek = monthlyAppointmentVisitEtl.day_of_week || '';
			var _total = monthlyAppointmentVisitEtl.total || '';
			var _totalVisited = monthlyAppointmentVisitEtl.total_visited || '';
			var _totalNotReturned = monthlyAppointmentVisitEtl.has_not_returned || '';

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

			modelDefinition.totalVisited = function (value) {
				if (angular.isDefined(value)) {
					_totalVisited = value;
				}
				else {
					return _totalVisited;
				}
			};
			modelDefinition.totalNotReturned = function (value) {
    				if (angular.isDefined(value)) {
    					_totalNotReturned = value;
    				}
    				else {
    					return _totalNotReturned;
    				}
    			};
		}

		function toArrayOfModels(openmrsModels){
			var wrappedObjects = [];
			for(var i = 0; i < openmrsModels.length; i++){
				wrappedObjects.push(new MonthlyAppointmentVisit(openmrsModels[i]));
			}
			return wrappedObjects;
		}
	}
})();
