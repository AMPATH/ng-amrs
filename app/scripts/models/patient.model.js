/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
    .module('models')
    .factory('PatientModel', factory);

  factory.$inject = [];

  function factory() {
    var patient = {
      patient: patient
    };

    return patient;

    //this is the contructor for the patient object
    //call this using the new function
    //e.g. var p = new Patient(openmrsPatient);
    //get the members for ses using p.uuid();
    //set the members for ses using ses.sessionId(newValue);

    function patient(openmrsPatient) {
      //initialize private members by first checking whether the openmrPatient properties are set before assigning default values
      console.log('patient value from the promise(REST SERVICE)');
    //  console.log(openmrsPatient);

      var modelDefinition = this;
      var _uuid = openmrsPatient.uuid || '';
      var _identifier = openmrsPatient.identifiers || '';
      var _givenName = openmrsPatient.person.preferredName.givenName || '';
      var _middleName = openmrsPatient.person.preferredName.middleName  || '';
      var _familyName = openmrsPatient.person.preferredName.familyName || '';
      //var _preferredName=openmrsPatient.preferredName.display||'';
      var _age = openmrsPatient.person.age||0;
      var _birthdate =openmrsPatient.person.birthdate|| '';
      //var _birthdateEstimated =openmrsPatient.birthdateEstimated|| false;
      var _gender = openmrsPatient.person.gender||'';
      //var _address =mapAddress(openmrsPatient.preferredAddress)||'';
      var _dead = openmrsPatient.person.dead||'';
      var _deathDate = openmrsPatient.person.deathDate||'';
      //var _causeOfDeath = openmrsPatient.causeOfDeath||'';
      //var _attributes = openmrsPatient.attributes||'';

      /*
       Below are getters and setters for private properties
       The convention is usually to name private properties starting with _
       e.g _uuid is the private member and accessed via the setter below
      */

      modelDefinition.identifier = function(value){
        if(angular.isDefined(value)){
          _identifier = value;
        }
        else{
          return _identifier;
        }
      };
      modelDefinition.identifierFormatted = function(value){

        if(_identifier.length > 0) {
          return _identifier[0].display.split('=')[1];
        }
        else{
          return _identifier = '';
        }

      };
      modelDefinition.uuid = function(value){
        if(angular.isDefined(value)){
          _uuid = value;
        }
        else{
          return _uuid;
        }
      };

      modelDefinition.givenName = function(value){
        if(angular.isDefined(value)){
          _givenName = value;
        }
        else{
          return _givenName;
        }
      };

      modelDefinition.middleName = function(value){
        if(angular.isDefined(value)){
          _middleName = value;
        }
        else{
          return _middleName;
        }
      };

      modelDefinition.fullNames = function(value){

          return _givenName + ' ' + _middleName + ' '+  _familyName;

      };

      modelDefinition.familyName = function(value){
        if(angular.isDefined(value)){
          _familyName = value;
        }
        else{
          return _familyName;
        }
      };

      modelDefinition.age = function(value){
        if(angular.isDefined(value)){
          _age = value;
        }
        else{
          return _age;
        }
      };

      modelDefinition.birthdate = function(value){
        if(angular.isDefined(value)){
          _birthdate = value;
        }
        else{
          return _birthdate;
        }
      };

      // modelDefinition.birthdateEstimated = function(value){
      //   if(angular.isDefined(value)){
      //     _birthdateEstimated = value;
      //   }
      //   else{
      //     return _birthdateEstimated;
      //   }
      // };

      modelDefinition.gender  = function(value){
        if(angular.isDefined(value)){
          _gender  = value;
        }
        else{
          return _gender ;
        }
      };

      modelDefinition.genderFull  = function(value){
          return _gender === 'M' ? 'Male':'Female';
      };

      // modelDefinition.address = function(value){
      //   if(angular.isDefined(value)){
      //     _address = value;
      //   }
      //   else{
      //     return _address;
      //   }
      // };

      // modelDefinition.preferredName = function(value){
      //   if(angular.isDefined(value)){
      //     _preferredName = value;
      //   }
      //   else{
      //     return _preferredName;
      //   }
      // };
      //
      // modelDefinition.attributes = function(value){
      //   if(angular.isDefined(value)){
      //     _attributes = value;
      //   }
      //   else{
      //     return _attributes;
      //   }
      // };
      //
      // modelDefinition.causeOfDeath = function(value){
      //   if(angular.isDefined(value)){
      //     _causeOfDeath = value;
      //   }
      //   else{
      //     return _causeOfDeath;
      //   }
      // };

      modelDefinition.deathDate = function(value){
        if(angular.isDefined(value)){
          _deathDate = value;
        }
        else{
          return _deathDate;
        }
      };

      modelDefinition.dead = function(value){
        if(angular.isDefined(value)){
          _dead = value;
        }
        else{
          return _dead;
        }
      };

      modelDefinition.openmrsModel = function(value){
        return {
          uuid:_uuid,
          identifier: _identifier,
          givenName:_givenName,
          familyName: _familyName,
          middleName:_middleName,

      //    preferredName:_preferredName,
          age:_age,
          birthdate:_birthdate,
          gender:_gender,
        //  address:_address,
          dead:_dead,
          deathDate:_deathDate
          //causeOfDeath:_causeOfDeath,
          //attributes:_attributes,
          //birthdateEstimated:_birthdateEstimated

        };
      };


    }

    //Other Util Functions
    function mapAddress(preferredAddress) {
      return preferredAddress ? {
        address1: preferredAddress.address1,
        address2: preferredAddress.address2,
        address3: preferredAddress.address3,
        cityVillage: preferredAddress.cityVillage,
        stateProvince: preferredAddress.stateProvince
      } : {};
    };




  }
})();
