/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
    'use strict';

    angular
        .module('models')
        .factory('ConceptClassModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            conceptClass: ConceptClass,
            toWrapper:toWrapper
        };

        return service;
       
        function ConceptClass(display_, uuId_, name_, description_, retired_) {
            var modelDefinition = this;

            //initialize private members
            var _display = display_? display_: '';
            var _uuId = uuId_ ? uuId_: '';
            var _name = name_ ? name_: '';
            var _description = description_ ? description_: '';
            var _retired = retired_;


            modelDefinition.display = function(value){
                return _display;
            };

            modelDefinition.uuId = function(value){
              if(angular.isDefined(value)){
                _uuId = value;
              }
              else{
                return _uuId;
              }
            };

            modelDefinition.name = function(value){
              if(angular.isDefined(value)){
                _name = value;
              }
              else{
                return _name;
              }
            };

            modelDefinition.description = function(value){
              if(angular.isDefined(value)){
                _description = value;
              }
              else{
                return _description;
              }
            };
            
            modelDefinition.retired = function(value){
              if(angular.isDefined(value)){
                _retired = value;
              }
              else{
                return _retired;
              }
            };            

            modelDefinition.openmrsModel = function(value){
              return {display:_display,
                      uuid:_uuId,
                      name:_name,
                      description:_description,
                      retired: _retired
              };
            };
        }

        function toWrapper(openmrsModel){
            return new ConceptClass(openmrsModel.display, openmrsModel.uuid, openmrsModel.name,
              openmrsModel.description, openmrsModel.retired);
        }

    }
})();
