/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';
  describe('Location Authorization Directive Unit Tests', function () {
    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.administration');
      module('models');
      module('mock.openmrsRestServices');
      module('my.templates');
    });

    var elm, element, scope, openmrsRestServicesMock, locationService, locationModel;

    beforeEach(inject(function ($injector, $rootScope, $compile) {
      elm = angular.element(
        '<location-authorization></location-authorization>'
      );
      scope = $rootScope.$new();
      element = $compile(elm)(scope);
      scope.$digest();
      openmrsRestServicesMock = $injector.get('OpenmrsRestService');
      locationService = openmrsRestServicesMock.getLocationResService();
      locationModel = $injector.get('LocationModel');
    }));

    afterEach(function () {
      openmrsRestServicesMock.returnErrorOnNextCall = false;
    });

    it('should have EtlRestServiceMock injected', function () {
      expect(openmrsRestServicesMock).to.exist;
      //ensure that mock services are injected
      expect(openmrsRestServicesMock.isMockService).to.equal(true);
      expect(locationService.isMockService).to.equal(true);
    });

    it('should call the locations service getLocations method on load to fetch locations', function () {
      //this should have been called when the directive was initializing
      expect(locationService.getLocationsCalled).to.equal(true);
    });

    it('should have required public member functions exposed on the scope on load',
      function () {
        var isolateScope = element.isolateScope();
        expect(isolateScope.findUsers).to.exist;
        expect(isolateScope.selectAllLocations).to.exist;
        expect(isolateScope.fetchLocations).to.exist;
        expect(isolateScope.saveUserAttribute).to.exist;
      });

    it('should have required public member properties exposed on the scope on load',
      function () {
        var isolateScope = element.isolateScope();
        expect(isolateScope.selectedUser).to.exist;
        expect(isolateScope.users).to.exist;
        expect(isolateScope.selectedLocations).to.exist;
        expect(isolateScope.savingProperty).to.exist;
       // expect(isolateScope.experiencedSavingErrors).to.exist;
      });

    it('we should expect any errors when directive is loaded i.e experiencedSavingErrors should be null',
      function () {
        var isolateScope = element.isolateScope();
        expect(isolateScope.experiencedSavingErrors).to.equal(null);
      });

    it('we should expect UX indicators are initialised correctly when all dependencies are loaded successfully',
      function () {
        var isolateScope = element.isolateScope();
        expect(isolateScope.selectedLocations.selectedAll).to.equal(false);
        expect(isolateScope.savingProperty).to.equal(false);
        expect(isolateScope.isBusy).to.equal(false);
        expect(isolateScope.findingUser).to.equal(false);
      });

    it('should should wrap received locations and assign it to the scope when fetchLocations is called', function () {
      var isolateScope = element.isolateScope();
      //fetchLocations is called when the controller was initializing
      expect(isolateScope.locations.length).to.equal(locationService.getMockLocations().length);

      //check for wrapping
      var firstLocation = locationService.getMockLocations()[0];
      var wrappedLocation = locationModel.toWrapper(firstLocation);

      expect(isolateScope.locations[0].uuId()).to.equal(wrappedLocation.uuId());

    });

  });
})();
