/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.administration')
    .directive('publishNotification', directive);

  function directive() {
    var directiveDefinition = {
      restrict: 'EA',
      templateUrl: 'views/administration/publish-notification.html',
      link: linkFunc,
      controller: publishNotificationCtrl,
    };

    return directiveDefinition;

    function linkFunc(scope, el, attr, ctrl) {
    }
  }

  publishNotificationCtrl.$inject = ['$scope','$resource', 'NfService', 'webSocketService', 'permissionService'];

  function publishNotificationCtrl($scope,$resource, NfService, webSocketService, permissionService) {

    $scope.notify = notify;
    $scope.sendToServer = sendToServer;
    $scope.isConnected = false;
    $scope.fromDate = new Date();
    $scope.toDate = new Date();
    $scope.currentDateTime = new Date();
    $scope.minDateTime = new Date();
    var client = webSocketService.getWebSocketConnection();
    $scope.data = {
      title: '',
      message: '',
      expire: '600',
      uuid: Date.now(),
      config: {
        delay: 0,
        type: 'success',
        dismiss: true,
        confirm: true
      }
    };

    function sendToServer() {
      if (permissionService.hasPrivileges('Broadcast Message')) {
          var dateTimeDifference = Math.round(($scope.toDate - $scope.fromDate) / 1000);
          $scope.data.expire = JSON.stringify(dateTimeDifference);
          client.message($scope.data, function(err, message) {
            if (err) {
              console.log('Error sending message:', err);
            }
            if (message) {
              console.log('Message sent:', message);
            }
          });
      }
    }

    function notify() {
      sendToServer();
    }
  }
})();
