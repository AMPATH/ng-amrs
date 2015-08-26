/* global it */
/* global inject */
/* global describe */
/* global beforeEach */
/* global expect */
/*
jshint -W030
*/
(function () {
  'use strict';

  describe('MonthlyAppointmentModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var monthlyAppointmentModelFactory;
    var monthlyAppointmentEtl;  // jshint ignore:line

    beforeEach(inject(function ($injector) {
      monthlyAppointmentModelFactory = $injector.get('MonthlyAppointmentModel');
    }));

    beforeEach(inject(function () {
      /* jshint ignore:start */
      monthlyAppointmentEtl = {
        rtc_date: '2015-08-02T21:00:00.000Z',
        day_of_week: 'Monday',
        total: '19'
      };
      /* jshint ignore:end */
    }));

    it('should have PatientTest Model Factory defined', function () {
      expect(monthlyAppointmentModelFactory).to.exist;
    });

    it('should always create etl patien test model with all required members defined ', function () {
      /* jshint ignore:start */
      var model = new monthlyAppointmentModelFactory.monthlyAppointment(monthlyAppointmentEtl);

      expect(model.rtcDate()).to.equal(monthlyAppointmentEtl.rtc_date);
      expect(model.dayOfWeek()).to.equal(monthlyAppointmentEtl.day_of_week);
      expect(model.total()).to.equal(monthlyAppointmentEtl.total);
		
      /* jshint ignore:end */
    });

  });

})();
