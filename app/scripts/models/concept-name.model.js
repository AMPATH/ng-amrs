/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
  'use strict';

  angular
      .module('models')
      .factory('ConceptNameModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      conceptName: ConceptName,
      toWrapper: toWrapper
    };

    return service;

    function ConceptName(display_, uuId_, name_, conceptNameType_) {
      var modelDefinition = this;

      // initialize private members
      var _display = display_? display_ : '';
      var _uuId = uuId_ ? uuId_: '';
      var _name = name_ ? name_: '';
      var _conceptNameType = conceptNameType_ ? conceptNameType_: '';


      modelDefinition.display = function(value){
        return _display;
      };

      modelDefinition.uuId = function(value) {
        if(angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.name = function(value) {
        if(angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.conceptNameType = function(value) {
        if(angular.isDefined(value)) {
          _conceptNameType = value;
        }
        else {
          return _conceptNameType;
        }
      };

      modelDefinition.openmrsModel = function(value) {
        return {display:_display,
                uuid:_uuId,
                name:_name,
                conceptNameType:_conceptNameType
        };
      };
    }

    function toWrapper(openmrsModel) {
      return new ConceptName(openmrsModel.display, openmrsModel.uuid, openmrsModel.name,
          openmrsModel.conceptNameType);
    }

  }
})();
