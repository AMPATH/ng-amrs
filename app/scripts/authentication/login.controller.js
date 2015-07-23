/*jshint -W003, -W117, -W098 */
(function() {
'use strict';
angular
        .module('app.authentication')
        .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'ContextService', '$timeout'];

function LoginCtrl($scope, context, $timeout) {
  $scope.errors = '';
  $scope.CurrentUser = {username:'',
              password:''
  };


  $timeout(function () {
    $scope.authenticate = function() {
      //to do authenticate
      console.log('you clicked me');
      context.getAuthService().isAuthenticated($scope.CurrentUser, function(authenticated) {
        console.log(authenticated);
        if (!authenticated) // check if user is authenticated
        {
          $scope.errors = 'Invalid user name or password. please try agian';
        }
        else {
            context.getUserService().getUser({q:$scope.CurrentUser.username},function(data){
            console.log(data);


          });
        }

      }); // authenticate user
      //if ()

    };

  }, 1000);
}
})();
