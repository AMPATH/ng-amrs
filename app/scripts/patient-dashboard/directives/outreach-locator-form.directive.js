/* global angular */
/*
jshint -W003, -W026
*/
(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('outreachLocatorForm', outreachLocatorForm);

  function outreachLocatorForm() {
    return {
      restict: 'E',
      scope: {
        patient: '='
      },
      controller: outreachLocatorFormController,
      link: outreachLocatorFormLink,
      templateUrl: 'views/patient-dashboard/outreach-locator-form-directive.html'
    };
  }

  outreachLocatorFormController.$inject = ['$scope', 'EtlRestService', 'PersonAttributesRestService',
    'EtlRestServicesSettings'
  ];

  function outreachLocatorFormController($scope, EtlRestService, PersonAttributesRestService,
    EtlRestServicesSettings) {
    $scope.photo = '';
    $scope.getPhoto = getPhoto;
    $scope.clearPhoto = clearPhoto;
    $scope.postPhoto = postPhoto;
    $scope.setMapImage = setMapImage;
    $scope.existing = '';
    $scope.noMap = true;
    $scope.hideExisting = true;
    $scope.experiencedLoadingError = false;
    function getPhoto(photoPromise) {
      photoPromise.then(function(imgSrc) {
        $scope.photo = imgSrc;
      });
    }

    function clearPhoto() {
      $scope.photo = '';
    }

    function setMapImage() {
      var mapImage = $scope.patient.getMapImage();
      if (!!mapImage) {
        $scope.noMap = false;
        $scope.existing = EtlRestServicesSettings.getCurrentRestUrlBase().trim() + 'files/' + $scope.patient.getMapImage();
      }
    }

    function postPhoto() {
      var payload = {
        extension: 'jpeg',
        data: $scope.photo
      };
      EtlRestService.uploadFile(payload).then(function(response) {
        saveAttribute(response.image);
      }).catch(function(err) {
        $scope.experiencedLoadingError = true;
        console.log(err);
      });
    }

    function saveAttribute(url) {
      var personAttributePayload = {
        attributes: [{
          value: url,
          attributeType: '1a12beb8-a869-42f2-bebe-09834d40fd59'
        }]
      };
      var person = {
        uuid: function() {
          return $scope.patient.uuid();
        }
      };
      $scope.isBusy = true;
      PersonAttributesRestService.saveUpdatePersonAttribute(personAttributePayload,
        person,
        function(data) {
          if (data) {
            $scope.patient.person = data.person;
            $scope.hideExisting = false;
            $scope.isBusy = false;
          }

        },
        //error callback
        function(error) {
          $scope.isBusy = false;
          $scope.experiencedLoadingError = false;
          console.log('Error', error);
        });
    }
  }

  function outreachLocatorFormLink(scope, element, attrs, vm) {
    scope.$watch('patient', function(newVal, oldVal) {
      scope.setMapImage();
    }, true);
  }
})();
