/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('ngAmrsApp')
    .directive('displayNotificationDirective', directive);

  function directive() {
    var directiveDefinition = {
      restrict: 'EA',
      templateUrl: 'views/main/display-notification.html',
      scope: {
        data: '@'
      },
      link: linkFunc,
      controller: displayNotificationCtrl,
    };

    return directiveDefinition;
  }

  function linkFunc(scope, el, attr, ctrl) {
  }

  displayNotificationCtrl.$inject = ['$scope','$resource', 'NfService', '$cookieStore', 'webSocketService'];

  function displayNotificationCtrl($scope, $resource, NfService, $cookieStore, webSocketService) {

      var client = webSocketService.getWebSocketConnection();
      client.onUpdate = function(update) {
        // console.log('A new message has been received', update)
        var notificationMsgArr = $cookieStore.get('NotificationMessages') || [];

        if (isNotRead(update, notificationMsgArr)) {
          $scope.$apply(function() {
            $scope.data = update;
            // console.log('Update :', update);

            var promise = NfService.notify($scope.data);
            promise.global.then(function() {
              notificationMsgArr.push($scope.data);
              $cookieStore.put('NotificationMessages', notificationMsgArr);
              // notification confirmed
            }, function() {
              //notification dismissed
            });
          });
        }
      };


    function isNotRead(newMessage, storedMessages) {
      var isNotRead = storedMessages.length === 0 ? true : false;
      _.each(storedMessages, function(storedMessage) {
        if(newMessage.uuid != storedMessage.uuid){
          isNotRead = true;
          // console.log('Not Read---->',storedMessage,storedMessage.uuid,newMessage.uuid)
        } else {
          isNotRead = false;
          // console.log('Read---->',storedMessage,storedMessage.uuid,newMessage.uuid)
        }
      });
      // console.log('---->',isNotRead)
      return isNotRead;
    }

  }
})();
