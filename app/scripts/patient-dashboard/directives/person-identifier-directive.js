(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('updatePersonIdentifier', directive);

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'views/patient-dashboard/update-patient-identifier.html',
            scope: {
                patientUuid: '@',
                patientIdentifiers: '@'
            },
            controller: updatePersonIdentifierController,
            link: linkFn
        };
    }

    updatePersonIdentifierController.$inject = ['$scope', 'IdentifierResService', 'LocationResService', 'LocationModel', 'PatientIdentifierTypeResService', 'OpenmrsRestService'];

    function updatePersonIdentifierController($scope, IdentifierResService, LocationResService, LocationModel, PatientIdentifierTypeResService, OpenmrsRestService) {
        $scope.saving = false;
        $scope.error = false;

        $scope.preferOptions = [{ label: 'Yes', val: true }, { label: 'No', val: false }];
        $scope.commonIdentifierTypes = [];
        $scope.commonIdentifierTypeFormats = [];

        $scope.setPatientIdentifier = setPatientIdentifier;
        $scope.setPreferredIdentifier = setPreferredIdentifier;

        $scope.setIdentifierType = setIdentifierType;

        $scope.patientIdentifier = '';
        $scope.preferredIdentifier = '';
        $scope.identifierLocation = '';
        $scope.identifierType = '';
        $scope.locations = [];
        $scope.identifierValidity = '';
        $scope.invalidLocationCheck = '';

        $scope.updatePatientIdentifier = updatePatientIdentifier;
        $scope.onIdentifierLocationSelection = onIdentifierLocationSelection;

       $scope.getCommonIdentifierTypes=getCommonIdentifierTypes;
       $scope.fetchLocations=fetchLocations;

        function getCurrentIdentifierByType(identifiers,identifierType){

        var existingIdentifier= _.find($scope.$eval(identifiers), function (i) { 
            return i.identifierType.uuid === identifierType; }
            ) ;
            return existingIdentifier; 
        }
        
        function onIdentifierLocationSelection(location) {
            $scope.selectedLocationName = location.name;
            $scope.selectedLocationUuid = location.uuid;
            $scope.identifierLocation = location.uuid;
            $scope.invalidLocationCheck = '';
        }

        function seIdentifierLocation(location) {
            $scope.identifierLocation = location;
        }

        function setPatientIdentifier(patientIdentifier) {
            $scope.patientIdentifier = patientIdentifier;
        }
        function setIdentifierType(identifierType) {
            $scope.identifierValidity='';
            $scope.identifierType = identifierType;
            
            var id=getCurrentIdentifierByType($scope.patientIdentifiers,identifierType);
            
            if(angular.isDefined(id)){
              $scope.patientIdentifier = id.identifier;  
              $scope.patientIdentifierUuid = id.uuid;
            }else{
              $scope.patientIdentifier ='';  
              $scope.patientIdentifierUuid=''; 
            }
            
        }

        function setPreferredIdentifier(preferredIdentifier) {
            $scope.preferredIdentifier = preferredIdentifier;            
        }

        function fetchLocations() {
            $scope.isBusy = true;
            LocationResService.getLocations(onGetLocationsSuccess,
            onGetLocationsError, false);
        }

        function onGetLocationsSuccess(locations) {
            $scope.locations = wrapLocations(locations);
            $scope.locationsOptions = {
                placeholder: 'Select a location or type to search...',
                dataTextField: 'name()',
                filter: 'contains',
                dataSource: wrapLocations(locations)
            };
            $scope.isBusy = false;
        }

        function onGetLocationsError(error) {
            $scope.isBusy = false;
            $scope.locationsOptions = {};
        }

        function wrapLocations(locations) {
            var wrappedLocations = [];
            for (var i = 0; i < locations.length; i++) {
                var wrapped = wrapLocation(locations[i]);
                wrapped.index = i;
                wrappedLocations.push(wrapped);
            }

            return wrappedLocations;
        }

        function wrapLocation(location) {
            return LocationModel.toWrapper(location);
        }

        function getCommonIdentifierTypes() {
            PatientIdentifierTypeResService.getPatientIdentifierTypes(function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    var commonIdentifierTypeNames =IdentifierResService.commonIdentifierTypes();
                    if (_.contains(commonIdentifierTypeNames, data.results[i].name)) {
                        $scope.commonIdentifierTypes.push({ val: data.results[i].uuid, label: data.results[i].name });
                        $scope.commonIdentifierTypeFormats[data.results[i].uuid] = { format: data.results[i].format, checkdigit: data.results[i].checkDigit };
                    }
                }
                
            }, function (error) {
                console.log('Error Occurred while retrieving common patient identifier types', error);
            }
           );

        }
        
        function checkIdentifierFormat() {

            $scope.isValidIdentifier = false;
            $scope.identifierValidity = '';
            var identifierType = $scope.identifierType;
            if (angular.isDefined($scope.commonIdentifierTypeFormats[identifierType])) {

                var identifierFormat = $scope.commonIdentifierTypeFormats[identifierType];

                if (identifierFormat.checkdigit) checkLuhnCheckDigit();

                if (identifierFormat.format && identifierFormat.format != 'NULL'){
                   
                    $scope.isValidIdentifier=IdentifierResService.checkRegexValidity(identifierFormat.format,$scope.patientIdentifier);
                    if($scope.isValidIdentifier==false)  $scope.identifierValidity = "Invalid Identifier Format. {" + identifierFormat.format + '}';
                }
                    
            }
            

            if ((identifierFormat.format == '' || identifierFormat.format == 'NULL') && identifierFormat.checkdigit == 0) {
                $scope.isValidIdentifier = true;
            }

            if (!$scope.identifierLocation) {
                $scope.invalidLocationCheck = "Location is Required";
            }
            
        }

        function checkLuhnCheckDigit() {
            var checkDigit = $scope.patientIdentifier.split('-')[1];
            var expectedCheckDigit = IdentifierResService.getLuhnCheckDigit($scope.patientIdentifier.split('-')[0]);
            if(checkDigit=='undefined'||checkDigit==undefined){
               $scope.identifierValidity = "Invalid Check Digit";               
            }           
            
            if (expectedCheckDigit == checkDigit) {

                $scope.isValidIdentifier = true;
            } else {
                $scope.identifierValidity = "Invalid Check Digit";
            }

        }
      
        function updatePatientIdentifier() {
            
            $scope.saving = true;
            $scope.error = false;
            var personIdentifierPayload=IdentifierResService.createIdentifierPayload(
                $scope.identifierType,$scope.patientIdentifier,$scope.preferredIdentifier.val,$scope.selectedLocationUuid);
           

            console.log('Patient Identifier Payload:', personIdentifierPayload);
            var param = { identifier: personIdentifierPayload, identifierUuid:$scope.patientIdentifierUuid, patientUid: $scope.patientUuid };
           checkIdentifierFormat();

            if ($scope.isValidIdentifier == true) {
                
           //Check for existing patients            
            OpenmrsRestService.getPatientService().getPatientQuery({
                q: $scope.patientIdentifier
            },
                function (data) {
                    $scope.isBusy = false;
                    $scope.patients = data;
                    $scope.totalItems = $scope.patients.length;
                    
                    if(data.length<=0){
                        IdentifierResService.saveUpdatePatientIdentifier(param,
                        function (data) {
                            console.log('Patient Updated Successfully:', data);
                            $scope.$emit('PatientIdentifierUpdated', data);
                        },
                        function (error) {
                            console.log('Error occurred why updating patient identifier:', error);
                        });
                    }else{
                        $scope.identifierValidity='A patient with this Identifier exists';
                    }

                }
                );          
            }
        }

    }   
        
        
    function linkFn(scope, element, attrs, vm) {
      scope.getCommonIdentifierTypes();
      scope.fetchLocations();
       scope.$watchGroup(['patientIdentifier','identifierType'], function(newVal, oldVal) {
          console.log('New Value:', newVal)
          console.log('old Value:', oldVal)
      });
    }   


})();