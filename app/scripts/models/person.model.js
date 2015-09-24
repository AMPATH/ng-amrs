/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('models')
        .factory('PersonModel', factory);

  factory.$inject = ['NameModel'];

  function factory(NameModel) {
    var service = {
      person: person,
      toWrapper: toWrapper
    };

    return service;

    function person(names_, gender_, uuId_, age_, birthdate_,
      birthdateEstimated_, dead_, deathDate_, causeOfDeath_, addresses_,
      attributes_, preferredName_, preferredAddress_ ) {
      var modelDefinition = this;

      //initialize private members
      var _names = names_ ? NameModel.toArrayOfWrappers(names_)  : [] ;
      var _gender = gender_ ? gender_ : '' ;
      var _uuId = uuId_ ? uuId_ : '' ;
      var _age = age_ ? age_ : null ;
      var _birthdate = birthdate_ ? birthdate_ : null ;
      var _birthdateEstimated = birthdateEstimated_ ? birthdateEstimated_ : null ;
      var _dead = dead_ ? dead_ : false ;
      var _deathDate = deathDate_ ? deathDate_ : null ;
      var _causeOfDeath = causeOfDeath_ ? causeOfDeath_ : '' ;
      var _addresses = addresses_ ? addresses_ : [] ;
      var _attributes = attributes_ ? attributes_ : [] ;
      var _preferredName = preferredName_ ? NameModel.toWrapper(preferredName_) : {} ;
      var _preferredAddress = preferredAddress_  ? preferredAddress_  : {} ;

      modelDefinition.names = function(value) {
        if (angular.isDefined(value)) {
          _names = value;
        }
        else {
          return _names;
        }
      };

      modelDefinition.gender = function(value) {
        if (angular.isDefined(value)) {
          _gender = value;
        }
        else {
          return _gender;
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

      modelDefinition.age = function(value) {
              if (angular.isDefined(value)) {
                _age = value;
              }
              else {
                return _age;
              }
       };

       modelDefinition.birthdate = function(value) {
               if (angular.isDefined(value)) {
                 _birthdate = value;
               }
               else {
                 return _birthdate;
               }
        };

        modelDefinition.birthdateEstimated = function(value) {
                if (angular.isDefined(value)) {
                  _birthdateEstimated = value;
                }
                else {
                  return _birthdateEstimated;
                }
         };

         modelDefinition.dead = function(value) {
                 if (angular.isDefined(value)) {
                   _dead = value;
                 }
                 else {
                   return _dead;
                 }
          };

         modelDefinition.deathDate = function(value) {
                  if (angular.isDefined(value)) {
                    _deathDate = value;
                  }
                  else {
                    return _deathDate;
                  }
           };

          modelDefinition.causeOfDeath = function(value) {
                    if (angular.isDefined(value)) {
                      _causeOfDeath = value;
                    }
                    else {
                      return _causeOfDeath;
                    }
            };

          modelDefinition.addresses = function(value) {
                      if (angular.isDefined(value)) {
                        _addresses = value;
                      }
                      else {
                        return _addresses;
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

            modelDefinition.preferredName = function(value) {
                          if (angular.isDefined(value)) {
                            _preferredName = value;
                          }
                          else {
                            return _preferredName;
                          }
              };

              modelDefinition.preferredAddress = function(value) {
                            if (angular.isDefined(value)) {
                              _preferredAddress = value;
                            }
                            else {
                              return _preferredAddress;
                            }
                };

      modelDefinition.openmrsModel = function(value) {
              return {names: NameModel.fromArrayOfWrappers(_names),
                      gender: _gender,
                      uuid: _uuId,
                      age: _age,
                      birthdate: _birthdate,
                      birthdateEstimated: _birthdateEstimated,
                      dead: _dead,
                      deathDate: _deathDate,
                      causeOfDeath: _causeOfDeath,
                      addresses: _addresses,
                      preferredName: _preferredName.openmrsModel(),
                      preferredAddress: _preferredAddress,
                      attributes: _attributes};
            };
    }

    function toWrapper(openmrsModel){
        return new person(openmrsModel.names, openmrsModel.gender, openmrsModel.uuid, openmrsModel.age,
          openmrsModel.birthdate, openmrsModel.birthdateEstimated, openmrsModel.dead, openmrsModel.deathDate,
          openmrsModel.causeOfDeath, openmrsModel.addresses, openmrsModel.attributes, openmrsModel.preferredName, openmrsModel.preferredAddress);
    }
  }
})();
