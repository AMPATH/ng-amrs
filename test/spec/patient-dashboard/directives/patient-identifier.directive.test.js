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

    describe('Manage Patient Identifier Directive Unit Tests', function () {

        beforeEach(function () {
            //debugger;
            module('ngAmrsApp');
            module('app.patientdashboard');
            module('mock.openmrsRestServices');
            module('my.templates');
        });

        var elm, element, scope, identifierResService, patientIdentifierTypeResService,
            patientIdTypeStub;
        var identifierTypes = { "results": [{ "uuid": "uuid1", "name": "KENYAN NATIONAL ID NUMBER" }, { "uuid": "uuid2", "name": "AMRS Medical Record Number" }] };

        beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
            identifierResService = $injector.get('IdentifierResService');
            patientIdentifierTypeResService = $injector.get('PatientIdentifierTypeResService');
            patientIdTypeStub = sinon.stub(patientIdentifierTypeResService,
                'getPatientIdentifierTypes',
                function (successCallback, errorCallback) {
                    successCallback(identifierTypes);
                });

            elm = angular.element(
                '<update-person-identifier patient-uuid="uuid" ' +
                'patient-identifiers="[{identifier:10203,identifierType="12"}]"></update-person-identifier>');
            scope = $rootScope.$new();
            scope.patient = { uuid: 'uuid' };
            element = $compile(elm)(scope);
            scope.$digest();

        }));

        afterEach(function () {
            patientIdTypeStub.restore();
            identifierResService.returnErrorOnNextCall = false;
        });

        it('should have all the scope members defined', function () {
            var isolateScope = element.isolateScope();
            expect(isolateScope.preferOptions).to.exist;
            expect(isolateScope.setIdentifierType).to.exist;

        });

        it('should have save button', function () {
            var elm = element.find('button');
            expect(elm).to.exist;
        });

        it('should set scope.commonIdentifierTypes with the returned identifier types when getCommonIdentifierTypes is invoked '
            , function () {
                var isolateScope = scope.$$childHead;
                isolateScope.commonIdentifierTypes = [];
                isolateScope.getCommonIdentifierTypes();
                expect(isolateScope.commonIdentifierTypes.length).to.equal(2);
            });

    });
})();