/*jshint -W003 */
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the ngAmrsApp
   */
  angular
  .module('ngAmrsApp')
  .controller('AboutCtrl', AboutCtrl);
  AboutCtrl.$inject = ['$scope'];
  function AboutCtrl($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
})();
