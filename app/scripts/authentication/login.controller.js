/*jshint -W003, -W117, -W098 */
(function() {
'use strict';
angular
        .module('app.authentication')
        .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'ContextService'];

function LoginCtrl($scope, context) {
  $scope.errors = '';
  $scope.CurrentUser = {username:'',
              password:''
  };

  $scope.authenticate = function() {
    //to do authenticate
    console.log('you clicked me');
    context.getAuthService().isAuthenticated($scope.CurrentUser, function(authenticated) {
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
