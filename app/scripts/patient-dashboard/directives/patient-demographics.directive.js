/*
jshint -W003, -W026, -W033, -W098
*/
(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('patientDemographics', patientDemographics);

  function patientDemographics() {
    var patientDemographicsDefinition = {
      restrict: 'EA',
      templateUrl: 'views/patient-dashboard/patient-demographics.html',
      controller: PatientDemographicsCtrl
    };

    return patientDemographicsDefinition;
  }

  PatientDemographicsCtrl.$inject = ['$rootScope', '$scope', '$stateParams',
    'OpenmrsRestService', '$state', '$uibModal'
  ];

  function PatientDemographicsCtrl($rootScope, $scope, $stateParams,
    OpenmrsRestService, $state, $uibModal) {
    $scope.openPersonAttributeManageModal = openPersonAttributeManageModal;
    $scope.openPersonManageModal = openPersonManageModal;
    $scope.openPersonNameModal = openPersonNameModal;
    $scope.openPersonAddressModal = openPersonAddressModal;
    $scope.openPersonIdentifierModal = openPersonIdentifierModal;
    
    function openPersonAttributeManageModal(attributeTypeUuid) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/manage-person-attributes-modal.html',
        controller: function($uibModalInstance, $scope, OpenmrsRestService) {
          $scope.$on('attributeSaved', function(event, data) {
            OpenmrsRestService.getPatientService().getPatientByUuid({
                uuid: scope.patient.uuid()
              },
              function(data) {
                scope.patient = data;
                $uibModalInstance.dismiss('cancel');
              });
          });
          $scope.patient = scope.patient;
          $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'sm',
        resolve: {
          patient: function() {
            return {
              name: 'Name'
            };
          }
        }
      });
    }

    function openPersonManageModal(patientUuid) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/manage-person-modal.html',
        windowClass: 'person-modal',
        controller: function($uibModalInstance, $scope, OpenmrsRestService) {
          $scope.$on('PersonUpdated', function(event, data) {
            OpenmrsRestService.getPatientService().getPatientByUuid({
                uuid: scope.patient.uuid()
              },
              function(data) {
                console.log('Patient Data:', data);
                scope.patient = data;
                $uibModalInstance.dismiss('cancel');
              });
          });
          $scope.patient = scope.patient;
          $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'sm',
        resolve: {
          patient: function() {
            return {
              name: 'Name'
            };
          }
        }
      });
    }
    
    
    function openPersonNameModal(patient) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/manage-person-name-modal.html',
        windowClass: 'person-modal',
        controller: function($uibModalInstance, $scope, OpenmrsRestService) {
          $scope.$on('PersonNameUpdated', function(event, data) {
            OpenmrsRestService.getPatientService().getPatientByUuid({
                uuid: scope.patient.uuid()
              },
              function(data) {
                console.log('Patient Data:', data);
                scope.patient = data;
                $uibModalInstance.dismiss('cancel');
              });
          });
          $scope.patient = scope.patient;
          $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
       size:'lg',
        resolve: {
          patient: function() {
            return {
              name: 'Name'
            };
          }
        }
      });
    }
   
     function openPersonIdentifierModal(patientUuid) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/manage-person-identifier-modal.html',
        windowClass: 'person-modal',
        controller: function($uibModalInstance, $scope, OpenmrsRestService) {
          $scope.$on('PatientIdentifierUpdated', function(event, data) {
            OpenmrsRestService.getPatientService().getPatientByUuid({
                uuid: scope.patient.uuid()
              },
              function(data) {
                console.log('Patient Data:', data);
                scope.patient = data;
                $uibModalInstance.dismiss('cancel');
              });
          });
          $scope.patient = scope.patient;
          $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
       size:'lg',
        resolve: {
          patient: function() {
            return {
              name: 'Name'
            };
          }
        }
      });
    }
    
     function openPersonAddressModal(patientUuid) {
      var scope = $scope;
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/patient-dashboard/manage-person-address-modal.html',
        windowClass: 'person-modal',
        controller: function($uibModalInstance, $scope, OpenmrsRestService) {
          $scope.$on('PersonAddressUpdated', function(event, data) {
            OpenmrsRestService.getPatientService().getPatientByUuid({
                uuid: scope.patient.uuid()
              },
              function(data) {
                console.log('Patient Data:', data);
                scope.patient = data;
                $uibModalInstance.dismiss('cancel');
              });
          });
          $scope.patient = scope.patient;
          $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
       size:'lg',
        resolve: {
          patient: function() {
            return {
              name: 'Name'
            };
          }
        }
      });
    }   
    /*Avoid the round trip and use the rootScope patient selected during
    search process    
    */
    //handle the case for unloaded patient

    if (!$rootScope.broadcastPatient.getPersonAttributes) {
      var patient = OpenmrsRestService.getPatientService().getPatientByUuid({
          uuid: $stateParams.uuid
        },
        function(data) {
          $scope.patient = data;
          $scope.personAttributes = data.getPersonAttributes();

        }

      );
    } else {
      $scope.patient = $rootScope.broadcastPatient;
      $scope.personAttributes = $scope.patient.getPersonAttributes();
    }
    $scope.loadPatient = loadPatient;

    function loadPatient(patientUuid) {
      /*
        Get the selected patient and save the details in the root scope
        so that we don't do another round trip to get the patient details
        */
      console.log("patient uuid clicked id ", patientUuid);
      OpenmrsRestService.getPatientService().getPatientByUuid({
          uuid: patientUuid
        },
        function(data) {
          $rootScope.broadcastPatient = data;
          $state.go('patient', {
            uuid: patientUuid
          });
        }
      );
    }
  }
})();
