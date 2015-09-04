/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('hivSummaryHistorical', labsSummary);

    function labsSummary() {
        return {
            restict: "E",
            scope: { patientUuid: "@" },
            controller: hivSummaryHistoricalController,
            link: hivSummaryHistoricalLink,
            templateUrl: "views/patient-dashboard/hiv-summary-historical-pane.html"
        };
    }

    hivSummaryHistoricalController.$inject = ['$scope', 'EtlRestService', 'HivSummaryModel'];

    function hivSummaryHistoricalController($scope, EtlRestService, HivSummaryModel) {
		//non-function types scope members
        $scope.hivSummaries = [];
        
        $scope.isBusy = false;
        $scope.experiencedLoadingErrors = false;
        
        //paging variables 
        $scope.nextStartIndex = 0;
        $scope.pageSize = 10;
        $scope.allDataLoaded = false;
        
        //function types scope members
        $scope.loadHistoricalHivSummary = loadHistoricalHivSummary;
        
        activate();
        
        function activate() {
            $scope.$on('viewHivHistoricalSummary',viewHivHistoricalSummary);
        }
        
        
        function viewHivHistoricalSummary() {
            loadHistoricalHivSummary();
        }
        
        function loadHistoricalHivSummary() {
             $scope.experiencedLoadingErrors = false;
             
             if($scope.isBusy === true) return;
             
             $scope.isBusy = true;
            
             if ($scope.patientUuid && $scope.patientUuid !== '')
                EtlRestService.getHivSummary($scope.patientUuid, $scope.nextStartIndex, $scope.pageSize, onFetchHivSummarySuccess, onFetchHivSummaryFailed);
        }
        
        
        function onFetchHivSummarySuccess(records){
            $scope.isBusy = false;
            for (var e in records.result) {
                $scope.hivSummaries.push(new HivSummaryModel.hivSummary(records.result[e]));
            }
            
            $scope.nextStartIndex = +records.startIndex + records.size;
            
            if (records.size === 0) {
               $scope.allDataLoaded = true;
            }
        }
        
        function onFetchHivSummaryFailed(error) {
            $scope.isBusy = false;
            $scope.experiencedLoadingErrors = true;
            
        }
        
	}
	
	function hivSummaryHistoricalLink(scope, element, attrs, vm) {
        // attrs.$observe('patientUuid', onPatientUuidChanged);

        // function onPatientUuidChanged(newVal, oldVal) {
        //     if (newVal && newVal != "") {
        //         scope.isBusy = false;
        //         scope.allDataLoaded = false;
        //         scope.nextStartIndex = 0;
        //         scope.encounters = [];
        //         scope.loadMoreLabs();
        //     }
        // }
    }

})();
	
	