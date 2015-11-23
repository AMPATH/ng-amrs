/*jshint -W098, -W030 */
/*global JL*/
(function() {
  'use strict';
  angular
    .module('app.logToServer')
    .service('$log', $log)
    .factory('$exceptionHandler', $exceptionHandler)
    .factory('LogToServerInterceptor', LogToServerInterceptor);
  $log.$inject = ['envService'];
  LogToServerInterceptor.$inject = ['$q'];

  // Make AngularJS do JavaScript logging through JSNLog so we can log to
  //the server by replacing the $log service
  function $log(envService) {
          this.log = function(msg) {
              JL('Angular').trace(msg);
            };

          this.debug = function(msg) {
            JL('Angular').debug(msg);
          };

          this.info = function(msg) {
              JL('Angular').info(msg);
            };

          this.warn = function(msg) {
              JL('Angular').warn(msg);
            };

          this.error = function(msg) {
              JL('Angular').error(msg);
            };

          var appender = JL.createAjaxAppender('appender');
          var consoleAppender = JL.createConsoleAppender('consoleAppender');
          appender.setOptions({url: envService.read('loggerUrl'),
          });
          JL().setOptions({requestId:'35F7446D-86F1-47FA-A9EC-547FFF510086', appenders: [appender]});
        }

  // Replace the factory that creates the standard $exceptionHandler service

  function $exceptionHandler() {
          return function(exception, cause) {
              JL('Angular').fatalException(cause, exception);
              throw exception;
            };
        }

  // Add a factory to create the interceptor to the logToServer module

  function LogToServerInterceptor($q) {
          var myInterceptor = {

            // The request function is called before the AJAX request is sent

            request: function(config) {
              config.msBeforeAjaxCall = new Date().getTime();
              return config;
            },

            // The response function is called after receiving a good response from the server
            response: function(response) {
              var msAfterAjaxCall = new Date().getTime();
              var timeTakenInMs = msAfterAjaxCall - response.config.msBeforeAjaxCall;
              JL('Angular.Ajax').info({
                url: response.config.url,
                timeTakenInMs: timeTakenInMs,
              });
              return response;
            },

            // The responseError function is called when an error response was received, or when a timeout happened.
            responseError: function(rejection) {
              var errorMessage = 'unknown';
              JL('Angular.Ajax').fatalException({
                status: rejection.status,
                url: rejection.config.url,
                errorMessage: rejection.data.error,
              });
              return $q.reject(rejection);
            },
          };
          return myInterceptor;
        }

})();
