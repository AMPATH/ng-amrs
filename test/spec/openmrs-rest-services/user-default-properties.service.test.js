/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('OpenMRS User Default Properties Service unit tests', function() {
    beforeEach(function() {
      module('app.openmrsRestServices');
      module('mock.data');
    });

    var httpBackend;
    var userDefaultPropertiesService;
    var cookieStoreService;

    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      userDefaultPropertiesService = $injector.get('UserDefaultPropertiesService');
      cookieStoreService = $injector.get('$cookies');
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('should have user default properties service defined', function() {
      expect(userDefaultPropertiesService).to.exist;
    });

    it('user default properties service should have the following  methods',
      function() {
        expect(userDefaultPropertiesService.setLocationSelectionEnabled).to.be.an('function');
        expect(userDefaultPropertiesService.getLocationSelectionEnabled).to.be.an('function');
        expect(userDefaultPropertiesService.getCurrentUserDefaultLocation).to.be.an('function');
        expect(userDefaultPropertiesService.setUserProperty).to.be.an('function');
        expect(userDefaultPropertiesService.setAuthenticatedUser).to.be.an('function');
        expect(userDefaultPropertiesService.getAuthenticatedUser).to.be.an('function');

      });

    it('should set the authenticated user when setAuthenticatedUser is called', function() {
      var testUser = 'test';
      userDefaultPropertiesService.setAuthenticatedUser(testUser);
      expect(userDefaultPropertiesService.getAuthenticatedUser()).to.equal('test');
    });

    it('should change the user default property when setUserProperty', function() {
      var testLocation = 'testlocation1';
      var testUser = 'test';
      var testLocationKey = 'userDefaultLocation' + testUser;
      userDefaultPropertiesService.setAuthenticatedUser(testUser);
      userDefaultPropertiesService.setUserProperty(testLocationKey, testLocation);
      expect(userDefaultPropertiesService.getCurrentUserDefaultLocation()).to.equal('testlocation1');
    });

  });
})();
