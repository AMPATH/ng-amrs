/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('UserDefaultPropertiesService', UserDefaultPropertiesService);

  UserDefaultPropertiesService.$inject = ['$cookies'];

  function UserDefaultPropertiesService($cookies) {
    var serviceDefinition;
    var userDefaultLocation;
    var authenticatedUser;
    var locationSelectionEnabled = true;
    serviceDefinition = {
      setLocationSelectionEnabled: setLocationSelectionEnabled,
      getLocationSelectionEnabled: getLocationSelectionEnabled,
      getCurrentUserDefaultLocation: getCurrentUserDefaultLocation,
      setUserProperty: setUserProperty,
      setAuthenticatedUser: setAuthenticatedUser,
      getAuthenticatedUser: getAuthenticatedUser
    };
    return serviceDefinition;

    function getCurrentUserDefaultLocation() {
      authenticatedUser = getAuthenticatedUser();
      var cookieValue = $cookies.getObject('userDefaultLocation' + authenticatedUser);
      if (cookieValue === undefined) {
        return;
      }
      userDefaultLocation = cookieValue;
      return userDefaultLocation;
    }

    function setLocationSelectionEnabled(status) {
      locationSelectionEnabled = status;
    }

    function getLocationSelectionEnabled() {
      return locationSelectionEnabled;
    }

    function setUserProperty(propertyKey, property) {
      //property = JSON.stringify(property);
      if (propertyKey === 'userDefaultLocation') {
        //attach the authenticated in username to form the default location key
        propertyKey = propertyKey + getAuthenticatedUser();
      }
      var d = new Date();
      d.setFullYear(2050);//expires in 2050
      $cookies.putObject(propertyKey, property, { 'expires': d });
    }

    function setAuthenticatedUser(user) {
      authenticatedUser = user;
    }

    function getAuthenticatedUser() {
      return authenticatedUser;
    }

  }
})();
