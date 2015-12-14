/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';
	describe('Patient List Directive Unit Tests', function () {
		beforeEach(function () {
			//debugger;
			module('ngAmrsApp');
			module('app.admin');
			module('mock.etlRestServices');
			module('my.templates');
		});

		var elm, element, scope, etlRestServiceMock;

		beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
			elm = angular.element(
				'<patient-monthly-list location-uuid="{{location.uuid}}" indicator="is_on_arvs" start-date="2015-04-01" ' +
        'selected="selected"></patient-monthly-list>');
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

		it('should have required public members exposed on the scope on load',
      function () {
			var isolateScope = element.isolateScope();
			expect(isolateScope.patients).to.exist;
			expect(isolateScope.isBusy).to.exist;
			expect(isolateScope.experiencedLoadingErrors).to.exist;
			expect(isolateScope.loadPatientList).to.exist;
		});

		it('should set experiencedLoadingErrors to false when loadPatientList is called',
      function () {
			var isolateScope = element.isolateScope();
			isolateScope.experiencedLoadingErrors = true;
			etlRestServiceMock.returnErrorOnNextCall = false;
			isolateScope.loadPatientList();
			expect(isolateScope.experiencedLoadingErrors).to.equal(false);
		});

		it('should call getPatientListByIndicator etl service method when loadPatientList is invoked',
      function () {
			var isolateScope = scope.$$childHead;
			var getPatientsSpy = sinon.spy(etlRestServiceMock, 'getPatientListByIndicator');
			isolateScope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(1);
		});

		it('should not call getPatientListByIndicator when another request is in progress when ' +
      'loadPatientList is called', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsSpy = sinon.spy(etlRestServiceMock, 'getPatientListByIndicator');
			isolateScope.isBusy = true;
			isolateScope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(0);
		});

		it('should not call getPatientListByIndicator when loadPatientList is called and location uuid not' +
      ' supplied or empty', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsSpy = sinon.spy(etlRestServiceMock, 'getPatientListByIndicator');

			//case undefined
			isolateScope.locationUuid = undefined;
			isolateScope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(0);

			//case empty
			isolateScope.locationUuid = '';
			isolateScope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(0);
		});

    it('should not call getPatientListByIndicator when loadPatientList is called and indicator not' +
      ' supplied or empty', function () {
      var isolateScope = scope.$$childHead;
      var getPatientsSpy = sinon.spy(etlRestServiceMock, 'getPatientListByIndicator');

      //case undefined
      isolateScope.indicator = undefined;
      isolateScope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);

      //case empty
      isolateScope.indicator = '';
      isolateScope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);
    });

    it('should not call getPatientListByIndicator when loadPatientList is called and startDate not' +
      ' supplied or empty', function () {
      var isolateScope = scope.$$childHead;
      var getPatientsSpy = sinon.spy(etlRestServiceMock, 'getPatientListByIndicator');

      //case undefined
      isolateScope.startDate= undefined;
      isolateScope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);

      //case empty
      isolateScope.startDate = '';
      isolateScope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);
    });

		it('should set isBusy to false when loadPatientList is invoked, and callbacks return',
      function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = false;
			isolateScope.loadPatientList();
			expect(isolateScope.isBusy).to.equal(false);

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientList();
			expect(isolateScope.isBusy).to.equal(false);
		});

		it('should set experiencedLoadingErrors to true when loadPatientList is invoked, and callback returns error',
      function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientList();
			expect(isolateScope.experiencedLoadingErrors).to.equal(true);
		});

		it('should set scope.patients with the returned patients when loadPatientList is invoked, ' +
      'and callback returns success', function () {
			var isolateScope = scope.$$childHead;
			etlRestServiceMock.returnErrorOnNextCall = false;
			etlRestServiceMock.numberOfPatientsToReturn = 20;
			isolateScope.patients = [];
			isolateScope.loadPatientList();
			expect(isolateScope.patients.length).to.equal(20);

			//another test
			etlRestServiceMock.numberOfPatientsToReturn = 40;
			isolateScope.patients = [];
			isolateScope.loadPatientList();
			expect(isolateScope.patients.length).to.equal(40);
		});
	});
})();
