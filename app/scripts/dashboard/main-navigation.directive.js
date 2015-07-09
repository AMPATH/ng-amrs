(function() {
    'use strict';

    angular
        .module('ngAmrsApp')
        .directive('mainNavigationBar', directive);

    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'views/appDashboard/main-navigation.html',
            scope: {
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['$scope','ContextService'];

    function Controller($scope, ContextService) {
        var vm = this;

        var authenticationService = ContextService.getAuthService();

        $scope.showNavigationBar = false;

        $scope.isUserLoggedIn = false;

        $scope.$on('onUserAuthenticationDetermined',onUserAuthentionChanged);


        activate();

        function activate() {
          updateNavBarVisibility();
        }


        function onUserAuthentionChanged(){
          updateNavBarVisibility();
          updateLoginLogoutMenutItems();
        }

        function updateNavBarVisibility(){
          $scope.showNavigationBar = authenticationService.authenticated;
        }

        function updateLoginLogoutMenutItems(){
          $scope.isUserLoggedIn = authenticationService.authenticated;
        }
    }
})();
