/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
    'use strict';

    angular
        .module('models')
        .factory('UserModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            user: user
        };

        return service;

        function user(userName_, personUuId_, password_, uuId_, systemId_) {
            var modelDefinition = this;

            //initialize private members
            var _uuId = uuId_ ? uuId_ : '' ;
            var _systemId = systemId_ ? systemId_ : '' ;
            var _userName = userName_ ? userName_ : '' ;
            var _personUuId = personUuId_ ? personUuId_ : '' ;
            var _password = personUuId_ ? password_ : '' ;


            modelDefinition.uuId = function(value){
              if(angular.isDefined(value)){
                _uuId = value;
              }
              else{
                return _uuId;
              }
            };

            modelDefinition.systemId = function(value){
              if(angular.isDefined(value)){
                _systemId = value;
              }
              else{
                return _systemId;
              }
            };

            modelDefinition.userName = function(value){
              if(angular.isDefined(value)){
                _userName = value;
              }
              else{
                return _userName;
              }
            };

            modelDefinition.personUuId = function(value){
              if(angular.isDefined(value)){
                _personUuId = value;
              }
              else{
                return _personUuId;
              }
            };

            modelDefinition.password = function(value){
              if(angular.isDefined(value)){
                _password = value;
              }
              else{
                return _password;
              }
            };

            modelDefinition.openmrsModel = function(value){
              return {username: _userName,
                      password: _password,
                      person: _personUuId,
                      systemId: _systemId};
            };
        }
    }
})();
