(function () {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormsCache', FormsCache);

    FormsCache.$inject = ['$cacheFactory', '$q'];
    function FormsCache($cacheFactory, $q) {
        var formsCache = $cacheFactory('forms-cache');
        var service = {
            getCompiledSchemaByUuid: getCompiledSchemaByUuid,
            setCompiledSchemaByUuid: setCompiledSchemaByUuid,
            clearFormCache: clearFormCache
        };

        return service;

        function getCompiledSchemaByUuid(formUuid) {
            var deferred = $q.defer();
            try {
                var schema = formsCache.get(formUuid);
                if (schema)
                    deferred.resolve(schema);
                else
                    deferred.reject(new Error('Form schema not found'));
            } catch (error) {
                deferred.reject(error);
            }
            return deferred.promise;
        }

        function setCompiledSchemaByUuid(formUuid, schema) {
            var deferred = $q.defer();
            try {
                formsCache.put(formUuid, schema);
                deferred.resolve(true);
            } catch (error) {
                deferred.reject(error);
            }
            return deferred.promise;
        }

        function clearFormCache() {
            var deferred = $q.defer();
            try {
                formsCache.removeAll();
                deferred.resolve(true);
            } catch (error) {
                deferred.reject(error);
            }
            return deferred.promise;
        }
    }
})();