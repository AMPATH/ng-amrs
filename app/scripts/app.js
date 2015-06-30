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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
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
  });
