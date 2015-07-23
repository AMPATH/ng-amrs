/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('TestFormSchema', TestFormSchema);

    TestFormSchema.$inject = ['$http'];

    function TestFormSchema($http) {
        var service = {
            getFormSchema: getFormSchema
        };

        return service;

        function getFormSchema(formName, callback) {
          var schema = {};
          formName = formName + '.json'
          $http.get('scripts/formentry/formschema/'+formName)
            .success(function(response) {
              console.log('testing json files');
              console.log(response.schema);
              schema = response.schema;
              callback(schema);
              })
              .error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                if (status === 404) {alert('Form Resource not Available');}

            });
/*
          var schema = {};
          schema.encounter = [
            {encounterDatetime:'',type:'datepicker', labelName:'Visit Date', idName:'encounterDatetime'},
            {encounterType:'', type:'text', labelName:'Encounter Type', idName:'encounterType'},
            {encounterProvider:'', type:'select', labelName:'Encounter Provider', idName:'EncounterProvider'},
            {encounterLocation:'',type:'select',labelName:'Facility Name', idName:'encounterLocation'},
            {patient:'',type:'text', labelName:'Patient Name', idName:'patient'}
          ];

          schema.obs = [
            {
              obsConceptGroupUuid:'a899e6d8-1350-11df-a1f1-0026b9348838',
              obsConceptUuid:'a8a65fee-1350-11df-a1f1-0026b9348838',
              type:'number',
              label:'Temperature',
              validators:{

              }
            },
            {
              obsConceptGroupUuid:'a899e6d8-1350-11df-a1f1-0026b9348838',
              obsConceptUuid:'a8a660ca-1350-11df-a1f1-0026b9348838',
              type:'number',
              label:'weight'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'a899a9f2-1350-11df-a1f1-0026b9348838',
              type:'select',
              obsAnswerConceptUuids:['a8aa76b0-1350-11df-a1f1-0026b9348838','a899ad58-1350-11df-a1f1-0026b93488382','a899ac7c-1350-11df-a1f1-0026b9348838'],
              obsAnswerLabels:['Married','Divorced','Single'],
              label:'Marital status'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'774961c6-232f-4332-8a9f-f5c55ebe86d0',
              type:'radio',
              obsAnswerConceptUuids:['a899b35c-1350-11df-a1f1-0026b9348838','a899b42e-1350-11df-a1f1-0026b9348838'],
              obsAnswerLabels:['Yes','No','Nope'],
              label:'Family Planning'
            },
            {
              obsConceptGroupUuid:'',
              obsConceptUuid:'a894b1cc-1350-11df-a1f1-0026b9348838',
              type:'multiCheckbox',
              obsAnswerConceptUuids:['a893516a-1350-11df-a1f1-0026b9348838','b75702a6-908d-491b-9399-6495712c81cc','a8aaf3e2-1350-11df-a1f1-0026b9348838'],
              obsAnswerLabels:['Condoms','Emergency OCP','Other'],
              label:'Family Planning Method',
              validators:{

              }
            }

          ];
*/
          //return schema;

        }
    }
})();
