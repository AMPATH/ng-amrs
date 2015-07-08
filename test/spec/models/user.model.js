(function() {
    'use strict';

    describe('UserModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var userModelFactory;

      beforeEach(inject(function($injector) {
        userModelFactory = $injector.get('UserModel');
      }));

      it('should have User Model Factory defined', function() {
        expect(userModelFactory).toBeDefined();
      });

      it('should always create user model with all required members defined ', function() {
        var uuId = 'uuid' ;
        var systemId = 'systemid' ;
        var userName = 'username' ;
        var personUuId = 'personuuid' ;
        var password =  'password' ;
        
        var model = new userModelFactory.user(userName, personUuId, password, uuId, systemId);
        
        expect(model.uuId).toBeDefined();
        expect(model.systemId).toBeDefined();
        expect(model.userName).toBeDefined();
        expect(model.personUuId).toBeDefined();
        expect(model.password).toBeDefined();
        
        expect(model.uuId()).toEqual(uuId);
        expect(model.systemId()).toEqual(systemId);
        expect(model.userName()).toEqual(userName);
        expect(model.personUuId()).toEqual(personUuId);
        expect(model.password()).toEqual(password);
        
      });

      it('should always create user model that returns a valid openmrs user payload', function() {
        var expectedOpenmrsUser = {
          username:'username',
          password:'password',
          person:'person uuid',
          systemId:''
        };

        var model = new userModelFactory.user(expectedOpenmrsUser.username,
          expectedOpenmrsUser.person, expectedOpenmrsUser.password);
          expect(model.openmrsModel()).toEqual(expectedOpenmrsUser);
      });

    });

})();
