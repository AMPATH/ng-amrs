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
    
    hivSummaryController.$inject = ['$scope', 'EtlRestService', 'HivSummaryModel'];
    
    function hivSummaryController(scope, EtlRestService, HivSummaryModel) {
        var vm = this;
        scope.hivSummary = {};
        
        scope.hasSummary = true;
        scope.experiencedLoadingError = false;
        scope.isBusy = false;
        
        scope.fetchHivSummary = function(patientUuid) {
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
            scope.hivSummary = new HivSummaryModel.hivSummary(hivData.result[0]);
        }
        
        function onFetchHivSummaryFailed(error) {
            scope.hasSummary = true;
            scope.experiencedLoadingError = true;
            scope.isBusy = false;
            scope.hivSummary = {};
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