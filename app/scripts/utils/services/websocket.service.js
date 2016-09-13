/* global angular */
/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
  'use strict';

  angular
    .module('app.utils')
    .service('webSocketService', webSocketService);

  webSocketService.$inject = ['EtlRestServicesSettings', '$http'];

  function webSocketService(EtlRestServicesSettings, $http) {
    var client = new nes.Client(EtlRestServicesSettings.getWssUrlBase());
    var serviceDefinition;
    serviceDefinition = {
      getWebSocketConnection : getWebSocketConnection,
      setWebSocketConnection : setWebSocketConnection
    };

    return serviceDefinition;

    function getWebSocketConnection(){
      return client;
    }
    function setWebSocketConnection(client){
      client = client;
    }

  }
})();
