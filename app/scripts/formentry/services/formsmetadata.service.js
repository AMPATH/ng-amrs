/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormsMetaData', FormsMetaData);

    FormsMetaData.$inject = ['CachedDataService'];

    function FormsMetaData(CachedDataService) {

        var forms = {};        
        var  defaultForm = {
           name: 'ampath_poc_adult_return_visit_form_v0.01',
           uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7',
           encounterType:'8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
           encounterTypeName:'ADULT RETURN'
         };
         
        forms=CachedDataService.getCachedPocForms();
        var service = {
            getForm: getForm
        };

        return service;

        function getForm(uuid) {
          //console.log('Available forms');
          //console.log(forms);

        var result =  _.find(forms,function(form) {
            //console.log(form)
            if (form.uuid === uuid) return form;
            else if (form.encounterType === uuid) return form;
            else if (form.name === uuid) return form;
          });
         if (result === undefined) return defaultForm;
          return result;
        }
    }
})();
