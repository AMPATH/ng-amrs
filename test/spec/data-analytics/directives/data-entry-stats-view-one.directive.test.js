/* global afterEach */
/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';
	describe('Data Entry Stats View One Directive Unit Tests', function () {
		beforeEach(function () {
			//debugger;
			module('ngAmrsApp');
			module('app.dataAnalytics');
			module('models');
			module('models');
			module('mock.etlRestServices');
			module('my.templates');
			module('app.openmrsRestServices');
		});

		var elm, element, scope, etlRestServiceMock, locationModelFactory, locationModels, moment, settingsService;
		
		beforeEach(function(){
			
		});

		beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
			settingsService = $injector.get('OpenmrsSettings');
			$httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'location?v=default').respond({});
			elm = angular.element(
				'<stats-data-entry-stats-view-one selected-locations="selectedLocations">' +
				'</stats-data-entry-stats-view-one>');
			scope = $rootScope.$new();
			scope.selectedLocations = { selectedAll: true, locations: [] };
			element = $compile(elm)(scope);
			scope.$digest();
			etlRestServiceMock = $injector.get('EtlRestService');
			locationModelFactory =  $injector.get('LocationModel');
			moment =  $injector.get('moment');
		}));
		
		beforeEach(function() {
			var testLocations = [{name: '_name',
					  uuid:'uuid1',
                      description: '_description'}, 
                      {name: '_name2',
					  uuid:'uuid2',
                      description: '_description2'}];
					  
					  locationModels = 
					  locationModelFactory.toArrayOfWrappers(testLocations);
		});

		afterEach(function () {
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
				expect(isolateScope.getSelectedLocations).to.exist;
				// expect(isolateScope.isBusy).to.exist;
				// expect(isolateScope.experiencedLoadingErrors).to.exist;
				// expect(isolateScope.loadPatientList).to.exist;
			});

		
			
			
			
			
			
			
			it('should invoke the getDataEntryStatistics etl method when loadStatsFromServer is invoked' +
			' with required params', 
			function(){
				var isolateScope = element.isolateScope();
				var loadStatsFromServerSpy = sinon.spy(etlRestServiceMock, 'getDataEntryStatistics');
				isolateScope.loadStatsFromServer();
				chai.expect(loadStatsFromServerSpy.callCount).to.equal(1);
			});
			
			it('should not invoke the getDataEntryStatistics etl method when loadStatsFromServer is invoked ' +
      		'and there is a pending request to avoid race conditions',
		    function () {
				var isolateScope = scope.$$childHead;
				var loadStatsFromServerSpy = sinon.spy(etlRestServiceMock, 'getDataEntryStatistics');
				isolateScope.isBusy = true;
				isolateScope.loadStatsFromServer();
				chai.expect(loadStatsFromServerSpy.callCount).to.equal(0);
			});
			
			 it('should not call getPatientListByIndicator when loadPatientList is called and startDate not' +
			' supplied or empty', function () {
				var isolateScope = scope.$$childHead;
				var loadStatsFromServerSpy = sinon.spy(etlRestServiceMock, 'getDataEntryStatistics');
		
				//case undefined
				isolateScope.startDate= undefined;
				isolateScope.loadStatsFromServer();
				chai.expect(loadStatsFromServerSpy.callCount).to.equal(0);
			
				//case empty
				isolateScope.startDate = null;
				isolateScope.loadStatsFromServer();
				chai.expect(loadStatsFromServerSpy.callCount).to.equal(0);
			});
			it('should set isBusy to false when loadStatsFromServer is invoked, and callbacks return',
			function () {
					var isolateScope = scope.$$childHead;
		
					//case when no error occurs during call
					etlRestServiceMock.returnErrorOnNextCall = false;
					isolateScope.loadStatsFromServer();
					expect(isolateScope.isBusy).to.equal(false);
		
					//case when no error occurs during call
					etlRestServiceMock.returnErrorOnNextCall = true;
					isolateScope.loadStatsFromServer();
					expect(isolateScope.isBusy).to.equal(false);
			});
			it('should set experiencedLoadingErrors to true when loadStatsFromServer is invoked, and callback returns error',
			function () {
					var isolateScope = scope.$$childHead;
		
					//case when no error occurs during call
					etlRestServiceMock.returnErrorOnNextCall = true;
					isolateScope.loadStatsFromServer();
					expect(isolateScope.experiencedLoadingErrors).to.equal(true);
			});
			
			

	});
})();
