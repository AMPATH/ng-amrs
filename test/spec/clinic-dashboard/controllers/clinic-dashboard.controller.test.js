/*
jshint -W098, -W117, -W030
*/
(function() {
'use strict';
	describe('Controller: ClinicDashboardCtrl', function() {
		// body...
		var controller;
		var stateParams;
		var OpenmrsRestService;
		var controllerScope;
		var locationModel;
		var clinicDashboardService;
		var locationService;
		beforeEach(function () {
			module('app.clinicDashboard');
			module('models');
			module('mock.openmrsRestServices');
		});

		beforeEach(module('ui.router')); //to enable using stateparams
		beforeEach(module('angularMoment'));
		beforeEach(inject(function ($controller, $injector, _$stateParams_, $rootScope) {
			/*
			When testing controllers it not wise to inject them as it is done when testing services
			It is advisable to use $controller to instantiate instead of using the $injector service
			*/

			OpenmrsRestService = $injector.get('OpenmrsRestService');
			locationService = OpenmrsRestService.getLocationResService();
			locationModel = $injector.get('LocationModel');
			clinicDashboardService = $injector.get('ClinicDashboardService');
			controllerScope = $rootScope.$new();
			stateParams = _$stateParams_;
			controller = $controller('ClinicDashboardCtrl', { $rootScope: $rootScope, $scope: controllerScope,
				 $stateParams: stateParams, OpenmrsRestService: OpenmrsRestService,
				 LocationModel: locationModel, ClinicDashboardService: clinicDashboardService });

		}));

		it('ClinicDashboardCtrl controller should have all Injected Services', function () {
			expect(controller).to.exist;

			//ensure that mock services are injected
			expect(OpenmrsRestService.isMockService).to.equal(true);
			expect(locationService.isMockService).to.equal(true);
		});

		it('should call the locations service getlocations method on load to fetch locations', function () {
			//this should have been called when the controller was initalizing
			expect(locationService.getLocationsCalled).to.equal(true);
		});



		it('should should wrap received locations and assign it to the scope when fetchLocations is called', function () {
			//fetchLocations is called when the controller was initalizing
			expect(controllerScope.locations.length).to.equal(locationService.getMockLocations().length);

			//check for wrapping
			var firstLocation = locationService.getMockLocations()[0];
			var wrappedLocation = locationModel.toWrapper(firstLocation);

			expect(controllerScope.locations[0].uuId()).to.equal(wrappedLocation.uuId());

		});

	});
})();
