/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';

	describe('Appointment Schedule Directive Unit Tests', function () {

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
				'<daily-visits location-uuid="{{location.uuid}}" selected="selected">' +
				'</daily-visits>');
			scope = $rootScope.$new();
			scope.location = { uuid: 'uuid' };
			element = $compile(elm)(scope);
			scope.$parent.switchTabByIndex = function(){}
			scope.$digest();
			etlRestServiceMock = $injector.get('EtlRestService');
		}));

		it('should have EtlRestServiceMock injected', function () {
			expect(etlRestServiceMock).to.exist;
			
			//ensure that mock services are injected
			expect(etlRestServiceMock.isMockService).to.equal(true);
		});
		
		it('should call  getDailyVisits and getAppointmentSchedule etl service methods when loadSchedule is invoked', function () {
			var isolateScope = scope.$$childHead;

			var getDailyVisitsSpy = sinon.spy(etlRestServiceMock, 'getDailyVisits');

			var getAppointmentsSpy = sinon.spy(etlRestServiceMock, 'getAppointmentSchedule');

			console.log("number of calls:" + getAppointmentsSpy.callCount)
			isolateScope.loadSchedule();
			
			chai.expect(getAppointmentsSpy.callCount).to.equal(1);
			chai.expect(getDailyVisitsSpy.callCount).to.equal(1);
			
		});
		
		it('should call loadSchedule method when selectedDate() is invoked with a date', function () {
			
			//we know that loadShedule in turns calls getAppointments when all conditions met
			//we therefore ensure that all conditions are met for loadSchedule to trigger getAppointments
			
			var isolateScope = scope.$$childHead; //get child scope. there's only one in this case
			
			var getAppointmentsSpy = sinon.spy(etlRestServiceMock, 'getAppointmentSchedule');
			
			console.log("number of calls:" + getAppointmentsSpy.callCount)
			
			isolateScope.selectedDate('2015-08-09');
			
			chai.expect(getAppointmentsSpy.callCount).to.equal(1);
			
		});
		
		it('should call loadSchedule method when location uuid changes', function () {
			
			var getAppointmentsSpy = sinon.spy(etlRestServiceMock, 'getAppointmentSchedule');
			
			scope.location.uuid = 'uuid2';
			
			scope.$digest();
			
			chai.expect(getAppointmentsSpy.callCount).to.equal(1);
			
		});
		
		it('should call loadSchedule on loading of the controller, and attach appointments to the scope when loaded', function () {
			//at this point, the location uuid changed on load and therefore appointments are present
			//by default the etservicemock will return 20 appointments
			var isolateScope = scope.$$childHead; 
			
			chai.expect(isolateScope.patients).to.not.equal(10);
			
		});
		
		it('should display error message when loading of appointments fails', function () {
			var isolateScope = scope.$$childHead; 
			
			console.log("Has Loading Errors:" + isolateScope.experiencedLoadingError); 
			
			etlRestServiceMock.returnErrorOnNextCall = true;
			
			isolateScope.loadSchedule();
			
			console.log("Has Loading Errors:" + isolateScope.experiencedLoadingError);
			
			chai.expect(isolateScope.experiencedLoadingError).to.equal(true);
			
		});
		
		it('should set the selected date to the argument when viewDayAppointments broadcast is received', function () {
			var isolateScope = scope.$$childHead; 
			
			scope.$broadcast('viewDayAppointments', '2015-08-08');
			
			scope.$digest();
			
			chai.expect(isolateScope.selectedDate()).to.equal( '2015-08-08');
			
		});
	});
})();
