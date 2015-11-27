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
  $exceptionHandler.$inject = ['envService'];

  // Make AngularJS do JavaScript logging through JSNLog so we can log to
  //the server by replacing the $log service
  function $log(envService) {
    var beforeSendExample =
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
            beforeSend: beforeSendExample
          });
          JL().setOptions({requestId:'35F7446D-86F1-47FA-A9EC-547FFF510086', appenders: [appender]});
  }

  // Replace the factory that creates the standard $exceptionHandler service

  function $exceptionHandler(envService) {
    return function(exception, cause) {
              JL('Angular').fatalException(cause, exception);
              if (envService.is('development'))
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

  function beforeSend(xhr) {
    // Replace send function with one that saves the message in the xhr, for
    // use when response indicates failure.
    xhr.originalSend = xhr.send;
    xhr.send = function(msg) {
      xhr.msg = msg; // Store message in xhr
      xhr.originalSend(msg);
    };

    // Set response handler that checks if response received (readyState == 4)
    // and response status is not 200 (OK). In that case, do something to deal with
    // failure to log the message.
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) { return; }

      if (xhr.status == 200) { return; }

      console.log('Cannot log to server. Status: ' + xhr.status + '. Messsage: ' + xhr.msg);
    };
  };

})();
