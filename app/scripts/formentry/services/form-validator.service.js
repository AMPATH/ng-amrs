/* global _ */
/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .service('FormValidator', FormValidator);
        
    FormValidator.$inject = ['CurrentLoadedFormService'];    

    function FormValidator(CurrentLoadedFormService) {
        
        var service = {
            extractQuestionIds: extractQuestionIds,
            replaceQuestionsPlaceholdersWithValue: replaceQuestionsPlaceholdersWithValue,
            replaceMyValuePlaceholdersWithActualValue: replaceMyValuePlaceholdersWithActualValue,
            evaluateExpression: evaluateExpression,
            getFieldValidator: getFieldValidatorObject,
            getFieldValidators: getFieldValidators,
            getHideDisableExpressionFunction: getHideDisableExpressionFunction,
            getConditionalRequiredExpressionFunction: getConditionalRequiredExpressionFunction,
            getDateValidatorObject: getDateValidatorObject,
            getJsExpressionValidatorObject: getJsExpressionValidatorObject
        }

        return service;

        function getFieldValidators(arrayOfValidations, getFieldById_KeyFunction) {
            var validator = {};
            var index = 1;
            _.each(arrayOfValidations, function (validate) {    
                var key = validate.type;
                if (validate.type === 'js_expression') {
                    key = key + index;
                    index++;
                }
                if (validate.type !== 'conditionalRequired')
                    validator[key] = getFieldValidatorObject(validate, getFieldById_KeyFunction);
            });
            return validator;
        }

        function getFieldValidatorObject(params, getFieldById_KeyFunction) {
            switch (params.type) {
                case 'date':
                    return getDateValidatorObject(params);
                    break;
                case 'js_expression':
                    return getJsExpressionValidatorObject(params);
                    break;
                case 'conditionalAnswered':
                    return getConditionalAnsweredValidatorObject(params, getFieldById_KeyFunction);
                    break;
                case 'conditionalRequired':
                    return getConditionalRequiredExpressionFunction(params, getFieldById_KeyFunction);
                    break;
            }

            if (params.field !== undefined && params.value !== undefined) {
                getHideDisableExpressionFunction(params);
            }
        }

        function getDateValidatorObject(params) {
            var validator = new Validator('', undefined);

            if (params.allowFutureDates !== 'true') {
                //case does not allow future dates
                validator.expression = function (viewValue, modelValue) {
                    /*
                    using datejs library
                    */
                    var value = modelValue || viewValue;
                    var dateValue;
                    var curDate = Date.parse(Date.today(), 'd-MMM-yyyy');
                    if ((value !== undefined) && (value !== null)) {
                        dateValue = Date.parse(value, 'd-MMM-yyyy').clearTime();
                    }
                    if (dateValue !== undefined) {
                        return !dateValue.isAfter(curDate);
                    }
                    if (dateValue !== undefined || dateValue !== null || value !== '')
                        return true;

                };
                validator.message = '"Should not be a future date!"';

            }
            else {
                //case should be a future date
                validator.expression = function (viewValue, modelValue, elementScope) {
                    /*
                    using datejs library
                    */
                    var value = modelValue || viewValue;
                    var dateValue;
                    //var curDate = Date.parse(Date.today(), 'd-MMM-yyyy');

                    if (value !== undefined && value !== null && value !== '') {
                        dateValue = Date.parse(value, 'd-MMM-yyyy').clearTime();
                    }
                    if (dateValue !== undefined || dateValue !== null || value !== '') {
                        return true;
                    }
                    else return false;

                };
                validator.message = '"Should be a future date!"';
            }
            return validator;
        }

        function getJsExpressionValidatorObject(params) {

            var validator = new Validator('"' + params.message + '"',
                function (viewValue, modelValue, elementScope) {
                    var val = viewValue || modelValue;
                    
                    //special case for multicheck box
                    if (elementScope.$parent && elementScope.$parent.multiCheckbox) {
                        console.log('validating multicheck box..', elementScope.$parent.multiCheckbox);
                        var selectedOptions = elementScope.$parent.model[elementScope.$parent.options.key];
                        var mergedOptions = selectedOptions ? [].concat(selectedOptions) : [];

                        if (val === true) {
                            if (elementScope.option.value)
                                mergedOptions.push(elementScope.option.value);
                        }
                        else {
                            var index = mergedOptions.indexOf(elementScope.option.value);
                            if (index >= 0) {
                                mergedOptions = _.without(mergedOptions, elementScope.option.value);
                            }
                        }

                        val = mergedOptions;
                    }

                    var referencedQuestions = service.extractQuestionIds(params.failsWhenExpression, CurrentLoadedFormService.formValidationMetadata);

                    var keyValue = {};

                    _.each(referencedQuestions, function (qId) {
                        if (keyValue[qId] === undefined) {
                            var referenceQuestionkey = CurrentLoadedFormService.getFieldKeyFromGlobalById(qId);
                            var referenceQuestionCurrentValue = CurrentLoadedFormService.getAnswerByQuestionKey(CurrentLoadedFormService.formModel, referenceQuestionkey);
                            keyValue[qId] = referenceQuestionCurrentValue;
                        }
                    });

                    var expressionToEvaluate = service.replaceQuestionsPlaceholdersWithValue(params.failsWhenExpression, keyValue);

                    expressionToEvaluate = service.replaceMyValuePlaceholdersWithActualValue(expressionToEvaluate, val);
                    console.log('Evaluates val', val);
                    console.log('Evaluates model', elementScope);
                    console.log('expressionToEvaluate', expressionToEvaluate);

                    var isInvalid = service.evaluateExpression(expressionToEvaluate);

                    console.log('isInvalid', isInvalid);

                    return !isInvalid;
                });
            return validator;

        }

        function getConditionalAnsweredValidatorObject(params, getFieldById_KeyFunction) {
            var validator = new Validator('"' + params.message + '"',
                function (viewValue, modelValue, elementScope) {
                    var val = viewValue || modelValue;

                    if (val === true && elementScope.$parent && elementScope.$parent.multiCheckbox) {
                        val = elementScope.option.value;
                    }
                    var modelOptions;
                    if (elementScope.$parent && elementScope.$parent.multiCheckbox) {
                        modelOptions = elementScope.$parent.model[elementScope.$parent.options.key];
                    }

                    var modelIsNonEmptyArray = (modelOptions !== undefined && Array.isArray(modelOptions) && modelOptions.length !== 0);

                    var hasValue = modelIsNonEmptyArray ||
                        (val !== undefined && val !== null && val !== '' && val !== false);
                    if (!hasValue) {
                        //question was not answered therefore it is always true
                        return true;
                    }  

                    //question was asnwered, therefore establish that the reference questions have the required answers
                    var referenceQuestionkey = CurrentLoadedFormService.getFieldKeyFromGlobalById(params.referenceQuestionId);
                    var referenceQuestion = getFieldById_KeyFunction(params.referenceQuestionId);
                    if (referenceQuestion !== undefined)
                        referenceQuestionkey = referenceQuestion.key

                    var referenceQuestionCurrentValue = CurrentLoadedFormService.getAnswerByQuestionKey(CurrentLoadedFormService.formModel, referenceQuestionkey);

                    var answersThatPermitThisQuestionAnswered = params.referenceQuestionAnswers;

                    var isValid = false;

                    _.each(answersThatPermitThisQuestionAnswered, function (answer) {
                        if (referenceQuestionCurrentValue === answer)
                            isValid = true;
                    });

                    console.log('isValid', isValid);
                    return isValid;
                });

            return validator;
        }

        function getConditionalRequiredExpressionFunction(params, getFieldById_KeyFunction) {

            return function ($viewValue, $modelValue, scope, element) {
                var i = 0;
                var fkey;
                var isRequired;
                var result;

                var referenceQuestionkey = CurrentLoadedFormService.getFieldKeyFromGlobalById(params.referenceQuestionId);
                var referenceQuestion = getFieldById_KeyFunction(params.referenceQuestionId);
                if (referenceQuestion !== undefined) referenceQuestionkey = referenceQuestion.key;

                fkey = referenceQuestionkey;

                _.each(params.referenceQuestionAnswers, function (val) {

                    result = scope.model[fkey] === val
                    if (i === 0) isRequired = result;
                    else isRequired = isRequired || result;
                    i = i + 1;

                });
                console.log('isRequired', isRequired);
                return isRequired;
            }

        }

        function getHideDisableExpressionFunction(params) {
            var result;
            var results;

            return (function ($viewValue, $modelValue, scope, element) {
                //if element is undefined then we are looking for a disable expression
                //if element is defined then we are looking for a hide expression

                var i = 0;
                var fkey;

                if (params.field === 'gender' || params.field === 'sex') fkey = 'sex';
                else fkey = CurrentLoadedFormService.getFieldKeyByIdFunction(params.field, scope.fields)

                _.each(params.value, function (val) {

                    result = scope.model[fkey] !== val
                    if (i === 0) results = result;
                    else results = results && result;
                    i = i + 1;

                });

                if (results === true) {
                    if (element) {
                        //case hide
                        CurrentLoadedFormService.clearQuestionValueByKey(scope.model, element.options.key);
                    }
                    else {
                        //case disable
                        CurrentLoadedFormService.clearQuestionValueByKey(scope.model, scope.options.key);
                    }
                }
                return results;
            });
        }




        function Validator(message, expressionFunction) {
            this.message = message;
            this.expression = expressionFunction;
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
                toReplace = convertArrayToString(toReplace);

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

        function convertArrayToString(array) {
            var converted = '[';
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) converted = converted + ",";
                converted = converted + "'" + array[i] + "'";
            }
            converted = converted + ']';
            return converted;
        }

        function isEmpty(val) {

            if (val === undefined || val === null || val === '' || val === 'null' || val === 'undefined') {
                return true;
            }
            if (Array.isArray(val) && val.length === 0)
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
