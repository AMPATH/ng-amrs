/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('PersonAttributesRestService', PersonAttributesRestService);

  PersonAttributesRestService.$inject = ['OpenmrsSettings', '$resource','LocationExtensionService', 'Restangular'];

  function PersonAttributesRestService(OpenmrsSettings, $resource,LocationExtensionService, Restangular) {
    var service = {
      getPersonAttributeByUuid: getPersonAttributeByUuid,
      saveUpdatePersonAttribute:saveUpdatePersonAttribute,
      voidPersonAttribute: voidPersonAttribute,
      getPersonAttributeValue:getPersonAttributeValue
    };

    return service;

    function getPersonAttributeResource() {
      var v = 'custom:(uuid,value,attributeType:(uuid,uuid))';
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/attribute/:personattributeuuid',
        { uuid: '@uuid', personattributeuuid:'@personattributeuuid',v:v},
        { query: { method: 'GET', isArray: false } });
    }

    function saveUpdatePersonAttribute(formatedPersonAttributes,person, successCallback, errorCallback) {
      var personUuid= person.uuid();
      console.log('person attributes payload in service',personUuid);
      Restangular.one('person', personUuid).customPOST(JSON.stringify(formatedPersonAttributes)).then(function(success) {
        console.log('person attributes saved successfully');
        if (typeof successCallback === 'function') successCallback(success);
      },
      function(error) {
        console.log('Error saving person attributes');
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function getPersonAttributeByUuid(params, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource();
      return personAttributeResource.get({uuid:params.patientUuid, personattributeuuid: params.attributeuuid }).$promise
        .then(function(data) {
        successCallback(data);
      })
        .catch(function(error) {
          console.error('An Error occured when getting person attribute ', error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        });
    }

    function voidPersonAttribute(personAttribute, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource();
      var patient = personAttribute.person;
      var patientUuid = patient.uuid();
      personAttributeResource.delete({uuid:patientUuid, personattributeuuid:personAttribute.attribute.uuid},
        function(data) {
          if (successCallback) {
            successCallback(data);
          } else return data;
        },

        function(error) {
          console.error('An Error occured when voiding person attribute ', error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        }
      );
    }
    function getPersonAttributeValue(attributes, key) {
      var inp = JSON.stringify(attributes);
      console.log(inp);
      var attributeType = key.split('_')[1].replace(/n/gi, '-');
      var val = _.filter(attributes, function(attribute_) {
        if (key !== undefined) {
          if (attribute_.attributeType === attributeType) {
            return attribute_.value;
          }
        }
      });

      return val;
    }
  }
})();
