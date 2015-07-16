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
  });
})();
