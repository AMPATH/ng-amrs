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
    'ui.bootstrap',
    'app.context',
    'app.authentication',
    'app.patientsearch'
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
    templateUrl: 'views/patientsearch/patientsearch.html',
    controller: 'PatientSearchCtrl',
    data: { requireLogin: false }
  })
  .state('login', {
  url: '/login',
  templateUrl: 'views/authentication/login.html',
  controller: 'LoginCtrl',
  data: { requireLogin: false }
});

  }).run(function($rootScope, $state, $location, ContextService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

      var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !ContextService.getAuthService().authenticated;
      //console.log(shouldLogin);
      if (shouldLogin) {
        $state.go('login', {onSuccessRout:toState, onSuccessParams:toParams});
        event.preventDefault();
        return;
      }

      //else navigate to page
    });
  });
})();
