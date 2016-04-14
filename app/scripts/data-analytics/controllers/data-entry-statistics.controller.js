/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.dataAnalytics')
		.controller('DataEntryStatisticsCtrl', DataEntryStatisticsCtrl);
	DataEntryStatisticsCtrl.$nject = ['$rootScope', '$scope', '$stateParams',
	'OpenmrsRestService', 'LocationModel', '$state'];

	function DataEntryStatisticsCtrl($rootScope, $scope, $stateParams, $state) {
		if ($scope.selectedView !== '' || _.isUndefined($scope.selectedView)) {
			$state.go('admin.data-entry-statistics.view', {view_id:'view1'});
		}
		$scope.selectedView = '';
		$scope.isBusy = false;

		console.log('Current stats',$stateParams);

		if (!_.isNull($stateParams.view_id) && !_.isUndefined($stateParams.view_id)) {
			$scope.selectedView = $stateParams.view_id;

		}

	}
})();
