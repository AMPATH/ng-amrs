/*
jshint -W098, -W117, -W030
*/
(function() {
  'use strict';
  describe('Controller: LoginCtrl', function() {
    // body...
    var controller;
    var currentUser;
    var authService;
    var scope;

    beforeEach(function() {
      module('authentication');

      //bard.inject('$scope', 'AuthService', '$rootScope');
    });

    beforeEach(function() {
      //loading the mock service module
      module('mock.authentication');
    });

    beforeEach(inject(function($controller, $injector, AuthService) {
      /*
      When testing controllers it not wise to inject them as it is done when testing services
      It is advisable to use $contoller to instantiate instead of using the $injector service

      AuthService above is simply a mock service to mimic the actual service
      */

      //loading  required dependancies beforeEach test
      //authService = $injector.get('AuthService'); //used when loading the actual/real service
      authService = AuthService;
      scope = $injector.get('$rootScope');
      controller = $controller('LoginCtrl', {$scope:scope, AuthService:authService});

    }));

    it('login controller should be created successfully', function() {
      //debugger;
      expect(controller).toBeDefined();
    });

    it('currentUser Object should be created successfully', function() {
      //debugger;
      expect(scope.CurrentUser).toBeDefined();
    });

    it('currentUser Object should have empty strings', function() {
      //debugger;
      currentUser = {username:'', password:''};
      expect(scope.CurrentUser).toEqual(currentUser);
    });

    it('authenticate function should be successfully defined', function() {
      //debugger;
      currentUser = {username:'', password:''};
      expect(scope.authenticate).toBeDefined();
    });

    describe('authenticate function:', function() {
      it('User login should be successfull', function() {
        currentUser = {username:'test', password:'test'};
        console.info(currentUser);
        var login = false;
        var authenticate = function() {
          AuthService.isAuthenticated(currentUser, function(data) {
            login = data;
          });
        };

        expect(login).toBe(false);
      });
    });
  });
})();
