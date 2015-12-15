/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';

  describe('Vitals Directive Unit Tests', function () {

    beforeEach(function () {
      //debugger;
      module('ngAmrsApp');
      module('app.patientdashboard');
      module('mock.etlRestServices');
      module('my.templates');
    });

    var elm, element, scope, etlRestServiceMock;

    beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
      elm = angular.element(
        '<vitals patient-uuid="{{patient.uuid}}">' +
        '</vitals>');
      scope = $rootScope.$new();
      scope.patient = { uuid: 'uuid' };
      element = $compile(elm)(scope);
      scope.$digest();
      etlRestServiceMock = element.isolateScope().injectedEtlRestService;
    }));

    it('should have EtlRestServiceMock defined', function () {
      expect(etlRestServiceMock).to.exist;
    });

    it('should create load more button', function () {
      //console.log(elm.find('btn btn-info'));
      var button = elm.find('btn btn-info');

      expect(button).to.exist;
    });

    it('should load the first set of vitals when patient uuid changes', function () {
      //the describe block sets the uuid = 'uuid'. that triggers load from the directive
      //the default items to fetch from the mocked etl service is 40, so we expect the first 10(or page size) mock vitals returned
      //this means that our directive fetched and bound it correctly
      var currentLength = element.isolateScope().encounters.length;

      expect(currentLength).to.not.equal(0);
    });

    it('should fetch and bind more vital records on clicking load more button', function () {
      //set items in backend to 70, being an abitrary number
      etlRestServiceMock.numberOfVitalsToReturn = 70;

      //console.log(element.isolateScope().encounters);

      var currentLength = element.isolateScope().encounters.length;
      console.log('initial length:' + currentLength);
      element.isolateScope().loadMoreVitals();

      //digest the scope to reflect changes
      scope.$digest();

      var lengthAfterLoad = element.isolateScope().encounters.length;
      console.log('length after load:' + lengthAfterLoad);
      expect(currentLength).to.not.equal(lengthAfterLoad);


    });
    it('should set allDataLoaded to true when all vitals have been loaded', function () {
      //there are 40 vital records by default with a page size of 10
      element.isolateScope().loadMoreVitals();
      element.isolateScope().loadMoreVitals();
      element.isolateScope().loadMoreVitals();
      element.isolateScope().loadMoreVitals();


      //digest the scope to reflect changes
      scope.$digest();

      var allDataLoaded = element.isolateScope().allDataLoaded;
      console.log('Fetched all records:' + allDataLoaded);
      expect(allDataLoaded).to.equal(true);


    });

  });
})();
