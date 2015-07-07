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
        expect(sessionModelFactory).toBeDefined();
      });

      it('should always create session model with all required members defined ', function() {
        var sessionId = 'session id';
        var isAuthenticated = true;
        var model = new sessionModelFactory.session(sessionId, isAuthenticated);
        expect(model.sessionId).toBeDefined();
        expect(model.isAuthenticated).toBeDefined();
        expect(model.sessionId()).toEqual(sessionId);
        expect(model.isAuthenticated()).toEqual(isAuthenticated);
      });

      it('should always create session model that returns a valid openmrs session payload', function() {
        var expectedOpenmrsSession = {
          sessionId:'session id',
          authenticated:true
        };

        var model = new sessionModelFactory.session(expectedOpenmrsSession.sessionId,
          expectedOpenmrsSession.authenticated);
        expect(model.openmrsModel()).toEqual(expectedOpenmrsSession);
      });


    });

})();
