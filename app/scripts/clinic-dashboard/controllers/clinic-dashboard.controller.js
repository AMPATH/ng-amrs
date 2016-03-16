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
    .module('app.clinicDashboard')
    .controller('ClinicDashboardCtrl', ClinicDashboardCtrl);
  ClinicDashboardCtrl.$nject = ['$rootScope', '$scope', '$stateParams',
   'OpenmrsRestService', 'LocationModel','$state',
    'ClinicDashboardService','UserDefaultPropertiesService','CachedDataService'];

  function ClinicDashboardCtrl($rootScope, $scope, $stateParams,
    OpenmrsRestService, LocationModel,$state, ClinicDashboardService,UserDefaultPropertiesService,
    CachedDataService) {

    var locationService = OpenmrsRestService.getLocationResService();
    $scope.selectedLocation = ClinicDashboardService.getSelectedLocation();

    $scope.selected = '';
    $scope.locations = [];

    $scope.isBusy = false;

    $scope.onLocationSelection = onLocationSelection;

    $scope.locationSelectionEnabled = ClinicDashboardService.getLocationSelectionEnabled();

    $scope.switchTabByIndex = switchTabByIndex;

    $scope.setDefaultUserLocation = setDefaultUserLocation;

    activate();

    function activate() {
      fetchLocations();
    }

    function switchTabByIndex(index) {
      $scope.activeTabId = index;
    }

    function setDefaultUserLocation(){
      var definedDefaultUserLocation = UserDefaultPropertiesService.getCurrentUserDefaultLocation();
      if (angular.isDefined(definedDefaultUserLocation)) {
        //use defined default user location to prefill the clinical dashboard
        if (ClinicDashboardService.getSelectedLocation().selected===undefined){
          var uuid = UserDefaultPropertiesService.getCurrentUserDefaultLocation().uuid;
          CachedDataService.getCachedLocationByUuid(uuid,function(results){
              var location = wrapLocation(results);
              $scope.selectedLocation.selected =location;
              ClinicDashboardService.setSelectedLocation(location);
              $scope.locationSelectionEnabled = false;
            });
        }

      }
    }



    function onLocationSelection($event) {
      $scope.locationSelectionEnabled = false;
      ClinicDashboardService.setLocationSelectionEnabled(false);
      ClinicDashboardService.setSelectedLocation({selected:$scope.selectedLocation.selected});
      console.log('Selected Location===>',$scope.selectedLocation.selected.uuId());
      $state.transitionTo($state.current, {locationuuid: $scope.selectedLocation.selected.uuId()},
         { reload: true, inherit: true, notify: true });
      $rootScope.$broadcast('location:change');
    }

    function fetchLocations() {
      $scope.isBusy = true;
      locationService.getLocations(onGetLocationsSuccess, onGetLocationsError, false);
    }

    function onGetLocationsSuccess(locations) {
      $scope.isBusy = false;
      $scope.locations = wrapLocations(locations);
      setDefaultUserLocation();
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
    }

    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        wrappedLocations.push(wrapLocation(locations[i]));
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      return LocationModel.toWrapper(location);
    }

  }
})();
