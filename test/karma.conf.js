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
    'bower_components/angular-dialog-service/dist/dialogs.js',
    'bower_components/angular-dialog-service/dist/dialogs-default-translations.js',
    'bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
    'bower_components/spin.js/spin.js',
    'bower_components/angular-loading/angular-loading.js',
    'bower_components/ui-router-extras/release/ct-ui-router-extras.js',
    'bower_components/karma-read-json/karma-read-json.js',
    'bower_components/jqueryui/jquery-ui.js',
    'bower_components/pivottable/dist/pivot.js',
    'bower_components/pivottable/dist/c3_renderers.min.js',
    'bower_components/pivottable/dist/gchart_renderers.min.js',
    'bower_components/pivottable/dist/export_renderers.min.js',
    'bower_components/d3/d3.js',
    'bower_components/c3/c3.js',
    'bower_components/jsnlog.js/jsnlog.js',
    'bower_components/angular-environment/dist/angular-environment.js',
    'bower_components/bootstrap-table/dist/bootstrap-table.min.js',
    'bower_components/bootstrap-table/dist/extensions/angular/bootstrap-table-angular.min.js',
    'bower_components/bootstrap-table/dist/extensions/export/bootstrap-table-export.js',
    'bower_components/bootstrap-table/dist/extensions/multiple-sort/bootstrap-table-multiple-sort.js',
    'bower_components/file-saver.js/FileSaver.js',
    'bower_components/html2canvas/build/html2canvas.js',
    'bower_components/jspdf/dist/jspdf.min.js',
    'bower_components/jspdf-autotable/dist/jspdf.plugin.autotable.js',
    'bower_components/tableExport.jquery.plugin/tableExport.min.js',
    'bower_components/matchmedia/matchMedia.js',
    'bower_components/ngSticky/lib/sticky.js',
    'bower_components/pdfmake/build/pdfmake.js',
    'bower_components/pdfmake/build/vfs_fonts.js',
    'bower_components/bootstrap-table-fixed-columns/bootstrap-table-fixed-columns.js',
    'bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',
    'bower_components/datatables/media/js/jquery.dataTables.js',
    'bower_components/flot/jquery.flot.js',
    'bower_components/holderjs/holder.js',
    'bower_components/metisMenu/dist/metisMenu.js',
    'bower_components/raphael/raphael.js',
    'bower_components/mocha/mocha.js',
    'bower_components/morrisjs/morris.js',
    'bower_components/datatables-responsive/js/dataTables.responsive.js',
    'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
    'bower_components/startbootstrap-sb-admin-2/dist/js/sb-admin-2.js',
    'bower_components/kendo-ui/js/kendo.ui.core.min.js',
    'bower_components/offline/offline.js',
    'bower_components/angular-ui-ace/ui-ace.js',
    'bower_components/openmrs-ngresource/dist/scripts/openmrsNgresource.js',
    'bower_components/angular-formentry/dist/scripts/angularFormentry.js',
    'bower_components/angular-cache/dist/angular-cache.js',
    'bower_components/angular-bar-code-scanner/angular-bar-code-scanner.js',
    'bower_components/angular-bar-code-scanner/angular-bar-code-scanner.min.js',
    'bower_components/keen-js/dist/keen.min.js',
    'bower_components/c3-angular/c3-angular.min.js',
    'bower_components/ion.rangeSlider/js/ion.rangeSlider.js',
    'bower_components/angular-mocks/angular-mocks.js',
    // endbower
      'app/scripts/**/*.module.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.module.mock.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js',
      '**/*.html',

      // fixtures
      {pattern: 'test/mock/*.json', watched: true, served: true, included: false}
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
      'app/views/patient-dashboard/**/*.html': ['ng-html2js'],
      'app/views/clinic-dashboard/**/*.html': ['ng-html2js'],
      'app/views/admin/**/*.html': ['ng-html2js'],
      'app/views/data-analytics/**/*.html': ['ng-html2js'],
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
