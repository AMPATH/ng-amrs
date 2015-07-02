/*jshint -W003 */
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name authentication.controller:AuthenticationCtrl
   * @description
   * # AuthenticationCtrl
   * Controller of the authentication
   */
  angular
    .module('authentication')
    .controller('LoginCtrl', LoginCtrl);
  MainCtrl.$nject = ['$scope'];

  function LoginCtrl($scope,AuthService) {

    //Pass username and password from scope
    $scope.credentials = {
      username: $scope.username,
      password: $scope.password
    };

    //Create function to execute the login function:
    $scope.login= function (credentials) {
      AuthService.login(credentials,credentials,AuthService.successcallback,AuthService.failedcallback);
    }

  }
})();

