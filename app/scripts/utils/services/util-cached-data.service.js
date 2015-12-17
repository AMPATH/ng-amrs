/*
 jshint -W098, -W003, -W068, -W004, -W033, -W026, -W030, -W117
 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';

    angular
            .module('app.utils')
            .factory('CachedDataService',CachedDataService);

    CachedDataService.$inject=['$rootScope'];

    function CachedDataService($rootScope){
        var service={
            //locations retrieved  from the  etl server
            getCachedEtlLocations:getCachedEtlLocations,
            getCachedEtlLocationsByUuid:getCachedEtlLocationsByUuid,
            getCachedLocations:getCachedLocations,
            getCachedLocationByUuid:getCachedLocationByUuid,
            getCachedPocForms:getCachedPocForms,
            getCachedPatient:getCachedPatient
        };

        return service;

        function getCachedEtlLocationsByUuid(locationUuid,callback){
            var result=[];
            angular.forEach($rootScope.cachedEtlLocations,function(value,key){
                if(value.uuid===locationUuid){
                    result=value
                }
            });
            callback(result);
        }

        function getCachedLocations(searchText,callback){
            var results=_.filter($rootScope.cachedLocations,
                    function(l){
                        // console.log('location ', l);
                        if(l.description!==null||l.description!=='null'){
                            return (_.contains(l.name.toLowerCase(),searchText.toLowerCase())||
                                    _.contains(l.description.toLowerCase(),searchText.toLowerCase()));
                        }else{
                            return (_.contains(l.name.toLowerCase(),searchText.toLowerCase()));
                        }

                    });

            callback(results);
        }

        function getCachedLocationByUuid(uuid,callback){
            var results=_.find($rootScope.cachedLocations,
                    function(l){
                        // console.log('location ', l);
                        return (l.uuid===uuid);
                    });

            callback(results);
        }

        function getCachedFormByUuid(uuid,callback){
            var results=_.find($rootScope.cachedPocForms,
                    function(f){
                        // console.log('location ', l);
                        return (f.uuid===uuid);
                    });

            callback(results);
        }

        function getCachedPocForms(){
            return $rootScope.cachedPocForms;
        }

        function getCachedPatient(){
            return $rootScope.broadcastPatient;
        }
        function getCachedEtlLocations(){
            return $rootScope.cachedEtlLocations;

        }

    }
})();
