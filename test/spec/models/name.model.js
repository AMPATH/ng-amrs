/*
jshint -W030
*/
(function() {
  'use strict';

  describe('NameModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var nameModelFactory;

      beforeEach(inject(function($injector) {
        nameModelFactory = $injector.get('NameModel');
      }));

      it('should have Name Model Factory defined', function() {
        expect(nameModelFactory).to.exist;
      });

      it('should always create name model with all required members defined ', function() {
        var _givenName = 'givenName';
        var _middleName = 'middleName';
        var _familyName = 'familyName';
        var _familyName2 = 'familyName2';
        var _voided = false;
        var _uuId = 'uuid';

        var model = new nameModelFactory.name(_givenName, _middleName, _familyName, _familyName2, _voided, _uuId);

        expect(model.givenName).to.exist;
        expect(model.middleName).to.exist;
        expect(model.familyName).to.exist;
        expect(model.familyName2).to.exist;
        expect(model.voided).to.exist;
        expect(model.uuId).to.exist;

        expect(model.givenName()).to.equal(_givenName);
        expect(model.middleName()).to.equal(_middleName);
        expect(model.familyName()).to.equal(_familyName);
        expect(model.familyName2()).to.equal(_familyName2);
        expect(model.voided()).to.equal(_voided);
        expect(model.uuId()).to.equal(_uuId);

      });

      it('should always create name model that returns a valid openmrs name payload', function() {
        var expectedOpenmrsName = {
          givenName:'_givenName',
          middleName:'_middleName',
          familyName:'_familyName',
          familyName2:'_familyName2',
          voided:true,
          uuId:'_uuId'
        };

        var model = nameModelFactory.toWrapper(expectedOpenmrsName);
        expect(model.openmrsModel()).to.deep.equal(expectedOpenmrsName);
      });

      it('should always have toWrapperArray create an array of name models that returns a valid openmrs name array payload', function() {
        var testNames = [{
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

        var models = nameModelFactory.toArrayOfWrappers(testNames);

        for(var i = 0; i++; i< models.length){
          expect(models[i].openmrsModel()).to.deep.equal(testNames[i]);
        }

      });

      it('should always have fromArrayOfWrappers return an array of name models that are valid openmrs name payload', function() {
        var testNames = [{
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

        var models = nameModelFactory.toArrayOfWrappers(testNames);

        var unwrappedModels = nameModelFactory.fromArrayOfWrappers(models);

        for(var i = 0; i++; i< unwrappedModels.length){
          expect(unwrappedModels[i]).to.deep.equal(testNames[i]);
        }

      });

    });

})();
