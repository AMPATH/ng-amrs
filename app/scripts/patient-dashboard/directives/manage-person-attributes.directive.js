(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('managerPersonAttributes', directive);

  function directive() {
    return {
      restrict: 'E',
      templateUrl: 'views/patient-dashboard/manage-person-attributes.html',
      scope: {
        patientUuid: '@',
        attributeTypeUuid: '@',
        attributeValue: '@',
        attributeName: '@'
      },
      controller: managePersonAttributesDirectiveController,
      link: managePersonAttributesDirectiveLink,
    };
  }
  managePersonAttributesDirectiveController.$inject = ['$scope', 'PersonAttributesRestService'];

  function managePersonAttributesDirectiveController($scope, PersonAttributesRestService) {
    $scope.saveAttribute = saveAttribute;
    $scope.error = false;
    $scope.errorMessage = '';
    $scope.saving = false;

    function saveAttribute() {
      var personAttributePayload = {
        attributes: [{
          value: $scope.attributeValue,
          attributeType: $scope.attributeTypeUuid
        }]
      };
      var person = {
        uuid: function() {
          return $scope.patientUuid;
        }
      };
      $scope.saving = true;
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
