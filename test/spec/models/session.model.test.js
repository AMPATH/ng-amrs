/*
jshint -W030
*/
(function() {
    'use strict';

    describe('SessionModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var sessionModelFactory;

      beforeEach(inject(function($injector) {
        sessionModelFactory = $injector.get('SessionModel');
      }));

      it('should have Session Model Factory defined', function() {
        expect(sessionModelFactory).to.exist;
      });

      it('should always create session model with all required members defined ', function() {
        var sessionId = 'session id';
        var isAuthenticated = true;
        var model = new sessionModelFactory.session(sessionId, isAuthenticated);
        expect(model.sessionId).to.exist;
        expect(model.isAuthenticated).to.exist;
        expect(model.sessionId()).to.equal(sessionId);
        expect(model.isAuthenticated()).to.equal(isAuthenticated);
      });

      it('should always create session model that returns a valid openmrs session payload', function() {
        var expectedOpenmrsSession = {
          sessionId:'session id',
          authenticated:true
        };

        var model = new sessionModelFactory.session(expectedOpenmrsSession.sessionId,
          expectedOpenmrsSession.authenticated);
        expect(model.openmrsModel()).to.deep.equal(expectedOpenmrsSession);
      });


    });

})();
