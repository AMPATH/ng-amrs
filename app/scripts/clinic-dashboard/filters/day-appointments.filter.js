/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ngAmrsApp.controller:MainCtrl
	 * @description
	 * # MainCtrl
	 * Controller of the ngAmrsApp
	 */

	angular
		.module('app.clinicDashboard')
		.filter('datesFilter', function () {

			return function (items, ele) {
				var out = 0;
				if (angular.isArray(items)) {
					items.forEach(function (item) {
						var date = item.rtcDate();
						if (ele.date.isSame(date, 'day'))
							out = item.total();

					});
				} else {
					// Let the output be the input untouched
					out = items;
				}
				return out;
			}
		});


})();
