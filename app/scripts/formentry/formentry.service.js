/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

    FormentryService.$inject = [];

    function FormentryService() {
        var service = {
            createForm: createForm,
            getPayLoad: getPayLoad,
            getConceptUuid:getConceptUuid,
            validateForm:validateForm
        };

        return service;

        function validateForm(schema)
        {
          _.each(schema, function(field) {
            // body...
            if(field.model.obsConceptUuid === '')
            {
              return field.templateOptions.label + 'Missing Concept uuid';
            }
            else {
              return '';
            }
          })
        }

        function getConceptUuid()
        {

        }

        function getPayLoad(schema)
        {
          var payLoad = {};
          //generate encounter section of the payload
          _.each(schema, function(field){
            var val= field.model.encounter;
            console.log('encounter log');
            //console.log(val);
            console.log(field.model.encounter + '  ' + field.model[val] );
            if(field.model.encounter === 'enc_patient' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.patient = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterType' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.encounterType = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterDatetime' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.encounterDatetime = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterLocation' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.location = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterProvider' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.provider = field.model[val];
            }
          })


          //generate obs payload section
          var obs=[];
          // for loop using underscore js
          _.each(schema, function(field, index){
            var val = 'obs_' + field.model.obsConceptUuid;
            console.log('logging val: ' + val);
            if(val !== 'obs_undefined') // all only obs with some data to be posted
            {
              console.log(field.model.obsConceptUuid + '  ' + field.model[val] );
              /*
              Add all obs without obs groups
              */
              if((field.model[val] !== undefined) && (field.type !== 'multiCheckbox') && (field.model.obsGroupUuid === '') )
              {
                //add property to obs
                obs.push({concept:field.model.obsConceptUuid, value:field.model[val]});

              }
              else if((field.model[val] !== undefined) && (field.type === 'multiCheckbox') && (field.model.obsGroupUuid === '') )
              {
                //add property to obs
                var items = [];
                items = field.model[val];
                 console.log(items);
                for (var l = 0; l < items.length; l++)
                {
                  obs.push({concept:field.model.obsConceptUuid, value:items[l]});
                }
              }
            }
          })

          /*
          Get an array of all obs group available in the schema and
          create an obs group with group members of items having the same obs group uuid
          the assumption here is that we will not have have more than one group sharing the same obs group uuid
          in case we have more than one group sharing the same obs group uuid then all this members will be grouped in
          same group
          */
          var obsGroupArr = {}; //dictionary object to store obs group uuids
          _.each(schema, function(field, i){
            //console.log('Pringting Obs Array');
            //console.log(field.model.obsGroupUuid + ' ' + i);
            /*
            we will only add obs groups that have some data
            */

            var val = 'obs_' + field.model.obsConceptUuid;
            if(val !== 'obs_undefined') // allow only obs with some data to be posted
            {
              if(field.model[val] !== undefined)
              {
                if((field.model.obsGroupUuid !== '') && (field.model.obsGroupUuid !== undefined))
                {
                  obsGroupArr[field.model.obsGroupUuid] = field.model.obsGroupUuid;
                }
              }
            }
          })

          /*
          Build obs group array list for each unique obsGroupUuid
          */
          _.each(obsGroupArr,function(key,i){
            console.log('logging keys in the dictionary ' + key);
            //filter all fields related to the current obs group uuid
            var obsGroupFields = _.filter(schema,function(field){
              if(field.model.obsGroupUuid === key)
              {
                return field;
              }
            });
            console.log('obsGroupFields...');
            console.log(obsGroupFields);
            var groupMembers = [];

            _.each(obsGroupFields, function(field){
              /*
              obss group
              "obs": {
              "concept": "uuid-of-grouping-concept",
              "groupMembers": [...]

              }
              */
              var val = 'obs_' + field.model.obsConceptUuid;
              if((field.model[val] !== undefined) && (field.type !== 'multiCheckbox'))
              {
                //add property to obs
                groupMembers.push({concept:field.model.obsConceptUuid, value:field.model[val]});

              }
              else if((field.model[val] !== undefined) && (field.type === 'multiCheckbox'))
              {
                //add property to obs
                var items = [];
                items = field.model[val];
                 console.log(items);
                for (var l = 0; l < items.length; l++)
                {
                  groupMembers.push({concept:field.model.obsConceptUuid, value:items[l]});
                }
              }

            });

            //add group items to the obs Array
            obs.push({concept:key, groupMembers:groupMembers});

          });

          //console.log(obsGroupArr);
          //add obs to payload
          payLoad.obs = obs;
          console.log(JSON.stringify(payLoad));
          //return JSON.stringify(payLoad);
        }




        function createForm(schema) {
          var formSchema=[];
          var field ={};

          //add encounter details

          for (var i=0; i<schema.encounter.length; i++)
          {
            //console.log(schema.encounter)
            if(schema.encounter[i].type === 'datepicker')
            {
              field = {
                key: 'enc_' + schema.encounter[i].idName,
                type: 'input',
                model: {encounter:'enc_' + schema.encounter[i].idName},
                templateOptions: {
                  type: 'text',
                  label: schema.encounter[i].labelName,
                  placeholder: schema.encounter[i].labelName
                }
              }
            }
            else if(schema.encounter[i].type === 'text')
            {
              field = {
                key: 'enc_' + schema.encounter[i].idName,
                type: 'input',
                model: {encounter:'enc_' + schema.encounter[i].idName},
                templateOptions: {
                  type: 'text',
                  label: schema.encounter[i].labelName,
                  placeholder: schema.encounter[i].labelName
                }
              }
            }
            else {
              field = {
                key: 'enc_' + schema.encounter[i].idName,
                type: schema.encounter[i].type,
                model: {encounter:'enc_' + schema.encounter[i].idName},
                templateOptions: {
                  type: 'text',
                  label: schema.encounter[i].labelName,
                  placeholder: schema.encounter[i].labelName,
                  options:[]
                }
              }
            }

            formSchema.push(field);
          }

          //add obs details
          for (var i = 0; i<schema.obs.length; i++)
          {
            console.log(i)
            var obsField ={};
            if ((schema.obs[i].type === 'text') || (schema.obs[i].type === 'number'))
            {
              obsField = {
                key: 'obs_' + schema.obs[i].obsConceptUuid,
                type: 'input',
                model: {obsConceptUuid:schema.obs[i].obsConceptUuid,
                  obsGroupUuid:schema.obs[i].obsConceptGroupUuid,
                  answerValue:''},
                templateOptions: {
                  type: schema.obs[i].type,
                  label: schema.obs[i].label
                }
              }

            }
            else if ((schema.obs[i].type === 'radio') || (schema.obs[i].type === 'select') || (schema.obs[i].type === 'multiCheckbox'))
            {
              var opts= [];
              //get the radio/select options/multicheckbox
              for(var l = 0; l<schema.obs[i].obsAnswerConceptUuids.length; l++)
              {
                 var item={
                   name:schema.obs[i].obsAnswerLabels[l],
                   value:schema.obs[i].obsAnswerConceptUuids[l]
                   };
                 opts.push(item);
              }

              obsField = {
                key: 'obs_' + schema.obs[i].obsConceptUuid,
                type: schema.obs[i].type,
                model: {obsConceptUuid:schema.obs[i].obsConceptUuid,
                  obsGroupUuid:schema.obs[i].obsConceptGroupUuid,
                  answerValue:''},
                templateOptions: {
                  type: schema.obs[i].type,
                  label: schema.obs[i].label,
                  options:opts
                }
              }

            }

            formSchema.push(obsField);

          }
          //console.log('sample form');
          //console.log(formSchema);

          return formSchema;

        }

    }
})();
