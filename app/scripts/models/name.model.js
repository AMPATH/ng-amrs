/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
    'use strict';

    angular
        .module('models')
        .factory('NameModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            name: name,
            toWrapper:toWrapper,
            toArrayOfWrappers: toArrayOfWrappers,
            fromArrayOfWrappers:fromArrayOfWrappers
        };

        return service;

        //madnatory fields givenName, familyName
        function name(givenName_, middleName_, familyName_, familyName2_, voided_, uuId_) {
            var modelDefinition = this;

            //initialize private members
            var _givenName = givenName_? givenName_: '';
            var _middleName = middleName_ ? middleName_: '';
            var _familyName = familyName_ ? familyName_: '';
            var _familyName2 = familyName2_ ? familyName2_: '';
            var _voided = voided_ ? voided_: false;
            var _uuId = uuId_ ? uuId_: '';


            modelDefinition.givenName = function(value){
              if(angular.isDefined(value)){
                _givenName = value;
              }
              else{
                return _givenName;
              }
            };

            modelDefinition.middleName = function(value){
              if(angular.isDefined(value)){
                _middleName = value;
              }
              else{
                return _middleName;
              }
            };

            modelDefinition.familyName = function(value){
              if(angular.isDefined(value)){
                _familyName = value;
              }
              else{
                return _familyName;
              }
            };

            modelDefinition.familyName2 = function(value){
              if(angular.isDefined(value)){
                _familyName2 = value;
              }
              else{
                return _familyName2;
              }
            };

            modelDefinition.voided = function(value){
              if(angular.isDefined(value)){
                _voided = value;
              }
              else{
                return _voided;
              }
            };

            modelDefinition.uuId = function(value){
              if(angular.isDefined(value)){
                _uuId = value;
              }
              else{
                return _uuId;
              }
            };

            modelDefinition.openmrsModel = function(value){
              return {givenName:_givenName,
                      middleName:_middleName,
                      familyName:_familyName,
                      familyName2:_familyName2,
                      voided:_voided,
                      uuId:_uuId};
            };
        }

        function toWrapper(openmrsModel){
            return new name(openmrsModel.givenName, openmrsModel.middleName, openmrsModel.familyName,
              openmrsModel.familyName2, openmrsModel.voided, openmrsModel.uuId );
        }

        function toArrayOfWrappers(openmrsNameArray){
            var array = [];
            for(var i = 0; i<openmrsNameArray.length;i++){
              array.push(toWrapper(openmrsNameArray[i]));
            }
            return array;
        }

        function fromArrayOfWrappers(nameWrappersArray){
            var array = [];
            for(var i = 0; i< nameWrappersArray.length; i++){
              array.push(nameWrappersArray[i].openmrsModel());
            }
            return array;
        }
    }
})();
