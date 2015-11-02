/*jshint -W098, -W030 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
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
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'ui.bootstrap',
      'app.authentication',
      'app.patientsearch',
      'app.patientdashboard',
      'app.clinicDashboard',
      'app.admin',
      'app.formentry',
      'app.utils',
      'ct.ui.router.extras'
    ])
    .config(function($stateProvider, $stickyStateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/main/main.html',
          data: { requireLogin: true },
        })
        .state('about', {
          url: '/about',
          templateUrl: 'views/main/about.html',
          controller: 'AboutCtrl',
          data: { requireLogin: true },
        })
        .state('patientsearch', {
          url: '/patientsearch',
          templateUrl: 'views/patient-search/patient-search.html',
          controller: 'PatientSearchCtrl',
          data: { requireLogin: true },
        })
        .state('patient', {
          url: '/patient/:uuid',
          templateUrl: 'views/patient-dashboard/patient-dashboard.html',
          controller: 'PatientDashboardCtrl',
          data: { requireLogin: true },
        })
        .state('clinical-dashboard', {
          url: '/clinical-dashboard/:locationuuid',
          templateUrl: 'views/clinic-dashboard/clinic-dashboard.html',
          controller: 'ClinicDashboardCtrl',
          data: { requireLogin: true },
        })
        .state('clinical-dashboard.defaulters-list', {
          url: '/defaulters-list',
          templateUrl: 'views/clinic-dashboard/defaulters-list-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: { requireLogin: true },
        })
        .state('clinical-dashboard.daily-appointments', {
          url: '/daily-appointments',
          templateUrl: 'views/clinic-dashboard/daily-appointments-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: { requireLogin: true },
        })
        .state('clinical-dashboard.monthly-appointments', {
          url: '/monthly-appointments',
          templateUrl: 'views/clinic-dashboard/monthly-appointments-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: { requireLogin: true },
        })
        .state('encounter', {
          url: '/encounter/:encuuid/patient/:uuid',
          templateUrl: 'views/formentry/formentry.html',
          controller: 'FormentryCtrl',
          data: { requireLogin: true },
        })
        .state('data-entry-statistics', {
          url: '/data-entry-statistics',
          templateUrl: 'views/admin/data-entry-statistics.html',
          controller: 'DataEntryStatisticsCtrl',
          data: { requireLogin: true },
        })
        .state('admin', {
          url: '/admin-dashboard',
          templateUrl: 'views/admin/admin-dashboard.html',
          controller: 'AdminDashboardCtrl',
          data: { requireLogin: true }
        })
        .state('url-selector', {
          url: '/url-selector',
          templateUrl: 'views/main/url-selector.html',
          controller: 'UrlSelectorCtrl',
          data: { requireLogin: false },
        })
        .state('login', {
          url: '/login',
          templateUrl: 'views/authentication/login.html',
          controller: 'LoginCtrl',
          data: { requireLogin: false },
        });

    }).run(function($rootScope, $state, $location, OpenmrsRestService, OpenmrsSettings, EtlRestServicesSettings, UtilService) {

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

        //check whether selection of url base is required first
        var hasPersistedCurrentUrl = OpenmrsSettings.hasCoockiePersistedCurrentUrlBase() && EtlRestServicesSettings.hasCoockiePersistedCurrentUrlBase();

        if (!hasPersistedCurrentUrl && toState.name !== 'url-selector') {
          $state.go('url-selector', { onSuccessRout: toState, onSuccessParams: toParams });
          event.preventDefault();
          return;
        }

        //check whether loginis required

        var shouldLogin = toState.data !== undefined &&
        toState.data.requireLogin && !OpenmrsRestService.getAuthService().authenticated;
        //console.log(shouldLogin);
        if (shouldLogin) {
          $state.go('login', { onSuccessRout: toState, onSuccessParams: toParams });
          event.preventDefault();
          return;
        }

        //else navigate to page
      });

      UtilService.disableBackSpaceOnNoneInputElements();

      // add provision of tracking various states for easy navigation and public variables of interest
      $rootScope.previousState;
      $rootScope.previousStateParams;
      $rootScope.currentState;
      $rootScope.currentStateParams;
      $rootScope.broadcastPatient;
      $rootScope.activeEncounter;
      $rootScope.cachedLocations = [];

      $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        $rootScope.previousStateParams = fromParams;
        $rootScope.currentStateParams = toParams;

        console.log('Previous state:' + $rootScope.previousState);
        console.log('Previous state Params:' + $rootScope.previousStateParams);
        console.log($rootScope.previousStateParams);
        console.log('Current state:' + $rootScope.currentState);
        console.log('Current Param Params:' + $rootScope.currentStateParams);
        console.log($rootScope.currentStateParams);
      });

    });
})();
