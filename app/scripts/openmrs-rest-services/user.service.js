/*
jshint -W003, -W026, -W098
*/
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .factory('UserResService', UserResService);

  UserResService.$inject = ['$resource', 'OpenmrsSettings', 'UserModel', '$rootScope'];

  function UserResService($resource, settings, UserModel, $rootScope) {
    var service = {
      getUser: getUser,
      user: '',
      getUserByUuid: getUserByUuid,
      findUser: findUser
    };

    return service;

    function getResource() {
      var v = 'custom:(uuid,username,systemId,roles:(uuid,name,privileges),person:(uuid,preferredName))'; // avoid spaces in this string
      var r = $resource(settings.getCurrentRestUrlBase().trim() + 'user/:uuid',
        { uuid: '@uuid', v: v },
        { query: { method: 'GET', isArray: false } }
        );
      return r;
    }

    function getFullResource() {
      var v = 'full'; // avoid spaces in this string
      var r = $resource(settings.getCurrentRestUrlBase().trim() + 'user/:uuid',
        { uuid: '@uuid', v: v },
        { query: { method: 'GET', isArray: false } }
        );
      return r;
    }


    function getUser(params, callback) {
      var UserRes = getResource();
      //console.log(params);
      UserRes.query(params, false,
        function (data) {
          console.log('userData');
          console.log(data.results);
          var result = data.results;
          if (result.length > 0) {
            //user(userName_, personUuId_, password_, uuId_, systemId_, userRole_)
            service.user = new UserModel.user(result[0].username, result[0].person.uuid, '', result[0].uuid, result[0].systemId, result[0].roles);
            //service.user = result;
            $rootScope.$broadcast('loggedUser');//broadcasting user to other controllers
            callback(service.user);
          }
        });

    }

    function getUserByUuid(uuid, onSuccess, onError) {
      var resource = getFullResource();

      return resource.get({ uuid: uuid }).$promise
        .then(function (data) {
          onSuccess(data);
        })
        .catch(function (error) {
          onError(error);
          console.error(error);
        });
    }


    function findUser(searchText, onSuccess, onError) {
      var resource = getFullResource();

      return resource.get({ q: searchText }).$promise
        .then(function (data) {
          onSuccess(data.results);
        })
        .catch(function (error) {
          onError(error);
          console.error(error);
        });
    }


    function getRoles(argument) {
      // body...
      var UserRes = getResource();
    }
  }
})()
;
