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
    .module('ngAmrsApp')
    .controller('UserDefaultPropertiesCtrl', UserDefaultPropertiesCtrl);
  UserDefaultPropertiesCtrl.$nject = ['$rootScope', '$scope', '$stateParams', 'LocationResService', 'LocationModel', 'UserDefaultPropertiesService', '$state'];

  function UserDefaultPropertiesCtrl($rootScope, $scope, $stateParams,
    LocationResService, LocationModel, UserDefaultPropertiesService, $state) {

    $scope.username = '';
    $scope.defaultLocation = '';

    $scope.selected = '';
    $scope.defaultLocationSelected = false;
    $scope.locations = [];

    $scope.isBusy = false;
    $scope.selectedLocationName = '';
    $scope.selectedLocationUuid = '';

    $scope.onDefaultLocationSelection = onDefaultLocationSelection;

    $scope.locationSelectionEnabled = UserDefaultPropertiesService.getLocationSelectionEnabled();

    $scope.goToPatientSearch = goToPatientSearch;
    activate();

    function activate() {
      fetchLocations();
      getLogedInUser();
      getUserDefaultLocation();
    }


    function onDefaultLocationSelection(location) {
      $scope.selectedLocationName = location.name;
      $scope.selectedLocationUuid = location.uuid;
      $scope.locationSelectionEnabled = false;
      UserDefaultPropertiesService.setLocationSelectionEnabled(false);
      if (angular.isDefined(location.uuid)) {
        $scope.defaultLocationSelected = true;

        if (angular.isDefined($scope.username) && angular.isDefined(location.name)) {
          var propertyKey = 'userDefaultLocation' + $scope.username;
          UserDefaultPropertiesService.setUserProperty(propertyKey, location);
          $rootScope.$broadcast('defaultUserLocationBroadcast', location);
        }

      }
    }

    function onGetLocationsSuccess(locations) {
      $scope.isBusy = false;
      $scope.locations = wrapLocations(locations);
    }

    function fetchLocations() {
      $scope.isBusy = true;
      LocationResService.getLocations(onGetLocationsSuccess, onGetLocationsError, false);
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

    function getLogedInUser() {
      $scope.username = UserDefaultPropertiesService.getAuthenticatedUser();
    }

    function getUserDefaultLocation() {
      $scope.defaultLocation = UserDefaultPropertiesService.getCurrentUserDefaultLocation();
      $scope.defaultLocationSelected = true;
      $scope.locationSelectionEnabled = false;

      if (angular.isDefined($scope.defaultLocation)) {
        $rootScope.$broadcast('defaultUserLocationBroadcast', $scope.defaultLocation);
        $scope.selectedLocationName = $scope.defaultLocation.name;
      }

    }

    function goToPatientSearch() {
      $state.go('patientsearch');
    }
  }
})();
