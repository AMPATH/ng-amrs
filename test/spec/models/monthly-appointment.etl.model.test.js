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
    var monthlyAppointmentsEtl;  // jshint ignore:line

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


      monthlyAppointmentsEtl = [
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
      /* jshint ignore:end */
    }));

    it('should have MonthlyAppointment Model Factory defined', function () {
      expect(monthlyAppointmentModelFactory).to.exist;
    });

    it('should always create etl monthly appointment model with all required members defined ', function () {
      /* jshint ignore:start */
      var model = new monthlyAppointmentModelFactory.monthlyAppointment(monthlyAppointmentEtl);

      expect(model.rtcDate()).to.equal(monthlyAppointmentEtl.rtc_date);
      expect(model.dayOfWeek()).to.equal(monthlyAppointmentEtl.day_of_week);
      expect(model.total()).to.equal(monthlyAppointmentEtl.total);
		
      /* jshint ignore:end */
    });
    
     it('should always a valid array of monthly appointment model when toArrayOfModels is called ', function () {
      /* jshint ignore:start */
      var model = new monthlyAppointmentModelFactory.monthlyAppointment(monthlyAppointmentsEtl[0]);

      var models = monthlyAppointmentModelFactory.toArrayOfModels(monthlyAppointmentsEtl);

      expect(model.rtcDate()).to.equal(models[0].rtcDate());
      expect(model.dayOfWeek()).to.equal(models[0].dayOfWeek());
      expect(model.total()).to.equal(models[0].total());
      
      expect(models.length).to.equal(3);
     
      /* jshint ignore:end */
    });

  });

})();
