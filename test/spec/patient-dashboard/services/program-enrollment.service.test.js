/* global afterEach */
/*jshint -W026, -W030 */
(function () {
    'use strict';

    describe.only('OpenMRS Program Rest Service Unit Tests', function () {
        beforeEach(function () {
            module('app.patientdashboard');
        });

        var callbacks;
        var httpBackend;
        var ProgramEnrollmentHelperService;


        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ProgramEnrollmentHelperService = $injector.get('ProgramEnrollmentHelperService');

        }));

        beforeEach(inject(function () {
            callbacks = {
                onSuccessCalled: false,
                onFailedCalled: false,
                message: null,
                onSuccess: function () {
                    callbacks.onSuccessCalled = true;
                },

                onFailure: function (message) {
                    callbacks.onFailedCalled = true;
                    callbacks.message = message;
                }
            };
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should have ProgramEnrollmentHelperService service defined', function () {
            expect(ProgramEnrollmentHelperService).to.exist;
        });

        it('ProgramEnrollmentHelperService should have getSelectedPatientProgram method', function () {
            expect(ProgramEnrollmentHelperService.getSelectedPatientProgram).to.be.an('function');
        });
        it('ProgramEnrollmentHelperService Service should have setSelectedPatientProgram method', function () {
            expect(ProgramEnrollmentHelperService.setSelectedPatientProgram).to.be.an('function');
        });

        it('ProgramEnrollmentHelperService should have createEnrollmentPayload method', function () {
            expect(ProgramEnrollmentHelperService.createEnrollmentPayload).to.be.an('function');
        });

        it('ProgramEnrollmentHelperService should have setSelectedPatient method', function () {
            expect(ProgramEnrollmentHelperService.setSelectedPatient).to.be.an('function');
        });
        it('ProgramEnrollmentHelperService should have getSelectedPatient method', function () {
            expect(ProgramEnrollmentHelperService.getSelectedPatient).to.be.an('function');
        });

        it('ProgramEnrollmentHelperService Service should have setSelectedProgram method', function () {
            expect(ProgramEnrollmentHelperService.setSelectedProgram).to.be.an('function');
        });
        it('ProgramEnrollmentHelperService Service should have getSelectedProgram method', function () {
            expect(ProgramEnrollmentHelperService.getSelectedProgram).to.be.an('function');
        });

    });
})();
