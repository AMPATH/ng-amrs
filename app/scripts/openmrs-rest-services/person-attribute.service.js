/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('PersonAttributesRestService', PersonAttributesRestService);

  PersonAttributesRestService.$inject = ['OpenmrsSettings', '$resource'];

  function PersonAttributesRestService(OpenmrsSettings, $resource) {
    var service = {
      getPersonAttributeByUuid: getPersonAttributeByUuid,
      saveUpdatePersonAttribute:saveUpdatePersonAttribute,
      voidPersonAttribute: voidPersonAttribute,
      getPersonAttributeFieldValues:getPersonAttributeFieldValues,     
      getPersonAttributeValue:getPersonAttributeValue
      
    }

    return service;

    function getPersonAttributeResource() {
      var v = 'custom:(uuid,value,attributeType:(uuid,uuid))';
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/attribute/:personattributeuuid',
        { uuid: '@uuid', personattributeuuid:'@personattributeuuid'},
        { query: { method: 'GET', isArray: false } });
    }

    function saveUpdatePersonAttribute(personAttribute, successCallback, errorCallback)
    {
      var personAttributeResource = getPersonAttributeResource()
      var patient=personAttribute.person;      
      var patientUuid=patient.uuid();
       var personAttributeUuid=personAttribute.attribute.uuid;
      if (patientUuid !== undefined)
      {
        //update personAttribute    
        if(personAttributeUuid){
          delete personAttribute.attribute['uuid'];
         
        }
        personAttributeResource.save({uuid:patientUuid, personattributeuuid:personAttributeUuid }, JSON.stringify(personAttribute.attribute)).$promise
          .then(function (data) {
          successCallback(data);
        })
          .catch(function (error) {
            console.error('An Error occured when saving person attribute ',error);
            if (typeof errorCallback === 'function')
              errorCallback('Error processing request', error);
        });        
      }
    }

    function getPersonAttributeByUuid(personAttribute, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource()
      var patient=personAttribute.person;      
      var patientUuid=patient.uuid();
      return personAttributeResource.get({uuid:patientUuid, personattributeuuid: personAttribute.attribute.uuid }).$promise
        .then(function (data) {
        successCallback(data);
      })
        .catch(function (error) {
          console.error('An Error occured when getting person attribute ',error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
      });
    }

    function voidPersonAttribute(personAttribute, successCallback, errorCallback) {
       var personAttributeResource = getPersonAttributeResource();
       var patient=personAttribute.person;      
       var patientUuid=patient.uuid();
       personAttributeResource.delete({uuid:patientUuid, personattributeuuid:personAttribute.attribute.uuid},
        function (data) {
          if (successCallback) { successCallback(data); }
          else return data;
        },
        function(error){
          console.error('An Error occured when voiding person attribute ',error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        }
      );
    }
    
     function getPersonAttributeFieldValues(personAttributes, person){
            _.each(personAttributes, function(attribute){
              var personAttribute={attribute:attribute,person:person}                                 
              saveUpdatePersonAttribute(personAttribute,function(response){
               console.log('Person attribute value',response.attributeType.uuid),
               function (error){
                 console.log('An Error Occurred while getting the person attributes')
               }
             });
           })

    return personAttributes;
    }       
   
  function getPersonAttributeValue(attributes,key){
        var attributeType=key.split('_')[1].replace(/n/gi,'-');    
        var val = _.filter(attributes, function(attribute_){           
          if(key !== undefined){
           if(attribute_.attributeType === attributeType){
             return attribute_.value; 
           } 
          }            
          });
          
      return val;  
     }
  }
})();
