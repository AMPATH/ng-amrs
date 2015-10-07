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
      module('app.authentication');
      module('app.etlRestServices');
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
      expect(controller).to.exist;
    });

    it('currentUser Object should be created successfully', function() {
      //debugger;
      expect(scope.CurrentUser).to.exist;
    });

    it('currentUser Object should have empty strings', function() {
      //debugger;
      currentUser = {username:'', password:''};
      expect(scope.CurrentUser).to.deep.equal(currentUser);
    });


    describe('authenticate function:', function() {
      it('User login should be successfull', function() {
        currentUser = {username:'test', password:'test'};
        console.info(currentUser);

        //debugger;
        var login = false;
        var authenticate = function() {
          authService.isAuthenticated(currentUser, function(data) {
            login = data;
          });
        };

        authenticate();
        expect(login).to.equal(true);
      });
    });
  });
})();
