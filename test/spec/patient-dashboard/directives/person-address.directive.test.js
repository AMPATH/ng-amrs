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

    describe('Manage Person Address Directive Unit Tests', function () {

        beforeEach(function () {
            //debugger;
            module('ngAmrsApp');
            module('app.patientdashboard');
            module('mock.openmrsRestServices');
            module('my.templates');
        });

        var elm, element, scope, personAddressResService;

        beforeEach(inject(function ($injector, $rootScope, $compile, $httpBackend) {
            elm = angular.element(
                '<update-person-address patient-uuid="person-uuid"  address1="1" ' +
                ' address2="2" address3="3"  city-village="4"  state-province="5" ' +
                'preferred-address-uuid="uuid" preferred="true"></update-person-address>');
            scope = $rootScope.$new();
            scope.patient = { uuid: 'uuid' };
            element = $compile(elm)(scope);
            scope.$digest();
            personAddressResService = $injector.get('PersonAddressResService');
        }));

        afterEach(function () {
            personAddressResService.returnErrorOnNextCall = false;
        });

        it('should have PersonAddressResService defined', function () {
            expect(personAddressResService).to.exist;
        });

        it('should have all the scope members defined', function () {
            var isolateScope = element.isolateScope();
            expect(isolateScope.patientUuid).to.exist;
            expect(isolateScope.address1).to.exist;
            expect(isolateScope.address2).to.exist;
            expect(isolateScope.address3).to.exist;
            expect(isolateScope.cityVillage).to.exist;
            expect(isolateScope.stateProvince).to.exist;
            expect(isolateScope.preferredAddressUuid).to.exist;
            expect(isolateScope.preferred).to.exist;

        });
        it('should have save button', function () {
            var elm = element.find('button');
            expect(elm).to.exist;
        });
    });
})();