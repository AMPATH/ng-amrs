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
      var modelDefinition = this;
      var _uuid= openmrsPatient.uuid||'';
      var _name = openmrsPatient.display||'';
      var _preferredName=openmrsPatient.preferredName.display||'';
      var _age = openmrsPatient.age||0;
      var _birthdate =openmrsPatient.birthdate|| '';
      var _birthdateEstimated =openmrsPatient.birthdateEstimated|| false;
      var _gender = openmrsPatient.gender||'';
      var _address =mapAddress(openmrsPatient.preferredAddress)||'';
      var _dead = openmrsPatient.dead||'';
      var _deathDate = openmrsPatient.deathDate||'';
      var _causeOfDeath = openmrsPatient.causeOfDeath||'';
      var _attributes = openmrsPatient.attributes||'';

      /*
       Below are getters and setters for private properties
       The convention is usually to name private properties starting with _
       e.g _uuid is the private member and accessed via the setter below
      */

      modelDefinition.uuid = function(value){
        if(angular.isDefined(value)){
          _uuid = value;
        }
        else{
          return _uuid;
        }
      };

      modelDefinition.name = function(value){
        if(angular.isDefined(value)){
          _name = value;
        }
        else{
          return _name;
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

      modelDefinition.birthdateEstimated = function(value){
        if(angular.isDefined(value)){
          _birthdateEstimated = value;
        }
        else{
          return _birthdateEstimated;
        }
      };

      modelDefinition.gender  = function(value){
        if(angular.isDefined(value)){
          _gender  = value;
        }
        else{
          return _gender ;
        }
      };

      modelDefinition.address = function(value){
        if(angular.isDefined(value)){
          _address = value;
        }
        else{
          return _address;
        }
      };

      modelDefinition.preferredName = function(value){
        if(angular.isDefined(value)){
          _preferredName = value;
        }
        else{
          return _preferredName;
        }
      };

      modelDefinition.attributes = function(value){
        if(angular.isDefined(value)){
          _attributes = value;
        }
        else{
          return _attributes;
        }
      };

      modelDefinition.causeOfDeath = function(value){
        if(angular.isDefined(value)){
          _causeOfDeath = value;
        }
        else{
          return _causeOfDeath;
        }
      };

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
          name:_name,
          preferredName:_preferredName,
          age:_age,
          birthdate:_birthdate,
          gender :_gender ,
          address:_address,
          dead:_dead,
          deathDate:_deathDate,
          causeOfDeath:_causeOfDeath,
          attributes :_attributes,
          birthdateEstimated:_birthdateEstimated

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
