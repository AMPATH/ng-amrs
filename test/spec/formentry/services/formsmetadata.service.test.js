/* global expect */
/* global inject */
/*jshint -W026, -W030 */

(function () {
    'use strict';

    describe('Forms Metadata Service Unit Tests', function () {
        beforeEach(function () {
            module('app.formentry');
        });

        var formsService;
        var formResService;
        var formEntryService;
        var $q, $rootScope;
        var formsCache;

        beforeEach(inject(function ($injector) {
            formsService = $injector.get('FormsMetaData');
            formResService = $injector.get('FormResService');
            formEntryService = $injector.get('FormEntry');
            formsCache = $injector.get('FormsCache');
        }));

        beforeEach(inject(function (_$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function () {
            //this is a hack to load the allSettled function required 
            //by the $q service that is available on the app module
            //the app module does not load well in this case
            //TODO: Figure out how to remove this hack 
            $q.allSettled = function (promises) {
                var deferred = $q.defer(),
                    counter = 0,
                    results = angular.isArray(promises) ? [] : {};

                angular.forEach(promises, function (promise, key) {
                    counter++;
                    $q.when(promise).then(function (value) {
                        if (results.hasOwnProperty(key)) return;
                        results[key] = { status: "fulfilled", value: value };
                        if (!(--counter)) deferred.resolve(results);
                    }, function (reason) {
                        if (results.hasOwnProperty(key)) return;
                        results[key] = { status: "rejected", reason: reason };
                        if (!(--counter)) deferred.resolve(results);
                    });
                });

                if (counter === 0) {
                    deferred.resolve(results);
                }

                return deferred.promise;
            }
        });



        //mock data initialization
        var formSchemaWithReference = {
            name: 'ampath_poc_adult_return_visit_form_v0.01',
            uuid: 'adult uuid',
            referencedForms: [
                {
                    formName: 'component_preclinic-review',
                    ref: { uuid: 'preclinic uuid' }, //how to ref by uuid
                    alias: 'pcr'
                },
                {
                    formName: 'component_hospitalization',
                    ref: { uuid: 'hosp uuid' }, //how to ref by uuid
                    alias: 'hosp'
                }
            ]
        };

        //form metadata for above
        var formMetadata = {
            name: 'ampath_poc_adult_return_visit_form_v0.01',
            uuid: 'adult uuid',
            resources: [
                {
                    name: 'json schema',
                    resourceVersion: '1.9',
                    uuid: '002d3f28-a3d3-47b5-a94b-16497c14789e',
                    valueReference: 'adult uuid'
                }
            ]
        };

        var mockSchemaReferenced1 = {
            name: 'component_preclinic-review',
            uuid: 'preclinic uuid'
        };

        var formMetadataRef1 = {
            name: 'component_preclinic-review',
            uuid: 'preclinic uuid',
            resources: [
                {
                    name: 'json schema',
                    resourceVersion: '1.9',
                    uuid: '002d3f28-a3d3-47b5-a94b-16497c14789e',
                    valueReference: 'preclinic uuid'
                }
            ]
        };

        var mockSchemaReferenced2 = {
            name: 'component_hospitalization',
            uuid: 'hosp uuid'
        };

        var formMetadataRef2 = {
            name: 'component_hospitalization',
            uuid: 'hosp uuid',
            resources: [
                {
                    name: 'json schema',
                    resourceVersion: '1.9',
                    uuid: '002d3f28-a3d3-47b5-a94b-16497c14789e',
                    valueReference: 'hosp uuid'
                }
            ]
        };

        //stab functionality to return form schema
        var formSchemaStub, toRejectFormSchemaStubPromise = false;
        var itFetchedMainSchema = false, itFetchedRef1Schema = false, itFetchedRef2Schema = false;
        beforeEach(function () {
            formSchemaStub = sinon.stub(formResService, 'getFormSchemaByUuid',
                function (resourceValueUuid) {
                    var deferred = $q.defer();
                    if (toRejectFormSchemaStubPromise === true) {
                        deferred.reject('experienced error!');
                        return deferred.promise;
                    }
                    if (resourceValueUuid === 'adult uuid') {
                        deferred.resolve(formSchemaWithReference);
                        itFetchedMainSchema = true;
                    }

                    if (resourceValueUuid === 'preclinic uuid') {
                        deferred.resolve(mockSchemaReferenced1);
                        itFetchedRef1Schema = true;
                    }

                    if (resourceValueUuid === 'hosp uuid') {
                        deferred.resolve(mockSchemaReferenced2);
                        itFetchedRef2Schema = true;
                    }
                    return deferred.promise;
                });
        });

        afterEach(function () {
            if (formSchemaStub && formSchemaStub.restore) {
                formSchemaStub.restore();
            }
            itFetchedMainSchema = itFetchedRef1Schema = itFetchedRef2Schema = false;
            toRejectFormSchemaStubPromise = false;
        });

        //stub functionality to return form metadata
        var formMetadataStub, resolvedFormUuidToFormMetadata = false;
        beforeEach(function () {
            formMetadataStub = sinon.stub(formResService, 'getFormByUuid',
                function (param) {
                    var deferred = $q.defer();
                    console.log('param for fetching form by uuid', param);
                    if (param.uuid && param.v && param.caching !== undefined) {
                        var formUuid = param.uuid;
                        resolvedFormUuidToFormMetadata = false;

                        if (formUuid === 'adult uuid') {
                            deferred.resolve(formMetadata);
                            resolvedFormUuidToFormMetadata = true;
                        }

                        if (formUuid === 'preclinic uuid') {
                            deferred.resolve(formMetadataRef1);
                            resolvedFormUuidToFormMetadata = true;
                        }

                        if (formUuid === 'hosp uuid') {
                            deferred.resolve(formMetadataRef2);
                            resolvedFormUuidToFormMetadata = true;
                        }

                        if (resolvedFormUuidToFormMetadata === false) {
                            deferred.reject(new Error('Unknown form uuid'));
                        }
                    }
                    else {
                        deferred.reject(new Error('Incorrect param!'));
                    }
                    return deferred.promise;
                });
        });

        afterEach(function () {
            if (formMetadataStub && formMetadataStub.restore) {
                formMetadataStub.restore();
            }
            resolvedFormUuidToFormMetadata = false;
        });

        //stub functionality to fetch cache
        // var cacheFormStub, getCachedFormStub, toRejectGetCachedFormStubPromise = false;
        // var itCachedForm = false, itRetrievedCachedForm = false;
        // beforeEach(function () {
        //     formSchemaStub = sinon.stub(cacheFormStub, 'getCompiledSchemaByUuid',
        //         function (resourceValueUuid) {
        //             var deferred = $q.defer();
        //             if (toRejectGetCachedFormStubPromise === true) {
        //                 deferred.reject('experienced error!');
        //                 return deferred.promise;
        //             }
        //             itCachedForm = true;
        //             deferred.resolve()
        //             return deferred.promise;
        //         });
        // });

        // afterEach(function () {
        //     if (cacheFormStub && cacheFormStub.restore) {
        //         cacheFormStub.restore();
        //     }
        //     itCachedForm = itRetrievedCachedForm = toRejectGetCachedFormStubPromise = false;
        // });

        beforeEach(function () {
            //clear the cached forms
            formsCache.clearFormCache().then(function(){});
            $rootScope.$digest();
        });

        it('should have forms resource and metadata services injected',
            function () {
                expect(formsService).to.exist;
                expect(formResService).to.exist;
                expect(formsCache).to.exist;
            });

        it('should get form metadata from the form res service when getFormSchemaByUuid is invoked',
            function () {
                var returnedSchema;
                formsService.getFormSchemaByUuid('preclinic uuid').then(
                    function (schema) {
                        returnedSchema = schema;
                    });

                $rootScope.$digest();
                expect(returnedSchema).to.equal(mockSchemaReferenced1);
                expect(resolvedFormUuidToFormMetadata).to.be.true;

            });

        it('should get form schema from the form res service when getFormSchemaByUuid is invoked',
            function () {
                var returnedSchema;
                formsService.getFormSchemaByUuid('preclinic uuid').then(
                    function (schema) {
                        returnedSchema = schema;
                    });

                $rootScope.$digest();
                expect(returnedSchema).to.equal(mockSchemaReferenced1);

            });

        it('should call success callback when getFormSchemaByUuid returns a schema successfully',
            function () {
                var successCallbackTriggered = false;
                formsService.getFormSchemaByUuid('preclinic uuid',
                    function (schema) {
                        successCallbackTriggered = true;
                    });
                $rootScope.$digest();
                expect(successCallbackTriggered).to.be.true;
            });

        it('should call error callback when getFormSchemaByUuid returns an error',
            function () {
                toRejectFormSchemaStubPromise = true;
                var returnedError;
                formsService.getFormSchemaByUuid('some uuid', function (schema) {
                    console.log('The bad error', schema)
                 },
                    function (_error) {
                        returnedError = _error;
                    });

                $rootScope.$digest(); //If you delete this line, the sky will fall on your head!
                expect(returnedError).to.exist;
            });

        it('should validate uuid when getFormSchemaByUuid is called',
            function () {
                var returnedError;
                //passing undefined as the form Uuid
                formsService.getFormSchemaByUuid(undefined, function () { },
                    function (_error) {
                        returnedError = _error;
                    });

                $rootScope.$digest();
                expect(returnedError).to.exist;
            });

        it('should fetch all referenced forms from form res service when getFormSchemaByUuid is invoked',
            function () {

                formsService.getFormSchemaByUuid('adult uuid').then(
                    function (schema) {
                        console.log('fetching form done', schema);
                        //then function of the promise to trigger function execution
                    }).catch(function (error) {
                        console.log('fetching form error', error);
                    });

                $rootScope.$digest();
                expect(itFetchedMainSchema).to.be.true;
                expect(itFetchedRef1Schema).to.be.true;
                expect(itFetchedRef2Schema).to.be.true;
            });

        it('should compile form schemas after fetching referenced components when getFormSchemaByUuid is invoked',
            function () {
                var spy = sinon.spy(formEntryService, 'compileFormSchema');

                formsService.getFormSchemaByUuid('adult uuid').then(
                    function (schema) {
                        //then function of the promise to trigger function execution
                    }).catch(function (error) {
                        console.log('error-->', error);
                    });

                $rootScope.$digest();

                expect(spy.called).to.be.true;

            });

        it('should first try to get cached form when getFormSchemaByUuid is invoked',
            function () {
                var spy = sinon.spy(formsCache, 'getCompiledSchemaByUuid');
                var formUuid = 'adult uuid';
                var mockedCachedSchema = {
                    uuid: 'adult uuid',
                    name: 'I am mocked schema'
                };
                var returnedForm;
                formsCache.setCompiledSchemaByUuid(formUuid, mockedCachedSchema)
                    .then(function (status) {
                        formsService.getFormSchemaByUuid(formUuid).then(
                            function (schema) {
                                returnedForm = schema;
                                //then function of the promise to trigger function execution
                            }).catch(function (error) {
                                console.log('error-->', error);
                            });
                    });


                $rootScope.$digest();
                expect(spy.called).to.be.true;
                expect(spy.calledWith(formUuid)).to.be.true;
                expect(returnedForm).to.deep.equal(mockedCachedSchema);
            });

        it('should cache compiled form schema after fetching when getFormSchemaByUuid is invoked',
            function () {
                var spy = sinon.spy(formsCache, 'setCompiledSchemaByUuid');
                var formUuid = 'adult uuid';
                var returnForm;
                formsService.getFormSchemaByUuid(formUuid).then(
                    function (schema) {
                        returnForm = schema;
                        //then function of the promise to trigger function execution
                    }).catch(function (error) {
                        console.log('error-->', error);
                    });

                $rootScope.$digest();
                expect(spy.called).to.be.true;
                expect(spy.calledWith(formUuid, returnForm)).to.be.true;
            });

    });

})();
