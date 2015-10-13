/*
 jshint -W098, -W117, -W030
 */
(function() {
  'use strict';
  describe('Controller: PatientSearchCtrl ', function(){
    var controller;
    var scope;
    var filterFilter;
    var state;
    var openmrsRestService;
    var log;

    beforeEach(function(){
      module('ngAmrsApp');
      module('app.openmrsRestServices');
      module('app.patientsearch');
      module('mock.data');
    });

    beforeEach(inject(function($controller, $injector, $rootScope, OpenmrsRestService){
      //Injecting required dependencies
      scope =   $rootScope.$new();
      state = $injector.get('$state');
      openmrsRestService = $injector.get('OpenmrsRestService');
      log=$injector.get('$log');
      filterFilter=$injector.get('filterFilter');
      controller =$controller('PatientSearchCtrl', {
        $rootScope:scope,
        OpenmrsRestService:openmrsRestService,
        $scope:scope,
        $log:log,
        filterFilter:filterFilter,
        $state:state
      });
    }));

      it('PatientSearchCtrl controller should be created successfully', function() {
        expect(controller).to.exist;
      });

      it('should ensure main variables needed for the controller exists', function(){
        expect(scope.patients).to.exist;
        expect(scope.isBusy).to.exist;
        expect(scope.noOfPages).to.exist;
        expect(scope.currentPage).to.exist;
        expect(scope.entryLimit).to.exist;
      });

      it('should ensure loadPatient method is defined', function(){
        expect(scope.loadPatient).to.exist;
      });

      it('should ensure resetFilters method is defined', function(){
        expect(scope.resetFilters).to.exist;
      });

      it('should return object when search method is fired', function(){
        var searchString='test';
        openmrsRestService.getPatientService().getPatientQuery({q:searchString},
          function(data) {
            var result=data;
            expect(result).to.be.an('object');
          });
      });

      it('should ensure main variables needed for the controller exists', function(){
        expect(scope.isBusy).to.be.equal(false);
        expect(scope.currentPage).to.be.equal(1);
        expect(scope.entryLimit).to.be.equal(10);
      });
    });
})();
