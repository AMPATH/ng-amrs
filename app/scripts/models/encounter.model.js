/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('EncounterModel', EncounterModel);

  EncounterModel.$inject = [];

  function EncounterModel() {
    var service = {
      encounter: EncounterModel,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function EncounterModel(openmrsModel) {
      var modelDefinition = this;
      
      //Evaluate the passed models for non-existent propertis.
      openmrsModel.encounterType = openmrsModel.encounterType || {};
      openmrsModel.provider = openmrsModel.provider || {};
      openmrsModel.location = openmrsModel.location || {};
      openmrsModel.form = openmrsModel.form || {};
      
      //initialize private members
      var _uuid = openmrsModel.uuid || '' ;
      var _encounterTypeName = openmrsModel.encounterType.display ||'';
      var _encounterTypeUuid = openmrsModel.encounterType.uuid || '';
      var _providerName = openmrsModel.provider.display || '';
      var _providerUuid = openmrsModel.provider.uuid || '';
      var _encounterDate = openmrsModel.encounterDatetime || '';
      var _locationName = openmrsModel.location.display || '';
      var _locationUuid = openmrsModel.location.uuid || '';
      var _formUuid = openmrsModel.form.uuid || '' ;

      modelDefinition.uuid = function(value) {
        if (angular.isDefined(value)) {
          _uuid = value;
        }
        else {
          return _uuid;
        }
      };

      modelDefinition.encounterTypeName = function(value) {
              if (angular.isDefined(value)) {
                _encounterTypeName = value;
              }
              else {
                return _encounterTypeName;
              }
            };

      modelDefinition.encounterTypeUuid = function(value) {
              if (angular.isDefined(value)) {
                      _encounterTypeUuid = value;
                    }
              else {
                      return _encounterTypeUuid;
                    }
                  };

      modelDefinition.providerName = function(value) {
              if (angular.isDefined(value)) {
                _providerName = value;
              }
              else {
                return _providerName;
              }
            };

      modelDefinition.providerUuid = function(value) {
              if (angular.isDefined(value)) {
                _providerUuid = value;
              }
              else {
                return _providerUuid;
              }
            };

      modelDefinition.encounterDate = function(value) {
              if (angular.isDefined(value)) {
                _encounterDate = value;
              }
              else {
                return _encounterDate;
              }
            };

      modelDefinition.locationName = function(value) {
                    if (angular.isDefined(value)) {
                      _locationName = value;
                    }
                    else {
                      return _locationName;
                    }
                  };
      modelDefinition.locationUuid = function(value) {
                  if (angular.isDefined(value)) {
                                  _locationUuid = value;
                              }
                  else {
                                  return _locationUuid;
                                }
                              };

      modelDefinition.formUuid = function(value) {
                  if (angular.isDefined(value)) {
                      _formUuid = value;
                      }
                  else {
                        return _formUuid;
                        }
              };

      modelDefinition.openmrsModel = function() {
          return {
              "uuid" : _uuid,
              "encounterDatetime" : _encounterDate,
              "encounterType" : _encounterTypeUuid,
              "provider" : _providerUuid,
              "location" : _locationUuid,
              "form" : _formUuid
          };
      };
    }
    
    function toArrayOfModels(encounterArray) {
      var modelArray = [];
      for(var i=0; i<encounterArray.length; i++) {
        modelArray.push(new EncounterModel(encounterArray[i]));
      }
      return modelArray;
    }
  }
})();
