/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('encounterView', encounterView);

    function encounterView() {
        return {
            restict: "E",
            scope: { patientUuid: "@" },
            controller: encounterViewController,
            link: encounterViewLink,
            templateUrl: "views/patient-dashboard/encounter-view-pane.html"
        };
    }

    encounterViewController.$inject = ['$scope', 'OpenmrsRestService', '$filter'];
    function encounterViewController($scope, OpenmrsRestService, $filter) {
        $scope.encounters = [];
        $scope.isBusy = false;
        $scope.nextStartIndex = 0;
        $scope.getLatestEncounter = getLatestEncounter;
        $scope.allDataLoaded = false;
        $scope.experiencedLoadingError = false;

        function getLatestEncounter(patientUuid) {
          OpenmrsRestService.getEncounterResService().getPatientEncounters(patientUuid,
              function(data) {
                var filterData=$filter('filter')(data,{encounterType:{uuid:'8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'}});
                  OpenmrsRestService.getEncounterResService().getEncounterByUuid(filterData[0].uuid,
                      function(data) {
                        $scope.obs = data.obs;
                      },
                      //error callback
                      function(error) {
                          $scope.errorMessage =
                              'An Error occured when trying to get latest encounter obs';
                      }
                  );
              },
              //error callback
              function(error) {
                  $scope.errorMessage =
                      'An Error occured when trying previous encounters';
              }
          );
        }
    }

    function encounterViewLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);
        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.isBusy = false;
                scope.allDataLoaded = false;
                scope.nextStartIndex = 0;
                scope.encounters = [];
                scope.getLatestEncounter(newVal);
            }
        }
    }
})();
