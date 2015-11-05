/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.admin')
		.directive('statsDataEntryFilters', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedForms: "=",
				startDate: "=",
				endDate: "=",
				startMonth: "=",
				endMonth: "=",
				selectedProvider: "=",
				selectedCreator: "=",
				selectedEncounterTypes: "=",
				enabledControls: "="
			},
			controller: dataEntryFilterController,
			link: dataEntryFilterLink,
			templateUrl: "views/admin/data-entry-filter-controls.html"
		};
	}

	dataEntryFilterController.$inject = ['$scope', '$rootScope', 
	'SearchDataService', 'moment', '$state', '$filter', 'CachedDataService', 
	'UserResService'];

    function dataEntryFilterController($scope, $rootScope, SearchDataService, 
	moment, $state, $filter, CachedDataService, UserResService) {
		$scope.forms = [];
		$scope.selectedForms = {};
		$scope.selectedForms.selected = [];
		$scope.selectedEncounterTypes = {};
		$scope.selectedEncounterTypes.selected = [];
		$scope.selectAllForms = selectAllForms;
		$scope.selectAllEncounterTypes = selectAllEncounterTypes;

		$scope.providers = [];
		$scope.creators = [];
		$scope.selectedProvider = {};
		$scope.selectedCreator = {};
		$scope.selectedProvider.selected = {};
		$scope.selectedCreator.selected = {};
		$scope.findProviders = findProviders;
		$scope.findingProvider = false;
		$scope.findCreators = findCreators;
		$scope.findingCreator = false;
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

		function findCreators(searchText) {

			$scope.creators = [];
			if (searchText && searchText !== ' ') {
				$scope.findingCreator = true;
				UserResService.findUser(searchText, 
				onCreatorSearchSuccess, onCreatorSearchError);
			}
		}

		function onCreatorSearchSuccess(data) {
			$scope.findingCreator = false;
			$scope.creators = data;
		}

		function onCreatorSearchError(error) {
			$scope.findingCreator = false;
		}
		
		function findProviders(searchText) {

			$scope.providers = [];
			if (searchText && searchText !== ' ') {
				$scope.findingProvider = true;
				SearchDataService.findProvider(searchText, 
				onProviderSearchSuccess, onProviderSearchError);
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

	function dataEntryFilterLink(scope, element, attrs, vm) {
        
    }
})();	