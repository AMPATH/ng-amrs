/*jshint -W098, -W030 */
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
      templateUrl: 'views/main/main.html',
      //controller: 'AboutCtrl',
      data: { requireLogin: true }
    })
      .state('about', {
      url: '/about',
      templateUrl: 'views/main/about.html',
      controller: 'AboutCtrl',
      data: { requireLogin: true }
    })
    .state('patientsearch', {
    url: '/patientsearch',
    templateUrl: 'views/patient-search/patient-search.html',
    controller: 'PatientSearchCtrl',
    data: { requireLogin: true}
  })
  .state('patient', {
  url: '/patient/:uuid',
  templateUrl: 'views/patient-dashboard/patient-dashboard.html',
  controller: 'PatientDashboardCtrl',
  data: { requireLogin: true}
})
.state('encounter', {
url: '/encounter/:encuuid/patient/:uuid',
templateUrl: 'views/formentry/formentry.html',
controller: 'FormentryCtrl',
data: { requireLogin: true}
})
.state('forms', {
url: '/form/:formuuid/patient/:uuid',
templateUrl: 'views/formentry/formentry.html',
controller: 'FormentryCtrl',
data: { requireLogin: true}
})

  .state('login', {
  url: '/login',
  templateUrl: 'views/authentication/login.html',
  controller: 'LoginCtrl',
  data: { requireLogin: false }
});

  }).run(function($rootScope, $state, $location, OpenmrsRestService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

      var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !OpenmrsRestService.getAuthService().authenticated;
      //console.log(shouldLogin);
      if (shouldLogin) {
        $state.go('login', {onSuccessRout:toState, onSuccessParams:toParams});
        event.preventDefault();
        return;
      }

      //else navigate to page
    });
// add provision of tracking various states for easy navigation and public variables of interest
    $rootScope.previousState;
    $rootScope.previousStateParams;
    $rootScope.currentState;
    $rootScope.currentStateParams;
    $rootScope.broadcastPatient;
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
