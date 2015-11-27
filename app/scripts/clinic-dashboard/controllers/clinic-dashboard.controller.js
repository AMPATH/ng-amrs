/*jshint -W003, -W098, -W033 */
(function() {
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
	.controller('ClinicDashboardCtrl', ClinicDashboardCtrl);
	ClinicDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService', 'LocationModel', 'ClinicDashboardService'];

	function ClinicDashboardCtrl($rootScope, $scope, $stateParams,
		OpenmrsRestService, LocationModel, ClinicDashboardService) {

  var locationService = OpenmrsRestService.getLocationResService();
  $scope.selectedLocation = ClinicDashboardService.getSelectedLocation();
  $scope.selected='';
  $scope.locations = [];

  $scope.isBusy = false;

  $scope.onLocationSelection = onLocationSelection;

  $scope.locationSelectionEnabled = ClinicDashboardService.getLocationSelectionEnabled();

  $scope.switchTabByIndex = switchTabByIndex;

  activate();

  function activate() {
  fetchLocations();
}

  function switchTabByIndex(index) {
  $scope.activeTabId = index;
}

  function onLocationSelection($event) {
  $scope.locationSelectionEnabled = false;
  ClinicDashboardService.setLocationSelectionEnabled(false);
		}

  function fetchLocations() {
  $scope.isBusy = true;
  locationService.getLocations(onGetLocationsSuccess, onGetLocationsError, false);
}

  function onGetLocationsSuccess(locations) {
  $scope.isBusy = false;
  $scope.locations = wrapLocations(locations);
		}

  function onGetLocationsError(error) {
  $scope.isBusy = false;
}

  function wrapLocations(locations) {
  var wrappedLocations = [];
  for (var i = 0; i < locations.length; i++) {
    wrappedLocations.push(wrapLocation(locations[i]));
  }

  return wrappedLocations;
		}

  function wrapLocation(location) {
  return LocationModel.toWrapper(location);
}

	}
})();
