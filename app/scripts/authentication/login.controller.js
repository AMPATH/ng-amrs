/*jshint -W003, -W117, -W098 */
(function() {
'use strict';
angular
        .module('authentication')
        .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope'];

function LoginCtrl($scope) {
  $scope.CurrentUser = {username:'',
              password:''
  };
  $scope.authenticate = function() {
    //to do authenticate
  };

  activate();
  function activate() {
      }
}
})();
