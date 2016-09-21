(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('updatePersonName', directive);

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'views/patient-dashboard/update-person-name.html',
            scope: {
                patientUuid: '@',
                givenName: '@',
                middleName: '@',
                familyName: '@',
                isPreferredName: '@',
                preferredNameUuid: '@'
            },
            controller: updatePersonNameController,
            link: linkFn
        };
    }
    updatePersonNameController.$inject = ['$scope', 'PersonNameResService'];

    function updatePersonNameController($scope, PersonNameResService) {
        $scope.updatePersonName = updatePersonName;
        $scope.saving = false;
        $scope.error = false;
        $scope.setGivenName = setGivenName;
        $scope.setFamilyName = setFamilyName;
        $scope.setMiddleName = setMiddleName;
        $scope.personNameError = '';
        $scope.setPreferred = setPreferred;
        $scope.preferOptions = [{ label: 'Yes', val: true }, { label: 'No', val: false }];

        if ($scope.isPreferredName === 'true')
            $scope.preferred = $scope.preferOptions[0];

        if ($scope.isPreferredName === 'false')
            $scope.preferred = $scope.preferOptions[1];

        function setGivenName(givenName) {
            $scope.givenName = givenName;
        }

        function setFamilyName(familyName) {
            $scope.familyName = familyName;
        }

        function setMiddleName(middleName) {
            $scope.middleName = middleName;
        }

        function setPreferred(preferred) {
            $scope.preferred = preferred;
            if (preferred)
                $scope.invalidPreferredName = '';

        }

        function updatePersonName() {

            var personNamePayload = PersonNameResService.createPersonNamePayload(
                $scope.givenName,
                $scope.familyName,
                $scope.middleName,
                $scope.preferred.val);
            console.log('Person Name Payload:', personNamePayload);

            $scope.saving = true;
            $scope.personNameError = '';
            var nameParam = { name: personNamePayload, personUuid: $scope.patientUuid, nameUuid: $scope.preferredNameUuid }
            PersonNameResService.saveUpdatePersonName(nameParam, function (data) {
                if (data) {
                    $scope.saving = false;
                    $scope.$emit('PersonNameUpdated', data);
                    console.log('Saved Person Name  Successfully:', data)
                }


            },
                function (error) {
                    $scope.saving = false;
                    $scope.personNameError = 'Name(s) Contain Invalid Characters';
                    console.log('Error Occurred while updating Person Name:', error)
                }
                );
        }
    }
    function linkFn(scope, element, attrs, vm) {
        scope.$watchGroup(['givenName', 'familyName', 'middleName'], function (newVal, oldVal) {
            console.log('New Value:', newVal)
            console.log('old Value:', oldVal)
        });
    }
})();
