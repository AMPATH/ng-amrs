/*
jshint -W003, -W026, -W098
*/
(function() {
  'use strict';

  angular
        .module('OpenmrsRestServices')
        .factory('UserResService', UserResService);

  UserResService.$inject = ['$resource', 'OpenmrsSettings'];

  function UserResService($resource, settings) {
    var service = {
      getUser: getUser,
      getRoles: getRoles
    };

    return service;

    function getResource() {
     var v = 'custom:(uuid, username, systemId, roles:(uuid, name, privileges))';
     var r = $resource(settings.getCurrentRestUrlBase() + '/ws/rest/v1/user/:uuid',
       {uuid: '@uuid', v: v},
       {query: {method: 'GET', isArray: false}}
     );
     return r;
   }

    function getUser() {

    }
  }
})();
