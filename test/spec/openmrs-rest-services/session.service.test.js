/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('Open MRS Session Service Unit Tests', function() {
      beforeEach(function() {
        module('app.openmrsRestServices');
      });

      //var baseURl = 'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/';

      var callbacks = {
        onSuccessCalled:false,
        onFailedCalled:false,
        message:null,
        onSuccessfulAuthentication: function() {
          callbacks.onSuccessCalled = true;
        },

        onFailedAuthentication: function(message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };

      var httpBackend;
      var sessionService;
      var settingsService;

      var mockAuthenticatedSession = {
        authenticated:true,
        sessionId:'test-authenticated-session'
      };

      beforeEach(inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
        sessionService = $injector.get('SessionResService');
        settingsService = $injector.get('OpenmrsSettings');
      }));

      afterEach (function() {
        httpBackend.verifyNoOutstandingExpectation ();

        //httpBackend.verifyNoOutstandingRequest (); expectation is sufficient for now
      });
//Trigger travis
      it('should have Session service defined', function() {
        expect(sessionService).to.exist;
      });

      it('should make an api call to the session resource when getSession is called', function() {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'session').respond(mockAuthenticatedSession);
        sessionService.currentSession = null;
        sessionService.getSession(function() {}, function() {});

        httpBackend.flush();
        expect(sessionService.currentSession).to.equal(mockAuthenticatedSession.sessionId);
      });

      it('should make an api delete session call to the session resource when logout is called', function() {
        httpBackend.expect('DELETE', settingsService.getCurrentRestUrlBase()  + 'session').respond(mockAuthenticatedSession);
        sessionService.currentSession = null;
        sessionService.deleteSession(function() {});

        httpBackend.flush();

        //expect(sessionService.currentSession).toEqual(mockAuthenticatedSession.sessionId);
      });

      it('should call the onSuccess callback getSession request successfully returns a session', function() {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase()  + 'session').respond(mockAuthenticatedSession);
        callbacks.onSuccessCalled = false;
        callbacks.onFailedCalled = false;
        sessionService.getSession(callbacks.onSuccessfulAuthentication, callbacks.onFailedAuthentication);
        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(true);
        expect(callbacks.onFailedCalled).to.equal(false);
      });

      it('should call the onFailed callback when getSession request is not successfull', function() {
        httpBackend.expectGET(settingsService.getCurrentRestUrlBase()  + 'session').respond(500);
        callbacks.onSuccessCalled = false;
        callbacks.onFailedCalled = false;
        callbacks.message = '';
        sessionService.getSession(callbacks.onSuccessfulAuthentication, callbacks.onFailedAuthentication);
        httpBackend.flush();
        expect(callbacks.onSuccessCalled).to.equal(false);
        expect(callbacks.onFailedCalled).to.equal(true);
        expect(callbacks.message).to.exist;
        expect(callbacks.message.trim()).not.to.equal('');
      });

    });
})();
