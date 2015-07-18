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
          schema.encounter = [
            {encounterDatetime:'',type:'datepicker', labelName:'Visit Date', idName:'encounterDatetime'},
            {encounterType:'', type:'select', labelName:'Encounter Type', idName:'encounterType'},
            {encounterProvider:'', type:'select', labelName:'Encounter Provider', idName:'EncounterProvider'},
            {encounterLocation:'',type:'select',labelName:'Facility Name', idName:'encounterLocation'},
            {patient:'',type:'text', labelName:'Patient Name', idName:'patient'}
          ];

          schema.obs = [
            {
              obsConceptGroupUuid:'uuid5',
              obsConceptUuid:'uuid1',
              type:'text',
              label:'Temperature'
            },
            {
              obsConceptGroupUuid:'uuid5',
              obsConceptUuid:'uuid2',
              type:'number',
              label:'weight'
            },
            {
              obsConceptGroupUuid:'grpuud',
              obsConceptUuid:'',
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
