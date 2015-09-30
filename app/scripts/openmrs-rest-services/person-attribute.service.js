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
      getPersonAttributeFieldValues:getPersonAttributeFieldValues
    }

    return service;

    function getPersonAttributeResource() {
      var v = 'custom:(uuid,value,attributeType:(uuid,uuid))';
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/attribute',
        { uuid: '@uuid', v:v},
        { query: { method: 'GET', isArray: false } });
    }

    function saveUpdatePersonAttribute(personAttribute, successCallback, errorCallback)
    {
      var personAttributeResource = getPersonAttributeResource()
      
      if (personAttribute.uuid !== undefined)
      {
        //update personAttribute
        var uuid = personAttribute.uuid
        delete personAttribute['uuid'];
        console.log('Stringified Person Attribute Resource', JSON.stringify(personAttribute))
        personAttributeResource.save({uuid: uuid }, JSON.stringify(personAttribute)).$promise
          .then(function (data) {
          successCallback(data);
        })
          .catch(function (error) {
            console.error('An Error occured when saving personAttribute ',error);
            if (typeof errorCallback === 'function')
              errorCallback('Error processing request', error);
        });
        
      }
      else {
        personAttributeResource = getPersonAttributeResource()
        personAttributeResource.save(personAttribute).$promise
        .then(function (data) {
        successCallback(data);
      })
        .catch(function (error) {
          console.error('An Error occured when saving personAttribute ',error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);

      });
      }
    }

    function getPersonAttributeByUuid(personAttribute, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource()

      return personAttributeResource.get({ uuid: personAttribute.uuid }).$promise
        .then(function (data) {
        successCallback(data);
      })
        .catch(function (error) {
          console.error('An Error occured when getting personAttribute ',error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
      });
    }

    function voidPersonAttribute(personAttribute, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource();
      personAttributeResource.delete({uuid:personAttribute.uuid},
        function (data) {
          if (successCallback) { successCallback(data); }
          else return data;
        },
        function(error){
          console.error('An Error occured when voiding personAttribute ',error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        }
      );
    }
    
     function getPersonAttributeFieldValues(model, formlyFields, person){
       var personAttributes=[];
          var fieldIds=Object.keys(formlyFields);
          var trs= findDeep(formlyFields,{ 'type': 'date' });
          recursiveIteration(formlyFields)
            // _.each(fieldIds, function (key) {
            //   console.log(key)
            //     var findResult = key;
            //     if (findResult !== -1) {
            //         personAttributes.push(key);
            //     }
            // });

            return personAttributes;
     }
//
function recursiveIteration(object) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "type"){
                recursiveIteration(object[property]);
            }else{
                //found a property which is not an object, check for your conditions here
            }
        }
    }
}

//-----------------------------------------------
function findDeep(items, attrs) {

  function match(value) {
    for (var key in attrs) {
      if(!_.isUndefined(value)) {
        if (attrs[key] !== value[key]) {
          return false;
        }
      }
    }

    return true;
  }

  function traverse(value) {
    var result;

    _.forEach(value, function (val) {
      if (match(val)) {
        result = val;
        return false;
      }

      if (_.isObject(val) || _.isArray(val)) {
        result = traverse(val);
      }

      if (result) {
        return false;
      }
    });

    return result;
  }

  return traverse(items);

}


  }
})();
