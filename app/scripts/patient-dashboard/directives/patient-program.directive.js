(function () {
    'use strict';
    angular
        .module('app.patientdashboard')
        .directive('patientProgram', patientProgram);
    function patientProgram() {
        var patientProgramDefinition = {
            restrict: 'EA',
            scope: { patientUuid: '@' },
            templateUrl: 'views/patient-dashboard/patient-program-template.html',
            controller: PatientProgramCtrl
        };

        return patientProgramDefinition;
    }
    PatientProgramCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService', '$state', 'dialogs', '$timeout', 'ProgramEnrollmentResService', 'ProgramResService', '$uibModal', 'ProgramEnrollmentHelperService'];
    function PatientProgramCtrl($rootScope, $scope, $stateParams, OpenmrsRestService, $state, dialogs, $timeout, ProgramEnrollmentResService, ProgramResService, $uibModal, EnrollmentHelperService) {
        //variables
        $scope.showSuccessAlert = false;
        $scope.successAlert = '';
        $scope.programes = '';
        $scope.isBusy = false;
        $scope.enrolledProgrames = '';
        $scope.notEnrolled = '';
        $scope.experiencedLoadingError = false;
        $scope.errorMessage = '';
        $scope.isBusyt = true;
        $scope.loadingData = '';
        //functions
        $scope.openPatientProgramModal = openPatientProgramModal;
        EnrollmentHelperService.setSelectedPatient($scope.patientUuid);
        EnrollmentHelperService.setSelectedProgram(undefined);
        EnrollmentHelperService.setSelectedPatientProgram(undefined);

        //Initialize;
        activate();

        function activate() {
            getPrograms();
            getPatientPrograms($scope.patientUuid);
        }

        function getPatientPrograms(patientId) {
            $scope.isBusy = true;
            $scope.notEnrolled = '';
            $scope.loadingData = 'Program Enrollment';
            var customFetchColumns = 'custom:(uuid,display,dateEnrolled,dateCompleted,program:(uuid))';
            ProgramEnrollmentResService.getProgramEnrollmentByPatientUuid(patientId,
                function (data) {
                    if (data) {
                        $scope.enrolledProgrames = data.results;
                        if (data.results.length <= 0)
                            $scope.notEnrolled = true;
                        $scope.isBusy = false;
                        $scope.loadingData = '';
                    }
                },
                function (error) {
                    console.log(error)
                    $scope.isBusy = false;
                    $scope.experiencedLoadingError = true;
                    $scope.errorMessage = 'Error Occured While Loading Patient Programs';
                    $scope.loadingData = '';
                }, customFetchColumns);
        }

        function selectedPatientProgram(enrolledProgram) {
            ProgramEnrollmentResService.setSelectedPatientProgram(enrolledProgram);
        }

        function getPrograms() {
            $scope.isBusy = true;
            $scope.loadingData = 'Programs';
            ProgramResService.getPrograms(
                function (data) {
                    if (data) {
                        $scope.programs = data.results;
                        if (data.results.length <= 0)
                            $scope.notEnrolled = true;
                        $scope.loadingData = '';
                        $scope.isBusy = false;
                    }
                    $scope.isBusy = false;
                },
                function (error) {
                    console.log(error);
                    $scope.isBusy = false;
                    $scope.experiencedLoadingError = true;
                    $scope.errorMessage = 'Error Occured While Loading Programs';
                    $scope.loadingData = '';
                });
        }

        function openPatientProgramModal(param) {

            if (param.enrolledProgram) {
                EnrollmentHelperService.setSelectedPatientProgram(param.enrolledProgram);
            }

            if (param.program) {
                EnrollmentHelperService.setSelectedProgram(param.program);
                EnrollmentHelperService.setSelectedPatientProgram('');
            }

            var selectedPatient = EnrollmentHelperService.getSelectedPatient();
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/patient-dashboard/patient-program-modal.html',
                windowClass: 'patient-program-modal',
                controller: function ($uibModalInstance, $scope, OpenmrsRestService) {
                    $scope.$on('ProgramEnrollmentUpdated', function (event, data) {
                        getPatientPrograms(selectedPatient);
                        $uibModalInstance.dismiss('cancel');
                    });

                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm',
                resolve: {
                    patient: function () {
                        return {
                            name: 'Name'
                        };
                    }
                }
            });
        }

    }

})();
