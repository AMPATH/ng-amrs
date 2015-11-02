/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.admin')
		.directive('statsHivSummaryFilters', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedForms: "=",
				startDate: "=",
        endDate: "=",
				selectedProvider: "=",
        enabledControls: "="
			},
			controller: hivSummaryFilterController,
			link: hivSummaryFilterLink,
			templateUrl: "views/admin/hiv-summary-filter-controls.html"
		};
	}

  hivSummaryFilterController.$inject = ['$scope', '$rootScope', 'SearchDataService', 'moment', '$state', '$filter', 'CachedDataService'];

    function hivSummaryFilterController($scope, $rootScope, SearchDataService, moment, $state, $filter, CachedDataService) {
		$scope.forms = [];
		$scope.selectedForms = {};
		$scope.selectedForms.selected = [];
		$scope.selectedEncounterTypes = {};
		$scope.selectedEncounterTypes.selected = [];
		$scope.selectAllForms = selectAllForms;
		$scope.selectAllEncounterTypes = selectAllEncounterTypes;

		$scope.providers = [];
		$scope.selectedProvider = {};
		$scope.selectedProvider.selected = {};
		$scope.findProviders = findProviders;
		$scope.findingProvider = false;
    $scope.canView = canView;


		loadForms();
		function loadForms() {
			$scope.forms = CachedDataService.getCachedPocForms();
		}

    function canView(param){
      return $scope.enabledControls.indexOf(param) > -1;
    }

    function selectAllForms() {
      if ($scope.forms)
        $scope.selectedForms.selected = $scope.forms;
    }

		function selectAllEncounterTypes() {
			if ($scope.forms)
				$scope.selectedEncounterTypes.selected = $scope.forms;
		}

		function findProviders(searchText) {

			$scope.providers = [];
			if (searchText && searchText !== ' ') {
				$scope.findingProvider = true;
				SearchDataService.findProvider(searchText, onProviderSearchSuccess, onProviderSearchError);
			}
		}

		function onProviderSearchSuccess(data) {
			$scope.findingProvider = false;
			$scope.providers = data;
		}

		function onProviderSearchError(error) {
			$scope.findingProvider = false;
		}
	}

	function hivSummaryFilterLink(scope, element, attrs, vm) {
        // attrs.$observe('selectedLocation', onLocationUuidChanged);
		// console.log('data-entry');
        // function onLocationUuidChanged(newVal, oldVal) {
        //     if (newVal && newVal !== "") {

        //     }
        // }
    }
})();
