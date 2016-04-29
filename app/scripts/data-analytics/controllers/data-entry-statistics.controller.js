/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.dataAnalytics')
		.controller('DataEntryStatisticsCtrl', DataEntryStatisticsCtrl);
	DataEntryStatisticsCtrl.$nject = ['$rootScope', '$scope', '$stateParams',
	'$state', 'DataEntryStatsHelpersService'];

	function DataEntryStatisticsCtrl($rootScope, $scope, $stateParams, $state, DataEntryStatsHelpersService) {
		if (_.isUndefined($rootScope.currentStateParams.patient_list) && ($scope.selectedView !== '' || _.isUndefined($scope.selectedView))) {
			$state.go('admin.data-entry-statistics.view', {view_id:'view1'});
		}
		$scope.selectedView = '';
		$scope.isBusy = false;
		$scope.data = [];

		if (!_.isNull($stateParams.view_id) && !_.isUndefined($stateParams.view_id)) {
			$scope.selectedView = $stateParams.view_id;
		} else if (!_.isUndefined($rootScope.previousStateParams.uuid) ||
		!_.isUndefined($rootScope.currentStateParams.patient_list)) {
			console.log('got here though', DataEntryStatsHelpersService.patientList())
			$scope.data = DataEntryStatsHelpersService.patientList();
		}

	}
})();
