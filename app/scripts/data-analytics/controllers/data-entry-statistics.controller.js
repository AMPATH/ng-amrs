/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.dataAnalytics')
		.controller('DataEntryStatisticsCtrl', DataEntryStatisticsCtrl);
	DataEntryStatisticsCtrl.$nject = ['$rootScope', '$scope', '$stateParams', 
	'OpenmrsRestService', 'LocationModel'];

	function DataEntryStatisticsCtrl($rootScope, $scope, $stateParams) {
		$scope.selectedView = '';

		$scope.isBusy = false;
		activate();

		function activate() {
					
		}
	}
})();
