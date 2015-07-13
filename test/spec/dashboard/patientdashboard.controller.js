/*
jshint -W098, -W117, -W030
*/
(function() {
  'use strict';
  describe('Controller: PatientDashboardCtrl', function() {
    // body...
    var controller;
    var stateParams;
    var ContextService;
    var scope;
    var timeout;

    beforeEach(function() {
      module('app.patientdashboard');
    });

    beforeEach(inject(function($controller, $injector, _ContextService_, _$stateParams_, _$timeout_) {
      /*
      When testing controllers it not wise to inject them as it is done when testing services
      It is advisable to use $controller to instantiate instead of using the $injector service

      _ContextService_ above is simply a mock service to mimic the actual service
      */

      //loading  required dependancies beforeEach test
      //authService = $injector.get('AuthService'); //used when loading the actual/real service
      ContextService = _ContextService_;
      scope = $injector.get('$rootScope');
      stateParams = _$stateParams_;
      timeout = _$timeout_;
      controller = $controller('PatientDashboardCtrl', {$scope:scope, AuthService:authService});

    }));

    it('PatientDashboardCtrl controller should have all Injected Services', function() {
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

    it('authenticate function should be successfully defined', function() {
      //debugger;
      currentUser = {username:'', password:''};
      expect(scope.authenticate).to.exist;
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
