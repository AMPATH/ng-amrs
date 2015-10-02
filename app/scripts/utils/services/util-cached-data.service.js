(function() {
    'use strict';

    angular
        .module('app.utils')
        .factory('CachedDataService', CachedDataService);

    CachedDataService.$inject = ['$rootScope'];

    function CachedDataService($rootScope) {
        var service = {
            getCachedLocations: getCachedLocations,
            getCachedLocationByUuid:getCachedLocationByUuid
        };

        return service;

        function getCachedLocations(searchText, callback) {
          var results = _.filter($rootScope.cachedLocations, function(l){
            // console.log('location ', l);
            return (_.contains(l.name.toLowerCase(), searchText.toLowerCase()) ||
                    _.contains(l.description.toLowerCase(), searchText.toLowerCase()));
          });

          callback(results);
        }

        function getCachedLocationByUuid(uuid, callback) {
          var results = _.find($rootScope.cachedLocations, function(l){
            // console.log('location ', l);
            return (l.uuid === uuid);
          });

          callback(results);
        }
    }
})();
