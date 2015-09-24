/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';

	describe('Defaulter List Directive Unit Tests', function () {

		beforeEach(function () {
			//debugger;
			module('ngAmrsApp');
			module('app.clinicDashboard');
			module('mock.etlRestServices');
			module('my.templates');
		});

		var elm, element, scope, etlRestServiceMock;

		beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
			elm = angular.element(
				'<defaulter-list location-uuid="{{location.uuid}}" selected="selected">' +
				'</defaulter-list>');
			scope = $rootScope.$new();
			scope.location = { uuid: 'uuid' };
			element = $compile(elm)(scope);
			scope.$digest();
			etlRestServiceMock = $injector.get('EtlRestService');
		}));
		
		afterEach(function() {
			etlRestServiceMock.returnErrorOnNextCall = false;
		});

		it('should have EtlRestServiceMock injected', function () {
			expect(etlRestServiceMock).to.exist;
			
			//ensure that mock services are injected
			expect(etlRestServiceMock.isMockService).to.equal(true);
		});
		
		it('should have required public members exposed on the scope on load', function () {
			var isolateScope = element.isolateScope();
			
			expect(isolateScope.patients).to.exist;
			expect(isolateScope.defaulterThreshold).to.exist;
			expect(isolateScope.isBusy).to.exist;
			expect(isolateScope.experiencedLoadingErrors).to.exist;
			expect(isolateScope.loadDefaulterList).to.exist;
			
		});
		
		it('should set experiencedLoadingErrors to false when loadDefaulterList is called', function () {
			var isolateScope = element.isolateScope();
			
			isolateScope.experiencedLoadingErrors = true;
			etlRestServiceMock.returnErrorOnNextCall = false;
			
			isolateScope.loadDefaulterList();
			
			expect(isolateScope.experiencedLoadingErrors).to.equal(false);
			
		});
		
		
		
		it('should call getDefaultersList etl service method when loadDefaulterList is invoked', function () {
			var isolateScope = scope.$$childHead;
			var getDefaultersSpy = sinon.spy(etlRestServiceMock, 'getDefaultersList');
			
			isolateScope.loadDefaulterList();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(1);
			
		});
		
		it('should not call getDefaultersList when another request is in progress when loadDefaulterList is called', function () {
			var isolateScope = scope.$$childHead;
			var getDefaultersSpy = sinon.spy(etlRestServiceMock, 'getDefaultersList');
			
			isolateScope.isBusy = true;
			
			isolateScope.loadDefaulterList();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(0);
			
		});
		
		it('should not call getDefaultersList when loadDefaulterList is called and location uuid not supplied or empty', function () {
			var isolateScope = scope.$$childHead;
			var getDefaultersSpy = sinon.spy(etlRestServiceMock, 'getDefaultersList');
			
			//case undefined
			isolateScope.locationUuid = undefined;
			
			isolateScope.loadDefaulterList();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(0);
			
			//case empty
			isolateScope.locationUuid = '';
			
			isolateScope.loadDefaulterList();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(0);
			
			
		});
		
		it('should set isBusy to false when loadDefaulterList is invoked, and callbacks return', function () {
			var isolateScope = scope.$$childHead;
			
			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = false;
			isolateScope.loadDefaulterList();
			expect(isolateScope.isBusy).to.equal(false);
			
			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadDefaulterList();
			expect(isolateScope.isBusy).to.equal(false);
			
		});
		
		it('should set experiencedLoadingErrors to true when loadDefaulterList is invoked, and callback returns error', function () {
			var isolateScope = scope.$$childHead;
			
			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadDefaulterList();
			expect(isolateScope.experiencedLoadingErrors).to.equal(true);
			
		});
		
		it('should set scope.patients with the returned patients when loadDefaulterList is invoked, and callback returns success', function () {
			var isolateScope = scope.$$childHead;
			
			etlRestServiceMock.returnErrorOnNextCall = false;
			etlRestServiceMock.numberOfDefaultersToReturn = 20;
			
			isolateScope.patients = [];
			
			isolateScope.loadDefaulterList();
			
			expect(isolateScope.patients.length).to.equal(20);
			
			//another test
			etlRestServiceMock.numberOfDefaultersToReturn = 40;
			
			isolateScope.patients = [];
			
			isolateScope.loadDefaulterList();
			
			expect(isolateScope.patients.length).to.equal(40);
			
		});
		
		it('should call loadDefaulterList etl service method when location uuid changes', function () {
			var isolateScope = scope.$$childHead;
			var getDefaultersSpy = sinon.spy(etlRestServiceMock, 'getDefaultersList');
			
			scope.location.uuid = 'uuid2';
			
			scope.$digest();
			
			chai.expect(getDefaultersSpy.callCount).to.equal(1);
			
		});
		
		
		
	});
})();