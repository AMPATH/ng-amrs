/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('TestFormSchema', TestFormSchema);

    TestFormSchema.$inject = [];

    function TestFormSchema() {
        var service = {
            getFormSchema: getFormSchema
        };

        return service;

        function getFormSchema() {
          var schema = {};
          schema.encounter = {
            encounterdatetime:'',
            encounterType:'',
            encounterProvider:'',
            location:'',
            patient:''
          };

          schema.obs = [
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'uuid1',
              type:'text',
              label:'Temperature'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'uuid2',
              type:'number',
              label:'weight'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'uuid5',
              type:'select',
              obsAnswerConceptUuids:['conceptUuid1','conceptUuid2','conceptUuid3'],
              obsAnswerLabels:['Yes, and I love it!','Yes, but am not a fan...','Nope'],
              label:'Test dropdown'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'uuid3',
              type:'radio',
              obsAnswerConceptUuids:['conceptUuid1','conceptUuid2','conceptUuid3'],
              obsAnswerLabels:['Yes, and I love it!','Yes, but am not a fan...','Nope'],
              label:'Test radio'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'uuid4',
              type:'multiCheckbox',
              obsAnswerConceptUuids:['conceptUuid1','conceptUuid2','conceptUuid3'],
              obsAnswerLabels:['Yes, and I love it!','Yes, but am not a fan...','Nope'],
              label:'Test Checkbox'
            }

          ];

          return schema;

        }
    }
})();
