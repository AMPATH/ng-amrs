/*jshint -W003, -W117, -W098, -W026 */
(function () {
  'use strict';

  angular
    .module('app.administration')
    .factory('LocationAuthorizationService', LocationAuthorizationService);
  LocationAuthorizationService.$inject = ['$filter', 'moment', 'LocationModel'];
  function LocationAuthorizationService($filter, moment, LocationModel) {
    var serviceDefinition;
    serviceDefinition = {
      wrapLocations: wrapLocations,
      generateUserPropertyPayload: generateUserPropertyPayload,
      getLocationByUuid:getLocationByUuid
    };
    return serviceDefinition;
    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        var wrapped = wrapLocation(locations[i]);
        wrapped.index = i;
        wrappedLocations.push(wrapped);
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      var location = LocationModel.toWrapper(location);
      location.uuid = location.uuId();
      return location;
    }

    function getLocationByUuid(uuid, locations) {
      var _location={};
      _.each(locations, function(location){
        if(uuid===location.uuid)
          _location=location;
      });
      return _location;
    }

    function generateUserPropertyPayload(selectedUser, selectedLocations) {
      //first remove previous location access in selectedUser.userProperties
      var userProperties = selectedUser.selected.userProperties || {};
      var payload={};
      for (var key in userProperties) {
        if (/^grantAccessToLocation/.test(key))
          delete userProperties[key];
      }

      // then now add the new location privileges
      if (selectedLocations.selectedAll) {
        userProperties['grantAccessToLocation[*]'] = '*';
      } else if (selectedLocations.locations.length > 0) {
        for (var i = 0; i < selectedLocations.locations.length; i++) {
          userProperties['grantAccessToLocation[' + i + ']'] = selectedLocations.locations[i].uuId();
        }
      }

      //finally create payload and add uuid to identify selected user
      payload.uuid = selectedUser.selected.uuid;
      payload.userProperties=userProperties;
      return payload;
    }
  }

})();
