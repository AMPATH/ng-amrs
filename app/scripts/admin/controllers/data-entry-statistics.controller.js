/*jshint -W003, -W098, -W033 */
(function () {
	'use strict';

	angular
		.module('app.admin')
		.controller('DataEntryStatisticsCtrl', DataEntryStatisticsCtrl);
	DataEntryStatisticsCtrl.$nject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService', 'LocationModel'];

	function DataEntryStatisticsCtrl($rootScope, $scope, $stateParams,
		OpenmrsRestService, LocationModel) {

		var locationService = OpenmrsRestService.getLocationResService();
		$scope.selectedLocations = {};
		$scope.selectedLocations.selectedAll = false;
		$scope.selectedLocations.locations = [];
		$scope.locations = [];

		$scope.isBusy = false;

		activate();

		function activate() {
			fetchLocations();
		}

		function onLocationSelection($event) {
			$scope.locationSelectionEnabled = false;
		}

		function fetchLocations() {
			$scope.isBusy = true;
			locationService.getLocations(onGetLocationsSuccess, onGetLocationsError, false);
		}

		function onGetLocationsSuccess(locations) {
			$scope.isBusy = false;
			$scope.locations = wrapLocations(locations);
			//$scope.selectedLocations.locations = $scope.locations;
		}

		function onGetLocationsError(error) {
			$scope.isBusy = false;
		}

		function wrapLocations(locations) {
			var wrappedLocations = [];
			for (var i = 0; i < locations.length; i++) {
				var wrapped = wrapLocation(locations[i]);
				wrapped.index = i;
				wrappedLocations.push(wrapped);
			}

			return wrappedLocations;
		}

		function wrapLocation(location) {
			return LocationModel.toWrapper(location);
		}

	}
})();
