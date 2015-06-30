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
    'ui.router'
  ])
    .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/appDashboard/main.html',
        controller:'MainCtrl',
        data : {requireLogin : true }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/appDashboard/about.html',
        controller: 'AboutCtrl',
        data : {requireLogin : true }
      });

  }).run(function ($rootScope, $state, $location) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

 /*   var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !Authentication.isAuthenticated ;

    if(shouldLogin)
    {
      $state.go('login',{onSuccessRout:toState, onSuccessParams:toParams});
      event.preventDefault();
      return;
    }
    //else navigate to page 
    */

  });
});

  
  /*.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/appDashboard/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/appDashboard/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/
