/*
jshint -W030
*/
(function() {
  'use strict';

  describe('ConceptClassModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('models');
      });

      var conceptClassModelFactory;
      
      var conceptClassOpenmrsObject;

      beforeEach(inject(function($injector) {
        conceptClassModelFactory = $injector.get('ConceptClassModel');
      }));
      
      beforeEach(inject(function() {
        conceptClassOpenmrsObject = {
          display: 'display',
          uuid: 'uuid',
          name: 'name',
          description: 'description',
          retired:false
        };
      }));


      it('should have Concept Class Model Factory defined', function() {
        expect(conceptClassModelFactory).to.exist;
      });

      it('should always create concept class model with all required members defined ', function() {

        var model = conceptClassModelFactory.toWrapper(conceptClassOpenmrsObject);

        expect(model.display()).to.equal(conceptClassOpenmrsObject.display);
        expect(model.uuId()).to.equal(conceptClassOpenmrsObject.uuid);
        expect(model.name()).to.equal(conceptClassOpenmrsObject.name);
        expect(model.description()).to.equal(conceptClassOpenmrsObject.description);
        expect(model.retired()).to.equal(conceptClassOpenmrsObject.retired);
      });

      it('should always create concept class model that returns a valid openmrs concept class payload', function() {

        var model = conceptClassModelFactory.toWrapper(conceptClassOpenmrsObject);
        expect(model.openmrsModel()).to.deep.equal(conceptClassOpenmrsObject);
      });

    });

})();
