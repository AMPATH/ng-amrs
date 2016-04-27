/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.dataAnalytics')
		.directive('statsDataEntryStatsViewTwo', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedLocations: '='
			},
			controller: dataEntryStatsViewTwoController,
			link: dataEntryStatsViewTwoLink,
			templateUrl: "views/data-analytics/data-entry-stats-view-two.html"
		};
	}

	dataEntryStatsViewTwoController.$inject = ['$scope', '$rootScope',
	'moment', '$state', '$filter', 'EtlRestService', 'DataEntryStatsHelpersService',
  'OpenmrsRestService', '$timeout'];

    function dataEntryStatsViewTwoController($scope, $rootScope,
	 moment, $state, $filter, EtlRestService, helperService, OpenmrsRestService,
 $timeout) {
		//filter configurations
    $scope.reportSubType = 'by-month-by-encounter-type';
    $scope.groupBy = "groupByMonth,groupByEncounterTypeId";
		$scope.controls =
		'start-month,selected-encounter,selected-form,selected-provider';
		$scope.numberOfColumns = 12;
    $scope.viewCachedData = {};

		//params
		$scope.selectedProvider = { selected: null };
		$scope.selectedEncounterTypes = { selected: [] };
		$scope.selectedForms = { selected: [] };
		$scope.startMonth = moment().startOf('month').startOf('day').toDate();
		$scope.endMonth =
		helperService.generateEndMonth($scope.startMonth, $scope.numberOfColumns).toDate();


		//items
		$scope.groupedItems = [];
		$scope.unGroupedItems = [];
		$scope.columnHeaderRow =
		helperService.getDateArrayFrom($scope.startMonth, $scope.numberOfColumns);
		$scope.firstColumnItems = [];


		//params processors
		$scope.getSelectedLocations = helperService.getSelectedLocations;
		$scope.getSelectedEncounterTypes = helperService.getSelectedEncounterTypes;
		$scope.getSelectedForms = helperService.getSelectedForms;
		$scope.generateEndMonth = helperService.generateEndMonth;
		$scope.getNextStartMonth = getNextStartMonth;
		$scope.getPreviousStartMonth = getPreviousStartMonth;
		$rootScope.$on('dataEntryStatsLocationSelected',
		 function () { $scope.needsRefresh = true; });

		//query etl functionality
		$scope.isBusy = false;
		$scope.needsRefresh = true;
		$scope.experiencedLoadingErrors = false;
    $scope.isLoadingPatientList = false;
		$scope.loadStatsFromServer = loadStatsFromServer;
    $scope.getPatienList = onLoadPatientList


		//grouping functionality
		$scope.extractUniqueElementsByProperty =
		helperService.extractUniqueElementsByProperty;
		$scope.groupByX_ThenByY = helperService.groupByX_ThenByY;
		$scope.findItemByXandY = helperService.findItemByXandY;
		$scope.getMonthArrayFrom = helperService.getMonthArrayFrom;

		activate();
		function activate() {
      $scope.viewCachedData = helperService.getSetViewCachedData()
      if($scope.viewCachedData.cached && $scope.viewCachedData.viewId==='view2') {
        $timeout(function(){
          $scope.selectedLocations = $scope.viewCachedData.selectedLocations;
          $scope.selectedProvider = $scope.viewCachedData.selectedProvider;
          $scope.selectedEncounterTypes = $scope.viewCachedData.selectedEncounterTypes;
          $scope.selectedForms = $scope.viewCachedData.selectedForms;
          $scope.startMonth = $scope.viewCachedData.startDate;
          $scope.endMonth = $scope.viewCachedData.endDate
          console.log('cached called', $scope.viewCachedData);
          loadStatsFromServer();
        }, 0);

      }
		}

		//query etl functionality
    function onLoadPatientList(cell) {
      $scope.groupBy = "groupByPatientId";
      $scope.reportSubType = 'patientList';
      //params
      // $scope.selectedProvider = { selected: null };
      var selected = [];
      selected.push({encounterTypeUuid:cell.value.encounter_type_uuid})
      $scope.selectedEncounterTypes = { selected: selected };
      // $scope.selectedForms = { selected: [] };
      // $scope.startDate = cell.value.date;
      // $scope.endDate = cell.value.date;
      $scope.isLoadingPatientList=true;
      loadStatsFromServer();
    }

		function loadStatsFromServer() {

			if ($scope.isBusy === true || $scope.startMonth === null || $scope.startMonth === undefined) {
				return;
			}

			$scope.experiencedLoadingErrors = false;
			$scope.isBusy = true;
			$scope.groupedItems = [];
			$scope.columnHeaderRow = [];
			$scope.firstColumnItems = [];
			$scope.unGroupedItems = [];

			var startMonth = moment($scope.startMonth).startOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			console.log('Date data stats', startMonth);
			$scope.endMonth =
			helperService.generateEndMonth($scope.startMonth, $scope.numberOfColumns).toDate();

			var endMonth = moment($scope.endMonth).endOf('day').format('YYYY-MM-DDTHH:MM:SSZZ');
			console.log('Date data stats', endMonth);
			console.log('locations data stats', $scope.selectedLocations);
			var locationUuids =
			helperService.getSelectedLocations($scope.selectedLocations);

			var encounterTypeUuids =
			helperService.getSelectedEncounterTypes($scope.selectedEncounterTypes);

			var formUuids = helperService.getSelectedForms($scope.selectedForms);
			var providerUuid = helperService.getSelectedProvider($scope.selectedProvider);

			EtlRestService.getDataEntryStatistics($scope.reportSubType,
				startMonth, endMonth, locationUuids, encounterTypeUuids, formUuids, providerUuid,
				undefined, $scope.groupBy, onLoadStatsFromServerSuccess, onLoadStatsFromServerError);
		}

		function onLoadStatsFromServerSuccess(results) {
			$scope.isBusy = false;
			$scope.needsRefresh = false;
			$scope.unGroupedItems = results.result;
      console.log('Sql Query :', results.sql);

      if ($scope.isLoadingPatientList) {
          $state.go('admin.data-entry-statistics.patientlist', {patient_list:'patientList'});
          $scope.isLoadingPatientList=false;
      }

      if ($scope.reportSubType === 'patientList') {
        //Build patient list
        $scope.patients = results.result;
        $rootScope.$broadcast("patient", $scope.patients);
        $scope.reportSubType = 'by-month-by-encounter-type';
        helperService.patientList($scope.patients);
      } else {
        $scope.viewCachedData = {
          selectedLocations:$scope.selectedLocations,
    			selectedForms:$scope.selectedForms,
    			selectedCreator:'',
    			selectedProvider:$scope.selectedProvider,
    			startDate:$scope.startMonth,
    			endDate:$scope.endMonth,
          selectedEncounterTypes:$scope.selectedEncounterTypes,
          cached:true,
          viewId:'view2'
        }
        helperService.getSetViewCachedData($scope.viewCachedData);
        console.log('cached params',   $scope.viewCachedData)
        //process data here
        processResults()
      }
		}

		function onLoadStatsFromServerError(error) {
			$scope.isBusy = false;
			$scope.experiencedLoadingErrors = true;
      $scope.isLoadingPatientList=false;
			console.error('An error occured when fetching data', error);
		}


		function processResults() {
			$scope.columnHeaderRow =
			 helperService.extractUniqueElementsByProperty($scope.unGroupedItems, 'month');
			$scope.firstColumnItems =
			helperService.extractUniqueElementsByProperty($scope.unGroupedItems, 'encounter_type_id');
			$scope.groupedItems =
			helperService.groupByX_ThenByY($scope.columnHeaderRow, $scope.firstColumnItems,
				'month', 'encounter_type_id', $scope.unGroupedItems, 'encounter_type');
		}
		//end etl functionality

		function getNextStartMonth() {
			$scope.startMonth =
			moment($scope.startMonth).startOf('day').add($scope.numberOfColumns, 'months').toDate();
			loadStatsFromServer();
		}

		function getPreviousStartMonth() {
			$scope.startMonth =
			moment($scope.startMonth).startOf('day').subtract($scope.numberOfColumns, 'months').toDate();
			loadStatsFromServer();
		}


	}

	function dataEntryStatsViewTwoLink(scope, element, attrs, vm) {
        // attrs.$observe('selectedLocations', onSelectedLocationsChanged);
        // function onSelectedLocationsChanged(newVal, oldVal) {
        //     if (newVal) {

        //     }
        // }
    }
})();
