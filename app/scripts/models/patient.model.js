/*jshint -W003, -W098, -W117, -W026, -W040, -W004, -W093 */
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
    //  console.log('patient value from the promise(REST SERVICE)');
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
      var _address =mapAddress(openmrsPatient.person.preferredAddress)||[];
      var _dead = openmrsPatient.person.dead||'';
      var _deathDate = formatDate(openmrsPatient.person.deathDate)||'';
      var _attributes = openmrsPatient.person.attributes||[];
      //var _causeOfDeath = openmrsPatient.causeOfDeath||'';
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
          //return _identifier[0].display.split('=')[1];
          return _identifier[0].identifier;
        }
        else{
          return _identifier = '';
        }

      };
      modelDefinition.commonIdentifiers = function(value){

        if(_identifier.length > 0) {
          //return _identifier[0].display.split('=')[1];
          var filteredIdentifiers;
          var identifier =_identifier;
          var kenyaNationalId =getIdentifierByType(identifier, 'KENYAN NATIONAL ID NUMBER');
          var amrsMrn =getIdentifierByType(identifier, 'AMRS Medical Record Number');
          var ampathMrsUId=getIdentifierByType(identifier, 'AMRS Universal ID');
          var cCC=getIdentifierByType(identifier, 'CCC');
          if(angular.isUndefined(kenyaNationalId) && angular.isUndefined(amrsMrn) &&
            angular.isUndefined(ampathMrsUId) && angular.isUndefined(cCC))
          {
            if (angular.isDefined(_identifier[0].identifier)) {
              filteredIdentifiers = {'default': _identifier[0].identifier};
            }
            else{
              filteredIdentifiers = {'default': ''};
            }
          }
          else {
            filteredIdentifiers = {
              'kenyaNationalId': kenyaNationalId,
              'amrsMrn': amrsMrn,
              'ampathMrsUId': ampathMrsUId,
              'cCC': cCC
            };
          }
          return filteredIdentifiers;
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

      modelDefinition.address = function(value){
        if(angular.isDefined(value)){
          _address = value;
        }
        else{
          return _address;
        }
      };

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
      modelDefinition.phoneNumber = function(value) {
        var phoneNumberPersonAttributeTypeUuid='72a759a8-1359-11df-a1f1-0026b9348838';
        return getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
      };
      modelDefinition.healthCenter = function(value) {
        var healthCenterPersonAttributeTypeUuid='8d87236c-c2cc-11de-8d13-0010c6dffd0f';
        var location =getPersonAttribute(healthCenterPersonAttributeTypeUuid);
        if(angular.isDefined(location)){
          return location.display;
        }
        else{
          return '';
        }
      };
      modelDefinition.isTestorFakePatient = function(value) {
        var testPatientPersonAttributeTypeUuid='1e38f1ca-4257-4a03-ad5d-f4d972074e69';
        var isTestPatient=getPersonAttribute(testPatientPersonAttributeTypeUuid);
        if(isTestPatient==='true'){
          return 'Test Patient';
        }
        else{
          return '';
        }

      };
      var _convertedAttributes = [];
      modelDefinition.getPersonAttributes = function(value) {
        _convertedAttributes.length = 0;
        if(_attributes.length>0){
          for(var i in _attributes) {
            var attr = _attributes[i];
            _convertedAttributes.push(
              { uuid:attr.uuid,
                attributeType:attr.attributeType.uuid,
                name:attr.attributeType.display,
                value:attr.value,
                size:_attributes.length
              }
            );
          }
        }
        return _convertedAttributes;
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

      // get the person attribute value from a list of attributes using the person attribute type uuid
      function getPersonAttribute(personAttributeTypeUuid){
        if(_attributes.length>0) {
          for(var i in _attributes) {
            var attr = _attributes[i];
            if(attr.attributeType.uuid === personAttributeTypeUuid) {
              return attr.value;
            }
          }
        }

      }

    }

    //Other Util Functions
    function mapAddress(preferredAddress) {
      return preferredAddress ? {
        'county': preferredAddress.address1,
        'subCounty': preferredAddress.address2,
        'estateLandmark': preferredAddress.address3,
        'townVillage': preferredAddress.cityVillage,
        'stateProvince': preferredAddress.stateProvince

        //Added the noAddress to aid in creating logic for hiding when the patient has no address
      } : {noAddress:'None'};
    }
    function getIdentifierByType(identifierObject, type ) {
      for (var e in identifierObject) {
        if (angular.isDefined(identifierObject[e].identifierType)) {
          var idType = identifierObject[e].identifierType.name;
          var id = identifierObject[e].identifier;
          if (idType === type) {
            return id;
          }
        }
      }
    }
    //format dates
    function formatDate(dateString){
      var formattedDate='';
      if(dateString!==null) {
          var date = new Date(dateString);
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();

          if (10 > monthIndex) {
            monthIndex = '0' + monthIndex;
          }
          if (10 > day) {
            day = '0' + day;
          }
          formattedDate = day + '-' + monthIndex + '-' +year ;
      }

      return formattedDate;
    }

  }
})();
