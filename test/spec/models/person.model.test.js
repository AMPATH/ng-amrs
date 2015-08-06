/*
jshint -W030
*/
(function() {
  'use strict';

  describe('PersonModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var personModelFactory;

      var testPersonOpenmrsObject;

      var testNames;

      beforeEach(inject(function() {

        testNames = [{
          givenName:'_givenName',
          middleName:'_middleName',
          familyName:'_familyName',
          familyName2:'_familyName2',
          voided:true,
          uuId:'_uuId'
        },{
          givenName:'_givenName2',
          middleName:'_middleName2',
          familyName:'_familyName2',
          familyName2:'_familyName22',
          voided:false,
          uuId:'_uuId2'
        }];


        testPersonOpenmrsObject = {
                      names: testNames,
                      gender: '_gender',
                      uuid: '_uuId',
                      age: '_age',
                      birthdate: '_birthdate',
                      birthdateEstimated: '_birthdateEstimated',
                      dead: '_dead',
                      deathDate: '_deathDate',
                      causeOfDeath: '_causeOfDeath',
                      addresses: '_addresses',
                      preferredName: testNames[0],
                      preferredAddress: '_preferredAddress',
                      attributes: '_attributes'
                      };
      }));

      beforeEach(inject(function($injector) {
        personModelFactory = $injector.get('PersonModel');
      }));

      it('should have Person Model Factory defined', function() {
        expect(personModelFactory).to.exist;
      });

      it('should always create person model with all required members defined ', function() {


        var model = personModelFactory.toWrapper(testPersonOpenmrsObject);

        expect(model.openmrsModel().names).to.deep.equal(testPersonOpenmrsObject.names);
        expect(model.gender()).to.equal(testPersonOpenmrsObject.gender);
        expect(model.uuId()).to.equal(testPersonOpenmrsObject.uuid);
        expect(model.age()).to.equal(testPersonOpenmrsObject.age);
        expect(model.birthdate()).to.equal(testPersonOpenmrsObject.birthdate);
        expect(model.birthdateEstimated()).to.equal(testPersonOpenmrsObject.birthdateEstimated);
        expect(model.dead()).to.equal(testPersonOpenmrsObject.dead);
        expect(model.deathDate()).to.equal(testPersonOpenmrsObject.deathDate);
        expect(model.causeOfDeath()).to.equal(testPersonOpenmrsObject.causeOfDeath);
        expect(model.addresses()).to.equal(testPersonOpenmrsObject.addresses);
        expect(model.attributes()).to.equal(testPersonOpenmrsObject.attributes);
        expect(model.preferredName().openmrsModel()).to.deep.equal(testPersonOpenmrsObject.preferredName);
        expect(model.preferredAddress()).to.equal(testPersonOpenmrsObject.preferredAddress);
      });

      it('should always create person model that returns a valid openmrs person payload', function() {
        var model = personModelFactory.toWrapper(testPersonOpenmrsObject);
        expect(model.openmrsModel()).to.deep.equal(testPersonOpenmrsObject);
      });

    });

})();
