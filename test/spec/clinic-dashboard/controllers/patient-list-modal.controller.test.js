/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
	'use strict';
	describe('Patient List Modal Controller Unit Tests', function () {

    var controller;
    var scope;
    var modalInstance;
    var loading;
    var etlRestService;
    var timeout;
    var data;
		beforeEach(function () {
			//debugger;
			module('ngAmrsApp');
			module('app.clinicDashboard');
      module('ui.bootstrap');
			module('mock.etlRestServices');
			module('my.templates');
      module('openmrs-ngresource.restServices');
		});

    beforeEach(inject(function($rootScope, EtlRestService, $controller, $injector, _$modal_){
      //Injecting required dependencies
      scope =   $rootScope.$new();
      etlRestService = $injector.get('EtlRestService');
      loading=$injector.get('$loading');
      timeout=$injector.get('$timeout');
      modalInstance = _$modal_.open({
        templateUrl: 'views/modalView.html'
      });
      data={
        "selectedPoint": {
          "id": "patients_continuing_care",
            "value": 95,
            "ratio": 0.6785714,
            "index": 0,
            "name": "Patients In Care"
        },
        "chartObject": {
          "reportName": "clinical-patient-care-status-overview-report",
            "chartDefinition": [
            {
              "indicator": "patients_continuing_care",
              "chartType": "pie",
              "name": "Patients In Care"
            },
            {
              "indicator": "transferred_out_patients",
              "chartType": "pie",
              "name": "Transferred Out Patients"
            },
            {
              "indicator": "deceased_patients",
              "chartType": "pie",
              "name": "Deceased Patients"
            },
            {
              "indicator": "untraceable_patients",
              "chartType": "pie",
              "name": "Untraceable Patients"
            },
            {
              "indicator": "hiv_negative_patients",
              "chartType": "pie",
              "name": "HIV Negative Patients"
            },
            {
              "indicator": "self_disengaged_from_care",
              "chartType": "pie",
              "name": "Self Disengaged From Care"
            },
            {
              "indicator": "defaulters",
              "chartType": "pie",
              "name": "Defaulters"
            },
            {
              "indicator": "other_patient_care_status",
              "chartType": "pie",
              "name": "Others"
            }
          ],
            "groupBy": "",
            "isBusy": false,
            "hasLoadingError": false,
            "resultIsEmpty": false,
            "chart": {
            "xAxis": {
              "id": ""
            },
            "yAxis": "",
              "y2Axis": "",
              "min": 0,
              "max": 95,
              "dataPoints": [
              {
                "patients_continuing_care": "95.0",
                "transferred_out_patients": "0.0",
                "deceased_patients": "0.0",
                "untraceable_patients": "0.0",
                "hiv_negative_patients": "1.0",
                "self_disengaged_from_care": "0.0",
                "defaulters": "44.0",
                "other_patient_care_status": "0.0"
              }
            ],
              "dataColumns": [
              {
                "id": "patients_continuing_care",
                "type": "pie",
                "name": "Patients In Care"
              },
              {
                "id": "transferred_out_patients",
                "type": "pie",
                "name": "Transferred Out Patients"
              },
              {
                "id": "deceased_patients",
                "type": "pie",
                "name": "Deceased Patients"
              },
              {
                "id": "untraceable_patients",
                "type": "pie",
                "name": "Untraceable Patients"
              },
              {
                "id": "hiv_negative_patients",
                "type": "pie",
                "name": "HIV Negative Patients"
              },
              {
                "id": "self_disengaged_from_care",
                "type": "pie",
                "name": "Self Disengaged From Care"
              },
              {
                "id": "defaulters",
                "type": "pie",
                "name": "Defaulters"
              },
              {
                "id": "other_patient_care_status",
                "type": "pie",
                "name": "Others"
              }
            ]
          },
          "startDate": "2015-04-21T07:00:45.781Z",
            "endDate": "2016-04-21T07:00:45.781Z",
            "selectedLocations": "2b0419c2-275f-4354-8b49-4c97d033ecbb"
        }
      };
     // modalInstance=$injector.get('$modalInstance');
      controller =$controller('PatientListModalCtrl', {
        $rootScope:scope,
        $scope:scope,
        EtlRestService:etlRestService,
        data:data,
        $loading:loading,
        $timeout:timeout,
        $modalInstance:modalInstance

      });
    }));

    it('PatientListModalCtrl controller should exist', function () {
      expect(controller).to.exist;

    });

    it('PatientListModalCtrl controller should have all Injected Services', function () {
      //ensure that mock services are injected
      expect(etlRestService.isMockService).to.equal(true);
    });

    it('should have required public members exposed on the scope on load', function () {

			expect(scope.patients).to.exist;
			expect(scope.isBusy).to.exist;
			expect(scope.experiencedLoadingErrors).to.exist;
			expect(scope.loadPatientList).to.exist;
      expect(scope.startDate).to.exist;
      expect(scope.endDate).to.exist;
      expect(scope.locationUuid).to.exist;
      expect(scope.indicator).to.exist;
      expect(scope.indicatorName).to.exist;
      expect(scope.totalCount).to.exist;
      expect(scope.reportName).to.exist;
		});

		it('should set experiencedLoadingErrors to false when loadPatientList is called', function () {
        scope.experiencedLoadingErrors = true;
			  etlRestService.returnErrorOnNextCall = false;
        scope.loadPatientList();
			  expect(scope.experiencedLoadingErrors).to.equal(false);
		});

		it('should call getPatientListReportByIndicatorAndLocation etl service method when loadPatientList is invoked',
      function () {
			var getPatientsSpy = sinon.spy(etlRestService, 'getPatientListReportByIndicatorAndLocation');
			scope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(1);
		});

		it('should not call getPatientListReportByIndicatorAndLocation when another request is in progress when ' +
      'loadPatientList is called', function () {
			var getPatientsSpy = sinon.spy(etlRestService, 'getPatientListReportByIndicatorAndLocation');
			scope.isBusy = true;
			scope.loadPatientList();
			chai.expect(getPatientsSpy.callCount).to.equal(0);
		});

    it('should not call getPatientListReportByIndicatorAndLocation when loadPatientList is called and indicator not' +
      ' supplied or empty', function () {
      var getPatientsSpy = sinon.spy(etlRestService, 'getPatientListReportByIndicatorAndLocation');

      //case undefined
      scope.indicator = undefined;
      scope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);

      //case empty
      scope.indicator = '';
      scope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);
    });

    it('should not call getPatientListReportByIndicatorAndLocation when loadPatientList is called and startDate not' +
      ' supplied or empty', function () {
      var getPatientsSpy = sinon.spy(etlRestService, 'getPatientListReportByIndicatorAndLocation');

      //case undefined
      scope.startDate= undefined;
      scope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);

      //case empty
      scope.startDate = '';
      scope.loadPatientList();
      chai.expect(getPatientsSpy.callCount).to.equal(0);
    });

		it('should set isBusy to false when loadPatientList is invoked, and callbacks return',
      function () {

			//case when no error occurs during call
			etlRestService.returnErrorOnNextCall = false;
			scope.loadPatientList();
			expect(scope.isBusy).to.equal(false);

			//case when no error occurs during call
			etlRestService.returnErrorOnNextCall = true;
			scope.loadPatientList();
			expect(scope.isBusy).to.equal(false);
		});

		it('should set experiencedLoadingErrors to true when loadPatientList is invoked, and callback returns error',
      function () {

			//case when no error occurs during call
			etlRestService.returnErrorOnNextCall = true;
			scope.loadPatientList();
			expect(scope.experiencedLoadingErrors).to.equal(true);
		});

		it('should set scope.patients with the returned patients when loadPatientList is invoked, ' +
      'and callback returns success', function () {

			etlRestService.returnErrorOnNextCall = false;
			etlRestService.numberOfPatientsToReturn = 20;
			scope.patients = [];
			scope.loadPatientList();
			expect(scope.patients.length).to.equal(20);

			//another test
			etlRestService.numberOfPatientsToReturn = 40;
			scope.patients = [];
			scope.loadPatientList();
			expect(scope.patients.length).to.equal(40);
		});
	});
})();
