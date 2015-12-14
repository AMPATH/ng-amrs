/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
    .module('ngAmrsApp')
    .directive('mainNavigationBar', directive);

  function directive() {
    var directiveDefinition = {
      restrict: 'EA',
      templateUrl: 'views/main/main-navigation.html',
      scope: {
        user: '@'
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directiveDefinition;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['$scope', 'OpenmrsRestService'];


    Controller.$inject = ['$scope', 'OpenmrsRestService', 'UserDefaultPropertiesService'];

    function Controller($scope, OpenmrsRestService, UserDefaultPropertiesService) {
    var vm = this;
     
    var authenticationService = OpenmrsRestService.getAuthService();

    $scope.showNavigationBar = false;

    $scope.isCollapsed = true;

    $scope.isUserLoggedIn = false;

    $scope.username = 'AKwatuha';

    $scope.location = 'Ampath';

    $scope.role = 'S/W Programmer';

    $scope.logOut = logOut;

    $scope.$on('loggedUser', function () {
            console.log(OpenmrsRestService.getUserService().user.openmrsModel());
            $scope.username = OpenmrsRestService.getUserService().user.userName();
            $scope.role = OpenmrsRestService.getUserService().user.userRole()[0].name;
            $scope.location = UserDefaultPropertiesService.getCurrentUserDefaultLocation().name;
            $scope.$on('defaultUserLocationBroadcast', function(event, location) {
            $scope.location = location.name;     
           });

        });


    $scope.$on('onUserAuthenticationDetermined', onUserAuthentionChanged);

    $scope.$on('onUserLoggedOut', onUserAuthentionChanged);

    activate();

    function activate() {
      updateNavBarVisibility();
    }

    function logOut() {
      authenticationService.logOut();
    }

    function onUserAuthentionChanged() {
      updateNavBarVisibility();
      updateLoginLogoutMenutItems();
    }

    function updateNavBarVisibility() {
      $scope.showNavigationBar = authenticationService.authenticated;
    }

    function updateLoginLogoutMenutItems() {
      $scope.isUserLoggedIn = authenticationService.authenticated;
    }
  }
})();
