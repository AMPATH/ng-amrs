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
        
        vm.fetchHivSummary = function(patientUuid) {
            EtlRestService.getHivSummary(patientUuid, undefined, undefined, onFetchHivSummarySuccess, onFetchHivSummaryFailed);
        }
        
        function onFetchHivSummarySuccess(hivData) {
            scope.hivSummary = new HivSummaryModel.hivSummary(hivData.result[0]);
        }
        
        function onFetchHivSummaryFailed(error) {
           scope.hivSummary = {};
        }
    }

    function hivSummaryLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);

        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                vm.fetchHivSummary(newVal);
            }
        }
    }
})();