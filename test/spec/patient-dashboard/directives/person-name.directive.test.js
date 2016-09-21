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

    describe('Manage Person Name Directive Unit Tests', function () {

        beforeEach(function () {
            debugger;
            module('ngAmrsApp');
            module('app.patientdashboard');
            module('mock.openmrsRestServices');
            module('my.templates');
        });

        var elm, element, scope, personNameResService;

        beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
            elm = angular.element(
                '<update-person-name   ' +
                'patient-uuid="patient-uuid" given-name="A" is-preferred-name="true" middle-name="M" family-name="F" preferred-name-uuid="123">' +
                '</update-person-name>');
            scope = $rootScope.$new();
            scope.patient = { uuid: 'uuid' };
            element = $compile(elm)(scope);
            scope.$digest();
            personNameResService = $injector.get('PersonNameResService');
        }));

        afterEach(function () {
            personNameResService.returnErrorOnNextCall = false;
        });

        it('should have PersonNameResService defined', function () {
            expect(personNameResService).to.exist;
        });

        it('should have all the scope members defined', function () {
            var isolateScope = element.isolateScope();
            expect(isolateScope.patientUuid).to.exist;
            expect(isolateScope.givenName).to.exist;
            expect(isolateScope.middleName).to.exist;
            expect(isolateScope.familyName).to.exist;
            expect(isolateScope.isPreferredName).to.exist;
            expect(isolateScope.preferredNameUuid).to.exist;
        });
        it('should have save button', function () {
            var elm = element.find('button');
            expect(elm).to.exist;
        });
    });
})();