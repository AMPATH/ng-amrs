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

    FormsMetaData.$inject = ['CachedDataService', '$http',
        'FormResService', '$q', '$log', 'FormEntry', 'FormsCache'];

    function FormsMetaData(CachedDataService, $http, FormResService,
        $q, $log, FormEntry, FormsCache) {

        var forms = {};
        var defaultForm = {
            name: 'ampath_poc_adult_return_visit_form_v0.01',
            uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7',
            encounterType: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            encounterTypeName: 'ADULT RETURN'
        };

        forms = CachedDataService.getCachedPocForms();

        var service = {
            getForm: getFormMetadata,
            getFormSchemaByUuid: getFormSchemaByUuid,
            getFormSchema: getFormSchema,
            getFormSchemasArray: getFormSchemasArray,
            getFormOrder: getFormOrder
        };

        return service;

        function getFormMetadata(uuid) {

            var result = _.find(forms, function (form) {
                //console.log(form)
                if (form.uuid === uuid) return form;
                else if (form.encounterTypeUuid === uuid) return form;
                else if (form.name === uuid) return form;
            });

            if (result === undefined) return defaultForm;
            return result;
        }

        //putting in callbacks for easy integration with the existing code
        function getFormSchemaByUuid(formUuid, onSuccess, onError) {
            //the function first checks if we have cached form before polling the server
            var deferred = $q.defer();

            //input error checking
            var inputError = _validateFormUuid(formUuid);
            if (inputError) {
                deferred.reject(inputError);
            }

            //first check if we have cached form
            if (inputError === undefined)
                FormsCache.getCompiledSchemaByUuid(formUuid)
                    .then(function (schema) {
                        if (schema) {
                            //resolve promise with cached schema
                            deferred.resolve(schema);
                            return schema;
                        } else {
                            $log.info('No cached schema. Getting schema from server...');
                            //schema not found, search from server
                            return _getFormSchemaAndCacheIt(formUuid)
                                .then(function (schemaFromServer) {
                                    deferred.resolve(schemaFromServer);
                                    return schemaFromServer;
                                })
                                .catch(function (error) {
                                    deferred.reject(error);
                                    return error;
                                });
                        }
                    })
                    .catch(function (error) {
                        $log.info('Error getting schema from cache. Trying the server...');
                        return _getFormSchemaAndCacheIt(formUuid)
                            .then(function (schemaFromServer) {
                                deferred.resolve(schemaFromServer);
                                return schemaFromServer;
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                                return error;
                            });
                    });

            return deferred.promise
                .then(function (schema) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(schema);
                    }
                    return schema;
                }).catch(function (error) {
                    if (typeof onError === 'function') {
                        onError(error);
                    }
                    return error;
                });
        }

        function _getFormSchemaAndCacheIt(formUuid) {
            var deferred = $q.defer();
            _fetchAndCompileFormSchemaFromServer(formUuid)
                .then(function (schema) {

                    //cache form
                    if (schema && schema.uuid)
                        _cacheForm(formUuid, schema);

                    deferred.resolve(schema);
                    return schema;
                }).catch(function (error) {
                    deferred.reject('error');
                    return error;
                });
            return deferred.promise;
        }

        function _cacheForm(formUuid, schema) {
            return FormsCache.setCompiledSchemaByUuid(formUuid, schema)
                .then(function (status) {
                    $log.info('Form schema for ' + schema.name + ' cached');
                    return status;
                })
                .catch(function (error) {
                    $log.error('Error caching form' + error);
                    return error;
                });
        }
        function _validateFormUuid(formUuid) {
            var inputError;
            if (formUuid === undefined || formUuid === null) {
                inputError = new Error('Form uuid is required');
            } else if (typeof formUuid !== 'string') {
                inputError = new Error('Form uuid needs to be a string');
            }
            return inputError;
        }

        function _getFormSchemaAndReferencesFromServer(formUuid) {
            var getFormsDeferred = $q.defer();

            //first fetch the main form
            _getFormSchemaByUuidFromServer(formUuid)
                .then(function (schema) {
                    if (Array.isArray(schema.referencedForms) && schema.referencedForms.length > 0) {
                        //fetch all referenced forms
                        _fetchFormSchemaReferences(schema)
                            .then(function (formAndReferencesObject) {
                                getFormsDeferred.resolve(formAndReferencesObject);
                                return formAndReferencesObject;
                            })
                            .catch(function (error) {
                                getFormsDeferred.reject(error);
                                return error;
                            });
                    } else {
                        //case where there are no referenced forms
                        getFormsDeferred.resolve(schema);
                    }
                    return schema;
                })
                .catch(function (error) {
                    getFormsDeferred.reject(error);
                    return error;
                });

            return getFormsDeferred.promise;
        }

        function _fetchAndCompileFormSchemaFromServer(formUuid) {
            var deferred = $q.defer();
            _getFormSchemaAndReferencesFromServer(formUuid)
                .then(function (results) {
                    $log.log('checking whether form needs compiling...', results);
                    if (results.form && results.referencedComponents) {
                        try {
                            $log.log('compiling fetched schema...')
                            FormEntry.compileFormSchema(results.form, results.referencedComponents);
                            deferred.resolve(results.form)
                        } catch (e) {
                            deferred.reject(e);
                        }
                    } else {
                        deferred.resolve(results);
                    }

                    return results;
                })
                .catch(function (error) {
                    deferred.reject(error);
                    return error;
                });

            return deferred.promise;
        }

        function _fetchFormSchemaReferences(formSchema) {
            var getFormsDeferred = $q.defer();

            var referencedUuids = _getFormUuidArray(formSchema.referencedForms);
            if (referencedUuids) {
                _getManyFormSchemasByUuidFromServer(referencedUuids)
                    .then(function (schemas) {
                        for (var e in schemas) {
                            if (schemas[e].value) {
                                schemas[e] = schemas[e].value;
                            }
                        }
                        //finished fetching all referenced forms
                        var forms = {
                            form: formSchema,
                            referencedComponents: schemas
                        };
                        getFormsDeferred.resolve(forms);
                        return forms;
                    })
                    .catch(function (error) {
                        getFormsDeferred.reject(error);
                        return error;
                    });
            } else {
                //didn't find referenced object';
                getFormsDeferred.reject(
                    new Error('Incorrect reference format + '
                        + schema.referencedForms));
            }

            return getFormsDeferred.promise;
        }

        function _getFormUuidArray(formSchemaReferenceArrayMember) {
            if (Array.isArray(formSchemaReferenceArrayMember)) {
                var formUuids = [];
                _.each(formSchemaReferenceArrayMember, function (refObject) {
                    formUuids.push(refObject.ref.uuid);
                });

                if (formUuids.length === 0)
                    return undefined;
                return formUuids;
            }
        }

        function _getManyFormSchemasByUuidFromServer(formUuidArray) {
            var promises = {};
            _.each(formUuidArray, function (formUuid) {
                promises[formUuid] = _getFormSchemaByUuidFromServer(formUuid);
            });

            return $q.allSettled(promises);
        }

        function _getFormSchemaByUuidFromServer(formUuid) {
            //resolve form uuid to form metadata in order to obtain the resource metadata object
            var deferred = $q.defer();
            FormResService.getFormByUuid({ uuid: formUuid, v: 'full', caching: false })
                .then(function (form) {
                    var resourceToFetch = _determineResourceToFetch(form);
                    if (resourceToFetch === undefined) {
                        var error = new Error('Error getting resource to load');
                        throw error;
                    }
                    return FormResService.getFormSchemaByUuid(resourceToFetch.valueReference)
                        .then(function (formSchema) {
                            deferred.resolve(formSchema);
                            return formSchema
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                            return error;
                        });
                })
                .catch(function (error) {
                    deferred.reject(error);
                    return error;
                });

            return deferred.promise;
        }

        function _determineResourceToFetch(form) {
            $log.debug('Finding json schema for form ' + form.name);
            var resource = _findResource(form.resources);
            if (resource === undefined) {
                $log.debug('Resource not found using "AmpathJsonSchema" dataType,'
                    + ' trying name "JSON Schema" ');
                resource = _findResource(form.resources, 'JSON schema');
            }

            return resource;
        }

        function _findResource(formResources, needle) {
            var needle = needle || 'AmpathJsonSchema';
            if (_.isUndefined(formResources) || !Array.isArray(formResources)) {
                throw new Error('Argument should be array of form resources');
            }

            needle = needle.toLowerCase();
            return _.find(formResources, function (resource) {
                if (resource.dataType) {
                    resource.dataType = resource.dataType.toLowerCase();
                }
                if (resource.name) {
                    resource.name = resource.name.toLowerCase();
                }
                return (resource.dataType === needle || resource.name === needle);
            });
        }

        function getFormSchema(formName, onSuccess, onError) {
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
                    onSuccess(response);
                })
                .error(function (data, status, headers, config) {
                    //console.log(data);
                    //console.log(status);
                    if (status === 404) { alert('Form Resource not Available'); }

                    onError(data);
                });
        }

        function getFormOrder(onSuccess, onError) {
            var url = 'scripts/formentry/form-order.json';
            $http.get(url, { cache: true })
                .success(function (response) {
                    onSuccess(response);
                })
                .error(function (data, status, headers, config) {
                    if (status === 404) { alert('form-order.json not Available'); }
                    onError(data);
                });
        }

        function getFormSchemasArray(arrayFormNames, onSuccess, onError) {
            var numberOfRequests = arrayFormNames.length;
            var formSchemas = [];
            var hasReturned = false;
            for (var i = 0; i < arrayFormNames.length; i++) {
                var formName = arrayFormNames[i];

                getFormSchema(formName,
                    function (formSchema) {
                        formSchemas.push(formSchema);
                        numberOfRequests--;
                        if (numberOfRequests === 0 && !hasReturned) {
                            hasReturned = true;
                            onSuccess(formSchemas);
                        }
                    }, function (error) {
                        if (!hasReturned) {
                            hasReturned = true;
                            onError(error);
                        }
                    });
            }
        }

        function createValidFormName(formName) {
            formName = formName.replace(/ /gi, '_').toLowerCase();
            return formName.replace(/\//gi, '_').toLowerCase();
        }
    }
})();
