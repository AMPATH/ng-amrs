/*jshint -W098, -W030 */
/*global JL*/
(function() {
  'use strict';
  angular.module('app.logToServer', ['environment'])
  .config(function(envServiceProvider) {
    // set the domains and variables for each environment
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            testing: ['test1.ampath.or.ke'],
            production: ['amrs.ampath.or.ke'],
          },
        vars: {
            development: {
                loggerUrl: '//test1.ampath.or.ke:8002/javascript-errors',
              },
            testing: {
                loggerUrl: '//test1.ampath.or.ke:8002/javascript-errors',
              },
            production: {
              loggerUrl: '//test1.ampath.or.ke:8002/javascript-errors',
            },
          },
      });

    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();
  });
})();
