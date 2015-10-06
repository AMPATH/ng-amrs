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

  describe('MonthlyAppointmentVisitModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var modelFactory;
    var monthlyAppointmentVisitEtl; // jshint ignore:line
    var monthlyAppointmentVisitsEtl; // jshint ignore:line

    beforeEach(inject(function ($injector) {
      modelFactory = $injector.get('MonthlyAppointmentVisitModel');
    }));

    beforeEach(inject(function () {
      /* jshint ignore:start */
      monthlyAppointmentVisitEtl = {
        rtc_date: '2015-08-02T21:00:00.000Z',
        day_of_week: 'Monday',
        total: '19',
        total_visited: '5'
      };

      monthlyAppointmentVisitsEtl = [{
          rtc_date: '2015-08-02T21:00:00.000Z',
          day_of_week: 'Monday',
          total: '19',
          total_visited: '0'
        }, {
          rtc_date: '2015-08-03T21:00:00.000Z',
          day_of_week: 'Tuesday',
          total: '20',
          total_visited: '5'
        }, {
          rtc_date: '2015-08-04T21:00:00.000Z',
          day_of_week: 'Wednesday',
          total: '21',
          total_visited: '22'
      }, {
          rtc_date: '2015-08-05T20:00:00.000Z',
          day_of_week: 'Friday',
          total: '0',
          total_visited: '9'
      }];
      /* jshint ignore:end */
    }));

    it('should have MonthlyAppointmentVisit Model Factory defined', function () {
      expect(modelFactory).to.exist;
    });

    it('should always create etl monthly AppointmentVisit model with all ' +
       'required members defined ', function () {
      /* jshint ignore:start */
      var model = 
        new modelFactory.MonthlyAppointmentVisit(monthlyAppointmentVisitEtl);

      expect(model.rtcDate()).to.equal(monthlyAppointmentVisitEtl.rtc_date);
      expect(model.dayOfWeek()).to.equal(monthlyAppointmentVisitEtl.day_of_week);
      expect(model.total()).to.equal(monthlyAppointmentVisitEtl.total);
      expect(model.totalVisited()).to.equal(monthlyAppointmentVisitEtl.total_visited);	
      /* jshint ignore:end */
    });
    
     it('should always return a valid array of monthly AppointmentVisit model '+
        'when toArrayOfModels is called ', function () {
      /* jshint ignore:start */
      var model = 
        new modelFactory.MonthlyAppointmentVisit(monthlyAppointmentVisitsEtl[0]);

      var models = modelFactory.toArrayOfModels(monthlyAppointmentVisitsEtl);

      expect(model.rtcDate()).to.equal(models[0].rtcDate());
      expect(model.dayOfWeek()).to.equal(models[0].dayOfWeek());
      expect(model.total()).to.equal(models[0].total());
      expect(model.totalVisited()).to.equal(models[0].totalVisited());
      expect(models.length).to.equal(4); 
      /* jshint ignore:end */
    });
  });
})();
