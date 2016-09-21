(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('updatePersonAddress', directive);

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'views/patient-dashboard/update-person-address.html',
            scope: {
                patientUuid: '@',
                address1: '@',
                address2: '@',
                address3: '@',
                cityVillage: '@',
                stateProvince: '@',
                preferredAddressUuid: '@',
                preferred: '@'
            },
            controller: updatePersonAddressController,
            link: linkFn
        };
    }

    updatePersonAddressController.$inject = ['$scope', 'PersonAddressResService'];

    function updatePersonAddressController($scope, PersonAddressResService) {

        $scope.setAddress1 = setAddress1;
        $scope.setAddress2 = setAddress2;
        $scope.setCityvillage = setCityvillage;
        $scope.setStateprovince = setStateprovince;
        $scope.setCountry = setCountry;
        $scope.setPostalcode = setPostalcode;
        $scope.setLatitude = setLatitude;
        $scope.setLongitude = setLongitude;
        $scope.setCountydistrict = setCountydistrict;
        $scope.setAddress3 = setAddress3;
        $scope.setAddress4 = setAddress4;
        $scope.setAddress5 = setAddress5;
        $scope.setAddress6 = setAddress6;
        $scope.saving = false;
        $scope.error = false;
        $scope.preferOptions = [{ label: 'Yes', val: true }, { label: 'No', val: false }];
        $scope.updatePersonAddress = updatePersonAddress;

        if ($scope.preferred === 'true')
            $scope.preferredAddress = $scope.preferOptions[0];

        if ($scope.preferred === 'false')
            $scope.preferredAddress = $scope.preferOptions[1];

        function setAddress1(address1) {
            $scope.address1 = address1;
        }

        function setAddress2(address2) {
            $scope.address2 = address2;
        }

        function setAddress3(address3) {
            $scope.address3 = address3;
        }

        function setCityvillage(cityVillage) {
            $scope.cityVillage = cityVillage;
        }

        function setStateprovince(stateProvince) {
            $scope.stateProvince = stateProvince;
        }

        function setCountry(country) {
            $scope.country = country;
        }

        function setPostalcode(postalCode) {
            $scope.postalCode = postalCode;
        }

        function setLatitude(latitude) {
            $scope.latitude = latitude;
        }

        function setLongitude(longitude) {
            $scope.longitude = longitude;
        }

        function setCountydistrict(countyDistrict) {
            $scope.countyDistrict = countyDistrict;
        }



        function setAddress4(address4) {
            $scope.address4 = address4;
        }

        function setAddress5(address5) {
            $scope.address5 = address5;
        }

        function setAddress6(address6) {
            $scope.address6 = address6;
        }

        function setpreferredAddress(preferredAddress) {
            $scope.preferredAddress = preferredAddress;

        }

        function updatePersonAddress() {
            var personAddressPayload = PersonAddressResService.createAddressPayload(
                $scope.address1,
                $scope.address2,
                $scope.address3,
                $scope.cityVillage,
                $scope.stateProvince,
                $scope.preferredAddress.val);

            console.log('Person Address Payload:', personAddressPayload);

            $scope.saving = true;
            var param = { personUuid: $scope.patientUuid, address: personAddressPayload, addressUuid: $scope.preferredAddressUuid }
            PersonAddressResService.saveUpdatePersonAddress(param,
                function (data) {
                    if (data) {
                        $scope.saving = false;
                        $scope.$emit('PersonAddressUpdated', data);
                    }
                },

                function (error) {
                    $scope.saving = false;
                    $scope.error = true;
                    console.log('Error', error);
                });
        }
    }
    function linkFn(scope, element, attrs, vm) {
        scope.$watchGroup(['address1', 'address2', 'address3', 'cityVillage', 'stateProvince'], function (newVal, oldVal) {
            console.log('New Value:', newVal)
            console.log('old Value:', oldVal)
        });
    }
})();
