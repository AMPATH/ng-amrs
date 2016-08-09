/*
 jshint -W098, -W117, -W030
 */
(function() {
  'use strict';
  describe('Controller: LabOrderSearchCtrl ', function(){
    var controller;
    var scope;

    var openmrsRestService;
    var etlRestService;
    var labOrderSearchService;
    var patientModel;
    var hivSummaryModel;
    var compile;

    beforeEach(function(){
      module('ngAmrsApp');
      module('app.openmrsRestServices');
      module('app.etlRestServices');
      module('app.labordersearch');
      module('mock.data');
    });

    beforeEach(inject(function($controller, $injector, $rootScope, OpenmrsRestService, EtlRestService, LabOrderSearchService, PatientModel, HivSummaryModel) {
      //Injecting required dependencies
      scope =   $rootScope.$new();
      openmrsRestService = $injector.get('OpenmrsRestService');
      etlRestService = $injector.get('EtlRestService');
      labOrderSearchService = $injector.get('LabOrderSearchService');
      patientModel = $injector.get('PatientModel');
      hivSummaryModel = $injector.get('HivSummaryModel');
      compile = $injector.get('$compile');

      controller =$controller('LabOrderSearchCtrl', {
        $rootScope:$rootScope,
        $scope:scope,
        OpenmrsRestService:openmrsRestService,
        EtlRestService: etlRestService,
        LabOrderSearchService: labOrderSearchService,
        PatientModel: patientModel,
        HivSummaryModel: hivSummaryModel,
        compile: compile
      });
    }));

    //$rootScope, $scope, OpenmrsRestService, EtlRestService, LabOrderSearchService, PatientModel, HivSummaryModel, $element, $compile

      it('LabOrderSearchCtrl controller should be created successfully', function() {
        expect(controller).to.exist;
      });

      it('should ensure main functions needed for the controlller exists', function(){
        expect(scope.fetchHivSummary).to.exist;
        expect(scope.searchLabOrders).to.exist;
        expect(scope.submitForm).to.exist;
        expect(scope.showResult).to.exist;
        expect(scope.onLoadStart).to.exist;
        expect(scope.onLoadComplete).to.exist;
        expect(scope.reset).to.exist;
      });

      it('should ensure main variabled needed for the controller exists', function() {

        expect(scope.showSearchButton).to.exist;
        expect(scope.showResetButton).to.exist;
        expect(scope.isLoading).to.exist;
        expect(scope.isFormInvalid).to.exist;
      });

      it('should ensure that variable have the right values when reset method is fired', function(){
        scope.reset();
        expect(scope.showSearchButton).to.be.true;
        expect(scope.showResetButton).to.be.false;
        expect(scope.isLoading).to.be.false;
        expect(scope.isFormInvalid).to.be.false;
        expect(scope.orderID).to.be.empty;
      });

      it('should ensure that variable have the right values when onLoadStart method is fired', function(){
        scope.onLoadStart();
        expect(scope.showSearchButton).to.be.false;
        expect(scope.showResetButton).to.be.false;
        expect(scope.isLoading).to.be.true;
        expect(scope.isFormInvalid).to.be.false;
        expect(scope.showNoResult).to.be.false;
      });

      it('should ensure that variable have the right values when onLoadComplete method is fired', function(){
        scope.onLoadComplete();
        expect(scope.showSearchButton).to.be.true;
        expect(scope.showResetButton).to.be.true;
        expect(scope.isLoading).to.be.false;
      });
    });
})();
