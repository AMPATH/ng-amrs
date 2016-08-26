/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.administration')
    .directive('locationAuthorization', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        selectedLocations: "=",
        isBusy: "="
      },
      controller: locationAuthorizationController,
      link: locationAuthorizationLink,
      templateUrl: "views/administration/location-authorization.html"
    };
  }

  locationAuthorizationController.$inject = ['$scope','LocationAuthorizationService', 'OpenmrsRestService','dialogs'];

  function locationAuthorizationController($scope, LocationAuthorizationService, OpenmrsRestService,dialogs) {
    //system user
    $scope.selectedUser = {};
    $scope.users = [];
    $scope.findUsers = findUsers;
    $scope.findingUser = false;
    $scope.isBusy = false;

    //location
    $scope.selectedLocations = {};
    $scope.selectedLocations.selectedAll = false;
    $scope.selectedLocations.locations = [];
    $scope.selectAllLocations = selectAllLocations;
    $scope.fetchLocations = fetchLocations;
    //locations to generate aggregate data
    $scope.selectedLocationsAggregateData = {};
    $scope.selectedLocationsAggregateData.selectedAllAgg = false;
    $scope.selectedLocationsAggregateData.locations = [];
    $scope.selectAllAggregateLocations = selectAllAggregateLocations;

    //save location privileges
    $scope.saveUserAttribute = saveUserProperty;
    $scope.savingProperty = false;
    $scope.experiencedSavingErrors=null;

    //watch for selectedUser changed
    $scope.$watch('selectedUser.selected', onSelectedUserChange);

    function onSelectedUserChange(newValues, oldValues, scope) {
      if(newValues!=oldValues) {
        //reset
        $scope.selectedLocations.selectedAll = false;
        $scope.selectedLocationsAggregateData.selectedAllAgg = false;
        $scope.selectedLocations.locations = [];
        $scope.selectedLocationsAggregateData.locations = [];
        var userProperties = newValues.userProperties || {};
        for (var key in userProperties) {
          if (/^grantAccessToLocationOperationalData/.test(key)) {
            if (userProperties[key] === '*') {
              selectAllLocations();
            } else {
              scope.selectedLocations.selectedAll = false;
              var location =LocationAuthorizationService.getLocationByUuid(userProperties[key], $scope.locations);
              $scope.selectedLocations.locations.push(location);
            }
          }else if (/^grantAccessToLocationAggregateData/.test(key)) {
            if (userProperties[key] === '*') {
              selectAllAggregateLocations();
            } else {
              $scope.selectedLocationsAggregateData.selectedAll = false;
              var location =LocationAuthorizationService.getLocationByUuid(userProperties[key], $scope.locations);
              $scope.selectedLocationsAggregateData.locations.push(location);
            }
          }
        }
      }
    }

    function saveUserProperty() {
      //set set UX flags
      $scope.savingProperty = true;
      $scope.experiencedSavingErrors=null;
      //generate payload
      var payload =
        LocationAuthorizationService.generateUserPropertyPayload($scope.selectedUser, $scope.selectedLocations, $scope.selectedLocationsAggregateData);
      OpenmrsRestService.getUserService().saveUpdateUserProperty(payload,
        onSaveUserPropertySuccess, onSaveUserPropertyError);
    }


    function onSaveUserPropertySuccess(data) {
        $scope.savingProperty = false;
        $scope.experiencedSavingErrors = null;
      dialogs.notify('Success', 'Location(s) saved successfully for the selected user.');
    }

    function onSaveUserPropertyError(error) {
        $scope.savingProperty = false;
        $scope.experiencedSavingErrors = error.message;
    }

    function findUsers(searchText) {
      $scope.users = [];
      if (searchText && searchText !== ' ') {
        $scope.findingUser = true;
        OpenmrsRestService.getUserService().findUser(searchText,
          onUserSearchSuccess, onUserSearchError);
      }
    }

    function onUserSearchSuccess(data) {
      $scope.findingUser = false;
      $scope.users = data;
    }

    function onUserSearchError(error) {
      $scope.findingUser = false;
    }

    function fetchLocations() {
      $scope.isBusy = true;
      OpenmrsRestService.getLocationResService().getLocations(onGetLocationsSuccess,
        onGetLocationsError, false);
    }

    function onGetLocationsSuccess(locations) {
      $scope.locations = LocationAuthorizationService.wrapLocations(locations);
      $scope.locationsOptions = {
        placeholder: 'Select a location or type to search...',
        dataTextField: 'name()',
        dataValueField: 'uuid',
        filter: 'contains',
        dataSource: $scope.locations
      };
      $scope.isBusy = false;
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
    }


    function selectAllLocations() {
      if ($scope.selectedLocations.selectedAll === false) {
        $scope.selectedLocations.selectedAll = true;
        $scope.selectedLocations.locations = $scope.locations;
      }
      else {
        $scope.selectedLocations.selectedAll = false;
        $scope.selectedLocations.locations = [];
      }
    }


    function selectAllAggregateLocations() {
      if ($scope.selectedLocationsAggregateData.selectedAllAgg === false) {
        $scope.selectedLocationsAggregateData.selectedAllAgg = true;
        $scope.selectedLocationsAggregateData.locations = $scope.locations;
      }
      else {
        $scope.selectedLocationsAggregateData.selectedAllAgg = false;
        $scope.selectedLocationsAggregateData.locations = [];
      }
    }



  }

  function locationAuthorizationLink(scope, element, attrs, vm) {
    scope.fetchLocations();
  }
})();
