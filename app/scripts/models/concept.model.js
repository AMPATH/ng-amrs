/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('ConceptModel', factory);

  factory.$inject = ['ConceptNameModel', 'ConceptClassModel'];

  function factory(ConceptNameModel, ConceptClassModel) {
    var service = {
      concept: concept,
      toWrapper: toWrapper
    };

    return service;

    function concept(name_, uuId_, conceptClass_) {
      var modelDefinition = this;

      //initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? ConceptNameModel.toWrapper(name_) : undefined;
      var _conceptClass = conceptClass_ ? ConceptClassModel.toWrapper(conceptClass_): undefined;

      modelDefinition.name = function(value) {
        if (angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.conceptClass = function(value) {
              if (angular.isDefined(value)) {
                _conceptClass = value;
              }
              else {
                return _conceptClass;
              }
       };
       
      modelDefinition.display = function(value) {
             
              return _name?_name.display(): undefined;
       };

      modelDefinition.openmrsModel = function(value) {
              return {name: _name? _name.openmrsModel():undefined,
                      uuid: _uuId,
                      conceptClass: _conceptClass? _conceptClass.openmrsModel():undefined
              };
       };
    }

    function toWrapper(openmrsModel){
        return new concept(openmrsModel.name, openmrsModel.uuid, openmrsModel.conceptClass);
    }
  }
})();
