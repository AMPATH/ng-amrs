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
    //'app.context',
    'app.authentication',
    'app.patientsearch',
    'app.patientdashboard',
    'app.formentry'
  ])
    .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
      url: '/',
      templateUrl: 'views/appDashboard/main.html',
      //controller: 'AboutCtrl',
      data: { requireLogin: true }
    })
      .state('about', {
      url: '/about',
      templateUrl: 'views/appDashboard/about.html',
      controller: 'AboutCtrl',
      data: { requireLogin: true }
    })
    .state('patientsearch', {
    url: '/patientsearch',
    templateUrl: 'views/patientsearch/patientsearch.html',
    controller: 'PatientSearchCtrl',
    data: { requireLogin: true}
  })
  .state('patient', {
  url: '/patient/:uuid',
  templateUrl: 'views/appDashboard/patient-dashboard.html',
  controller: 'PatientDashboardCtrl',
  data: { requireLogin: true}
})
.state('encounter', {
url: '/encounter/:uuid',
templateUrl: 'views/appDashboard/patient-dashboard.html',
controller: 'PatientDashboardCtrl',
data: { requireLogin: true}
})
.state('form1', {
url: '/form1',
templateUrl: 'views/formentry/test1.html',
controller: 'TestFormCtrl',
data: { requireLogin: true}
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
// add provision of tracking various states for easy navigation
    $rootScope.previousState;
    $rootScope.previousStateParams;
    $rootScope.currentState;
    $rootScope.currentStateParams;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
      $rootScope.previousStateParams = fromParams;
      $rootScope.currentStateParams = toParams;

      console.log('Previous state:'+$rootScope.previousState);
      console.log('Previous state Params:'+$rootScope.previousStateParams);
      console.log($rootScope.previousStateParams);
      console.log('Current state:'+$rootScope.currentState);
      console.log('Current Param Params:'+$rootScope.currentStateParams);
      console.log($rootScope.currentStateParams);
});

  });
})();
