/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('PersonAttributesRestService', PersonAttributesRestService);

  PersonAttributesRestService.$inject = ['OpenmrsSettings', '$resource','LocationResService'];

  function PersonAttributesRestService(OpenmrsSettings, $resource,LocationResService) {
    var service = {
      getPersonAttributeByUuid: getPersonAttributeByUuid,
      saveUpdatePersonAttribute:saveUpdatePersonAttribute,
      voidPersonAttribute: voidPersonAttribute,
      getPersonAttributeFieldValues:getPersonAttributeFieldValues,
      getPersonAttributeValue:getPersonAttributeValue
    };

    return service;

    function getPersonAttributeResource() {
      var v = 'custom:(uuid,value,attributeType:(uuid,uuid))';
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/attribute/:personattributeuuid',
        { uuid: '@uuid', personattributeuuid:'@personattributeuuid',v:v},
        { query: { method: 'GET', isArray: false } });
    }

    function saveUpdatePersonAttribute(personAttribute, successCallback, errorCallback) {
      var personAttributeResource = getPersonAttributeResource();
      var patient = personAttribute.person;
      var patientUuid = patient.uuid();
      var personAttributeUuid = personAttribute.attribute.uuid;

      if (patientUuid !== undefined) {
        //Void an existing person attribute and create a new one
        if (personAttributeUuid) {
          voidPersonAttribute(personAttribute, function(response) {
            console.log('Voided a person attribute with uuid ' + personAttributeUuid);
          },

          function(error) {
            console.log('An Error Occurred while voiding the person attribute', error);
          });
        }

        //getting the location id
        var locationUUid = personAttribute.attribute.value;
        LocationResService.getLocationByUuidFromEtl(locationUUid,
          function(response) {
            var locationId = response.result[0]['location_id'].toString();
            var attributePayLoad = JSON.stringify({value:locationId,
                attributeType:personAttribute.attribute.attributeType.uuid});

            if (locationId !== null && locationId !== undefined)  {
              personAttributeResource.save({uuid:patientUuid},
                    attributePayLoad).$promise
                  .then(function(data) {
                  successCallback(data);
                })
                .catch(function(error) {
                  console.error('An Error occured when saving person attribute ', error);
                  if (typeof errorCallback === 'function')
                  errorCallback('Error processing request', error);
                });
            }

          },

          function(error) {
            console.log('Failed get location id from etl server', error);
          });
      }
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

    function getPersonAttributeFieldValues(personAttributes, person) {
      _.each(personAttributes, function(attribute) {
        var personAttribute = {attribute:attribute,person:person};
        saveUpdatePersonAttribute(personAttribute, function(response) {
          console.log('Person attribute value', JSON.stringify(response));
        },

       function(error) {
         console.log('An Error Occurred while getting the person attributes');
       });
      });
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
