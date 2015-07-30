/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .factory('SearchDataService', SearchDataService);

    SearchDataService.$inject = ['ProviderResService', 'LocationResService', 'LocationModel'];

    function SearchDataService(ProviderResService, LocationResService,LocationModelFactory) {
        var service = {
            findProvider: ProviderResService.findProvider,
            getProviderByUuid: ProviderResService.getProviderByUuid,
            findLocation: findLocation,
            getLocationByUuid: getLocationByUuid
        };
        
        return service;
        
        function findLocation(searchText, onSuccess, onError){
            LocationResService.findLocation(searchText,
                function(locations){
                    var wrapped = wrapLocations(locations);
                    onSuccess(wrapped);
                },
                function(error){
                    onError(onError);
                });
        }
        
        function getLocationByUuid(uuid,  onSuccess, onError){
             LocationResService.getLocationByUuid(uuid,
                function(location){
                    var wrapped = wrapLocation(location);
                    onSuccess(wrapped);
                },
                function(error){
                    onError(onError);
                });
        }
        
        
        function wrapLocations(locations){
            var wrappedLocations = [];
            for(var i = 0; i < locations.length;i++){
                wrappedLocations.push(wrapLocation(locations[i]));
            }
            return wrappedLocations;
        }
        
        function wrapLocation(location){
            return LocationModelFactory.toWrapper(location);
        }
    }

})();
