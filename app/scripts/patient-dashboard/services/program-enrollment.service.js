/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .service('ProgramEnrollmentHelperService', ProgramEnrollmentHelperService);

    function ProgramEnrollmentHelperService(OpenmrsSettings, $resource) {
        var selectedPatientProgram, selectedPatient, selectedProgram;

        var serviceDefinition = {

            getSelectedPatientProgram: getSelectedPatientProgram,
            setSelectedPatientProgram: setSelectedPatientProgram,
            setSelectedPatient: setSelectedPatient,
            getSelectedPatient: getSelectedPatient,
            createEnrollmentPayload: createEnrollmentPayload,
            getSelectedProgram: getSelectedProgram,
            setSelectedProgram: setSelectedProgram
        };
        return serviceDefinition;

        function setSelectedPatientProgram(patientProgram) {
            selectedPatientProgram = patientProgram;
        }

        function getSelectedPatientProgram() {
            return selectedPatientProgram;
        }

        function setSelectedPatient(patient) {
            selectedPatient = patient;
        }

        function getSelectedPatient() {
            return selectedPatient;
        }

        function setSelectedProgram(program) {
            selectedProgram = program;
        }

        function getSelectedProgram() {
            return selectedProgram;
        }

        function createEnrollmentPayload(patientUuid, program, enrolledDate, dateCompleted, enrollmentUuid) {

            var payLoad = {
                patient: patientUuid,
                program: program,
                dateEnrolled: enrolledDate,
                uuid: enrollmentUuid,
                dateCompleted: dateCompleted
            };
            if (payLoad.dateCompleted == undefined) {
                delete payLoad['dateCompleted'];
            }

            if (payLoad.uuid == undefined) {
                delete payLoad['uuid'];
            }

            if (enrollmentUuid !== undefined) {
                //delete program and patient properties as they are not supported when updating enrollment
                delete payLoad['patient'];
                delete payLoad['program'];
            }

            return payLoad;
        }

    }
})();