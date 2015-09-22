/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .service('FormValidator', FormValidator);

    function FormValidator() {
        var lastFound;
        var service = {
            clearQuestionValueByKey: clearQuestionValueByKey,
            getAnswerByQuestionKey: getAnswerByQuestionKey,
            getContainingObjectForQuestionKey: getContainingObjectForQuestionKey,
            extractQuestionIds: extractQuestionIds,
            replaceQuestionsPlaceholdersWithValue: replaceQuestionsPlaceholdersWithValue,
            replaceMyValuePlaceholdersWithActualValue: replaceMyValuePlaceholdersWithActualValue,
            evaluateExpression: evaluateExpression
        }

        return service;


        function clearQuestionValueByKey(formlyModel, key) {
            var containingObject = getContainingObjectForQuestionKey(formlyModel, key);
            if (containingObject) {
                //containingObject[key] = null;
                if (Array.isArray(containingObject[key])) {
                    console.log('is array')
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


        function replaceQuestionsPlaceholdersWithValue(expression, keyValuObject) {
            var fieldIds = Object.keys(keyValuObject);
            var replaced = expression;
            _.each(fieldIds, function (key) {
                var toReplace = keyValuObject[key];
                if (typeof keyValuObject[key] === 'string')
                    toReplace = '"' + toReplace + '"';

              if (Array.isArray(keyValuObject[key]))
                  toReplace = convertArrayToString(toReplace);

                var beforeReplaced = replaced;

                replaced = replaced.replace(key, toReplace);

                while (replaced.localeCompare(beforeReplaced) !== 0) {
                    beforeReplaced = replaced;
                    replaced = replaced.replace(key, toReplace);
                }
            });
            return replaced;
        }

        function replaceMyValuePlaceholdersWithActualValue(expression, myValue) {
            var replaced = expression;
            var toReplace = myValue;
            if (typeof toReplace === 'string')
                toReplace = '"' + toReplace + '"';
            if (Array.isArray(toReplace))
            toReplace =convertArrayToString(toReplace);

            var beforeReplaced = replaced;
            replaced = replaced.replace('myValue', toReplace);
            while (replaced.localeCompare(beforeReplaced) !== 0) {
                beforeReplaced = replaced;
                replaced = replaced.replace('myValue', toReplace);
            }
            return replaced;
        }

        function extractQuestionIds(expression, objectWithKeysBeingIds) {
            var fieldIds = Object.keys(objectWithKeysBeingIds);
            var extracted = [];
            _.each(fieldIds, function (key) {
                var findResult = expression.search(key);
                if (findResult !== -1) {
                    extracted.push(key);
                }
            });

            return extracted;
        }


        function evaluateExpression(expression) {
            return eval(expression);
        }

      function  convertArrayToString(array){
        var converted = '[';
        for(var i = 0; i < array.length; i++){
          if(i !== 0) converted = converted + ",";
          converted = converted + "'" + array[i] + "'";
        }
        converted = converted + ']';
        return converted;
      }

        function isEmpty(val) {

            if (val === undefined || val === null || val === '' || val === 'null' || val === 'undefined') {
                return true;
            }
            if(Array.isArray(val) && val.length === 0)
                return true;
            return false;
        }

        function arrayContains(array, members) {
            if (Array.isArray(members)) {
                if (members.length === 0) return true;
                var contains = true;
                _.each(members, function (val) {
                    if (array.indexOf(val) === -1) {
                        contains = false;
                    }
                });
                return contains;
            }
            else {
                return array.indexOf(members) !== -1;
            }
        }
		  }
})();
