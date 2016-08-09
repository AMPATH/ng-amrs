/*jshint -W003, -W098, -W033 */
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name ngAmrsApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the ngAmrsApp
   */
  angular
    .module('app.administration')
    .controller('AdministrationCtrl', AdministrationCtrl);
  AdministrationCtrl.$nject = ['$rootScope', '$scope'];

  function AdministrationCtrl($rootScope, $scope) {

  }
})();
