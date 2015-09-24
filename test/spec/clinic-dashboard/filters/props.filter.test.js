(function () {
	'use strict'
	describe('filter: propsFilter', function () {
		var propsFilter;
		var testDataArray;
		var testProps;
		var dailyAppointments;
		var monthlyAppointmentModelFactory;
		var dailyAppointmentModels;

		beforeEach(function () {
			module('app.clinicDashboard');
			module('models');
			inject(function ($injector) {
				propsFilter = $injector.get('$filter')('propsFilter');
				monthlyAppointmentModelFactory = $injector.get('MonthlyAppointmentModel');
			});
		});

		beforeEach(function () {
			testDataArray = [
				{
					prop1: 'prop1A',
					prop2: 'prop2A',
					prop3: 'prop3A'
				},
				{
					prop1: 'prop1B',
					prop2: 'prop2B',
					prop3: 'prop3B'
				},
				{
					prop1: 'prop1C',
					prop2: 'prop2C',
					prop3: 'prop3C'
				}
			];
			
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
			
			dailyAppointmentModels = monthlyAppointmentModelFactory.toArrayOfModels(dailyAppointments);




		});

		it('Should filter array of objects by properties values passed in', function () {

			testProps = {
				prop1: 'prop1A'
			};

			var returnedArray = propsFilter(testDataArray, testProps);

			expect(returnedArray.length).to.equal(1);
			expect(returnedArray[0]).to.deep.equal(testDataArray[0]);
			
			//try different object
			
			testProps = {
				prop1: 'prop1A',
				prop2: 'prop2c'
			};

			returnedArray = propsFilter(testDataArray, testProps);

			expect(returnedArray.length).to.equal(2);
			expect(returnedArray[0]).to.deep.equal(testDataArray[0]);
			expect(returnedArray[1]).to.deep.equal(testDataArray[2]);

		});
		
		it('Should filter array of models (wrapped objects with getter setter properties) by properties values passed in', function () {

			testProps = {
				rtcDate: '2015-08-02T21:00:00.000Z'
			};

			var returnedArray = propsFilter(dailyAppointmentModels, testProps);

			expect(returnedArray.length).to.equal(1);
			expect(returnedArray[0].rtcDate()).to.equal(dailyAppointmentModels[0].rtcDate());
			
			//try different object
			
			testProps = {
				rtcDate: '2015-08-02T21:00:00.000Z',
				total: '21'
			};

			returnedArray = propsFilter(dailyAppointmentModels, testProps);

			expect(returnedArray.length).to.equal(2);
			expect(returnedArray[0].rtcDate()).to.deep.equal(dailyAppointmentModels[0].rtcDate());
			expect(returnedArray[1].rtcDate()).to.deep.equal(dailyAppointmentModels[2].rtcDate());

		});

		it('Should return original object of object not an array', function () {
			//expect(datesFilter('does it work?')).to.equal('Does It Work?');
			
			testProps = {
				prop1: 'prop1A'
			};

			var total = propsFilter('test', testProps);

			expect(total).to.equal('test');


		});
	});

})();