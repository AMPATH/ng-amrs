/*jshint -W003, -W117, -W098, -W026 */
(function () {
  'use strict';

  angular
    .module('ngAmrsApp')
    .factory('permissionService', PermissionService);
  PermissionService.$inject = ['$rootScope', 'OpenmrsRestService'];
  function PermissionService($rootScope, OpenmrsRestService) {
    var serviceDefinition = {
      hasPrivileges: hasPrivileges,
    };
    return serviceDefinition;
    function hasPrivileges(permission) {
      if (OpenmrsRestService.getUserService().user!=='') {
        var userRoles = OpenmrsRestService.getUserService().user.openmrsModel().userRole;
        var canAccess = _.some(userRoles, function (userRole) {
          if(userRole.name==='System Developer') {
            return true;
          } else {
            return _.some(userRole.privileges, function (privileg) {
              return privileg.name === permission;
            });
          }
        });

        return canAccess;
      } else {
        return false;
      }

    }
  }

})();
