/*jshint -W003, -W098, -W117, -W026 */



(function () {
    'use strict';

    angular
        .module('app.etlRestServices')
        .service('LocationExtensionService', LocationExtensionService);

    LocationExtensionService.$inject = ['EtlRestServicesSettings', '$resource', '$rootScope',
        'CachedDataService'];

    function LocationExtensionService(EtlRestServicesSettings, $resource, $rootScope, CachedDataService) {
        var serviceDefinition;
        serviceDefinition = {
            getLocationByUuidFromEtlOrCatch: getLocationByUuidFromEtlOrCatch,
            getLocationByUuidFromEtl: getLocationByUuidFromEtl
        };
        return serviceDefinition;

        function getResourceFromEtl() {
            return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim() + 'custom_data/location/uuid/:uuid', {
                uuid: '@uuid'
            }, {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                });
        }

        function getLocationByUuidFromEtlOrCatch(uuid, checkCache, successCallback, failedCallback) {
            if (checkCache === true) {
                CachedDataService.getCachedEtlLocationsByUuid(uuid, function (success) {
                    if (success.length === 0) {
                        var resource = getResourceFromEtl();
                        return resource.get({
                            uuid: uuid
                        }).$promise
                            .then(function (response) {
                                //catch the location uuid  and  location etl id to $rootScope.cachedEtlLocations
                                if (angular.isUndefined($rootScope.cachedEtlLocations)) {
                                    $rootScope.cachedEtlLocations = {};
                                }
                                angular.forEach(response.result, function (value, key) {
                                    $rootScope.cachedEtlLocations[uuid] = value;
                                });
                                /**
                                 * Dont removed Used For Testing
                                 * A hack for situations that location id
                                 * cannot  be  resolved  from   location uuid
                                 * by  the  etl  server.This  is a  sign  of  major
                                 * error
                                 *
                
                                if(response.result.length===0){
                                    if(angular.isDefined($rootScope.dummyLocationid)){$rootScope.dummyLocationid=$rootScope.dummyLocationid+1;}else{$rootScope.dummyLocationid=101;}
                                   console.log("Loading  dummy  data Location Id",$rootScope.dummyLocationid);
                                     $rootScope.cachedEtlLocations[uuid]={location_id:$rootScope.dummyLocationid};
                                }
                                */
                                successCallback(response);
                            }).catch(function (error) {
                                console.error(error);
                            });

                    } else {
                        successCallback([success]);
                    }
                });
            }

        }

        function getLocationByUuidFromEtl(uuid, successCallback, failedCallback) {
            var resource = getResourceFromEtl();
            return resource.get({
                uuid: uuid
            }).$promise
                .then(function (response) {
                    //catch the location uuid  and  location etl id to $rootScope.cachedEtlLocations
                    if (angular.isUndefined($rootScope.cachedEtlLocations)) {
                        $rootScope.cachedEtlLocations = [];
                    }
                    angular.forEach(response.result, function (value, key) {
                        $rootScope.cachedEtlLocations.push(value);
                    });
                    successCallback(response);
                }).catch(function (error) {
                    console.error(error);
                });
        }

    }
})();