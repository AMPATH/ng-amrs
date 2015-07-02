/*jshint -W003 */
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
  .module('ngAmrsApp')
  .controller('MainCtrl', MainCtrl);
  MainCtrl.$nject = ['$scope'];
  function MainCtrl($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    }
})();
