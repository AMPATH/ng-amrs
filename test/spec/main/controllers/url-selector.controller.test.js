/* global sinon */
/* global expect */
/* global it */
/* global beforeEach */
/* global describe */
/*
jshint -W098, -W117, -W030
*/
(function () {
	'use strict';
	describe('Controller: UrlSelectorCtrl', function () {
		// body...
		var controller;
		var EtlRestServicesSettings;
		var OpenmrsSettings;
		var controllerScope;
		var rootScope;
		var cookieStoreService;
		var controllerFactory;
		var AuthService;

		beforeEach(function () {
			module('ngAmrsApp');
		});

		//beforeEach(module('ui.router')); //to enable using stateparams

		beforeEach(inject(function ($controller, $injector, $rootScope) {

			OpenmrsSettings = $injector.get('OpenmrsSettings');
			EtlRestServicesSettings = $injector.get('EtlRestServicesSettings');
			cookieStoreService= $injector.get('$cookies');
			AuthService= $injector.get('AuthService');
			rootScope =  $rootScope;
			controllerScope = $rootScope.$new();
			controllerFactory = $controller;
			controller = $controller('UrlSelectorCtrl', { $rootScope: $rootScope, $scope: controllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings, AuthService: AuthService});

		}));

		it('UrlSelectorCtrl controller should be defined and have all required services injected', function () {
			expect(controller).to.exist;
			expect(OpenmrsSettings).to.exist;
			expect(EtlRestServicesSettings).to.exist;
			expect(cookieStoreService).to.exist;
			expect(AuthService).to.exist;
		});
		
		it('should switch current mode to SetMode when controller is initailized with no persisted current Url base ', function () {
			
			cookieStoreService.remove('restUrlBase');
			cookieStoreService.remove('restEtlUrlBase');
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.currentMode).to.equal('SetMode');
		});
		
		it('should switch current mode to SetMode when controller is initailized with no persisted current Url base in either Etl or Openmrs settings ', function () {
			
			cookieStoreService.remove('restUrlBase');
			EtlRestServicesSettings.setCurrentRestUrlBase('test.url.com');
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.currentMode).to.equal('SetMode');
		});
		
		it('should switch current mode to ChangeMode when controller is initailized with a persisted current Url base ', function () {
			
			OpenmrsSettings.setCurrentRestUrlBase('test.url.com');
			EtlRestServicesSettings.setCurrentRestUrlBase('test.url.com');
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.currentMode).to.equal('ChangeMode');
		});
		
		
		it('should set current openmrssettings service url to the controllers currentRestBaseUrl when the conrtoller initializes', function () {
			
			OpenmrsSettings.setCurrentRestUrlBase('test.url.com');
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.currentRestBaseUrl).to.equal('test.url.com');
		});
		
		it('should set current etlRestSettings service url to the controllers currentRestBaseUrl when the conrtoller initializes', function () {
			
			EtlRestServicesSettings.setCurrentRestUrlBase('test.url.com');
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.currentEtlRestBaseUrl).to.equal('test.url.com');
		});
		
		it('should set url lists when the controller initializes', function () {
			
			var tempControllerScope = rootScope.$new();
			var tempController = controllerFactory('UrlSelectorCtrl', { $rootScope: rootScope, $scope: tempControllerScope, OpenmrsSettings: OpenmrsSettings, EtlRestServicesSettings: EtlRestServicesSettings});
			expect(tempControllerScope.urlRestBaseList).to.equal(OpenmrsSettings.getUrlBaseList());
			expect(tempControllerScope.urlEtlRestBaseList).to.equal(EtlRestServicesSettings.getUrlBaseList());
		});
		
		it('should add urlToAdd url to the openmrs settings list of urls when addUrlToList is invoked with a non-empty defined urlToAdd value', function () {
			controllerScope.urlToAdd = 'urlToAdd.com';
			controllerScope.addUrlToList();
			controllerScope.addUrlToList();
			
			expect(OpenmrsSettings.getUrlBaseList()).to.include(controllerScope.urlToAdd);
			
		});
		
		it('should refresh openmrs settings list when addUrlToList is invoked successfully', function () {
			controllerScope.urlToAdd = 'urlToAdd.com';
			controllerScope.addUrlToList();
			controllerScope.addUrlToList();
			
			expect(controllerScope.urlRestBaseList).to.equal(OpenmrsSettings.getUrlBaseList());
			
		});
		
		it('should add urlToAdd url to the openmrs settings list of urls when addEtlUrlToList is invoked with a non-empty defined urlToAdd value', function () {
			controllerScope.urlEtlToAdd = 'urlToAdd.com';
			controllerScope.addEtlUrlToList();//one to switch to adding url nmode
			controllerScope.addEtlUrlToList();
			expect(EtlRestServicesSettings.getUrlBaseList()).to.include(controllerScope.urlEtlToAdd);
			
		});
		
		it('should refresh etl rest settings url list when addEtlUrlToList is invoked successfully', function () {
			controllerScope.urlEtlToAdd = 'urlToAdd.com';
			controllerScope.addEtlUrlToList();//one to switch to adding url nmode
			controllerScope.addEtlUrlToList();
			
			expect(controllerScope.urlEtlRestBaseList).to.equal(EtlRestServicesSettings.getUrlBaseList());
			
		});
		
		it('should persist etl and openmrs current url settings when saveSettings is invoked', function () {
			controllerScope.currentRestBaseUrl = 'urlToAdd.com';
			controllerScope.currentRestBaseUrl = 'urlEtlToAdd.com';
			
			controllerScope.saveSettings();
			
			expect(controllerScope.currentRestBaseUrl).to.equal(OpenmrsSettings.getCurrentRestUrlBase());
			expect(controllerScope.currentEtlRestBaseUrl).to.equal(EtlRestServicesSettings.getCurrentRestUrlBase());
			
		});
		
		it('should logout the user when saveSettings is invoked successfully', function () {
			//setting this ensures success
			controllerScope.currentRestBaseUrl = 'urlToAdd.com';
			controllerScope.currentRestBaseUrl = 'urlEtlToAdd.com';
			
			
			//set up spy for auth service 
			var getDefaultersSpy = sinon.spy(AuthService, 'logOut');
			
			controllerScope.saveSettings();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(1);
			
		});
		
		
		
		
		
	});
})();
