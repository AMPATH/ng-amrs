/*
jshint -W003, -W026, -W117, -W098
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('app.patientdashboard')
            .directive('currentVisit', directive);

  function directive() {
      return {
        restrict: 'E',
        scope: { patientUuid: '@' },
        templateUrl: 'views/patient-dashboard/current-visit.html',
        controller: currentVisitController
      };
    }

  currentVisitController.$inject = [
        '$scope',
        '$rootScope',
        'VisitResService',
        '$stateParams',
        'EncounterResService',
        'EncounterModel',
        '$filter',
        '$timeout',
        '$location',
        'dialogs'
  ];

  function currentVisitController($scope, $rootScope, vService, $stateParams,
                                    encService, encModel, $filter, $timeout,
                                    $location, dialogs) {

        $scope.currentVisit = initializeCurrentVisit();
        $scope.loadingVisitTypes = true;
        $scope.checkingIfVisitStarted = true;
        $scope.visitTypesLoaded = false;
        $scope.formsFilledStatus = [];

        _.each($rootScope.cachedPocForms, function(form)
          {
              form.filled=false;
              $scope.formsFilledStatus.push(form)
          });

        $scope.startNewVisit = function() {
             $scope.currentVisit.startDatetime = new Date();
             //Create visit
             var newVisit = {
                 patient: $scope.patientUuid,
                 visitType: $scope.currentVisit.visitType,
                 startDatetime: getFormattedDate($scope.currentVisit.startDatetime)
             };

             vService.saveVisit(newVisit, function(data) {
                 $scope.currentVisit.uuid = data.uuid;
                 $scope.visitStarted = true;
                 console.info('New visit instance created');
             });
         };

         $scope.loadEncounterForm = function(EncounterModel) {
           $rootScope.activeEncounter = EncounterModel;
           $location.path('/encounter/' + EncounterModel.uuid() + '/patient/' +
             EncounterModel.patientUuid());
         }

         $scope.cancelVisit = function(visit) {
             var promise = dialogs.confirm('Warning', 'Canceling a visit ' +
                            'deletes all encounters associated with it');
             promise.result.then(function yes(){
                 //void the visit.
                 var payload = {
                     'uuid': visit.uuid,
                     'voided': true
                 };
                 vService.saveVisit(payload, function success(response){
                     //Update state
                     $scope.visitStarted = false;
                     $scope.currentVisit = initializeCurrentVisit()
                     clearFormFilledStatus();

                     //Void encounters
                     if(angular.isDefined(visit.encounters)) {
                         _.each(visit.encounters, function(encounter) {
                             encService.voidEncounter(encounter.uuid());
                         });
                     }
                 });
             });
         }

         $scope.endVisit = function(visit) {
             var promise = dialogs.confirm('Confirm', 'Are you sure?');
             promise.result.then(function yes(){
                 $scope.currentVisit.stopDatetime = Date.now();
                 var payload = {
                     uuid: visit.uuid,
                     stopDatetime: getFormattedDate($scope.currentVisit.stopDatetime)
                 };

                 vService.saveVisit(payload, function(data) {
                     $scope.currentVisit.ended = true;
                 }, function(error) {
                     $scope.currentVisit.stopDatetime = undefined;
                 });
             });
         }

         $scope.$evalAsync(function checkIfVisitStarted(tryCount) {
             var tryCount = tryCount || 1;      //Try 10 times before failing
             console.info('Checking whether visit has started');
             $scope.checkingIfVisitStarted = true;
             __getTodayVisits($scope.patientUuid, function(todayVisits) {
                  if(todayVisits.length > 0) {
                      console.info('Patient with uuid ', $scope.patientUuid,
                        ' has visit started');
                      var visit = todayVisits[0];
                      $scope.currentVisit.uuid = visit.uuid;
                      $scope.currentVisit.startDatetime = visit.startDatetime;
                      $scope.visitStarted = true;
                      if(Date.parse(visit.stopDatetime) !== null) {
                          $scope.currentVisit.stopDatetime = visit.stopDatetime;
                          $scope.currentVisit.ended = true;
                      }

                      //Load associated encounters
                      __fetchVisitCompletedEncounters($scope.currentVisit.uuid);
                  } else {
                      console.info('No visit started yet');
                      $scope.visitStarted = false;
                  }
                  $scope.checkingIfVisitStarted = false;
              }, function(err) {
                  if(tryCount === 5) {
                      $scope.checkingIfVisitStarted = false;
                      $scope.errorLoadingPatientVisits = true;
                      console.error('Error: An error occured while loading visits ',
                                  'patient with uuid ', $scope.patientUuid);
                      console.trace(err.message());
                  } else {
                      //Retry
                      checkIfVisitStarted(++tryCount);
                  }
              });
         });

          $scope.$evalAsync(function __loadVisitTypes(tryCount) {
              var tryCount = tryCount || 1;
              vService.getVisitTypes(function(data) {
                  $scope.visitTypes = data;
                  $scope.visitTypesLoaded = true;
                  $scope.loadingVisitTypes = false;
              }, function(err) {
                  if(tryCount === 5) {
                      // Fail
                      $scope.loadingVisitTypes = false;
                      $scope.errorLoadingVisitTypes = true;
                      console.log('Failed to load visit types');
                      console.trace(err.message);
                  } else {
                      // Retry
                      __loadVisitTypes(++tryCount);
                  }
              });
          });

         // Function to load saved encounters if visit started
         function __fetchVisitCompletedEncounters(visitUuid, tryCount) {
             var tryCount = tryCount || 1;
             $scope.loadingEncounters = true;
             vService.getVisitEncounters(visitUuid, function(visitEncounters) {
                 if(visitEncounters.length > 0) {
                     $scope.currentVisit.hasCompletedEncounters = true;
                     $scope.currentVisit.encounters =
                        encModel.toArrayOfModels(visitEncounters);

                     _.each(visitEncounters, function(encounter) {
                          var i = _.findIndex($scope.formsFilledStatus, function(entry) {
                             return entry.encounterTypeUuid === encounter.encounterType.uuid;
                         });
                         if(i !== -1) {
                             $scope.formsFilledStatus[i].filled = true;
                             return true;
                        }
                     });
                }
                $scope.loadingEncounters = false;
            }, function(err) {
                if(tryCount === 5) {
                    $scope.errorLoadingEncounters = true;
                    console.log('Error loading visit encounters for visit uuid ',
                     visitUuid);
                    console.trace(err.message());
                } else {
                    // Retry
                    __fetchVisitCompletedEncounters(visitUuid, ++tryCount);
                }
            });
         }

         // Function to load Patient's today's visits if any.
         function __getTodayVisits(patientUuid, callback, errorCallback) {
             var simpleVisitRep = 'custom:(uuid,patient:(uuid,uuid),' +
                     'visitType:(uuid,name),location:ref,startDatetime,' +
                     'stopDatetime)';
             var params = {
                 patientUuid: patientUuid,
                 v: simpleVisitRep
             };
             console.info('vService ni ...', vService);
             vService.getPatientVisits(params, function(visits) {
                 //Get todays
                 var dFormat = 'yyyy-MM-dd';
                 var today = getFormattedDate(Date.now(), dFormat);
                 var todayVisits = [];
                 function formatted(gDate) {
                     return getFormattedDate(new Date(gDate), dFormat);
                 }
                 _.each(visits, function(visit) {
                    if(today === formatted(visit.startDatetime)) {
                        todayVisits.push(visit);
                    }
                 });
                 if(typeof callback === 'function') {
                     callback(todayVisits);
                 } else {
                     console.log('No callback function has been passed');
                 }
             }, errorCallback);
         }

         //Format date
         function getFormattedDate(date, format) {
             if(angular.isUndefined(format)) {
                 format = 'yyyy-MM-dd HH:mm:ss';
             }
             if(typeof date === 'string') {
                 date = new Date(date);
             }
             return $filter('date')(date, format, '+0300');
         }

         function clearFormFilledStatus() {
             _.each($scope.formsFilledStatus, function(entry) {
                 entry.filled = false;
             });
         }

         function initializeCurrentVisit() {
             return {
                 ended: false,
                 hasCompletedEncounters: false
             };
         }
  }
})();
