/*
 jshint -W003, -W098, -W117, -W109
 */
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
    .module('app.patientsearch')
    .directive('patientRelationshipSearch', PatientRelationshipSearch);

  function PatientRelationshipSearch(){
    var patientRelationshipSearchDefinition={
      restrict:'E',
      templateUrl:'views/patient-search/patient-relationship-search.html',
      controller:PatientRelationshipSearchCtrl
    };
    return patientRelationshipSearchDefinition;
  }
  PatientRelationshipSearchCtrl.$inject = ['$rootScope', 'OpenmrsRestService', '$scope',
    '$log', 'filterFilter', '$state', 'PatientSearchService', '$window', '$timeout'
  ];

  function PatientRelationshipSearchCtrl($rootScope, OpenmrsRestService, $scope, $log,
    filterFilter, $state, PatientSearchService, $window, $timeout) {
    $scope.filter = '';
    $scope.patients = PatientSearchService.getPatients();
    $scope.isBusy = false;
    $scope.isResetButton = true;
    $scope.isSearchButton = true;
    $scope.loaderButton = false;
    $scope.searchPatients = searchPatients;
    // pagination controls
    $scope.currentPage = 1;
    $scope.entryLimit = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $scope.relationshipSearchString = PatientSearchService.getSearchString();
    $scope.searchPanelVisible=false;
    $scope.isBusy = false;

    $scope.$on('bar-code-scan-event', function(event, parameters) {
      $scope.relationshipSearchString= '';
      var barcode = angular.element.find('#search-textbox')[0].value.replace('$', '');
      $scope.relationshipSearchString = barcode;
      searchPatients(barcode);
    });

    $scope.selectPatient = function(patientUuid) {
      $scope.searchPanelVisible=false;
      $scope.patientToBindRelationship= _.find($scope.patients, function(patient) {
        if (patient.uuid() === patientUuid) {
          return patient;
        }
      });

    };

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.items = [];
    // create empty search model (object) to trigger $watch on update
    $scope.search = {};
    $scope.resetFilters = function() {
      // needs to be a function or it won't trigger a $watch
      $scope.search = {};
    };

    $scope.resetSearch = function() {
      $scope.searchPanelVisible=false;
      $scope.isResetButton = true;
      PatientSearchService.resetPatients();
      $scope.relationshipSearchString = '';
    };

    function searchPatients(relationshipSearchString) {
      $scope.searchPanelVisible=true;
      $scope.isSearchButton = false;
      $scope.loaderButton = true;
      $scope.isBusy = true;
      OpenmrsRestService.getPatientService().getPatientQuery({
          q: relationshipSearchString
        },
        function(data) {
          $scope.isSearchButton = true;
          $scope.loaderButton = false;
          $scope.isBusy = false;
          $scope.isResetButton = false;
          $scope.patients = data;
          PatientSearchService.resetPatients();
          PatientSearchService.setPatients(data);
          PatientSearchService.setSearchString(relationshipSearchString);
          $scope.totalItems = $scope.patients.length;
          $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
          $scope.currentPage = 1;
           $scope.$apply();
        }
      );
    }
  }
})();
