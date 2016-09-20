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
    PatientProgramEnrollmentCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService', '$state', 'dialogs', '$timeout', 'ProgramEnrollmentResService', 'ProgramEnrollmentHelperService', '$uibModal'];
    function PatientProgramEnrollmentCtrl($rootScope, $scope, $stateParams, OpenmrsRestService, $state, dialogs, $timeout, ProgramEnrollmentResService, EnrollmentHelperService, $uibModal) {
       
        //variables
        $scope.showSuccessAlert = false;
        $scope.successAlert = '';
        $scope.currentDate = new Date();
        $scope.isBusy = false;
        
        //functions
        $scope.updateEnrollment = updateEnrollment;
        $scope.setEnrolledDate = setEnrolledDate;
        $scope.setcompletedDate = setcompletedDate;
        $scope.validateFormFields = validateFormFields;
        $scope.validateDateInput = validateDateInput;           
       
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

        function setEnrolledDate(date) {
            $scope.enrolledDate = date;
            $scope.hasError = false;
            $scope.errorMessage = '';
        }

        function setcompletedDate(date) {
            $scope.completedDate = date;
            $scope.hasError = false;
            $scope.errorMessage = '';

        }

        function updateEnrollment() {
            var isFormValid = validateFormFields($scope.enrolledDate, $scope.completedDate);
            var enrollmentPayload = EnrollmentHelperService.createEnrollmentPayload($scope.selectedPatient, $scope.programUuid, $scope.enrolledDate, $scope.completedDate, $scope.enrollmentUuid);

            if (isFormValid == true && enrollmentPayload) {
                $scope.isBusy = true;
                ProgramEnrollmentResService.saveUpdateProgramEnrollment(enrollmentPayload,
                    function (response) {
                        console.log('Patient Enrolled Succeffully' + JSON.stringify(response));
                        $scope.$emit('ProgramEnrollmentUpdated', response);
                        $scope.isBusy = false;
                    },
                    function (error) {
                        $scope.hasError = true;
                        $scope.errorMessage = 'Error Occurred while Enrolling Patient';
                        $scope.isBusy = false;
                        console.log('Error Occurred while Enrolling Patient' + JSON.stringify(error));
                    }

                    );
            }
        }

        function validateDateInput(inputValue, errorMessage) {
            var customDate, isValid;
            if (angular.isDefined(inputValue) && inputValue !== '') {
                customDate = new Date(inputValue);
                isValid = !isNaN(customDate);

                if (!isValid) {
                    $scope.hasError = true;
                    $scope.errorMessage = errorMessage;
                }
            }
            return isValid;
        }

        function validateFormFields(enrolledDate, completedDate) {
            $scope.hasError = false;
            $scope.errorMessage = '';
            var isValidDate;
            if (angular.isDefined(enrolledDate) && enrolledDate !== '') {
                isValidDate = validateDateInput(enrolledDate, 'Invalid Date Enrolled Value')
            }

            if (angular.isDefined(completedDate) && completedDate !== '') {
                isValidDate = validateDateInput(completedDate, 'Invalid Date Completed Value')
            }
            
            //when a user attempts to provide completion date without providing date enrolled
            if (completedDate && (enrolledDate == '' || !angular.isDefined(enrolledDate)) && isValidDate == true) {
                $scope.hasError = true;
                $scope.errorMessage = 'Date Enrolled is Required';
                isValidDate = false;
            }
            
            //when a user attempts to provide completion date greater than date enrolled
            if ((completedDate && enrolledDate) && isValidDate == true) {
                if (enrolledDate > completedDate) {
                    $scope.hasError = true;
                    $scope.errorMessage = 'Date completed should be greater than Date Enrolled';
                    isValidDate = false;
                } else {
                    isValidDate = true;
                }
            }
            return isValidDate;
        }
    }

})();
