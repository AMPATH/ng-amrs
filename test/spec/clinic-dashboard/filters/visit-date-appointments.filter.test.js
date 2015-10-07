(function () {
	'use strict'
	describe('filter: visitDaysFilter for Monthly Appointments & Visits View',
	function () {
		var visitDatesFilter;
		var dailyAppointments;
		var modelFactory;
		var moment;
		
		beforeEach(function () {
			module('models');
			module('angularMoment');
		});

		beforeEach(function () {
			module('app.clinicDashboard');
			inject(function ($injector) {
				visitDatesFilter = $injector.get('$filter')('visitDatesFilter');
			});
		});


		beforeEach(function () {
			inject(function ($injector) {
				moment = $injector.get('moment');
				modelFactory = $injector.get('MonthlyAppointmentVisitModel');
			});	
		});

		beforeEach(function () {
			dailyAppointments = [{
					rtc_date: '2015-08-02T21:00:00.000Z',
					day_of_week: 'Monday',
					total: '19',
					total_visited: '10'
				}, {
					rtc_date: '2015-08-03T21:00:00.000Z',
					day_of_week: 'Tuesday',
					total: '20',
					total_visited: '5'
				}, {
					rtc_date: '2015-08-04T21:00:00.000Z',
					day_of_week: 'Wednesday',
					total: '21',
					total_visited: '0'
				}
			];
		});

		it('Should return the total appointments for a particular date ' +
			'given an array of daily appointmets', function () {			
			var wrappedMonthlyAppointments = 
				modelFactory.toArrayOfModels(dailyAppointments);

			var date = new moment('2015-08-02T21:00:00.000Z');
			var total = visitDatesFilter(wrappedMonthlyAppointments, {date:date});	
			expect(total).to.equal('10');
		});
		
		it('Should return origina object of object not an array', function () {			
			var date = new moment('2015-08-02T21:00:00.000Z');
			var total = visitDatesFilter('test', {date:date});
			expect(total).to.equal('test');
		});	
	});
})();
