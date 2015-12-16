/* global angular */
/*
jshint -W106, -W098, -W109, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {

    'use strict';

    var mod =
        angular
            .module('app.formentry');

    mod.run(function (formlyConfig) {
        formlyConfig.setType({
            name: 'anchor',
            template: '<div id="{{to.ownerKey}}"><div>'
        });

    });

})();
