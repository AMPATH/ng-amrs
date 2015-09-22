/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Concept Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });

    var callbacks;

    var httpBackend;
    var conceptService;
    var settingsService;

    var testConcepts = [
      {
        name: undefined,
        uuid: '_uuId',
        conceptClass: {
          display: 'display',
          uuid: 'uuid',
          name: 'name',
          description: 'description',
          retired: false
        }
      },
      {
        name: undefined,
        uuid: '_uuId',
        conceptClass: {
          display: 'display',
          uuid: 'uuid1',
          name: 'name1',
          description: 'description',
          retired: false
        }
      },
      {
        name: undefined,
        uuid: '_uuId',
        conceptClass: {
          display: 'display',
          uuid: 'uuid1',
          name: 'name1',
          description: 'description',
          retired: false
        }
      },
      {
        name: undefined,
        uuid: '_uuId',
        conceptClass: {
          display: 'display',
          uuid: 'uuid2',
          name: 'name2',
          description: 'description',
          retired: false
        }
      },
      {
        name: undefined,
        uuid: '_uuId',
        conceptClass: {
          display: 'display',
          uuid: 'uuid2',
          name: 'name2',
          description: 'description',
          retired: false
        }
      }
    ];

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      conceptService = $injector.get('ConceptResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));

    beforeEach(inject(function () {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function () {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function (message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };
    }));

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();

      // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
    });

    it('should have concept service defined', function () {
      expect(conceptService).to.exist;
    });

    it('should make an api call to the concept class resource with right url when getConceptClasses is invoked', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'conceptclass?v=default').respond({});
      conceptService.getConceptClasses(function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getConceptClasses request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'conceptclass?v=default').respond({});
      conceptService.getConceptClasses(callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getConceptClasses request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'conceptclass?v=default').respond(500);
      conceptService.getConceptClasses(callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the concept resource with right url when getConceptByUuid is invoked with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept/passed-uuid?v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.getConceptByUuid('passed-uuid', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getConceptByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept/passed-uuid?v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.getConceptByUuid('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getConceptByUuid request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept/passed-uuid?v=custom:(uuid,name,conceptClass)').respond(500);
      conceptService.getConceptByUuid('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the concept resource with right url when findConcept is invoked with a search text and non-empty array of conceptClassUuids', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.findConcept('search-text', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback findConcept request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.findConcept('search-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findConcept request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond(500);
      conceptService.findConcept('search-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the concept resource with right url when findConceptByConceptClassesUuid is invoked with a search text an of conceptClassUuids', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.findConceptByConceptClassesUuid('search-text', [], function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback findConceptByConceptClassesUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond({});
      conceptService.findConceptByConceptClassesUuid('search-text', [], callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findConceptByConceptClassesUuid request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'concept?q=search-text&v=custom:(uuid,name,conceptClass)').respond(500);
      conceptService.findConceptByConceptClassesUuid('search-text', [], callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should filter by ConceptClassesUuid when filterResultsByConceptClassesUuid is invoked with (results, conceptClassesUuidArray)', function () {
      var expectedFilterResults = [
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid',
            name: 'name',
            description: 'description',
            retired: false
          }
        }
      ];

      var filteredResults = conceptService.filterResultsByConceptClassesUuid(testConcepts, ['uuid']);

      expect(filteredResults).to.deep.equal(expectedFilterResults);

      expectedFilterResults = [
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid',
            name: 'name',
            description: 'description',
            retired: false
          }
        },
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid1',
            name: 'name1',
            description: 'description',
            retired: false
          }
        },
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid1',
            name: 'name1',
            description: 'description',
            retired: false
          }
        }
      ];

      filteredResults = conceptService.filterResultsByConceptClassesUuid(testConcepts, ['uuid', 'uuid1']);

      expect(filteredResults).to.deep.equal(expectedFilterResults);

      filteredResults = conceptService.filterResultsByConceptClassesUuid(testConcepts, []);

      expect(filteredResults).to.deep.equal([]);

    });

    it('should filter by ConceptClassesName when filterResultsByConceptClassesNames is invoked with (results, conceptClassesNamesArray)', function () {
      var expectedFilterResults = [
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid',
            name: 'name',
            description: 'description',
            retired: false
          }
        }
      ];

      var filteredResults = conceptService.filterResultsByConceptClassesName(testConcepts, ['name']);

      expect(filteredResults).to.deep.equal(expectedFilterResults);

      expectedFilterResults = [
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid',
            name: 'name',
            description: 'description',
            retired: false
          }
        },
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid1',
            name: 'name1',
            description: 'description',
            retired: false
          }
        },
        {
          name: undefined,
          uuid: '_uuId',
          conceptClass: {
            display: 'display',
            uuid: 'uuid1',
            name: 'name1',
            description: 'description',
            retired: false
          }
        }
      ];

      filteredResults = conceptService.filterResultsByConceptClassesName(testConcepts, ['name', 'name1']);

      expect(filteredResults).to.deep.equal(expectedFilterResults);

      filteredResults = conceptService.filterResultsByConceptClassesName(testConcepts, []);

      expect(filteredResults).to.deep.equal([]);

    });

  });
})();
