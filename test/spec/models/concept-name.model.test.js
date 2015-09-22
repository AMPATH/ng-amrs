/*
jshint -W030
*/
(function() {
  'use strict';

  describe('ConceptNameModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var conceptNameModelFactory;
      
      var conceptNameOpenmrsObject;

      beforeEach(inject(function($injector) {
        conceptNameModelFactory = $injector.get('ConceptNameModel');
      }));
      
      beforeEach(inject(function() {
        conceptNameOpenmrsObject = {
          display: 'display',
          uuid: 'uuid',
          name: 'name',
          conceptNameType: 'conceptNameType'
        };
      }));


      it('should have Concept Name Model Factory defined', function() {
        expect(conceptNameModelFactory).to.exist;
      });

      it('should always create name model with all required members defined ', function() {

        var model = new conceptNameModelFactory.conceptName(conceptNameOpenmrsObject.display, conceptNameOpenmrsObject.uuid, conceptNameOpenmrsObject.name, conceptNameOpenmrsObject.conceptNameType);

        expect(model.display()).to.equal(conceptNameOpenmrsObject.display);
        expect(model.uuId()).to.equal(conceptNameOpenmrsObject.uuid);
        expect(model.name()).to.equal(conceptNameOpenmrsObject.name);
        expect(model.conceptNameType()).to.equal(conceptNameOpenmrsObject.conceptNameType);
      });

      it('should always create name model that returns a valid openmrs name payload', function() {

        var model = conceptNameModelFactory.toWrapper(conceptNameOpenmrsObject);
        expect(model.openmrsModel()).to.deep.equal(conceptNameOpenmrsObject);
      });

    });

})();
