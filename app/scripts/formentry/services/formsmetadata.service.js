/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormsMetaData', FormsMetaData);

    FormsMetaData.$inject = [];

    function FormsMetaData() {

        var forms = {};
        forms['form1'] = {
          name: 'form1',
          uuid: 'form1',
          encounterType:'8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'
        };

        forms['form2'] = {
          name: 'form2',
          uuid: 'form2',
          encounterType:'8d5b3108-c2cc-11de-8d13-0010c6dffd0f'
        };

        forms['form3'] = {
          name: 'form3',
          uuid: 'form3',
          encounterType:'b1e9ed0f-5222-4d47-98f7-5678b8a21ebd'
        };

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

          return result;
        }
    }
})();
