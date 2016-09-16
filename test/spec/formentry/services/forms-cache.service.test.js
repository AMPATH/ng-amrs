/* global expect */
/* global inject */
/*jshint -W026, -W030 */

(function () {
    'use strict';

    describe('Forms Cache Service Unit Tests', function () {
        beforeEach(function () {
            module('app.formentry');
        });

        var FormsCache;
        var rootScope;
        beforeEach(inject(function ($injector, _$rootScope_) {
            FormsCache = $injector.get('FormsCache');
            rootScope = _$rootScope_;
        }));

        it('should have forms cache service injected',
            function () {
                expect(FormsCache).to.exist;
                expect(rootScope).to.exist;
            });
        it('should cache form schemas by uuid',
            function () {
                var sampleUuid = 'uuid';
                var sampleSchema = { memberA: 'A' };
                var setPromise =
                    FormsCache.setCompiledSchemaByUuid(sampleUuid, sampleSchema);
                var cachedSchema;
                setPromise.then(function (didCache) {
                    FormsCache.getCompiledSchemaByUuid(sampleUuid)
                        .then(function (schema) {
                            cachedSchema = schema;
                        });
                });

                rootScope.$apply();
                console.log('expected', sampleSchema);
                console.log('returned', cachedSchema);
                expect(sampleSchema).to.deep.equal(cachedSchema);
            });

        it('should clear cache when clearFormCache is invoked',
            function () {
                var sampleUuid = 'uuid';
                var sampleSchema = { memberA: 'A' };
                var setPromise =
                    FormsCache.setCompiledSchemaByUuid(sampleUuid, sampleSchema);
                var cachedSchema;
                setPromise.then(function (didCache) {
                    FormsCache.clearFormCache().then(function (didClearCache) {
                        FormsCache.getCompiledSchemaByUuid(sampleUuid)
                            .then(function (schema) {
                                cachedSchema = schema;
                            });
                    });

                });

                rootScope.$apply();
                console.log('expected', sampleSchema);
                console.log('returned', cachedSchema);
                expect(sampleSchema).not.to.deep.equal(cachedSchema);
            });
    });
})();