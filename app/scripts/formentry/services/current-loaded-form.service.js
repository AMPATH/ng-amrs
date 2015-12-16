/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .service('CurrentLoadedFormService', CurrentLoadedFormService);

    CurrentLoadedFormService.$inject = [];

    function CurrentLoadedFormService() {
        var lastFound;

        var service = {
            formModel: {},
            formValidationMetadata: {},
            listenersMetadata: {},
            clearQuestionValueByKey: clearQuestionValueByKey,
            getAnswerByQuestionKey: getAnswerByQuestionKey,
            getContainingObjectForQuestionKey: getContainingObjectForQuestionKey,
            getFieldKeyFromGlobalById: getFieldKeyFromGlobalById,
            getFieldKeyById: getFieldKeyById
        };

        return service;

        function getFieldKeyFromGlobalById(id) {
            var obj = service.formValidationMetadata[id];
            if (obj)
                return service.formValidationMetadata[id].key;
            return null;
        }

        function getFieldKeyById(id_, searchFields) {
            var result;
            _.each(searchFields, function (cfield) {
                if (cfield.data && cfield.data.id === id_) {
                    result = cfield.key;
                    return result;
                }
            });
            return result;
        }

        function clearQuestionValueByKey(formlyModel, key) {
            var containingObject = getContainingObjectForQuestionKey(formlyModel, key);
            if (containingObject) {
                //containingObject[key] = null;
                if(containingObject[key] === null) {
                    return;
                }
                else if (Array.isArray(containingObject[key])) {
                    console.log('is array');
                    containingObject[key] = [];
                }
                else if (typeof containingObject[key] === 'number') {
                    containingObject[key] = '';
                }
                else if (Object.prototype.toString.call(containingObject[key]) === '[object Date]') {
                    containingObject[key] = '';
                }
                else if (typeof containingObject[key] === 'string') {
                    containingObject[key] = '';
                }
                else if (typeof containingObject[key] === 'object') {
                    console.log('object');
                    containingObject[key] = {};
                }
                else {
                    containingObject[key] = null;
                }
            }
        }

        function getAnswerByQuestionKey(formlyModel, key) {
            lastFound = null;
            traverse(formlyModel, key);

            if (lastFound) {
                return lastFound[key];
            }
            return undefined;
        }

        function getContainingObjectForQuestionKey(formlyModel, key) {
            lastFound = null;
            traverse(formlyModel, key);
            return lastFound;
        }

        function traverse(o, key) {
            for (var i in o) {
                if (typeof (o[i]) === 'object') {
                    if (i === key) {
                        lastFound = o;
                    }
                    traverse(o[i], key);
                }
                else {
                    if (i === key) {
                        lastFound = o;
                    }
                }
            }
        }
    }

})();