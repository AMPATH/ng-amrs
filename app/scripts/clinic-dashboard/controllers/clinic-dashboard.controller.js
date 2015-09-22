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
		.controller('ClinicDashboardCtrl', ClinicDashboardCtrl);
	ClinicDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService', 'LocationModel'];

	function ClinicDashboardCtrl($rootScope, $scope, $stateParams, OpenmrsRestService, LocationModel) {

		var locationService = OpenmrsRestService.getLocationResService();

		$scope.selectedLocation = {selected:undefined};

		$scope.locations = [];
		
		$scope.isBusy = false;
		
		$scope.onLocationSelection = onLocationSelection;
		
		$scope.locationSelectionEnabled = true;
		
		$scope.switchTabByIndex = switchTabByIndex;

		activate();
		

		function activate() {
			fetchLocations();
		}
		
		function switchTabByIndex(index){
			//console.log("Switched to tab:" + index);
			$scope.activeTabId = index;
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
