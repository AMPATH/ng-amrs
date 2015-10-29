/*
jshint -W030
*/
(function() {
  'use strict';

  describe('ProviderModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var providerModelFactory;

      var testProviderOpenmrsObject;
      
      var testPersonOpenmrsObject;

      beforeEach(inject(function() {
        
        var testNames = [{
          givenName: '_givenName',
          middleName: '_middleName',
          familyName: '_familyName',
          familyName2: '_familyName2',
          voided: true,
          uuId: '_uuId'
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

        testProviderOpenmrsObject = 
        {identifier: '_identifier',
         person: testPersonOpenmrsObject,
         uuid: '_uuId',
         display: '_display',
         attributes: '_attributes',
         retired: '_retired'};
      }));

      beforeEach(inject(function($injector) {
        providerModelFactory = $injector.get('ProviderModel');
      }));

      it('should have Provider Model Factory defined', function() {
        expect(providerModelFactory).to.exist;
      });

      it('should always create provider model with all required members defined ', function() {


        var model = providerModelFactory.toWrapper(testProviderOpenmrsObject);

        expect(model.identifier()).to.equal(testProviderOpenmrsObject.identifier);
        expect(model.person().openmrsModel()).to.deep.equal(testProviderOpenmrsObject.person);
        expect(model.uuId()).to.equal(testProviderOpenmrsObject.uuid);
        expect(model.display()).to.equal(testProviderOpenmrsObject.display);
        expect(model.attributes()).to.equal(testProviderOpenmrsObject.attributes);
        expect(model.retired()).to.equal(testProviderOpenmrsObject.retired);
      });

      it('should always create provider model that returns a valid openmrs provider payload', function() {
        var model = providerModelFactory.toWrapper(testProviderOpenmrsObject);
        
        expect(model.identifier()).to.equal(testProviderOpenmrsObject.identifier);
        expect(model.person().openmrsModel()).to.deep.equal(testProviderOpenmrsObject.person);
        expect(model.attributes()).to.equal(testProviderOpenmrsObject.attributes);
        expect(model.retired()).to.equal(testProviderOpenmrsObject.retired);
      });

    });

})();
