/*jshint -W098, -W030 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
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
      'app.labordersearch',
      'app.patientdashboard',
      'app.clinicDashboard',
      'app.admin',
      'app.formentry',
      'app.utils',
      //   'app.logToServer',
      'ct.ui.router.extras',
      'sticky',
      'mwl.calendar',
      'app.offline',
      'app.administration'
    ])
    .config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/main/main.html',
          data: {
            requireLogin: true
          },
        })
        .state('about', {
          url: '/about',
          templateUrl: 'views/main/about.html',
          controller: 'AboutCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('patientsearch', {
          url: '/patientsearch',
          templateUrl: 'views/patient-search/patient-search.html',
          controller: 'PatientSearchCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('labordersearch', {
          url: '/labordersearch',
          templateUrl: 'views/lab-order-search/lab-order-search.html',
          controller: 'LabOrderSearchCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('patient', {
          url: '/patient/:uuid',
          templateUrl: 'views/patient-dashboard/patient-dashboard.html',
          controller: 'PatientDashboardCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('clinical-dashboard', {
          url: '/clinical-dashboard/:locationuuid',
          templateUrl: 'views/clinic-dashboard/clinic-dashboard.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true
          },
          cache: false,
          reloadOnSearch: false,
          deepStateRedirect: {
            default: {
              state: 'clinical-dashboard.daily-appointments'
            }
          },
        })
        .state('clinical-dashboard.defaulters-list', {
          url: '/defaulters-list',
          templateUrl: 'views/clinic-dashboard/defaulters-list-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('clinical-dashboard.daily-appointments', {
          url: '/daily-appointments',
          templateUrl: 'views/clinic-dashboard/daily-appointments-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true
          },
          params: {
            view: null
          },
          deepStateRedirect: {
            default: {
              state: 'clinical-dashboard.daily-appointments.appointments'
            }
          },
        })
        .state('clinical-dashboard.daily-appointments.visits', {
          url: '/daily-appointments/visits',
          templateUrl: 'views/clinic-dashboard/daily-visits-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true,
            cssClassnames: 'panel-success'
          },
          params: {
            view: null
          }
        })
        .state('clinical-dashboard.daily-appointments.appointments', {
          url: '/daily-appointments/appointments',
          templateUrl: 'views/clinic-dashboard/daily-appointments.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true,
            cssClassnames: 'panel-info'
          },
          params: {
            view: null
          }
        })
        .state('clinical-dashboard.daily-appointments.has-not-returned', {
          url: '/daily-appointments/has-not-returned',
          templateUrl: 'views/clinic-dashboard/daily-not-returned.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true,
            cssClassnames: 'panel-warning'
          },
          params: {
            view: null
          }
        })
        .state('clinical-dashboard.daily-appointments.patient-flow', {
          url: '/daily-appointments/patient-flow',
          templateUrl: 'views/clinic-dashboard/patient-flow-container.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true,
            cssClassnames: 'panel-success'
          },
          params: {
            view: null
          }
        })
        .state('clinical-dashboard.monthly-appointments', {
          url: '/monthly-appointments',
          templateUrl: 'views/clinic-dashboard/monthly-appointments-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('clinical-dashboard.moh-731', {
          url: '/moh-731',
          templateUrl: 'views/clinic-dashboard/moh-731.html',
          controller: 'moh731ReportCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('clinical-dashboard.patient-register', {
          url: '/patient-register',
          templateUrl: 'views/clinic-dashboard/patient-register.html',
          controller: 'PatientRegisterCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('clinical-dashboard.visualization', {
          url: '/visualization',
          templateUrl: 'views/clinic-dashboard/visualization-tab.html',
          controller: 'ClinicDashboardCtrl',
          data: {
            requireLogin: true
          }
        })

        .state('clinical-dashboard.hiv-summary-indicators', {
          url: '/hiv-summary-indicators',
          templateUrl: 'views/clinic-dashboard/hiv-summary-indicators.html',
          controller: 'HivSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          }
        })

        .state('clinical-dashboard.hiv-monthly-summary-stats', {
          url: '/hiv-monthly-summary-stats',
          templateUrl: 'views/clinic-dashboard/hiv-monthly-summary-stats.html',
          controller: 'HivMonthlySummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          }
        })

        .state('encounter', {
          url: '/encounter/:encuuid/patient/:uuid',
          templateUrl: 'views/formentry/formentry.html',
          controller: 'FormentryCtrl',
          data: {
            requireLogin: true
          },
        })

        .state('admin', {
          url: '/admin-dashboard',
          templateUrl: 'views/admin/admin-dashboard.html',
          controller: 'AdminDashboardCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('admin.view-selection', {
          url: '/view-selection',
          templateUrl: 'views/admin/admin-dashboard-view-selector.html',
          data: {
            requireLogin: true
          }
        })
        .state('admin.patient-creation-statistics', {
          url: '/patient-creation-statistics',
          templateUrl: 'views/admin/patient-creation-statistics-container.html',
          data: {
            requireLogin: true
          }
        })
        .state('admin.data-entry-statistics', {
          url: '/data-entry-statistics',
          templateUrl: 'views/data-analytics/data-entry-statistics.html',
          controller: 'DataEntryStatisticsCtrl',
          data: {
            requireLogin: true
          },
        })

        .state('admin.data-entry-statistics.view', {
          url: '/view/:view_id',
          templateUrl: 'views/data-analytics/view-one.html',
          controller: 'DataEntryStatisticsCtrl',
          data: {
            requireLogin: true
          },
        })

        .state('admin.data-entry-statistics.patientlist', {
          url: '/lists/:patient_list',
          templateUrl: 'views/data-analytics/data-entry-patient-list.html',
          controller: 'DataEntryStatisticsCtrl',
          data: {
            requireLogin: true
          },
        })


        .state('admin.hiv-summary-indicators', {
          url: '/hiv-summary-indicators',
          templateUrl: 'views/admin/hiv-summary-indicators.html',
          controller: 'HivSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-summary-indicators.indicator', {
          url: '/indicator',
          templateUrl: 'views/admin/indicators-container.html',
          controller: 'HivSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-summary-indicators.visual', {
          url: '/indicator_visual',
          templateUrl: 'views/admin/visual-indicators-container.html',
          controller: 'HivVisualSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-monthly-summary-indicators', {
          url: '/hiv-monthly-summary-indicators',
          templateUrl: 'views/admin/hiv-monthly-summary-indicators.html',
          controller: 'HivMonthlySummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-monthly-summary-indicators.monthly', {
          url: '/monthly_summary',
          templateUrl: 'views/admin/hiv-monthly-summary-indicators-container.html',
          controller: 'HivMonthlySummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-monthly-summary-indicators.patients', {
          url: '/location/:locationuuid/month/:month/indicator/:indicator/locationName/:locationName',
          templateUrl: 'views/admin/patient-monthly-list-container.html',
          controller: 'HivMonthlySummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('admin.hiv-summary-indicators.patients', {
          url: '/location/:locationuuid/indicator/:indicator/locationName/:locationName',
          templateUrl: 'views/admin/patient-list-container.html',
          controller: 'HivSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          },
        })

        .state('admin.moh-731-report.patients', {
          url: '/location/:locationuuid/indicator/:indicator/locationName/:locationName',
          templateUrl: 'views/admin/patient-moh-list-container.html',
          controller: 'moh731ReportCtrl',
          data: {
            requireLogin: true
          }
        })

        .state('url-selector', {
          url: '/url-selector',
          templateUrl: 'views/main/url-selector.html',
          controller: 'UrlSelectorCtrl',
          data: {
            requireLogin: false
          },
        })
        .state('user-default-properties', {
          url: '/user-default-properties',
          templateUrl: 'views/main/user-default-properties.html',
          controller: 'UserDefaultPropertiesCtrl',
          data: {
            requireLogin: true
          },
        })
        .state('login', {
          url: '/login',
          templateUrl: 'views/authentication/login.html',
          controller: 'LoginCtrl',
          data: {
            requireLogin: false
          },
        })
        .state('admin.patient-register', {
          url: '/patient-register',
          templateUrl: 'views/admin/patient-register.html',
          controller: 'PatientRegisterCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('admin.patient-register.patient', {
          url: '/patient/:uuid',
          templateUrl: 'views/admin/patient-register.html',
          data: {
            requireLogin: true
          }
        }).state('admin.moh-731-report.report', {
          url: '/moh-731-report',
          templateUrl: 'views/admin/moh-731-report-container.html',
          controller: 'moh731ReportCtrl',
          data: {
            requireLogin: true
          }
        })
        //this is the combined view

        .state('admin.hiv-summary-combined', {
          url: '/hiv-combine-report',
          templateUrl: 'views/admin/hiv-summary-combined.html',
          controller: 'HivSummaryIndicatorsCtrl',
          data: {
            requireLogin: true
          }
        })



        .state('admin.moh-731-report', {
          url: '/moh-731-reports',
          templateUrl: 'views/admin/moh-731-report.html',
          controller: 'moh731ReportCtrl',
          data: {
            requireLogin: true
          }
        })

        .state('moh-731-geneuerate-pdf', {
          url: '/moh-731-generate-pdf',
          templateUrl: 'views/admin/moh-731-report-container.html',
          data: {
            requireLogin: true
          }
        }).state('moh-731-report-by-location', {
          url: '/moh-731-pdf/location/:location',
          templateUrl: 'views/admin/moh-731-report-container.html',
          controller: 'moh731ReportCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('admin.clinical-visualization', {
          url: '/clinical-visualization',
          templateUrl: 'views/admin/clinical-visualization-container.html',
          controller: 'AdminDashboardCtrl',
          data: {
            requireLogin: true
          }
        })
      .state('admin.clinical-comparator', {
        url: '/clinical-comparator',
        templateUrl: 'views/admin/clinic-comparator.html',
        controller: 'ClinicalComparatorCtrl',
        data: {
          requireLogin: true
        }
      })
      .state('admin.clinic-flow', {
        url: '/clinic-flow',
        templateUrl: 'views/admin/clinic-flow-container.html',
        controller: 'AdminDashboardCtrl',
        data: {
          requireLogin: true
        }
      })
      .state('system-administration', {
        url: '/administration',
        templateUrl: 'views/administration/administration-dashboard.html',
        controller: 'AdministrationCtrl',
        data: {
          requireLogin: true
        },
        cache: false
      })
      .state('admin.patient-requiring-viral-load', {
        url: '/patient-requiring-viral-load',
        templateUrl: 'views/admin/patient-requiring-viral-load-container.html',
        controller: 'AdminDashboardCtrl',
        data: {
          requireLogin: true
        }
      });


    }).config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('authenticationErrorInterceptor');
      $httpProvider.interceptors.push('AuthorizationInterceptor');
    }])
    .config(function ($provide) {
      $provide.decorator('$q', function ($delegate) {
        function allSettled(promises) {
          var deferred = $delegate.defer(),
            counter = 0,
            results = angular.isArray(promises) ? [] : {};

          angular.forEach(promises, function (promise, key) {
            counter++;
            $delegate.when(promise).then(function (value) {
              if (results.hasOwnProperty(key)) return;
              results[key] = { status: "fulfilled", value: value };
              if (!(--counter)) deferred.resolve(results);
            }, function (reason) {
              if (results.hasOwnProperty(key)) return;
              results[key] = { status: "rejected", reason: reason };
              if (!(--counter)) deferred.resolve(results);
            });
          });

          if (counter === 0) {
            deferred.resolve(results);
          }

          return deferred.promise;
        }
        $delegate.allSettled = allSettled;
        return $delegate;
      });
    })
    .run(function ($rootScope, $state, $location, OpenmrsRestService, OpenmrsSettings,
      EtlRestServicesSettings, UtilService) {

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        //checking if  pdf report generation  path
        if (toState.url === '/moh-731-generate-pdf') {
          //call renerate report
          // console.log('preventing default');
          $rootScope.$broadcast('generate-moh-731-pdf-report', {
            item: {}
          });
          event.preventDefault(); //prevent the change  from happening
        }
        //check whether selection of url base is required first
        var hasPersistedCurrentUrl = OpenmrsSettings.hasCoockiePersistedCurrentUrlBase() && EtlRestServicesSettings.hasCoockiePersistedCurrentUrlBase();

        if (!hasPersistedCurrentUrl && toState.name !== 'url-selector') {
          $state.go('url-selector', {
            onSuccessRout: toState,
            onSuccessParams: toParams
          });
          event.preventDefault();
          return;
        }

        //check whether loginis required

        var shouldLogin = toState.data !== undefined &&
          toState.data.requireLogin && !OpenmrsRestService.getAuthService().authenticated;
        if (shouldLogin) {
          $state.go('login', {
            onSuccessRout: toState,
            onSuccessParams: toParams
          });
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

      $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        $rootScope.previousStateParams = fromParams;
        $rootScope.currentStateParams = toParams;
      });

    });
})();
