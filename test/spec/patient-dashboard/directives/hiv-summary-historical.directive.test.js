/* global sinon */
/* global afterEach */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';

  describe('Hiv Summary Historical Directive Unit Tests', function () {

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
        '<hiv-summary-historical patient-uuid="{{patient.uuid}}">' +
        '</hiv-summary-historical>');
      scope = $rootScope.$new();
      scope.patient = { uuid: 'uuid' };
      element = $compile(elm)(scope);
      scope.$digest();
      etlRestServiceMock = $injector.get('EtlRestService');
    }));

    afterEach(function () {
      etlRestServiceMock.returnErrorOnNextCall = false;
    });

    it('should have EtlRestServiceMock defined', function () {
      expect(etlRestServiceMock).to.exist;
      expect(etlRestServiceMock.isMockService).to.equal(true);
    });

    it('should have all the scope members defined', function () {
      var isolateScope = element.isolateScope();

      expect(isolateScope.hivSummaries).to.exist;
      expect(isolateScope.patientUuid).to.exist;
      expect(isolateScope.isBusy).to.exist;
      expect(isolateScope.experiencedLoadingErrors).to.exist;
      expect(isolateScope.loadHistoricalHivSummary).to.exist;
      expect(isolateScope.nextStartIndex).to.exist;
      expect(isolateScope.pageSize).to.exist;
      expect(isolateScope.allDataLoaded).to.exist;
    });

    it('should set experiencedLoadingErrors to false when loadHistoricalHivSummary is called', function () {
      var isolateScope = element.isolateScope();

      isolateScope.experiencedLoadingErrors = true;
      etlRestServiceMock.returnErrorOnNextCall = false;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.experiencedLoadingErrors).to.equal(false);

    });

    it('should call getHivSummary etl service method with right params when loadHistoricalHivSummary is invoked', function () {
      var isolateScope = scope.$$childHead;
      var getHivSummarySpy = sinon.spy(etlRestServiceMock, 'getHivSummary');

      var patientUuid = isolateScope.patientUuid;

      var startIndex = isolateScope.nextStartIndex;

      var limit = isolateScope.pageSize;

      isolateScope.loadHistoricalHivSummary();

      chai.expect(getHivSummarySpy.callCount).to.equal(1);
      
      //confirming correct params passed other than callbacks
      chai.expect(getHivSummarySpy.args[0][0]).to.equal(patientUuid);
      chai.expect(getHivSummarySpy.args[0][1]).to.equal(startIndex);
      chai.expect(getHivSummarySpy.args[0][2]).to.equal(limit);

    });

    it('should not call getHivSummary when another request is in progress when loadHistoricalHivSummary is called', function () {
      var isolateScope = scope.$$childHead;
      var getHivSummarySpy = sinon.spy(etlRestServiceMock, 'getHivSummary');

      isolateScope.isBusy = true;

      isolateScope.loadHistoricalHivSummary();

      chai.expect(getHivSummarySpy.callCount).to.equal(0);

    });

    it('should not call getHivSummary when loadHistoricalHivSummary is called and location uuid not supplied or empty', function () {
      var isolateScope = scope.$$childHead;
      var getHivSummarySpy = sinon.spy(etlRestServiceMock, 'getHivSummary');
			
      //case undefined
      isolateScope.patientUuid = undefined;

      isolateScope.loadHistoricalHivSummary();

      chai.expect(getHivSummarySpy.callCount).to.equal(0);
			
      //case empty
      isolateScope.patientUuid = '';

      isolateScope.loadHistoricalHivSummary();

      chai.expect(getHivSummarySpy.callCount).to.equal(0);


    });

    it('should set isBusy to false when loadHistoricalHivSummary is invoked, and callbacks return', function () {
      var isolateScope = scope.$$childHead;
			
      //case when no error occurs during call
      etlRestServiceMock.returnErrorOnNextCall = false;
      isolateScope.loadHistoricalHivSummary();
      expect(isolateScope.isBusy).to.equal(false);
			
      //case when no error occurs during call
      etlRestServiceMock.returnErrorOnNextCall = true;
      isolateScope.loadHistoricalHivSummary();
      expect(isolateScope.isBusy).to.equal(false);

    });

    it('should set experiencedLoadingErrors to true when loadHistoricalHivSummary is invoked, and callback returns error', function () {
      var isolateScope = scope.$$childHead;
			
      //case when no error occurs during call
      etlRestServiceMock.returnErrorOnNextCall = true;
      isolateScope.loadHistoricalHivSummary();
      expect(isolateScope.experiencedLoadingErrors).to.equal(true);

    });

    it('should set scope.hivSummaries with the returned records when loadHistoricalHivSummary is invoked, and callback returns success', function () {
      var isolateScope = scope.$$childHead;

      etlRestServiceMock.returnErrorOnNextCall = false;
      etlRestServiceMock.numberOfHivSummaryRecordsToReturn = 40;

      isolateScope.hivSummaries = [];
      isolateScope.pageSize = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.hivSummaries.length).to.equal(20);

    });

    it('should increament scope.hivSummaries with the additional returned records when loadHistoricalHivSummary is invoked more than once returning success each time', function () {
      var isolateScope = scope.$$childHead;
			
      //set total records to be returned
      etlRestServiceMock.returnErrorOnNextCall = false;
      etlRestServiceMock.numberOfHivSummaryRecordsToReturn = 40;
			
      //set paging params
      isolateScope.hivSummaries = [];
      isolateScope.pageSize = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.hivSummaries.length).to.equal(20);
      
      
      //second page
      isolateScope.nextStartIndex = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.hivSummaries.length).to.equal(40);


    });

    it('should increament scope.hivSummaries with the additional returned records when loadHistoricalHivSummary is invoked more than once returning success each time', function () {
      var isolateScope = scope.$$childHead;
			
      //set total records to be returned
      etlRestServiceMock.returnErrorOnNextCall = false;
      etlRestServiceMock.numberOfHivSummaryRecordsToReturn = 40;
			
      //set paging params
      isolateScope.hivSummaries = [];
      isolateScope.pageSize = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.hivSummaries.length).to.equal(20);
      
      
      //second page
      isolateScope.nextStartIndex = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.hivSummaries.length).to.equal(40);


    });
    
    it('should increament nextStartingIndex after a sucessful fetch when loadHistoricalHivSummary is invoked', function () {
      var isolateScope = scope.$$childHead;
			
      //set total records to be returned
      etlRestServiceMock.returnErrorOnNextCall = false;
      etlRestServiceMock.numberOfHivSummaryRecordsToReturn = 40;
			
      //set paging params
      isolateScope.hivSummaries = [];
      isolateScope.pageSize = 20;

      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.nextStartIndex).to.equal(20);
      
      
      //second page
      isolateScope.loadHistoricalHivSummary();

      expect(isolateScope.nextStartIndex).to.equal(40);


    });
    
     it('should set allDataLoaded to true after all records fetched when loadHistoricalHivSummary is invoked to end of records', function () {
      var isolateScope = scope.$$childHead;
			
      //set total records to be returned
      etlRestServiceMock.returnErrorOnNextCall = false;
      etlRestServiceMock.numberOfHivSummaryRecordsToReturn = 40;
			
      //set paging params
      isolateScope.hivSummaries = [];
      isolateScope.pageSize = 20;
      isolateScope.allDataLoaded = false;

      isolateScope.loadHistoricalHivSummary();
      expect(isolateScope.allDataLoaded).to.equal(false);

      //second page
      isolateScope.loadHistoricalHivSummary();

      //last fetch
      isolateScope.loadHistoricalHivSummary();
      expect(isolateScope.allDataLoaded).to.equal(true);
      

    });




  });
})();