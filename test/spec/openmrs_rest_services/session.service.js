//jshint -W026
(function() {
    'use strict';

    describe('Open MRS Session Service Unit Tests', function() {
      beforeEach(function() {
        module('OpenMRS_RestServices');
      });

      var baseURl = 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/';

      var callbacks = {
        onSuccessCalled:false,
        onFailedCalled:false,
        message:null,
        onSuccessfulAuthentication: function(){
          callbacks.onSuccessCalled = true;
        },
        onFailedAuthentication: function(message){
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };

      var httpBackend, sessionService;

      var mockAuthenticatedSession = {
        authenticated:true,
        sessionId:'test-authenticated-session'
      };

      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        sessionService = $injector.get('SessionResService');
      }));

      afterEach (function () {
        httpBackend.verifyNoOutstandingExpectation ();
        //httpBackend.verifyNoOutstandingRequest (); expectation is sufficient for now
      });

      it('should have Session service defined', function () {
        expect(sessionService).toBeDefined();
      });

      it('should make an api call to the session resource when getSession is called', function(){
        httpBackend.expectGET(baseURl+ 'session').respond(mockAuthenticatedSession);
        sessionService.currentSession =null;
        sessionService.getSession(function(){}, function(){});
        httpBackend.flush();
        expect(sessionService.currentSession).toEqual(mockAuthenticatedSession.sessionId);
      });

      it('should make an api delete session call to the session resource when logout is called', function(){
        debugger;
        httpBackend.expect('DELETE',baseURl+ 'session').respond(mockAuthenticatedSession);
        sessionService.currentSession =null;
        sessionService.logout(function(){});
        httpBackend.flush();
        //expect(sessionService.currentSession).toEqual(mockAuthenticatedSession.sessionId);
      });

      it('should call the onSuccess callback getSession request successfully returns a session', function(){
        httpBackend.expectGET(baseURl+ 'session').respond(mockAuthenticatedSession);
        callbacks.onSuccessCalled = false;
        callbacks.onFailedCalled = false;
        sessionService.getSession(callbacks.onSuccessfulAuthentication, callbacks.onFailedAuthentication);
        httpBackend.flush();
        expect(callbacks.onSuccessCalled).toEqual(true);
        expect(callbacks.onFailedCalled).toEqual(false);
      });

      it('should call the onFailed callback when getSession request is not successfull', function(){
        httpBackend.expectGET(baseURl+ 'session').respond(500);
        callbacks.onSuccessCalled = false;
        callbacks.onFailedCalled = false;
        callbacks.message = '';
        sessionService.getSession(callbacks.onSuccessfulAuthentication, callbacks.onFailedAuthentication);
        httpBackend.flush();
        expect(callbacks.onSuccessCalled).toEqual(false);
        expect(callbacks.onFailedCalled).toEqual(true);
        expect(callbacks.message).toBeDefined();
        expect(callbacks.message.trim()).not.toEqual('');
      });

    });
})();
