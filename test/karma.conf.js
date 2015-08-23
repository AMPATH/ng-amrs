// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-06-29 using
// generator-karma 1.0.0

module.exports = function (config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'chai', 'mocha', 'sinon'
    ],

    // list of files / patterns to load in the browser
    files: [
    // bower:js
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-touch/angular-touch.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-base64/angular-base64.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/api-check/dist/api-check.js',
    'bower_components/angular-formly/dist/formly.js',
    'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
    'bower_components/underscore/underscore.js',
    'bower_components/underscore.string/dist/underscore.string.js',
    'bower_components/angular-messages/angular-messages.js',
    'bower_components/lodash/lodash.js',
    'bower_components/restangular/dist/restangular.js',
    'bower_components/angular-ui-select/dist/select.js',
    'bower_components/datejs/build/production/date.min.js',
    'bower_components/moment/moment.js',
    'bower_components/angular-moment/angular-moment.js',
    'bower_components/angular-translate/angular-translate.js',
    'bower_components/angular-dialog-service/dist/dialogs.min.js',
    'bower_components/angular-dialog-service/dist/dialogs-default-translations.min.js',
    'bower_components/angular-mocks/angular-mocks.js',
    // endbower
      'app/scripts/**/*.module.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js',
      '**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 9000,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // reporters configuration
    reporters: ['mocha'],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',

    //"karma-chrome-launcher",
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-mocha',
      'karma-chai',
      'karma-ng-html2js-preprocessor'
    ],
    preprocessors: {
      'app/views/patient-dashboard/**/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'my.templates' 
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
