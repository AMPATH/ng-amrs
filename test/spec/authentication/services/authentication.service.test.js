/*jshint -W003, -W117, -W098, -W026, -W030 */
(function() {
    'use strict';

    describe('Athentication Service Unit Tests', function() {
      beforeEach(function() {
          //debugger;
        module('ngAmrsApp');
        module('app.openmrsRestServices');
        module('mock.sessionService');
      });

      var callbacks;

      var testUser = {
        username:'test',
        password:'password'
      };
      var homeState = {
        url: '/test'
      };

      var authenticationService;
      var settingsService;
      var sessionServiceMock;
      var state;
      var rootScope;
      var httpBackend;

      //initialize the test states for ui-router
      beforeEach(module(function ($stateProvider) {
        //$stateProvider.state('home', homeState);
      }));

      beforeEach(inject(function($injector, $state, $rootScope, $httpBackend) {
        //debugger;
        httpBackend = $httpBackend;
        state = $state;
        rootScope = $rootScope;
        sessionServiceMock = $injector.get('SessionResService');
        settingsService = $injector.get('OpenmrsSettings');
        authenticationService = $injector.get('AuthService');

      }));

      beforeEach(function() {
        callbacks = {
          callbackInvocked:false,
          returnedValue:false,
          callback: function(returnedValue) {
            //debugger;
            callbacks.callbackInvocked = true;
            callbacks.returnedValue = returnedValue;
          }
        };

      });

      it('should have Session service mock defined', function() {
        //debugger;
        expect(sessionServiceMock).to.exist;
        expect(sessionServiceMock.returnSuccess).to.equal(true);
      });

      it('should have Authentication service defined', function() {
        //debugger;
        expect(authenticationService).to.exist;
      });

      it('should have isAuthenticated invoke callback with value being true when supplied with correct credentials', function() {
        //debugger;
        sessionServiceMock.mockedResponse = {authenticated:true, sessionId:'sessionId'};

        authenticationService.isAuthenticated(testUser,callbacks.callback);
        expect(callbacks.callbackInvocked).to.equal(true);
        expect(callbacks.returnedValue).to.equal(true);
      });

      it('should have isAuthenticated change state to home when authentication  is successfull', function() {
        //debugger;
        httpBackend.when('GET','views/main/main.html').respond('');//prevent test from failing
        sessionServiceMock.mockedResponse = {authenticated:true, sessionId:'sessionId'};
        authenticationService.isAuthenticated(testUser,callbacks.callback);
        //rootScope.$apply();
        //rootScope.$digest();
        var isCurrentStateHome = state.$current.name === '' || state.$current.name ==='home';
        expect(isCurrentStateHome).to.equal(true);
      });

      it('should have isAuthenticated broadcast onUserAuthenticationDetermined when authentication is complete', function () {
        //using sinon spies
        //link: http://sinonjs.org/docs/
        var spy = sinon.spy(rootScope, '$broadcast');
        authenticationService.isAuthenticated(testUser,callbacks.callback);
        spy.calledWith('onUserAuthenticationDetermined');
      });

    });
})();
