/*
jshint -W003, -W026, -W033, -W098
*/
(function () {
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

    PatientDemographicsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'OpenmrsRestService','$state'];

    function PatientDemographicsCtrl($rootScope, scope, $stateParams, OpenmrsRestService,$state) {
        /*
        Avoid the round trip and use the rootScope patient selected during
        search process
        */
        //handle the case for unloaded patient

        var patientRelationship = OpenmrsRestService.getPatientRelationshipService()
        .getPatientRelationships({person:$stateParams.uuid,v:'full'},
          function (data) {
            var orderAdded=addOrderProperty(data);
            console.log("orderAdded array is ",orderAdded);
            orderAdded.relationships.sort(sortRelationships);
          scope.patientRelationships=orderAdded;
        },function(error){
          console.log("The request failed because of ",error);
        });

        if (!$rootScope.broadcastPatient.getPersonAttributes) {
            var patient = OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: $stateParams.uuid },
                function (data) {
                    scope.patient = data;
                    scope.personAttributes = data.getPersonAttributes();

                }

                );
        }
        else {
            scope.patient = $rootScope.broadcastPatient;
            scope.personAttributes = scope.patient.getPersonAttributes();
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
