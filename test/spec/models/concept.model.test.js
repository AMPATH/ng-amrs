/* global describe */
/* global it */
/* global expect */
/* global inject */
/* global beforeEach */
/*
jshint -W030
*/
(function () {
  'use strict';

  describe('ConceptModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var conceptModelFactory;

    var testConceptOpenmrsObject;

    var testConceptNameOpenmrsObject;



    beforeEach(inject(function ($injector) {
      testConceptNameOpenmrsObject = {
        display: 'display',
        uuid: 'uuid',
        name: 'name',
        conceptNameType: 'conceptNameType'
      };

      testConceptOpenmrsObject = {
        name: testConceptNameOpenmrsObject,
        uuid: '_uuId',
        conceptClass: undefined
      };

    }));

    beforeEach(inject(function ($injector) {
      conceptModelFactory = $injector.get('ConceptModel');
    }));

    it('should have Concept Model Factory defined', function () {
      expect(conceptModelFactory).to.exist;
    });

    it('should always create concept model with all required members defined ', function () {
      var model = conceptModelFactory.toWrapper(testConceptOpenmrsObject);

      expect(model.name() ? model.name().openmrsModel() : undefined).to.deep.equal(testConceptOpenmrsObject.name);
      expect(model.uuId()).to.equal(testConceptOpenmrsObject.uuid);
      expect(model.conceptClass() ? model.conceptClass().openmrsModel() : undefined).to.deep.equal(testConceptOpenmrsObject.conceptClass);
    });

    it('should always create concept model with display member being equal to name.display member', function () {
      var model = conceptModelFactory.toWrapper(testConceptOpenmrsObject);

      expect(model.name() ? model.name().display() : undefined).to.equal(model.display());
      
    });

    it('should always create concept model that returns a valid openmrs name payload', function () {
      var model = conceptModelFactory.toWrapper(testConceptOpenmrsObject);
      expect(model.openmrsModel()).to.deep.equal(testConceptOpenmrsObject);
    });


  });

})();
