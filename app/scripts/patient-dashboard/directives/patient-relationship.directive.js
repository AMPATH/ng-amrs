(function(){
'use strict';
angular
      .module('app.patientdashboard')
      .directive('patientRelationship',patientRelationship);
function patientRelationship(){
  var patientRelationshipDefinition = {
      restrict: 'EA',
      templateUrl: 'views/patient-dashboard/patient-relationships-template.html',
      controller: PatientRelationshipCtrl
  };

  return patientRelationshipDefinition;
}
PatientRelationshipCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService','$state','dialogs', '$timeout'];
function PatientRelationshipCtrl($rootScope, $scope, $stateParams, OpenmrsRestService,$state,dialogs, $timeout){
  $scope.patientRelationships = undefined;
  $scope.showSuccessAlert = false;
  $scope.successAlert='';
  $scope.patientRelationshipTypes=undefined;
  $scope.setPatientRelationship=setPatientRelationship;
  $scope.voidRelationship=voidRelationship;
  $scope.setRelationship=setRelationship;
  $scope.loadPatient = loadPatient;
  getPatientRelationships();
  OpenmrsRestService.getPatientRelationshipTypeService()
  .getPatientRelationshipTypes(function(data){
    $scope.patientRelationshipTypes=data;
  },function(error){
    console.log("The request failed because of ",error);
  });
  function loadPatient(patientUuid) {
      console.log("patient uuid clicked id ",patientUuid);
    OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
           function(data) {
             $rootScope.broadcastPatient = data;
             $state.go('patient', { uuid: patientUuid });
           }
      );
  }
  function setPatientRelationship(personA,relationshipTypeUUid,personB){
    if(angular.isDefined(relationshipTypeUUid) && $scope.patient.uuid()!==personB
    && angular.isDefined($scope.patientToBindRelationship)){
    var relationshipExists=false;
    _.find($scope.patientRelationships.relationships,function(relationship){
      console.log("relationship in find loop is ",relationship.uuId());
      if(personB==relationship.personUuId()) {
        relationshipExists=true;
        var patientRelationshipPayload={
          relationshipType:relationshipTypeUUid
        }
        OpenmrsRestService.getPatientRelationshipService()
        .updatePatientRelationship(relationship.uuId(),patientRelationshipPayload,
          function(success){
            console.log("successfull POST request ",success);
            displaySuccessAlert('Relatioship updated successfully');
            $scope.patientToBindRelationship=undefined;
          },
          function(error){
            console.error("The request failed because of the following ",error);
            displayErrorDialog('Saving Error','The system encountered an error while saving the relatinship');
          });
      }
    });
    console.log("relationshipExists = ",relationshipExists);
    if(!relationshipExists){
      var patientRelationshipPayload=getPatientRelationshipPayload(personA,relationshipTypeUUid,personB);
      OpenmrsRestService.getPatientRelationshipTypeService().setPatientRelationship(patientRelationshipPayload,
      function(success){
        console.log("successfull POST request",success);
        displaySuccessAlert('New relationship saved successfully');
        $scope.patientToBindRelationship=undefined;
      },
      function(error){
        console.error("The request failed because of the following ",error);
        displayErrorDialog('Error','The system encountered an error while saving the relationship');
      }
    );
    }
  }
  else{
    displayErrorDialog('Validation Error','Please make sure you fill the necessary fields before submiting');
  }
  $scope.searchString = '';
}
function voidRelationship(relationshipUuId){
  var dlg=dialogs.confirm('Delete Relationship','Are you sure you want to delete this relationship?');
  dlg.result.then(function(btn){
    OpenmrsRestService.getPatientRelationshipService()
    .purgePatientRelationship(relationshipUuId,
      function(success){
        console.log("success response ",success);
        displaySuccessAlert('Relationship deleted successfully');
      },
      function(error){
        console.error("error response ",error);
        displayErrorDialog('Error','System encountered an error while deleting the relationship');
      });
  });
  $scope.searchString = '';
}
function setRelationship(patientUuid,relationshipTypeUuId)
{
  $scope.isAddingNew = true;
  console.log("patientUuid clicked is ",patientUuid);
  OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
         function(data) {
           $scope.patientToBindRelationship = data;
         }
    );
  $scope.selectedRelationshipType=_.find($scope.patientRelationshipTypes.relationshipTypes, function(patientRelationshipType) {
    if (patientRelationshipType.uuId() === relationshipTypeUuId) {
      return patientRelationshipType;
    }
  });
  $scope.searchString = '';
}
function getPatientRelationships(){
  OpenmrsRestService.getPatientRelationshipService()
  .getPatientRelationships({person:$stateParams.uuid,v:'full'},
    function (data) {
      var orderAdded=addOrderProperty(data);
      console.log("orderAdded array is ",orderAdded);
      orderAdded.relationships.sort(sortRelationships);
    $scope.patientRelationships=orderAdded;
  },function(error){
    console.log("The request failed because of ",error);
  });
}
function getPatientRelationshipPayload(personA,relationshipTypeUUid,personB){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  today =yyyy+'-'+mm+'-'+dd;
  var patientRelationshipPayload={
    personA: personA,
    relationshipType:relationshipTypeUUid,
    personB:personB,
    startDate:today
  }
  return patientRelationshipPayload;
}
function displaySuccessAlert(message){
  $scope.showSuccessAlert = true;
  $scope.successAlert=message;
  $scope.patientToBindRelationship='';
  $scope.selectedRelationshipType='';
  $scope.isAddingNew = false;
  $timeout(function () {
    $scope.showSuccessAlert = false;
    getPatientRelationships();
  }, 3000);
}
function displayErrorDialog(errorTitle,errorMessage){
  var dlgError=dialogs.error(errorTitle,errorMessage);
  dlgError.result.then(function(btnError){});
}
}
function addOrderProperty(arr) {
  var relationshipMap = new Map();
  relationshipMap.set("Parent",1);
  relationshipMap.set("Spouse",2);
  relationshipMap.set("Guardian",3);
  relationshipMap.set("Caretaker",4);
  relationshipMap.set("Child",5);
  relationshipMap.set("Sibling",6);
  relationshipMap.set("Cousin",7);
  relationshipMap.set("Grandparent",8);
  relationshipMap.set("Grandchild",9);
  relationshipMap.set("Aunt/Uncle",10);
  relationshipMap.set("Niece/Nephew",11);
  relationshipMap.set("Foster Child",12);
  relationshipMap.set("Doctor",13);
  relationshipMap.set("Sexual Partner",14);
  relationshipMap.set("Household Member",15);
  relationshipMap.set("Patient",16);
  relationshipMap.set("Child-in-law",17);
  relationshipMap.set("Parent-in-law",18);
  relationshipMap.set("Child-in-law",19);
  relationshipMap.set("Co-wife",20);
  relationshipMap.set("Stepchild",21);
  relationshipMap.set("Stepparent",22);
  relationshipMap.set("Foster Parent",23);
  relationshipMap.set("Friend",24);
  relationshipMap.set("Employee",25);
  relationshipMap.set("Employer",26);
  relationshipMap.set("Tenant/Renter",27);
  relationshipMap.set("Landlord",28);
  relationshipMap.set("Head of Household",29);
  relationshipMap.set("Nurse",30);
  relationshipMap.set("Other non-coded",31);
 _.each(arr.relationships,function(value){
      value.order=relationshipMap.get(value.relationshipTypeName());
});
return arr;
}
function sortRelationships(a,b){
if (a.order < b.order)
return -1;
else if (a.order > b.order)
return 1;
else
return 0;
}
})();
