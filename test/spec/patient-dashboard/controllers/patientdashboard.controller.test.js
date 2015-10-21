/*
jshint -W098, -W117, -W030
*/
(function() {
  'use strict';
  describe('Controller: PatientDashboardCtrl', function() {
    // body...
    var controller;
    var stateParams;
    var OpenmrsRestService;
    var scope;
    var timeout;

    beforeEach(function() {
      module('app.patientdashboard');
      module('app.formentry');
    });

    beforeEach(module('ui.router')); //to enable using stateparams

    beforeEach(inject(function($controller, $injector, _$stateParams_, $rootScope) {
      /*
      When testing controllers it not wise to inject them as it is done when testing services
      It is advisable to use $controller to instantiate instead of using the $injector service

      _OpenmrsRestService_ above is simply a mock service to mimic the actual service
      */

      //loading  required dependancies beforeEach test
      //authService = $injector.get('AuthService'); //used when loading the actual/real service
      OpenmrsRestService = $injector.get('OpenmrsRestService');
      scope = $rootScope.$new();
      stateParams = _$stateParams_;//$injector.get('$stateParams');
      timeout =$injector.get('$timeout');
      controller = $controller('PatientDashboardCtrl', {$scope:scope, $stateParams: stateParams, $timeout:timeout, OpenmrsRestService:OpenmrsRestService});

    }));

    it('PatientDashboardCtrl controller should have all Injected Services', function() {
      //debugger;

      expect(controller).to.exist;
    });

    it('patient Object should be created successfully in the Scope', function() {
      //debugger;
      //console.log(scope);
      expect(scope).to.have.property('patient');
    });

  });
})();
