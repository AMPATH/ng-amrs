/*jshint -W003, -W098, -W033 */
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
    .module('app.patientdashboard')
    .controller('PatientDashboardCtrl', PatientDashboardCtrl);
  PatientDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams', '$timeout',
    'OpenmrsRestService', 'ClinicalSummaryPdfService'
  ];

  function PatientDashboardCtrl($rootScope, $scope, $stateParams, $timeout,
    OpenmrsRestService, ClinicalSummaryPdfService) {
    $scope.patient = {};
    $scope.patient = $rootScope.broadcastPatient;
    $scope.p = null;
    $scope.encounters = [];
    $scope.isBusy = false;

    $scope.HivHistoricalExpanded = true;

    $scope.showHivHistoricalSummary = false;
    $scope.MedicationChangeHistoryExpanded = true;

    $scope.showMedicationChangeHistory = false;

    $scope.$on('viewHivHistoricalSummary', viewHivHistoricalSummary);
    $scope.$on('viewMedicationChangeHistory', viewMedicationChangeHistory);
    $scope.generateClinicalSummaryPdf = generateClinicalSummaryPdf;

    //exposing labs, reminders, vitals, notes and hivSummary to the controller (from respective directive)
    $scope.labTests = [];
    $scope.clinicalReminders = [];
    $scope.vitals = [];
    $scope.hivSummary = {};
    $scope.clinicalNotes = [];
    $scope.letterHead = '';

    //isBusy flags for each directive
    $scope.labTestsIsBusy = true;
    $scope.clinicalRemindersIsBusy = true;
    $scope.vitalsIsBusy = true;
    $scope.hivSummaryIsBusy = true;
    $scope.clinicalNotesIsBusy = true;
    $scope.letterHeadIsBusy = true;

    function generateClinicalSummaryPdf() {
      var patient = {
        demographics: $scope.patient,
        labTests: $scope.labTests,
        clinicalReminders: $scope.clinicalReminders,
        vitals: $scope.vitals,
        hivSummary: $scope.hivSummary,
        clinicalNotes: $scope.clinicalNotes[0],
        letterHead: $scope.letterHead
      };
      ClinicalSummaryPdfService.generatePdf(patient, function(pdf) {
        pdfMake.createPdf(pdf).open();
      });

    }

    function fetchLetterhead() {
      ClinicalSummaryPdfService.getAmpathLogo('images/Logo-large.png', function(base64Img) {
        $scope.letterHead = base64Img;
        $scope.letterHeadIsBusy = false;
      });
    }

    function viewHivHistoricalSummary() {
      $scope.showHivHistoricalSummary = true;
    }
    function viewMedicationChangeHistory() {
      $scope.showMedicationChangeHistory = true;
    }

    fetchLetterhead();

  }
})();
