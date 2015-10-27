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
  .controller('PatientSearchCtrl', PatientSearchCtrl);

  PatientSearchCtrl.$inject = ['$rootScope', 'OpenmrsRestService', '$scope',
  '$log', 'filterFilter', '$state','PatientSearchService'];

  function PatientSearchCtrl($rootScope, OpenmrsRestService, $scope, $log,
    filterFilter, $state,PatientSearchService) {
    $scope.filter = '';
    $scope.patients = PatientSearchService.getPatients();
    $scope.isBusy = false;
    // pagination controls
    $scope.currentPage = 1;
    $scope.entryLimit = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $scope.searchString = PatientSearchService.getSearchString ();
    $scope.$watch('searchString', function(searchString) {
      $scope.patients = PatientSearchService.getPatients();
      if (searchString && searchString.length > 2) {
        $scope.isBusy = true;
        OpenmrsRestService.getPatientService().getPatientQuery({q:searchString},
          function(data) {
            $scope.isBusy = false;
            $scope.patients = data;
            PatientSearchService.resetPatients();
            PatientSearchService.setPatients(data);
            PatientSearchService.setSearchString (searchString);
            $scope.totalItems = $scope.patients.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 1;
          }
          );
      }
    });

    $scope.loadPatient = function(patientUuid) {
      /*
       Get the selected patient and save the details in the root scope
       so that we don't do another round trip to get the patient details
       */
       $rootScope.broadcastPatient = _.find($scope.patients, function(patient) {
        if (patient.uuid() === patientUuid)
          {return patient;}
      });

       $state.go('patient', {uuid:patientUuid});
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
  }
})();
