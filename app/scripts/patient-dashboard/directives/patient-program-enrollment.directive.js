(function () {
    'use strict';
    angular
        .module('app.patientdashboard')
        .directive('patientProgramEnrollment', patientProgramEnrollment);
    function patientProgramEnrollment() {
        var patientProgramEnrollmentDefinition = {
            restrict: 'EA',

            templateUrl: 'views/patient-dashboard/patient-program-enrollment.html',
            controller: PatientProgramEnrollmentCtrl
        };

        return patientProgramEnrollmentDefinition;
    }
    PatientProgramEnrollmentCtrl.$inject = ['$rootScope', '$scope', '$stateParams',
        'OpenmrsRestService', '$state', 'dialogs', '$timeout', 'ProgramEnrollmentResService',
        'ProgramEnrollmentHelperService', '$uibModal', 'moment'];
    function PatientProgramEnrollmentCtrl($rootScope, $scope, $stateParams,
        OpenmrsRestService, $state, dialogs, $timeout, ProgramEnrollmentResService,
        EnrollmentHelperService, $uibModal, moment) {
       
        //variables
        $scope.showSuccessAlert = false;
        $scope.successAlert = '';
        $scope.currentDate = new Date();
        $scope.isBusy = false;
        $scope.saving = false;
                
        //functions
        $scope.updateEnrollment = updateEnrollment;
        $scope.validateFormFields = validateFormFields;
        $scope.validateDateInput = isDateValid;           
       
        //initialize 
        activate();

        function activate() {

            $scope.selectedProgram = EnrollmentHelperService.getSelectedProgram();
            $scope.selectedPatient = EnrollmentHelperService.getSelectedPatient();
            var existingPatientProgram = EnrollmentHelperService.getSelectedPatientProgram();


            if (angular.isDefined(existingPatientProgram) && existingPatientProgram !== '') {
                $scope.selectedProgramName = existingPatientProgram.display;
                $scope.enrolledDate = existingPatientProgram.dateEnrolled;
                $scope.completedDate = existingPatientProgram.dateCompleted;
                $scope.enrollmentUuid = existingPatientProgram.uuid;
                $scope.programUuid = existingPatientProgram.program.uuid;
            }

            if (angular.isDefined($scope.selectedProgram) && $scope.selectedProgram !== '') {
                $scope.selectedProgramName = $scope.selectedProgram.name;
                $scope.programUuid = $scope.selectedProgram.uuid;
            }

        }

        function updateEnrollment() {
            var isFormValid = validateFormFields($scope.enrolledDate, $scope.completedDate);
            var enrollmentPayload = EnrollmentHelperService.createEnrollmentPayload($scope.selectedPatient, $scope.programUuid, $scope.enrolledDate, $scope.completedDate, $scope.enrollmentUuid);

            if (isFormValid == true && enrollmentPayload) {
                $scope.isBusy = true;
                $scope.saving = true;
                ProgramEnrollmentResService.saveUpdateProgramEnrollment(enrollmentPayload,
                    function (response) {
                        console.log('Patient Enrolled Succeffully' + JSON.stringify(response));
                        $scope.$emit('ProgramEnrollmentUpdated', response);
                        $scope.isBusy = false;
                        $scope.saving = false;
                    },
                    function (error) {
                        $scope.hasError = true;
                        $scope.errorMessage = 'Error Occurred while Enrolling Patient';
                        $scope.isBusy = false;
                        $scope.saving = false;
                        console.log('Error Occurred while Enrolling Patient' + JSON.stringify(error));
                    }

                    );
            }
        }

        function isDateValid(inputValue) {
            return moment(inputValue).isValid();;
        }


        function setErroMessage(message) {

            $scope.hasError = true;
            $scope.errorMessage = message;
        }

        function isNullOrUndefined(val) {
            return val === null || val === undefined;
        }

        function validateFormFields(enrolledDate, completedDate) {

            if (isNullOrUndefined(enrolledDate)) {
                setErroMessage('Date Enrolled is required.');
                return false;
            }

            if (!isDateValid(enrolledDate)) {
                setErroMessage('Date Enrolled should be a valid date.');
                return false;
            }

            if (!isNullOrUndefined(completedDate) && !isDateValid(completedDate)) {
                setErroMessage('Date Completed should be a valid date.');
                return false;
            }

            if (isDateValid(completedDate) && !moment(completedDate).isAfter(enrolledDate)) {
                setErroMessage('Date Completed should be after Date Enrolled');
                return false;
            }

            return true;
        }
    }

})();
