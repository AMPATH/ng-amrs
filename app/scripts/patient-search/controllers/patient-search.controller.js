/*
jshint -W003, -W098, -W117, -W109
*/
(function() {
'use strict';

  angular
        .module('app.patientsearch')
        .controller('PatientSearchCtrl', PatientSearchCtrl);

  PatientSearchCtrl.$inject = ['$rootScope', 'OpenmrsRestService', '$scope', '$log', 'filterFilter', '$state'];

  function PatientSearchCtrl($rootScope, OpenmrsRestService, $scope, $log, filterFilter, $state) {
    $scope.filter = "";
    $scope.patients = [];

    $scope.isBusy = false;

    // pagination controls
  	$scope.currentPage = 1;
  	$scope.entryLimit = 10; // items per page

   $scope.$watch('searchString', function (searchString) {
     $scope.patients = [];
     if (searchString && searchString.length > 2) {
       $scope.isBusy = true;
       OpenmrsRestService.getPatientService().getPatientQuery({q:searchString},
           function(data) {
             $scope.isBusy = false;

             //Initializing required var for the pagination
             $scope.allPatients = data;
             $scope.totalItems = $scope.allPatients.length;
             $scope.entryLimit = 10;

             //Adding $watch to currentPage amd EntryLimit
             $scope.$watch('currentPage + entryLimit', function() {
               var begin = (($scope.currentPage - 1) * $scope.entryLimit)
                 , end = begin + $scope.entryLimit;
               $scope.patients= $scope.allPatients.slice(begin, end);
               console.log("The new patient after filter " +$scope.patients);
             });
           }
       );
     }
   });


   $scope.loadPatient = function (patientUuid){
     /*
     Get the selected patient and save the details in the root scope
     so that we don't do another round trip to get the patient details
     */
     $rootScope.broadcastPatient = _.find($scope.patients, function(patient){
       if(patient.uuid() === patientUuid)
       {return patient;}
     });
     $state.go('patient', {uuid:patientUuid});
   };


  //  $scope.currentPage = 1;

  //   $scope.setPage = function(pageNo) {
  //   $scope.currentPage = pageNo;
  // };

    $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

    $scope.items = [];

	// create empty search model (object) to trigger $watch on update
	$scope.search = {};

	$scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};



	// $watch search to update pagination
	// $scope.$watch('search', function (newVal, oldVal) {
	// 	$scope.filtered = filterFilter($scope.items, newVal);
	// 	$scope.totalItems = $scope.filtered.length;
	// 	$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
	// 	$scope.currentPage = 1;
	// }, true);
  }
})();
