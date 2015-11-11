/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.dataAnalytics')
		.directive('statsDataEntryStatsViewOne', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedLocations: '='
			},
			controller: dataEntryStatsViewOneController,
			link: dataEntryStatsViewOneLink,
			templateUrl: "views/data-analytics/data-entry-stats-view-one.html"
		};
	}

	dataEntryStatsViewOneController.$inject = ['$scope', '$rootScope', 'moment', 
	'$state', '$filter', 'EtlRestService', 'DataEntryStatsHelpersService'];

    function dataEntryStatsViewOneController($scope, $rootScope, moment, 
	$state, $filter, EtlRestService, helperService) {
		//filter configurations
		$scope.reportSubType = 'by-date-by-encounter-type';
		$scope.controls = 
		'start-date,selected-encounter,selected-form,selected-provider';
		$scope.numberOfColumns = 6;
		
		//params
		$scope.selectedProvider = { selected: null };
		$scope.selectedEncounterTypes = { selected: [] };
		$scope.selectedForms = { selected: [] };
		$scope.startDate = moment().startOf('day').toDate();
		$scope.endDate = 
		helperService.generateEndDate($scope.startDate, $scope.numberOfColumns).toDate();
		
		
		//items	
		$scope.groupedItems = [];
		$scope.unGroupedItems = [];
		$scope.columnHeaderRow = 
		helperService.getDateArrayFrom($scope.startDate, $scope.numberOfColumns);
		$scope.firstColumnItems = [];
		
		
		//params processors
		$scope.getSelectedLocations = helperService.getSelectedLocations;
		$scope.getSelectedEncounterTypes = helperService.getSelectedEncounterTypes;
		$scope.getSelectedForms = helperService.getSelectedForms;
		$scope.generateEndDate = helperService.generateEndDate;
		$scope.getNextStartDate = getNextStartDate;
		$scope.getPreviousStartDate = getPreviousStartDate;
		$rootScope.$on('dataEntryStatsLocationSelected', 
		function () { $scope.needsRefresh = true; });
		
		//query etl functionality
		$scope.isBusy = false;
		$scope.needsRefresh = true;
		$scope.experiencedLoadingErrors = false;
		$scope.loadStatsFromServer = loadStatsFromServer;
		
		
		//grouping functionality
		$scope.groupByDateByEncounterType = helperService.groupByDateByEncounterType;
		$scope.extractUniqueElementsByProperty = 
		helperService.extractUniqueElementsByProperty;
		$scope.groupByX_ThenByY = helperService.groupByX_ThenByY;
		$scope.findItemByXandY = helperService.findItemByXandY;
		$scope.getDateArrayFrom = helperService.getDateArrayFrom;

		activate();
		function activate() {
			//loadStatsFromServer();
		}
		
		//query etl functionality
		
		function loadStatsFromServer() {

			if ($scope.isBusy === true || $scope.startDate === null || $scope.startDate === undefined) {
				return;
			}

			$scope.experiencedLoadingErrors = false;
			$scope.isBusy = true;
			$scope.groupedItems = [];
			$scope.columnHeaderRow = [];
			$scope.firstColumnItems = [];
			$scope.unGroupedItems = [];

			var startDate = 
			moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			console.log('Date data stats', startDate);
			
			$scope.endDate = 
			helperService.generateEndDate($scope.startDate, $scope.numberOfColumns).toDate();
			var endDate = 
			moment($scope.endDate).endOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			console.log('Date data stats', endDate);
			
			console.log('locations data stats', $scope.selectedLocations);
			var locationUuids = helperService.getSelectedLocations($scope.selectedLocations);
			var encounterTypeUuids = 
			helperService.getSelectedEncounterTypes($scope.selectedEncounterTypes);
			var formUuids = helperService.getSelectedForms($scope.selectedForms);
			var providerUuid = 
			helperService.getSelectedProvider($scope.selectedProvider);

			EtlRestService.getDataEntryStatistics($scope.reportSubType,
				startDate, endDate, locationUuids, encounterTypeUuids, formUuids, providerUuid,
				undefined, onLoadStatsFromServerSuccess, onLoadStatsFromServerError);
		}

		function onLoadStatsFromServerSuccess(results) {
			$scope.isBusy = false;
			$scope.needsRefresh = false;
			$scope.unGroupedItems = results.result;
			//process data here
			processResults();
		}

		function onLoadStatsFromServerError(error) {
			$scope.isBusy = false;
			$scope.experiencedLoadingErrors = true;
			console.error('An error occured when fetching data', error);
		}


		function processResults() {
			$scope.columnHeaderRow = 
			helperService.extractUniqueElementsByProperty($scope.unGroupedItems, 'date');
			
			$scope.firstColumnItems = 
			helperService.extractUniqueElementsByProperty($scope.unGroupedItems, 'encounter_type_id');
			$scope.groupedItems = 
			helperService.groupByX_ThenByY($scope.columnHeaderRow, $scope.firstColumnItems,
				'date', 'encounter_type_id', $scope.unGroupedItems, 'encounter_type');
		}
		//end etl functionality

		function getNextStartDate() {
			$scope.startDate = 
			moment($scope.startDate).startOf('day').add($scope.numberOfColumns + 1, 'days').toDate();
			loadStatsFromServer();
		}

		function getPreviousStartDate() {
			$scope.startDate = 
			moment($scope.startDate).startOf('day').subtract($scope.numberOfColumns + 1, 'days').toDate();
			loadStatsFromServer();
		}


	}

	function dataEntryStatsViewOneLink(scope, element, attrs, vm) {

    }
})();	