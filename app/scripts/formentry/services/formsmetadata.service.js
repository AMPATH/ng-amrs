/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069
*/
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormsMetaData', FormsMetaData);

    FormsMetaData.$inject = ['CachedDataService', '$http'];

    function FormsMetaData(CachedDataService, $http) {

        var forms = {};
        var defaultForm = {
            name: 'ampath_poc_adult_return_visit_form_v0.01',
            uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7',
            encounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            encounterTypeName: 'ADULT RETURN'
        };

        forms = CachedDataService.getCachedPocForms();
        var service = {
            getForm: getForm,
            getFormSchema: getFormSchema
        };

        return service;

        function getForm(uuid) {

            var result = _.find(forms, function (form) {
                //console.log(form)
                if (form.uuid === uuid) return form;
                else if (form.encounterTypeUuid === uuid) return form;
                else if (form.name === uuid) return form;
            });

            if (result === undefined) return defaultForm;
            return result;
        }
        
        function getFormSchema(formName, callback) {
            formName = createValidFormName(formName);
            // this should de dropped once we align all forms related issues
            if (formName !== undefined) {
                formName = formName + '.json';
            } else {
                formName = 'form1.json';
            }

            var url = 'scripts/formentry/formschema/' + formName;
            $http.get(url, { cache: true })
                .success(function (response) {
                    //console.log('testing json files');
                    //console.log(response.schema);
                    //schema = response.schema;
                    callback(response);
                })
                .error(function (data, status, headers, config) {
                    //console.log(data);
                    //console.log(status);
                    if (status === 404) { alert('Form Resource not Available'); }
                });
        }

        function createValidFormName(formName) {
            return formName.replace(/ /gi, '_').toLowerCase();
        }
    }
})();
