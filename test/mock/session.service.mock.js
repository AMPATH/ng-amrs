/*
jshint -W098, -W117, -W003, -W026
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  var mockedModule = angular
    .module('mock.sessionService', []);

  mockedModule.factory('SessionResService', SessionService);
  SessionService.$inject = ['$q'];
  function SessionService($q) {
    var currentSession;
    var mockedResponse = {};
    var returnSuccess = true;
    var service = {
      getResource:getResource,
      getSession:getSession,
      currentSession:currentSession,
      mockedResponse:mockedResponse,
      returnSuccess:returnSuccess,
      logout:logout
    };
    //debugger;
    return service;

    function getResource() {

    }

    function getSession(successCallback, failedCallback) {
      //debugger;
      if (service.returnSuccess) {
        service.currentSession = mockedResponse.sessionId;
        successCallback(service.mockedResponse);
      } else {
        service.currentSession = null;
        failedCallback('Error processing request', error);
      }
    }

    function logout(callBack) {
      callBack(service.mockedResponse);
    }

  }
})();
