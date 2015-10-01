/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('EncounterModel', EncounterModel);

  EncounterModel.$inject = [];

  function EncounterModel() {
    var service = {
      model: Model,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function Model(openmrsModel) {
      var modelDefinition = this;

      //Evaluate the passed models for non-existent propertis.
      // Take care of provider special case
      if(openmrsModel.encounterProviders !== undefined) {
          if(openmrsModel.encounterProviders.length > 0) {
              openmrsModel.provider = 
                            openmrsModel.encounterProviders[0].provider;
          } else {
              openmrsModel.provider = {};
          }
      } else {
          openmrsModel.provider = openmrsModel.provider || {};
      }
      
      openmrsModel.encounterType = openmrsModel.encounterType || {};
      openmrsModel.patient = openmrsModel.patient || {};
      openmrsModel.location = openmrsModel.location || {};
      openmrsModel.form = openmrsModel.form || {};

      //initialize private members
      var _uuid = openmrsModel.uuid || '' ;
      var _patientUuid = openmrsModel.patient.uuid || '';
      var _encounterTypeName = openmrsModel.encounterType.display ||
                                openmrsModel.encounterType.name || '';
                                
      var _encounterTypeUuid = openmrsModel.encounterType.uuid || '';
      var _providerName = openmrsModel.provider.display || 
                                openmrsModel.provider.name || '';
                                
      var _providerUuid = openmrsModel.provider.uuid || '';
      var _encounterDate = openmrsModel.encounterDatetime || '';
      
      var _locationName = openmrsModel.location.display || 
                                    openmrsModel.location.name || '';
                                    
      var _locationUuid = openmrsModel.location.uuid || '';
      var _formUuid = openmrsModel.form.uuid || '';
      var _formName = openmrsModel.form.name || '';

      modelDefinition.uuid = function(value) {
        if (angular.isDefined(value)) {
          _uuid = value;
        } else {
          return _uuid;
        }
      };

      modelDefinition.patientUuid = function(value) {
        if(angular.isDefined(value)) {
          _patientUuid = value;
        } else {
          return _patientUuid;
        }
      };

      modelDefinition.encounterTypeName = function(value) {
        if (angular.isDefined(value)) {
          _encounterTypeName = value;
        } else {
          return _encounterTypeName;
        }
      };

      modelDefinition.encounterTypeUuid = function(value) {
        if (angular.isDefined(value)) {
          _encounterTypeUuid = value;
        } else {
          return _encounterTypeUuid;
        }
      };

      modelDefinition.providerName = function(value) {
        if (angular.isDefined(value)) {
          _providerName = value;
        } else {
          return _providerName;
        }
      };

      modelDefinition.providerUuid = function(value) {
        if (angular.isDefined(value)) {
          _providerUuid = value;
        } else {
          return _providerUuid;
        }
      };

      modelDefinition.encounterDate = function(value) {
        if (angular.isDefined(value)) {
          _encounterDate = value;
        } else {
          return _encounterDate;
        }
      };

      modelDefinition.locationName = function(value) {
        if (angular.isDefined(value)) {
          _locationName = value;
        } else {
          return _locationName;
        }
      };
      modelDefinition.locationUuid = function(value) {
        if (angular.isDefined(value)) {
          _locationUuid = value;
        } else {
          return _locationUuid;
        }
      };

      modelDefinition.formUuid = function(value) {
        if (angular.isDefined(value)) {
            _formUuid = value;
        } else {
          return _formUuid;
        }
      };

      modelDefinition.formName = function(value) {
        if(angular.isDefined(value)) {
          _formName = value;
        } else {
          return _formName;
        }
      };

      modelDefinition.openmrsModel = function() {
        /* jshint ignore:start */
        return {
            "uuid" : _uuid,
            "patient" : _patientUuid,
            "encounterDatetime" : _encounterDate,
            "encounterType" : _encounterTypeUuid,
            "provider" : _providerUuid,
            "location" : _locationUuid,
            "form" : _formUuid
        };
        /* jshint ignore:end */
      };
    }

    function toArrayOfModels(encounterArray) {
      var modelArray = [];
      for(var i=0; i<encounterArray.length; i++) {
        modelArray.push(new Model(encounterArray[i]));
      }
      return modelArray;
    }
  }
})();
