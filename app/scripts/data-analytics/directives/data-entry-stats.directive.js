/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.dataAnalytics')
		.directive('statsDataEntryStats', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
			},
			controller: dataEntryStatsViewController,
			link: dataEntryStatsViewLink,
			templateUrl: "views/data-analytics/data-entry-stats-view.html"
		};
	}

	dataEntryStatsViewController.$inject = ['$scope', '$rootScope', 'moment',
		'$state', '$filter', 'EtlRestService', 'DataEntryStatsHelpersService',
		'UserResService', 'SearchDataService'];

    function dataEntryStatsViewController($scope, $rootScope, moment,
		$state, $filter, EtlRestService, helperService, UserResService, SearchDataService) {
		//view configurations
		$scope.viewConfigurations = helperService.getViewConfigurationObjects();
		$scope.currentViewConfiguration = $scope.viewConfigurations[0];
		$scope.canView = canView;
		//
		$scope.changeView = changeView;

		//params
		$scope.selectedLocations = {};
		$scope.selectedProvider = { selected: null };
		$scope.selectedCreator = { selected: null };
		$scope.selectedEncounterTypes = { selected: [] };
		$scope.selectedForms = { selected: [] };
		$scope.startDate = moment().startOf('day').toDate();
		$scope.endDate =
		helperService.generateEndDate($scope.startDate,
			$scope.currentViewConfiguration.numberOfColumns).toDate();
		$scope.startMonth = moment().startOf('month').startOf('day').toDate();
		$scope.endMonth =
		helperService.generateEndMonth($scope.startMonth,
			$scope.currentViewConfiguration.numberOfColumns).toDate();

		//items
		$scope.groupedItems = [];
		$scope.unGroupedItems = [];
		$scope.columnHeaderRow = [];
		$scope.firstColumnItems = [];

		//params processors
		$scope.getNextStartDate = getNextStartDate;
		$scope.getPreviousStartDate = getPreviousStartDate;
		$scope.getNextStartMonth = getNextStartMonth;
		$scope.getPreviousStartMonth = getPreviousStartMonth;
		// $rootScope.$on('dataEntryStatsLocationSelected',
		// 	function () { $scope.needsRefresh = true; });

		//query etl functionality
		$scope.isBusy = false;
		$scope.needsRefresh = true;
		$scope.experiencedLoadingErrors = false;
		$scope.loadStatsFromServer = loadStatsFromServer;
    $scope.currentViewConfiguration_copy = angular.copy($scope.currentViewConfiguration);
    $scope.getPatienList = function(cell) {
      $scope.currentViewConfiguration.groupBy = "groupByPatientId";
      $scope.currentViewConfiguration.reportSubType = 'patientList';
      // //params
      // $scope.selectedProvider = { selected: null };
      var selected = [];
      selected.push({encounterTypeUuid:cell.value.encounter_type_uuid})
      $scope.selectedEncounterTypes = { selected: selected };
      // $scope.selectedForms = { selected: [] };
      $scope.startDate = cell.value.date;
      $scope.endDate = cell.value.date;

      loadStatsFromServer();
      $state.go('admin.data-entry-statistics.patientlist');
    }

		activate();
		function activate() {

		}

		function changeView(newView) {
			$scope.currentViewConfiguration = newView;
			$scope.needsRefresh = true;
		}

		//query etl functionality

		function loadStatsFromServer() {

			if ($scope.isBusy === true) {
				return;
			}

			$scope.experiencedLoadingErrors = false;
			$scope.isBusy = true;
			$scope.groupedItems = [];
			$scope.columnHeaderRow = [];
			$scope.firstColumnItems = [];
			$scope.unGroupedItems = [];

			var dateRange = getCurrentDateRange();

			var params = getParamsObject();

			EtlRestService.getDataEntryStatistics(
				$scope.currentViewConfiguration.reportSubType,
				dateRange.startDate, dateRange.endDate, params.locationUuids,
				params.encounterTypeUuids, params.formUuids, params.providerUuid,
				params.creatorUuid, $scope.currentViewConfiguration.groupBy, onLoadStatsFromServerSuccess,
				onLoadStatsFromServerError);
		}

		function onLoadStatsFromServerSuccess(results) {
			$scope.isBusy = false;
			$scope.needsRefresh = false;
			$scope.unGroupedItems = results.result;

      if ($scope.currentViewConfiguration.reportSubType === 'patientList') {
        //Build patient list
        $scope.patients = results.result;
        $rootScope.$broadcast("patient", $scope.patients);
        $scope.currentViewConfiguration.reportSubType = $scope.currentViewConfiguration_copy.reportSubType;
        console.log('got here', $scope.patients)


      }
			//process data here
			if ($scope.currentViewConfiguration.reportSubType !== 'patientList') processResults();
		}

		function onLoadStatsFromServerError(error) {
			$scope.isBusy = false;
			$scope.experiencedLoadingErrors = true;
			console.error('An error occured when fetching data', error);
		}


		function processResults() {
			$scope.columnHeaderRow =
			helperService.extractUniqueElementsByProperty($scope.unGroupedItems,
				$scope.currentViewConfiguration.column);

			$scope.firstColumnItems =
			helperService.extractUniqueElementsByProperty($scope.unGroupedItems,
				$scope.currentViewConfiguration.row);
			$scope.groupedItems =
			helperService.groupByX_ThenByY($scope.columnHeaderRow, $scope.firstColumnItems,
				$scope.currentViewConfiguration.column, $scope.currentViewConfiguration.row,
				$scope.unGroupedItems, $scope.currentViewConfiguration.additionalRowMember);
			if ($scope.currentViewConfiguration.row === 'provider_id') {
				for (var i = 0; i < $scope.groupedItems.length; i++) {
					getProvider($scope.groupedItems[i]);
				}
			}
			if ($scope.currentViewConfiguration.row === 'creator_id') {
				for (var i = 0; i < $scope.groupedItems.length; i++) {
					getCreator($scope.groupedItems[i]);
				}
			}
		}
		//resolvers
		function getProvider(item) {
			item.provider = 'loading provider...';
			SearchDataService.getProviderByProviderUuid(item.provider_uuid,
				function (provider) {
					item.provider = provider.display();
				},
				function (error) {
					item.provider = 'error loading provider..';
				});
		}

		function getCreator(item) {
			item.provider = 'loading creator...';
			UserResService.getUserByUuid(item.user_uuid,
				function (user) {
					item.creator = user.person.display;
				},
				function (error) {
					item.creator = 'error loading creator..';
				});
		}
		//end etl functionality

		function getNextStartDate() {
			$scope.startDate =
			moment($scope.startDate).startOf('day')
				.add($scope.currentViewConfiguration.numberOfColumns + 1, 'days').toDate();
			$scope.endDate =
			helperService.generateEndDate($scope.startDate,
				$scope.currentViewConfiguration.numberOfColumns).toDate();
			loadStatsFromServer();
		}

		function getPreviousStartDate() {
			$scope.startDate =
			moment($scope.startDate).startOf('day')
				.subtract($scope.currentViewConfiguration.numberOfColumns + 1, 'days').toDate();
			$scope.endDate =
			helperService.generateEndDate($scope.startDate,
				$scope.currentViewConfiguration.numberOfColumns).toDate();
			loadStatsFromServer();
		}

		function getNextStartMonth() {
			$scope.startMonth =
			moment($scope.startMonth).startOf('day')
				.add($scope.currentViewConfiguration.numberOfColumns, 'months').toDate();
			$scope.endMonth =
			helperService.generateEndMonth($scope.startMonth,
				$scope.currentViewConfiguration.numberOfColumns).toDate();
			loadStatsFromServer();
		}

		function getPreviousStartMonth() {
			$scope.startMonth =
			moment($scope.startMonth).startOf('day')
				.subtract($scope.currentViewConfiguration.numberOfColumns, 'months').toDate();
			$scope.endMonth =
			helperService.generateEndMonth($scope.startMonth,
				$scope.currentViewConfiguration.numberOfColumns).toDate();
			loadStatsFromServer();
		}

		function getCurrentDateRange() {
			var rangeObject = {
				startDate: null,
				endDate: null
			};

			if (canView('start-date')) {
				rangeObject.startDate =
				moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
				rangeObject.endDate =
				moment($scope.endDate).endOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			} else {
				rangeObject.startDate =
				moment($scope.startMonth).startOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
				rangeObject.endDate =
				moment($scope.endMonth).endOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			}

			return rangeObject;
		}

		function getParamsObject() {
			var params = {};
			params.locationUuids =
			helperService.getSelectedLocations($scope.selectedLocations);

			if (canView('selected-encounter')) {
				params.encounterTypeUuids =
				helperService.getSelectedEncounterTypes($scope.selectedEncounterTypes);
			}
			if (canView('selected-form')) {
				params.formUuids =
				helperService.getSelectedForms($scope.selectedForms);
			}
			if (canView('selected-provider')) {
				params.providerUuid =
				helperService.getSelectedProvider($scope.selectedProvider);
			}
			if (canView('selected-creator')) {
				params.creatorUuid =
				helperService.getSelectedCreator($scope.selectedCreator);
			}
			return params;
		}

		function canView(param) {
			return $scope.currentViewConfiguration.controls.indexOf(param) > -1;
		}

	}

	function dataEntryStatsViewLink(scope, element, attrs, vm) {

    }
})();
