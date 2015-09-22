/*
jshint -W030
*/
(function () {
  'use strict';

  describe('LocationModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('models');
    });

    var locationModelFactory;
    var testLocations;
    var testLocationOpenmrsObject;

    beforeEach(inject(function ($injector) {
      locationModelFactory = $injector.get('LocationModel');
    }));

    beforeEach(inject(function () {

      testLocations = [{name: '_name',
                      description: '_description',
                      address1: '_address1',
                      address2: '_address2',
                      cityVillage: '_cityVillage',
                      stateProvince: '_stateProvince',
                      country: '_country',
                      postalCode: '_postalCode',
                      latitude: '_latitude',
                      longitude: '_longitude',
                      address3: '_address3',
                      address4: '_address4',
                      address5: '_address5',
                      address6: '_address6',
                      tags: '_tags',
                      parentLocation: undefined,
                      childLocations: [],
                      attributes: '_attributes'}, 
                      
                      {name: '_name2',
                      description: '_description2',
                      address1: '_address12',
                      address2: '_address22',
                      cityVillage: '_cityVillage2',
                      stateProvince: '_stateProvince2',
                      country: '_country2',
                      postalCode: '_postalCode2',
                      latitude: '_latitude2',
                      longitude: '_longitude2',
                      address3: '_address32',
                      address4: '_address42',
                      address5: '_address52',
                      address6: '_address62',
                      tags: '_tags2',
                      parentLocation:undefined,
                      childLocations: [],
                      attributes: '_attributes2'}];


      testLocationOpenmrsObject = {name: '_name',
                      description: '_description',
                      address1: '_address1',
                      address2: '_address2',
                      cityVillage: '_cityVillage',
                      stateProvince: '_stateProvince',
                      country: '_country',
                      postalCode: '_postalCode',
                      latitude: '_latitude',
                      longitude: '_longitude',
                      address3: '_address3',
                      address4: '_address4',
                      address5: '_address5',
                      address6: '_address6',
                      tags: '_tags',
                      parentLocation: testLocations[0],
                      childLocations: testLocations,
                      attributes: '_attributes'};
    }));
    it('should have Location Model Factory defined', function () {
      expect(locationModelFactory).to.exist;
    });

    it('should always create location model with all required members defined ', function () {
      var model = new locationModelFactory.toWrapper(testLocationOpenmrsObject);

      expect(model.uuId).to.exist;
      expect(model.name).to.exist;
      expect(model.description).to.exist;
      expect(model.address1).to.exist;
      expect(model.address2).to.exist;
      expect(model.cityVillage).to.exist;
      expect(model.stateProvince).to.exist;
      expect(model.country).to.exist;
      expect(model.postalCode).to.exist;
      expect(model.latitude).to.exist;
      expect(model.longitude).to.exist;
      expect(model.address3).to.exist;
      expect(model.address4).to.exist;
      expect(model.address5).to.exist;
      expect(model.address6).to.exist;
      expect(model.tags).to.exist;
      expect(model.parentLocation).to.exist;
      expect(model.childLocations).to.exist;
      expect(model.attributes).to.exist;

      expect(model.name()).to.equal(testLocationOpenmrsObject.name);
      expect(model.description()).to.equal(testLocationOpenmrsObject.description);
      expect(model.address1()).to.equal(testLocationOpenmrsObject.address1);
      expect(model.address2()).to.equal(testLocationOpenmrsObject.address2);
      expect(model.cityVillage()).to.equal(testLocationOpenmrsObject.cityVillage);
      expect(model.stateProvince()).to.equal(testLocationOpenmrsObject.stateProvince);
      expect(model.country()).to.equal(testLocationOpenmrsObject.country);
      expect(model.postalCode()).to.equal(testLocationOpenmrsObject.postalCode);
      expect(model.latitude()).to.equal(testLocationOpenmrsObject.latitude);
      expect(model.longitude()).to.equal(testLocationOpenmrsObject.longitude);
      expect(model.address3()).to.equal(testLocationOpenmrsObject.address3);
      expect(model.address4()).to.equal(testLocationOpenmrsObject.address4);
      expect(model.address5()).to.equal(testLocationOpenmrsObject.address5);
      expect(model.address6()).to.equal(testLocationOpenmrsObject.address6);
      expect(model.tags()).to.equal(testLocationOpenmrsObject.tags);
      expect(model.parentLocation().openmrsModel()).to.deep.equal(testLocationOpenmrsObject.parentLocation);
      expect(model.attributes()).to.equal(testLocationOpenmrsObject.attributes);
      
    });

    it('should always create location model that returns a valid openmrs location payload', function () {
      
      var model = locationModelFactory.toWrapper(testLocationOpenmrsObject);
      expect(model.openmrsModel()).to.deep.equal(testLocationOpenmrsObject);
    });

    it('should always have toWrapperArray create an array of location models that returns a valid openmrs location array payload', function () {


      var models = locationModelFactory.toArrayOfWrappers(testLocations);

      for (var i = 0; i++; i < models.length) {
        expect(models[i].openmrsModel()).to.deep.equal(testLocations[i]);
      }

    });

    it('should always have fromArrayOfWrappers return an array of location models that are valid openmrs location payload', function () {

      var models = locationModelFactory.toArrayOfWrappers(testLocations);

      var unwrappedModels = locationModelFactory.fromArrayOfWrappers(models);

      for (var i = 0; i++; i < unwrappedModels.length) {
        expect(unwrappedModels[i]).to.deep.equal(testLocations[i]);
      }

    });

  });

})();
