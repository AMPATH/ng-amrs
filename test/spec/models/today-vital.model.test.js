/* global it */
/* global inject */
/* global describe */
/* global beforeEach */
/* global expect */
/*
jshint -W030
*/
(function() {
  'use strict';

  describe('TodayVitalModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var vitalModelFactory;
      var vitalEtl;  // jshint ignore:line

      beforeEach(inject(function($injector) {
        vitalModelFactory = $injector.get('TodayVitalModel');
      }));

      it('should have Vital Model Factory defined', function() {
        expect(vitalModelFactory).to.exist;
      });
    });

})();
