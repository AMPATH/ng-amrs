/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Drug Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });

    var callbacks;
    var httpBackend;
    var drugService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      drugService = $injector.get('DrugResService');
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
    });

    it('should have drug service defined', function () {
      expect(drugService).to.exist;
    });

    it('should make an api call with right url when getDrugByUuid is invoked', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug/passed-uuid?v=custom:(uuid,name,concept)').respond({});
      drugService.getDrugByUuid('passed-uuid',function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback when getDrugByUuid request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug/passed-uuid?v=custom:(uuid,name,concept)').respond({});
      drugService.getDrugByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when getDrugByUuid request is not successfull', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug/passed-uuid?v=custom:(uuid,name,concept)').respond(500);
      drugService.getDrugByUuid('passed-uuid',callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });

    it('should make an api call to the drug resource with right url when getDrugByUuid is invoked with a uuid', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug/passed-uuid?v=custom:(uuid,name,concept)').respond({});
      drugService.getDrugByUuid('passed-uuid', function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback findDrugs request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug?q=&v=custom:(uuid,name,concept)&search=search-text').respond({});
      drugService.findDrugs('search-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call the onFailed callback when findDrugs request is not successful', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'drug?q=&v=custom:(uuid,name,concept)&search=search-text').respond(500);
      drugService.findDrugs('search-text', callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
      expect(callbacks.message).to.exist;
      expect(callbacks.message.trim()).not.to.equal('');
    });


  });
})();
