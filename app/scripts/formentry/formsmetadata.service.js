/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116
*/
(function() {
    'use strict';

    angular
        .module('formentry')
        .factory('FormsMetaData', FormsMetaData);

    FormsMetaData.$inject = [];

    function FormsMetaData() {
        var service = {
            getForm: getForm
        };

        return service;

        var forms = {
          {name: 'form1', uuid: 'vv', encounterType: 'b2be0-c2cc-11de-8d13-0010c6dffd0f'},
          {name: 'form2', uuid: 'vv', encounterType: 'vv'},
          {name: 'form3', uuid: 'bb', encounterType: 'xxx'}
        };

        function getForm(uuid) {
          return _.findWhere(forms,{uuid:uuid});
        }
    }
})();
