/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.clinicDashboard')
		.filter('visitDatesFilter', function () {

			return function (items, ele) {
				var out = 0;
				if (angular.isArray(items)) {
					items.forEach(function (item) {
						var date = item.rtcDate();
						if (ele.date.isSame(date, 'day'))
							out = item.totalVisited();
					});
				} else {
					// Let the output be the input untouched
					out = items;
				}
				return out;
			}
		});
})();
