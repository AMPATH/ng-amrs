/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';

	describe('Patient Creation Statistics Directive Unit Tests', function () {

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
				'<patient-creation-statistics>'+
				'</patient-creation-statistics>');
			scope = $rootScope.$new();
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
			expect(isolateScope.startDate).to.exist;
			expect(isolateScope.endDate).to.exist;
			expect(isolateScope.currentPage).to.exist;
			expect(isolateScope.startFrom).to.exist;
			expect(isolateScope.statisticSearchString).to.exist;
			expect(isolateScope.isBusyStatistics).to.exist;
			expect(isolateScope.isBusyStatisticsDetails).to.exist;
			expect(isolateScope.experiencedStatisticsLoadError).to.exist;
			expect(isolateScope.creationstatistics).to.exist;
			expect(isolateScope.showStatistics).to.exist;
			expect(isolateScope.experiencedStatisticsDetailLoadError).to.exist;
			expect(isolateScope.showCreationDetails).to.exist;
			expect(isolateScope.showPatientsInLocation).to.exist;
			expect(isolateScope.selectedLocation).to.exist;
			expect(isolateScope.patientInLocationSearchString).to.exist;
			expect(isolateScope.patientDetails).to.exist;
			expect(isolateScope.selectedEndDate).to.exist;
			expect(isolateScope.openDatePopup).to.exist;
			expect(isolateScope.openEndDatePopup).to.exist;
			expect(isolateScope.loadPatientCreationStats).to.exist;
			expect(isolateScope.loadPatientDetails).to.exist;
			expect(isolateScope.openEndDatePopup).to.exist;
			expect(isolateScope.loadPatientCreationStats).to.exist;
			expect(isolateScope.selectedLocationId).to.exist;

		});


		it('should set experiencedStatisticsLoadError to false when getPatientsCreatedByPeriod is called', function () {
			var isolateScope = element.isolateScope();

			isolateScope.patientCreationStatisticsLoadError = true;

			etlRestServiceMock.returnErrorOnNextCall = false;

			isolateScope.loadPatientCreationStats();

			expect(isolateScope.patientCreationStatisticsLoadError).to.equal(false);

		});

		it('should call getPatientsCreatedByPeriod etl service method when getPatientsCreatedByPeriod is invoked', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsCreatedByPeriodSpy = sinon.spy(etlRestServiceMock, 'getPatientsCreatedByPeriod');

			isolateScope.loadPatientCreationStats();

			chai.expect(getPatientsCreatedByPeriodSpy.callCount).to.equal(1);

		});

		it('should not call getPatientsCreatedByPeriod when another request is in progress when getPatientsCreatedByPeriod is called', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsCreatedByPeriodSpy = sinon.spy(etlRestServiceMock, 'getPatientsCreatedByPeriod');

			isolateScope.isBusyStatistics = true;

			isolateScope.loadPatientCreationStats();

			chai.expect(getPatientsCreatedByPeriodSpy.callCount).to.equal(0);

		});

		it('should not call getPatientsCreatedByPeriod when selected end date less than start date', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsCreatedByPeriodSpy = sinon.spy(etlRestServiceMock, 'getPatientsCreatedByPeriod');

			isolateScope.startDate = '2011-01-01';
			isolateScope.endDate = '2012-01-01';

			isolateScope.loadPatientCreationStats();

			chai.expect(getPatientsCreatedByPeriodSpy.callCount).to.equal(1);

		});

		it('should not call getPatientsCreatedByPeriod when getPatientsCreatedByPeriod is called and start and end date is not specificied', function () {
			var isolateScope = scope.$$childHead;
			var getPatientsCreatedByPeriodSpy = sinon.spy(etlRestServiceMock, 'getPatientsCreatedByPeriod');

			//case undefined
			isolateScope.startDate = undefined;
			isolateScope.endDate = undefined;

			isolateScope.loadPatientCreationStats();

			chai.expect(getPatientsCreatedByPeriodSpy.callCount).to.equal(0);

			//case empty
			isolateScope.startDate = '';
			isolateScope.endDate =  '';

			isolateScope.loadPatientCreationStats();

			chai.expect(getPatientsCreatedByPeriodSpy.callCount).to.equal(0);


		});

		it('should set isBusyStatistics to false when loadPatientCreationStats is invoked, and callbacks return', function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = false;
			isolateScope.loadPatientCreationStats();
			expect(isolateScope.isBusyStatistics).to.equal(false);

			//case when an error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientCreationStats();
			expect(isolateScope.isBusyStatistics).to.equal(false);

		});

		it('should set experiencedStatisticsLoadError to true when loadPatientCreationStats is invoked, and callback returns error', function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientCreationStats();
			expect(isolateScope.experiencedStatisticsLoadError).to.equal(true);

		});

		it('should set scope.patientStatistics with the returned statistics when getPatientsCreatedByPeriod is invoked, and callback returns success', function () {
			var isolateScope = scope.$$childHead;


			etlRestServiceMock.returnErrorOnNextCall = false;
			etlRestServiceMock.numberOfPatientCreationRowsToReturn = 20;

			isolateScope.patientStatistics = [];

			isolateScope.loadPatientCreationStats();

			expect(isolateScope.patientStatistics.result.length).to.equal(20);

			//another test
			etlRestServiceMock.numberOfPatientCreationRowsToReturn = 30;

			isolateScope.patientStatistics = [];

			isolateScope.loadPatientCreationStats();

			expect(isolateScope.patientStatistics.result.length).to.equal(30);

		});


		it('should set experiencedStatisticsDetailLoadError to false when getDetailsOfPatientsCreatedInLocation is called', function () {
			var isolateScope = element.isolateScope();

			isolateScope.experiencedStatisticsDetailLoadError = true;

			etlRestServiceMock.returnErrorOnNextCall = false;

			isolateScope.loadPatientDetails();

			expect(isolateScope.experiencedStatisticsDetailLoadError).to.equal(false);

		});

		it('should call getDetailsOfPatientsCreatedInLocation etl service method when getDetailsOfPatientsCreatedInLocation is invoked', function () {
			var isolateScope = scope.$$childHead;

			var getDetailsOfPatientsCreatedInLocationSpy = sinon.spy(etlRestServiceMock, 'getDetailsOfPatientsCreatedInLocation');

			isolateScope.loadPatientDetails(1,'Test location');

			chai.expect(getDetailsOfPatientsCreatedInLocationSpy.callCount).to.equal(1);

		});


		it('should not call getDetailsOfPatientsCreatedInLocation when another request is in progress when getDetailsOfPatientsCreatedInLocation is called', function () {
			var isolateScope = scope.$$childHead;
			var getDetailsOfPatientsCreatedInLocationSpy = sinon.spy(etlRestServiceMock, 'getDetailsOfPatientsCreatedInLocation');

			isolateScope.isBusyStatisticsDetails = true;

			isolateScope.loadPatientDetails(1,'Test location');

			chai.expect(getDetailsOfPatientsCreatedInLocationSpy.callCount).to.equal(0);

		});

		it('should not call getDetailsOfPatientsCreatedInLocation when selected end date less than start date', function () {
			var isolateScope = scope.$$childHead;
			var getDetailsOfPatientsCreatedInLocationSpy = sinon.spy(etlRestServiceMock, 'getDetailsOfPatientsCreatedInLocation');

			isolateScope.startDate = '2011-01-01';
			isolateScope.endDate = '2012-01-01';

			isolateScope.loadPatientDetails(1,'Test location');

			chai.expect(getDetailsOfPatientsCreatedInLocationSpy.callCount).to.equal(1);

		});

		it('should not call getDetailsOfPatientsCreatedInLocation when getDetailsOfPatientsCreatedInLocation is called and start or end date or selected Location is not specificied', function () {
			var isolateScope = scope.$$childHead;
			var getDetailsOfPatientsCreatedInLocationSpy = sinon.spy(etlRestServiceMock, 'getDetailsOfPatientsCreatedInLocation');

			//case undefined
			isolateScope.startDate = undefined;
			isolateScope.endDate = undefined;
			isolateScope.selectedLocationId =  undefined;

			isolateScope.loadPatientDetails(1,'Test location');

			chai.expect(getDetailsOfPatientsCreatedInLocationSpy.callCount).to.equal(0);

			//case empty
			isolateScope.startDate = '';
			isolateScope.endDate =  '';
			isolateScope.selectedLocationId =  '';
			isolateScope.loadPatientDetails(1,'Test location');

			chai.expect(getDetailsOfPatientsCreatedInLocationSpy.callCount).to.equal(0);


		});

		it('should set isBusyStatisticsDetails to false when loadPatientDetails is invoked, and callbacks return', function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = false;
			isolateScope.loadPatientDetails(1,'Test location');
			expect(isolateScope.isBusyStatisticsDetails).to.equal(false);

			//case when an error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientDetails(1,'Test location');
			expect(isolateScope.isBusyStatisticsDetails).to.equal(false);

		});

		it('should set experiencedStatisticsDetailLoadError to true when loadPatientDetails is invoked, and callback returns error', function () {
			var isolateScope = scope.$$childHead;

			//case when no error occurs during call
			etlRestServiceMock.returnErrorOnNextCall = true;
			isolateScope.loadPatientDetails(1,'Test location');
			expect(isolateScope.experiencedStatisticsDetailLoadError).to.equal(true);

		});

		it('should set scope.patientInLocation with the returned statistics when getDetailsOfPatientsCreatedInLocation is invoked, and callback returns success', function () {
			var isolateScope = scope.$$childHead;

			etlRestServiceMock.returnErrorOnNextCall = false;
			etlRestServiceMock.numberOfPatientCreationInLocationRowsToReturn = 20;

			isolateScope.patientInLocation = [];

			isolateScope.loadPatientDetails(1,'Test location');

			expect(isolateScope.patientInLocation.result.length).to.equal(20);



		});














	});
})();
