/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116
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
            getConceptUuid:getConceptUuid
        };

        return service;

        function getPayLoad(schema)
        {
          var payLoad={};

          return payLoad;
        }

        function createForm(schema) {
          var formSchema=[];
          var field ={};

          //add encounter details

          for (var key in schema.encounter)
          {
            field = {
              key: 'encounter_' + key,
              type: 'input',
              model: {conceptUuid:key},
              templateOptions: {
                type: 'text',
                label: key,
                placeholder: key
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
                model: {conceptUuid:schema.obs[i].obsConceptUuid,
                  groupUuid:schema.obs[i].obsConceptGroupUuid,
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
                model: {conceptUuid:schema.obs[i].obsConceptUuid,
                  groupUuid:schema.obs[i].obsConceptGroupUuid,
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
          console.log('sample form');
          console.log(formSchema);

          return formSchema;

        }

    }
})();
