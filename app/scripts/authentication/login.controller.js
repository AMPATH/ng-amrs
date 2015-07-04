/*jshint -W003, -W117, -W098 */
(function() {
'use strict';
angular
        .module('authentication')
        .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'AuthService'];

function LoginCtrl($scope, auth) {
  $scope.errors = '';
  $scope.CurrentUser = {username:'',
              password:''
  };
  $scope.authenticate = function() {
    //to do authenticate
    console.log('you clicked me');
    auth.isAuthenticated($scope.CurrentUser, function(authenticated) {
      console.log(authenticated);
      if (!authenticated) // check if user is authenticated
      {
        $scope.errors = 'Invalid user name or password. please try agian';
      }

    }); // authenticate user
    //if ()

  };
}
})();
