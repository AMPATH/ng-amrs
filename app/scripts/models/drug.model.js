/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('DrugModel', factory);

  factory.$inject = ['ConceptModel'];

  function factory(ConceptModel) {
    var service = {
      drug: drug,
      toWrapper: toWrapper
    };

    return service;

    function drug(name_, uuId_, description_, dosageForm_, doseStrength_, maximumDailyDose_, minimumDailyDose_, units_,concept_) {
      var modelDefinition = this;

      //initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? name_ : '';
      var _description = description_ ? description_ : '';
      var _dosageForm = dosageForm_ ? dosageForm_ : '';
      var _doseStrength = name_ ? doseStrength_ : '';
      var _maximumDailyDose = name_ ? maximumDailyDose_ : '';
      var _minimumDailyDose = minimumDailyDose_ ? minimumDailyDose_ : '';
      var _units = units_ ? units_ : '';
      var _concept = concept_ ? ConceptModel.toWrapper(concept_): undefined;

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


      modelDefinition.description = function(value) {
        if (angular.isDefined(value)) {
          _description = value;
        }
        else {
          return _description;
        }
      };


      modelDefinition.dosageForm = function(value) {
        if (angular.isDefined(value)) {
          _dosageForm = value;
        }
        else {
          return _dosageForm;
        }
      };


      modelDefinition.doseStrength = function(value) {
        if (angular.isDefined(value)) {
          _doseStrength = value;
        }
        else {
          return _doseStrength;
        }
      };

      modelDefinition.maximumDailyDose = function(value) {
        if (angular.isDefined(value)) {
          _maximumDailyDose = value;
        }
        else {
          return _maximumDailyDose;
        }
      };

      modelDefinition.minimumDailyDose = function(value) {
        if (angular.isDefined(value)) {
          _minimumDailyDose = value;
        }
        else {
          return _minimumDailyDose;
        }
      };

      modelDefinition.units = function(value) {
        if (angular.isDefined(value)) {
          _units = value;
        }
        else {
          return _units;
        }
      };

      modelDefinition.concept = function(value) {
              if (angular.isDefined(value)) {
                _concept = value;
              }
              else {
                return _concept;
              }
       };

      modelDefinition.openmrsModel = function(value) {
              return {name: _name? _name.openmrsModel():undefined,
                      uuid: _uuId,
                      description:_description,
                      dosageForm:_dosageForm,
                      doseStrength:_doseStrength,
                      maximumDailyDose:_maximumDailyDose,
                      minimumDailyDose:_minimumDailyDose,
                      units:_units,
                      concept: _concept? _concept.openmrsModel():undefined
              };
       };
    }

    function toWrapper(openmrsModel){
        return new drug(openmrsModel.name, openmrsModel.uuid, openmrsModel.description, openmrsModel.dosageForm, openmrsModel.doseStrength, openmrsModel.maximumDailyDose, openmrsModel.minimumDailyDose, openmrsModel.units, openmrsModel.concept);
    }
  }
})();
