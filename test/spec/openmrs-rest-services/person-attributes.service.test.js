/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('OpenMRS Person Attributes Service unit tests', function() {
    beforeEach(function() {
      module('app.openmrsRestServices');
      module('mock.data');
      module('app.etlRestServices');
    });

    var httpBackend;
    var personAttributesService;
    var settingsService;
    var v = 'custom:(uuid,value,attributeType:(uuid,uuid))';
    var mockData;
    var locationResService;

    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      personAttributesService = $injector.get('PersonAttributesRestService');
      settingsService = $injector.get('OpenmrsSettings');
      locationResService = $injector.get('LocationResService');
      mockData = $injector.get('mockData');
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('should have person attributes service defined', function() {
      expect(personAttributesService).to.exist;
    });

    it('should have location service service defined', function() {
      expect(locationResService).to.exist;
    });

    it('should make an api call to the person attributes resource when' +
     'getPersonAttributeByUuid is called with a uuid', function() {
      var params = {uuid:'patientUuid', personattributeuuid: 'attributeuuid' };
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
      'person/attribute?v=' + v).respond(mockData.getMockPersonAttribute());
      personAttributesService.getPersonAttributeByUuid(params,
        function(data) {
          expect(data.results[0].uuid).to.equal('passed-uuid');
          expect(data.results[0].attributeType.uuid).to.equal('fb121d9dc370');
          expect(data.results[0].value.uuid).to.equal('location1-uuid');
        });

      httpBackend.flush();
    });

    it('person attribute service should have the following  methods',
    function() {
      expect(personAttributesService.voidPersonAttribute).to.be.an('function');
      expect(personAttributesService.getPersonAttributeByUuid).to.be.an('function');
      expect(personAttributesService.saveUpdatePersonAttribute).to.be.an('function');
      expect(personAttributesService.getPersonAttributeFieldValues).to.be.an('function');
      expect(personAttributesService.getPersonAttributeValue).to.be.an('function');

    });

    it('location service should have the following  methods', function() {
      expect(locationResService.getLocationByUuidFromEtl).to.be.an('function');
      expect(locationResService.getLocationByUuidFromEtl).to.be.an('function');

    });

    it('should get an attribute matching a specified key from a list of' +
    'person attributes', function() {
      var personAttributesListMock = mockData.getMockPersonAttributesArray();
      var personAttributeFieldKeyMock = 'personAttribute121_8d87236cnc2ccn11den8d13n0010c6dffd0f';
      var attribute = personAttributesService.getPersonAttributeValue(personAttributesListMock, personAttributeFieldKeyMock);
      expect(attribute[0].uuid).to.equal('f123244d-8f1d-4430-9191-98ce60f3723b');
    });

  });
})();
