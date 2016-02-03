/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
  'use strict';
  describe('Controller: PatientRegisterCtrl ', function () {
    var controller;
    var scope;
    var filterFilter;
    var state;
    var openmrsRestService;
    var log;
    var EtlRestServices;
    var moments;

    beforeEach(function () {
      module('ngAmrsApp');
      module('app.openmrsRestServices');
      module('app.admin');
      //module('mock.etlRestServices');
      module('mock.data');
    });

    beforeEach(inject(function ($controller, $injector, $rootScope, OpenmrsRestService, EtlRestService, moment) {
      //Injecting required dependencies
      scope = $rootScope.$new();
      state = $injector.get('$state');
      EtlRestServices = $injector.get('EtlRestService');
      openmrsRestService = $injector.get('OpenmrsRestService');
      moments = $injector.get('moment');
      log = $injector.get('$log');
      filterFilter = $injector.get('filterFilter');
      controller = $controller('PatientRegisterCtrl', {
        $rootScope: scope,
        $scope: scope,
        EtlRestService: EtlRestServices,
        OpenmrsRestService: openmrsRestService,
        moment: moments,
        $log: log,
        filterFilter: filterFilter,
        $state: state
      });
    }));

    afterEach(function () {
      EtlRestServices.returnErrorOnNextCall = false;
    });

    it('PatientRegisterCtrl controller should be created successfully', function () {
      expect(controller).to.exist;
    });

    it('should ensure main variables needed for the controller exists and they have correct data types', function () {
      expect(scope.reportName).to.exist;
      expect(scope.isBusy).to.exist;
      expect(scope.experiencedLoadingError).to.exist;
      expect(scope.currentPage).to.exist;
      expect(scope.countBy).to.exist;
      expect(scope.groupBy).to.exist;

      //Make sure data types are enforced
      expect(scope.reportName).to.be.an('string');
      expect(scope.isBusy).to.be.an('boolean');
      expect(scope.experiencedLoadingError).to.be.an('boolean');
      expect(scope.currentPage).to.be.an('number');
      expect(scope.countBy).to.be.an('string');
      expect(scope.groupBy).to.be.an('string');

    });

    it('should ensure main variables needed for the data table exists and they have correct data types', function () {
      expect(scope.bsTableControl).to.exist;
      expect(scope.columns).to.exist;
      expect(scope.exportList).to.exist;
      expect(scope.exportDataType).to.exist;
      //Make sure data types are enforced
      expect(scope.bsTableControl).to.be.an('object');
      expect(scope.columns).to.be.an('array');
      expect(scope.exportList).to.be.an('array');
      expect(scope.exportDataType).to.be.an('object');
    });

    it('should Filter variables needed for the report generation exists and they have correct data types', function () {
      expect(scope.startDate).to.exist;
      expect(scope.endDate).to.exist;
      //Make sure data types are enforced
      expect(scope.startDate).to.be.an('date');
      expect(scope.endDate).to.be.an('date');
    });

    it('should ensure loadIndicators method is defined and it is a function', function () {
      expect(scope.loadIndicators).to.exist;
      expect(scope.loadIndicators).to.be.an('function');
    });

    it('should ensure setCountType method is defined and it is a function', function () {
      expect(scope.setCountType).to.exist;
      expect(scope.setCountType).to.be.an('function');
    });

    it('should ensure updateSelectedType method is defined and it is a function', function () {
      expect(scope.updateSelectedType).to.exist;
      expect(scope.updateSelectedType).to.be.an('function');
    });

    it('should ensure getIndicatorLabelByName method is defined', function () {
      expect(scope.getIndicatorLabelByName).to.exist;
      expect(scope.getIndicatorLabelByName).to.be.an('function');
    });
    it('should ensure main variables needed for the controller exists and is initialised', function () {
      expect(scope.isBusy).to.be.equal(true);
      expect(scope.currentPage).to.be.equal(1);
      expect(scope.groupBy).to.be.equal('groupByEncounter');
      expect(scope.reportName).to.be.equal('patient-register-report');
      expect(scope.countBy).to.be.equal('num_persons');
    });
  });
})();
