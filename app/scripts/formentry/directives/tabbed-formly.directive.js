/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/

(function () {
    'use strict';

    angular
        .module('app.formentry')
        .directive('tabbedFormlyForm', directive);

    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'views/formentry/tabbed-form.html',
            scope: {
                model: '=',
                form: '=',
                options: '='
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = [];

    function Controller() {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
