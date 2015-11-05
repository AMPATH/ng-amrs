/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('ProviderModel', factory);

  factory.$inject = ['PersonModel'];

  function factory(PersonModel) {
    var service = {
      provider: provider,
      toWrapper: toWrapper
    };

    return service;

    function provider(person_, identifier_, uuId_,  display_, attributes_, retired_) {
      var modelDefinition = this;

      //initialize private members
      var _identifier = identifier_ ? identifier_ : '';
      var _person = person_ ? PersonModel.toWrapper(person_) :undefined;
      var _uuId = uuId_ ? uuId_ : '';
      var _display = display_ ? display_  : '' ;
      var _attributes = attributes_ ? attributes_ : null;
      var _retired = retired_ ? retired_ : null ;

      modelDefinition.display = function(value) {
        if (angular.isDefined(value)) {
          _display = value;
        }
        else {
          return _display;
        }
      };
      
     modelDefinition.person = function(value) {
        if (angular.isDefined(value)) {
          _person = value;
        }
        else {
          return _person;
        }
      };
      
     modelDefinition.personUuid = function(value) {
         var ret = _person? _person.uuId():null;
          return ret;
      };

      modelDefinition.identifier = function(value) {
        if (angular.isDefined(value)) {
          _identifier = value;
        }
        else {
          return _identifier;
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

      modelDefinition.attributes = function(value) {
              if (angular.isDefined(value)) {
                _attributes = value;
              }
              else {
                return _attributes;
              }
      };
       
      modelDefinition.retired = function(value) {
              if (angular.isDefined(value)) {
                _retired = value;
              }
              else {
                return _retired;
              }
       };

      modelDefinition.openmrsModel = function(value) {
              return {identifier: _identifier,
                      person: _person.openmrsModel(),
                      attributes: _attributes,
                      retired: _retired};
            };
    }

    function toWrapper(openmrsModel) {
      //provider(person_, identifier_, uuId_,  display_, attributes_)
        return new provider(openmrsModel.person, openmrsModel.identifier, openmrsModel.uuid, openmrsModel.display,
          openmrsModel.attributes, openmrsModel.retired);
    }
  }
})();
