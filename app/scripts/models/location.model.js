/* global angular */
/* jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('LocationModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      location: Location,
      toWrapper: toWrapper,
      toArrayOfWrappers: toArrayOfWrappers,
      fromArrayOfWrappers:fromArrayOfWrappers
    };

    return service;

    function Location(name_, uuId_, description_, address1_,  address2_,
      cityVillage_, stateProvince_, country_, postalCode_, latitude_,
      longitude_, countyDistrict_, address3_, address4_, address5_, address6_,
      tags_, parentLocation_, childLocations_, attributes_) {
      var modelDefinition = this;

      // initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? name_ : '' ;
      var _description = description_ ? description_ : '' ;
      var _address1 = address1_ ? address1_ : '' ;
      var _address2 = address2_ ? address2_ : '' ;
      var _cityVillage = cityVillage_ ? cityVillage_ : '';
      var _stateProvince = stateProvince_ ? stateProvince_ : '';
      var _country = country_ ? country_ : '';
      var _postalCode = postalCode_ ? postalCode_ : '';
      var _latitude = latitude_ ? latitude_ : '';
      var _longitude = longitude_ ? longitude_ : '';
      var _address3 = address3_ ? address3_ : '';
      var _address4 = address4_ ? address4_ : '';
      var _address5 = address5_ ? address5_ : '';
      var _address6 = address6_ ? address6_ : '';
      var _tags = tags_ ? tags_ : '';

      var _parentLocation = parentLocation_ ? toWrapper( parentLocation_) :undefined;
      var _childLocations = childLocations_ ? toArrayOfWrappers(childLocations_): [];
      var _attributes = attributes_ ? attributes_ : '' ;

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };


      modelDefinition.name = function(value) {
        if (angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
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

      modelDefinition.address1 = function(value) {
        if (angular.isDefined(value)) {
          _address1 = value;
        }
        else {
          return _address1;
        }
      };

      modelDefinition.address2 = function(value) {
        if (angular.isDefined(value)) {
          _address2 = value;
        }
        else {
          return _address2;
        }
      };

      modelDefinition.cityVillage = function(value) {
        if (angular.isDefined(value)) {
          _cityVillage = value;
        }
        else {
          return _cityVillage;
        }
      };

      modelDefinition.stateProvince = function(value) {
        if (angular.isDefined(value)) {
          _stateProvince = value;
        }
        else {
          return _stateProvince;
        }
      };

      modelDefinition.country = function(value) {
        if (angular.isDefined(value)) {
          _country = value;
        }
        else {
          return _country;
        }
      };

      modelDefinition.postalCode = function(value) {
        if (angular.isDefined(value)) {
          _postalCode = value;
        }
        else {
          return _postalCode;
        }
      };

      modelDefinition.latitude = function(value) {
        if (angular.isDefined(value)) {
          _latitude = value;
        }
        else {
          return _latitude;
        }
      };

      modelDefinition.longitude = function(value) {
        if (angular.isDefined(value)) {
          _longitude = value;
        }
        else {
          return _longitude;
        }
      };

      modelDefinition.address3 = function(value) {
        if (angular.isDefined(value)) {
          _address3 = value;
        }
        else {
          return _address3;
        }
      };

      modelDefinition.address4 = function(value) {
        if (angular.isDefined(value)) {
          _address4 = value;
        }
        else {
          return _address4;
        }
      };
                  
      modelDefinition.address5 = function(value) {
        if (angular.isDefined(value)) {
          _address5 = value;
        }
        else {
          return _address5;
        }
      };
                                    
      modelDefinition.address6 = function(value) {
        if (angular.isDefined(value)) {
          _address6 = value;
        }
        else {
          return _address6;
        }
      };

      modelDefinition.tags = function(value) {
        if (angular.isDefined(value)) {
          _tags = value;
        }
        else {
          return _tags;
        }
      };

      modelDefinition.parentLocation = function(value) {
        if (angular.isDefined(value)) {
          _parentLocation = value;
        }
        else {
          return _parentLocation;
        }
      };

      modelDefinition.childLocations = function (value) {
        if (angular.isDefined(value)) {
          _childLocations = value;
        }
        else {
          return _childLocations;
        }
      };

      modelDefinition.attributes = function (value) {
        if (angular.isDefined(value)) {
          _attributes = value;
        }
        else {
          return _attributes;
        }
      };

      modelDefinition.display = function (value) {
        return _name + ' [' + _description + ']';
      };

      modelDefinition.openmrsModel = function(value) {
        return {name: _name,
                description: _description,
                address1: _address1,
                address2: _address2,
                cityVillage: _cityVillage,
                stateProvince: _stateProvince,
                country: _country,
                postalCode: _postalCode,
                latitude: _latitude,
                longitude: _longitude,
                address3: _address3,
                address4: _address4,
                address5: _address5,
                address6: _address6,
                tags: _tags,
                parentLocation:_parentLocation? _parentLocation.openmrsModel():undefined,
                childLocations: fromArrayOfWrappers(_childLocations),
                attributes: _attributes};
      };
    }

    function toWrapper(openmrsModel){
      if(openmrsModel!==undefined){
            var obj = new Location(openmrsModel.name, openmrsModel.uuid,
        openmrsModel.description, openmrsModel.address1, openmrsModel.address2,
        openmrsModel.cityVillage, openmrsModel.stateProvince,
        openmrsModel.country, openmrsModel.postalCode, openmrsModel.latitude,
        openmrsModel.longitude, openmrsModel.countyDistrict,
        openmrsModel.address3, openmrsModel.address4,
        openmrsModel.address5, openmrsModel.address6, openmrsModel.tags,
        openmrsModel.parentLocation, openmrsModel.childLocations,
        openmrsModel.attributes
      );

      return obj;
        
      }
  
    }

    function toArrayOfWrappers(openmrsLocationArray) {
      var array = [];
      for(var i = 0; i<openmrsLocationArray.length;i++) {
        array.push(toWrapper(openmrsLocationArray[i]));
      }

      return array;
    }

    function fromArrayOfWrappers(locationWrappersArray) {
      var array = [];
      for(var i = 0; i< locationWrappersArray.length; i++) {
        array.push(locationWrappersArray[i].openmrsModel());
      }

      return array;
    }
  }
})();
