/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('ngAmrsApp')
        .directive('hivSummary', hivSummary);

    function hivSummary() {
        var directive = {
            restrict: "E",
            scope: { patientUuid: "@" },
            controller: hivSummaryController,
            link: hivSummaryLink,
            templateUrl: "views/patient-dashboard/hiv-summary-pane.html",
        };

        return directive;
    }
    
    hivSummaryController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'HivSummaryModel'];
    
    function hivSummaryController(scope, $rootScope, EtlRestService, HivSummaryModel) {
        var vm = this;
        scope.hivSummary = {};
        
        scope.hasSummary = true;
        scope.experiencedLoadingError = false;
        scope.isBusy = false;
        scope.showingHistoricalSummary = false;
        scope.openHistoricalSection = openHistoricalSection;
        
        scope.fetchHivSummary = function(patientUuid) {
            scope.hivSummary = {};
            scope.hasSummary = true;
            scope.experiencedLoadingError = false;
            scope.isBusy = true;
            EtlRestService.getHivSummary(patientUuid, undefined, undefined, onFetchHivSummarySuccess, onFetchHivSummaryFailed);
        }
        
        function onFetchHivSummarySuccess(hivData) {
            if(hivData.result[0])
                scope.hasSummary = true;
            else
                scope.hasSummary = false;
                
            scope.isBusy = false;
             
            if(hivData.result[0])  
                scope.hivSummary = new HivSummaryModel.hivSummary(hivData.result[0]);
        }
        
        function onFetchHivSummaryFailed(error) {
            scope.hasSummary = true;
            scope.experiencedLoadingError = true;
            scope.isBusy = false;
            scope.hivSummary = {};
        }
        
        function openHistoricalSection() {
            $rootScope.$broadcast('viewHivHistoricalSummary', null);
            scope.showingHistoricalSummary = true;
        }
    }

    function hivSummaryLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);

        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.fetchHivSummary(newVal);
            }
        }
    }
})();
