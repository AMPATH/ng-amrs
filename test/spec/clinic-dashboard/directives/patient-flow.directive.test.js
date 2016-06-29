/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function () {
    'use strict';

    describe('Patient Flow Directive Unit Tests', function () {

        beforeEach(function () {
            //debugger;
            module('ngAmrsApp');
            module('app.clinicDashboard');
            module('app.etlRestServices');
            module('my.templates');
        });

        var elm, element, scope, etlRestService;
        var patientFlowStub, returnErrorOnNextCall = false;

        beforeEach(inject(function ($injector) {
            etlRestService = $injector.get('EtlRestService');

            //default stub
            patientFlowStub = sinon.stub(etlRestService, 'getPatientFlowData',
                function (location, date, success, error) {

                    if (!returnErrorOnNextCall) {
                        if (typeof success === 'function')
                            success({ result: [{}, {}, {}] });
                    } else {
                        if (typeof error === 'function')
                            error('error');
                    }
                });
        }));

        beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
            elm = angular.element(
                '<patient-flow  location-uuid="{{location.uuid}}">' +
                '</patient-flow>');
            scope = $rootScope.$new();
            scope.location = { uuid: 'uuid' };
            element = $compile(elm)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            patientFlowStub.restore();
        })

        it('should have etlRestService injected', function () {
            expect(etlRestService).to.exist;
        });

        it('should trigger loadPatientFlowInformation function when location changes',
            function () {
                var isolateScope = scope.$$childHead;
                var patientFlowSpy = sinon.spy(isolateScope, 'loadPatientFlowInformation');

                scope.location.uuid = 'changed uuid';
                scope.$digest();
                chai.expect(patientFlowSpy.callCount).to.equal(1);
            });

        it('should trigger loadPatientFlowInformation function when selected date changes',
            function () {
               var isolateScope = scope.$$childHead;
                var patientFlowSpy = sinon.spy(isolateScope, 'loadPatientFlowInformation');

                isolateScope.selectedDate(new Date(2014, 1, 1));
                expect(patientFlowSpy.callCount === 1).to.be.true;
            });

        it('should load patient info status when loadPatientFlowInformation is triggered',
            function () {
                //CASE: All required 'input' variables correct
                //i.e location and dates are selected
                //by default they have values

                var isolateScope = scope.$$childHead;

                isolateScope.loadPatientFlowInformation();
                expect(isolateScope.patientStatuses.length === 3).to.be.true;

            });

        it('should set properties before loadPatientFlowInformation is triggered',
            function () {
                var isolateScope = scope.$$childHead;
                isolateScope.patientStatuses = [{}, {}];
                isolateScope.experiencedLoadingErrors = true;
                scope.$digest();

                patientFlowStub.restore();
                patientFlowStub = sinon.stub(etlRestService, 'getPatientFlowData',
                    function (location, date, success, error) {
                        expect(isolateScope.patientStatuses.length === 0).to.be.true;
                        expect(isolateScope.experiencedLoadingErrors).to.be.false;
                    });
                isolateScope.loadPatientFlowInformation();
            });


        it('should show loading indicator when loading patient information',
            function () {
                var isolateScope = scope.$$childHead;
                isolateScope.isBusy = false;
                scope.$digest();

                patientFlowStub.restore();
                patientFlowStub = sinon.stub(etlRestService, 'getPatientFlowData',
                    function (location, date, success, error) {
                        expect(isolateScope.isBusy).to.be.true;
                    });
                isolateScope.loadPatientFlowInformation();
            });

        it('should not trigger loading of patient flow info when another request is in progress',
            function () {
                var isolateScope = scope.$$childHead;
                patientFlowStub.restore();

                var patientFlowSpy = sinon.spy(etlRestService, 'getPatientFlowData');

                //simulate another load in progress
                isolateScope.isBusy = true;

                isolateScope.loadPatientFlowInformation();

                expect(patientFlowSpy.callCount === 0).to.be.true;
            });

        it('should be in the correct request-tracking state' +
            ' when finished loading patient flow information successfully',
            function () {
                var isolateScope = scope.$$childHead;

                returnErrorOnNextCall = false;

                isolateScope.loadPatientFlowInformation();

                //expected that there is no error when loading
                expect(isolateScope.experiencedLoadingErrors).to.be.false;

                //any busy indication ui is hiddened or turned off
                expect(isolateScope.isBusy).to.be.false;
            });

        it('should be in the correct request-tracking state' +
            ' when finished loading patient flow information unsuccessfully',
            function () {
                var isolateScope = scope.$$childHead;

                returnErrorOnNextCall = true;

                isolateScope.loadPatientFlowInformation();

                //STATE 1: Expected that there is no error when loading
                expect(isolateScope.experiencedLoadingErrors).to.be.true;

                //STATE 2: Any busy indication ui is hiddened or turned off
                expect(isolateScope.isBusy).to.be.false;

                //STATE 3: No results are displayed
                expect(isolateScope.patientStatuses.length === 0).to.be.true;
            });
    });
})();