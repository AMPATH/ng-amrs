/*jshint -W003, -W117, -W098 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
  'use strict';
  angular
    .module('app.authentication')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', 'OpenmrsRestService', '$timeout', 'SessionResService', 'EtlRestService'];

  function LoginCtrl($scope, OpenmrsRestService, $timeout, SessionResService, EtlRestService) {
    $scope.errors = '';
    $scope.isVisible = false;
    $scope.CurrentUser = {
      username: '',
      password: ''
    };

    $scope.isBusy = false;

    clearCurrentSession();

    $scope.authenticate = function () {
      //to do authenticate
      //console.log('you clicked me');
      $scope.isBusy = true;
      OpenmrsRestService.getAuthService().isAuthenticated($scope.CurrentUser, function (authenticated) {
        console.log(authenticated);
        $scope.isBusy = false;
        if (!authenticated) // check if user is authenticated
        {
          $scope.isVisible = true;
          $scope.errors = 'Invalid user name or password. Please try again';
        } else {
          OpenmrsRestService.getUserService().getUser({ uuid:  OpenmrsRestService.getAuthService().user.uuid },
            function (data) {
              console.log('Logged in user:', data);

            });
          //invalidate etl session
          EtlRestService.invalidateUserSession( function (data) {},function (data) {})

        }

      }); // authenticate user
    };

    function clearCurrentSession() {
      $scope.isBusy = true;

     SessionResService.deleteSession(function(response) {
        $scope.isBusy = false;
      });
    }
  }
})();
