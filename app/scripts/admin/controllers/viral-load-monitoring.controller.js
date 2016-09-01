/*jshint -W003, -W098, -W033 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViralLoadMonitoringCtrl', ViralLoadMonitoringCtrl);
  ViralLoadMonitoringCtrl.$nject =

    ['$scope', '$stateParams'];

  function ViralLoadMonitoringCtrl($scope, $stateParams) {
    $scope.selectedLocation = $stateParams.locationuuid || '';
    var date = new Date();
    $scope.startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    $scope.endDate = date;
    $scope.loadData = loadData;
    //$scope.setTableParams = setTableParams;
    var indicators = $scope.indicators;
    var locations = '';
    if ($scope.selectedLocation) {
      locations = $scope.selectedLocation;
    } else {
      locations = getSelectedLocations($scope.selectedLocations);
    }
    $scope.table1Indicators = 'total_with_vl,perc_unsuppressed,num_requiring_followup_vl';
    $scope.table2Indicators = 'perc_getting_followup_vl_180_days,getting_followup_vl_180_days,avg_days_to_switch_after_unsuppressed,perc_fu_suppressed';
    $scope.table3Indicators = 'switch_after_unsuppressed,switch_after_unsuppressed_x_2,avg_days_to_switch_after_unsuppressed,num_with_vl_after_switch_suppressed,perc_switched_with_suppressed_fu';
    $scope.params = {
      endDate: moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      report: 'viral-load-monitoring-report',
      startDate: moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      groupBy: 'groupByLocation',
      locationUuids: locations,
      indicators: '',
      order: 'encounter_datetime|asc',
      startAge: $scope.startAge,
      endAge: $scope.endAge,
      gender: ($scope.gender || ['M', 'F']).toString()

    };
    function loadData() {
      var locations = $scope.selectedLocation || getSelectedLocations($scope.selectedLocations);
      $scope.$broadcast('loadData',getSelectedLocations($scope.selectedLocations));
    }
  }



  function getSelectedLocations(selectedLocationObject) {
    var locations;
    try {
      if (angular.isDefined(selectedLocationObject.locations)) {
        for (var i = 0; i < selectedLocationObject.locations.length; i++) {
          if (i === 0) {
            locations = '' + selectedLocationObject.locations[i].uuId();
          } else {
            locations =
              locations + ',' + selectedLocationObject.locations[i].uuId();
          }
        }
      }
    } catch (e) {

    }
    return locations;
  }
})();
