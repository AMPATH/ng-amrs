/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('EncounterModel', EncounterModel);

  EncounterModel.$inject = [];

  function EncounterModel() {
    var service = {
      encounter: encounter
    };

    return service;

    function encounter(uuid_, encounterTypeName_, encounterTypeUuid_, formUuid_, providerName_, providerUuid_, encounterDate_, locationName_, locationUuid_) {
      var modelDefinition = this;

      //initialize private members
      var _uuid = uuid_ ? uuid_ : '' ;
      var _encounterTypeName = encounterTypeName_ ? encounterTypeName_ : '' ;
      var _encounterTypeUuid = encounterTypeUuid_ ? encounterTypeUuid_ : '' ;
      var _providerName = providerName_ ? providerName_ : '' ;
      var _providerUuid = providerUuid_ ? providerUuid_ : '' ;
      var _encounterDate = encounterDate_ ? encounterDate_ : '' ;
      var _locationName = locationName_ ? locationName_ : '' ;
      var _locationUuid = locationUuid_ ? locationUuid_ : '' ;
      var _formUuid = formUuid_ ? formUuid_ : '' ;

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

      modelDefinition.openmrsModel = function(value) {
              return {uuid: _uuid,
                      encounterTypeName: _encounterTypeName,
                      encounterTypeUuid: _encounterTypeUuid,
                      providerName: _providerName,
                      providerUuid: _providerUuid,
                      encounterDate: _encounterDate,
                      locationName: _locationName,
                      locationUuid: _locationUuid,
                      formUuid, _formUuid};
            };
    }
  }
})();
