/*
jshint -W030
*/
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
        expect(userModelFactory).to.exist;
      });

      it('should always create user model with all required members defined ', function() {
        var uuId = 'uuid' ;
        var systemId = 'systemid' ;
        var userName = 'username' ;
        var personUuId = 'personuuid' ;
        var password =  'password' ;
        var userRole = [];

        var model = new userModelFactory.user(userName, personUuId, password, uuId, systemId, userRole);

        expect(model.uuId).to.exist;
        expect(model.systemId).to.exist;
        expect(model.userName).to.exist;
        expect(model.personUuId).to.exist;
        expect(model.password).to.exist;

        expect(model.uuId()).to.equal(uuId);
        expect(model.systemId()).to.equal(systemId);
        expect(model.userName()).to.equal(userName);
        expect(model.personUuId()).to.equal(personUuId);
        expect(model.password()).to.equal(password);

      });

      it('should always create user model that returns a valid openmrs user payload', function() {
        var expectedOpenmrsUser = {
          username:'username',
          password:'password',
          person:'person uuid',
          systemId:'',
          userRole:[]
        };

        var model = new userModelFactory.user(expectedOpenmrsUser.username,
          expectedOpenmrsUser.person, expectedOpenmrsUser.password, expectedOpenmrsUser.uuId, expectedOpenmrsUser.systemId, expectedOpenmrsUser.userRole);
        expect(model.openmrsModel()).to.deep.equal(expectedOpenmrsUser);
      });

    });

})();
