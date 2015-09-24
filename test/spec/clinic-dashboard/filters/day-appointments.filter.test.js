(function () {
	'use strict'
	describe('filter: daysFilter for Monthly Appointments View', function () {
		var datesFilter;
		var dailyAppointments;
		var monthlyAppointmentModelFactory;
		var moment;
		
		beforeEach(function () {
			module('models');
			module('angularMoment');
		});

		beforeEach(function () {
			module('app.clinicDashboard');
			inject(function ($injector) {
				datesFilter = $injector.get('$filter')('datesFilter');
			});
		});


		beforeEach(function () {
			inject(function ($injector) {
				moment = $injector.get('moment');
				monthlyAppointmentModelFactory = $injector.get('MonthlyAppointmentModel');
			});
			
			
		});

		beforeEach(function () {
			dailyAppointments = [
				{
					rtc_date: '2015-08-02T21:00:00.000Z',
					day_of_week: 'Monday',
					total: '19'
				},
				{
					rtc_date: '2015-08-03T21:00:00.000Z',
					day_of_week: 'Tuesday',
					total: '20'
				},
				{
					rtc_date: '2015-08-04T21:00:00.000Z',
					day_of_week: 'Wednesday',
					total: '21'
				}
			];
		});

		it('Should return the total appointments for a particular date given an array of daily appointmets', function () {
			//expect(datesFilter('does it work?')).to.equal('Does It Work?');
			
			var wrappedMonthlyAppointments = monthlyAppointmentModelFactory.toArrayOfModels(dailyAppointments);

			var date = new moment('2015-08-02T21:00:00.000Z');
			
			var total = datesFilter(wrappedMonthlyAppointments, {date:date});
			
			expect(total).to.equal('19');


		});
		
		it('Should return origina object of object not an array', function () {
			//expect(datesFilter('does it work?')).to.equal('Does It Work?');
			
			var date = new moment('2015-08-02T21:00:00.000Z');
			
			var total = datesFilter('test', {date:date});
			
			expect(total).to.equal('test');


		});
		
		
	});
})();
