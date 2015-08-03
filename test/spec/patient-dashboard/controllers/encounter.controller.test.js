(function() {
  'use strict'
  describe('Controller: EncounterCtrl', function() {
    // body...
    var controller
    var stateParams
    var EncounterResService
    var scope
    var timeout

    beforeEach(function() {
      module('app.patientdashboard')
    });

    beforeEach(module('ui.router')); //to enable using stateparams

    beforeEach(inject(function($controller, $injector, _$stateParams_, $rootScope) {
      EncounterResService = $injector.get('EncounterResService');
      scope = $rootScope.$new();
      stateParams = _$stateParams_;//$injector.get('$stateParams');
      timeout =$injector.get('$timeout');
      controller = $controller('EncounterCtrl', { $scope: scope,
                                                  $stateParams: stateParams,
                                                  $timeout: timeout,
                                                  EncounterResService: EncounterResService })

    }));

    it('EncounterCtrl should exists', function() {
      expect(controller).to.exist;
    });

    it('Encounter list object should be created', function() {
      expect(controller.encounterList).to.be.an('array');
    });
  });
})();
