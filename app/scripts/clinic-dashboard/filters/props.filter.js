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
		.filter('propsFilter', function () {
			return function (items, props) {
				var out = [];

				if (angular.isArray(items)) {
					items.forEach(function (item) {
						var itemMatches = false;

						var keys = Object.keys(props);
						for (var i = 0; i < keys.length; i++) {
							var prop = keys[i];
							var text = props[prop].toLowerCase();
							
							var val;
							if(typeof item[prop] === 'function'){
								val = item[prop]();
							}
							else{
								val = item[prop];
							}
							
							
							if (val.toString().toLowerCase().indexOf(text) !== -1) {
								itemMatches = true;
								break;
							}
						}

						if (itemMatches) {
							out.push(item);
						}
					});
				} else {
					// Let the output be the input untouched
					out = items;
				}

				return out;
			}
		});


})();
