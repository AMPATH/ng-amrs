(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('managePersonAttributes', directive);

  function directive() {
    return {
      restrict: 'E',
      templateUrl: 'views/patient-dashboard/manage-person-attributes.html',
      scope: {
        patient: '='
            },
      controller: managePersonAttributesDirectiveController,
      link: managePersonAttributesDirectiveLink,
    };
  }
  managePersonAttributesDirectiveController.$inject = ['$scope', 'PersonAttributesRestService'];

  function managePersonAttributesDirectiveController($scope, PersonAttributesRestService) {
    $scope.saveAttribute = saveAttribute;
    $scope.error = false;
    $scope.errorMessage = 'Sorry contact infomation can not been updated at this time';
    $scope.saving = false;
    $scope.phoneNumber = $scope.patient.phoneNumber();
    $scope.alternativePhoneNumber = $scope.patient.alternativePhoneNumber();
    $scope.nextofkinPhoneNumber = $scope.patient.nextofkinPhoneNumber();
    $scope.patnerPhoneNumber = $scope.patient.patnerPhoneNumber();
    $scope.contactEmailAddress = $scope.patient.contactEmailAddress();

    function saveAttribute() {
          var personAttributePayload = {
            attributes: [{
              value:  $scope.phoneNumber,
              attributeType:'72a759a8-1359-11df-a1f1-0026b9348838'
            },{
              value:  $scope.alternativePhoneNumber,
              attributeType:'c725f524-c14a-4468-ac19-4a0e6661c930'
            },{
              value:  $scope.nextofkinPhoneNumber,
              attributeType:'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
            },{
              value:  $scope.patnerPhoneNumber,
              attributeType:'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
            },{
              value:  $scope.contactEmailAddress,
              attributeType:'2f65dbcb-3e58-45a3-8be7-fd1dc9aa0faa'
            }]
          };
          var person = {
            uuid: function() {
              return $scope.patient.uuid();
            }
          };

          personAttributePayload.attributes = _.filter(personAttributePayload.attributes, function(attribute){
            return attribute.value !== undefined && attribute.value !== null && attribute.value.trim().length > 0;
          });

      $scope.saving = true;
      $scope.error = false;
      personAttributePayload
      PersonAttributesRestService.saveUpdatePersonAttribute(personAttributePayload, person, function(data) {
          if (data) {
            $scope.saving = false;
            $scope.$emit('attributeSaved',data.person);
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

  function managePersonAttributesDirectiveLink(scope, element, attrs, vm) {
  }
})();
