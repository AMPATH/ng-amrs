/*jshint -W098 */
(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name ngAmrsApp
   * @description
   * # ngAmrsApp
   *
   * Main module of the application.
   */
  angular
    .module('ngAmrsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'authentication'
  ])
    .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
      url: '/',
      templateUrl: 'views/appDashboard/main.html',
      controller: 'MainCtrl',
      data: { requireLogin: true }
    })
      .state('about', {
      url: '/about',
      templateUrl: 'views/appDashboard/about.html',
      controller: 'AboutCtrl',
      data: { requireLogin: true }
    })
    .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/authentication/login.html',
    controller: 'LoginCtrl',
    data: { requireLogin: true }
  })
  .state('login', {
  url: '/login',
  templateUrl: 'views/authentication/login.html',
  controller: 'LoginCtrl',
  data: { requireLogin: false }
});

  }).run(function($rootScope, $state, $location, AuthService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

      var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !AuthService.authenticated;
      if (shouldLogin) {
        $state.go('login', {onSuccessRout:toState, onSuccessParams:toParams});
        event.preventDefault();
        return;
      }

      //else navigate to page
    });
  });
})();
