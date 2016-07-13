(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('updatePerson', directive);

  function directive() {
    return {
      restrict: 'E',
      templateUrl: 'views/patient-dashboard/update-person.html',
      scope: {
        patientUuid: '@',
        dead:  '@',
        deathDate:  '@',
        causeOfDeath:  '@'
      },
      controller: updatePersonController,
      link: linkFn
    };
  }

  updatePersonController.$inject = ['$scope', 'PersonRestService', 'ConceptResService'];

  function updatePersonController($scope, PersonRestService, ConceptResService) {
    $scope.getCausesOfDeath = getCausesOfDeath;
    $scope.setDeathDate = setDeathDate;
    $scope.setCauseOfDeath = setCauseOfDeath;
    $scope.updatePerson = updatePerson;
    $scope.isDeadOptions = [{ label: 'Yes', val: true }, { label: 'No', val: false }];
    $scope.dead = $scope.isDeadOptions[1];
    $scope.causesOfDeath = [];
    $scope.causeOfDeath = $scope.causesOfDeath[0];
    $scope.saving = false;
    $scope.error = false;
    $scope.currentDate = new Date();

    function getCausesOfDeath(){
      ConceptResService.getConceptAnswers('a89df750-1350-11df-a1f1-0026b9348838', onCallbackSuccess, onCallbackError);
    }
    function onCallbackSuccess(data){
      console.log('Concept Answers:',data.answers)
      $scope.causesOfDeath = data.answers;
    }
    function onCallbackError(error){
      console.log("Concept fetch error:",error)
    }

    function setDeathDate(deathDate){
      $scope.deathDate = deathDate;
    }

    function setCauseOfDeath(causeOfDeath){
      $scope.causeOfDeath = causeOfDeath;
    }

    function updatePerson(){
      if ($scope.dead.val === false){
        $scope.deathDate = null;
        $scope.causeOfDeath = null;
      }
      var personPayload = {
          dead: $scope.dead.val,
          deathDate: $scope.deathDate,
          causeOfDeath: $scope.causeOfDeath
      };
      console.log('Person Payload:',personPayload);
      var person = {
        uuid: function() {
          return $scope.patientUuid;
        }
      };
      $scope.saving = true;
      PersonRestService.updatePerson(person, personPayload, function(data) {

          if (data) {
            $scope.saving = false;
            $scope.$emit('PersonUpdated',data);
          }

        },
        //error callback
        function(error) {
          $scope.saving = false;
          $scope.error = true;
          console.log('Error', error);
        });
    }
  }
  function linkFn(scope, element, attrs, vm) {
    scope.getCausesOfDeath();
    scope.$watchGroup(['dead.val','deathDate','causeOfDeath'], function(newVal, oldVal) {
          console.log('New Value:', newVal)
          console.log('old Value:', oldVal)
      });
  }
})();
