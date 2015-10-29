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
    .module('app.admin')
    .controller('AdminDashboardCtrl', AdminDashboardCtrl);
  AdminDashboardCtrl.$nject = ['$rootScope', '$scope', 
  '$stateParams', '$timeout', 'OpenmrsRestService'];

  function AdminDashboardCtrl($rootScope, $scope, 
  $stateParams, $timeout, OpenmrsRestService) {  
  }
})();
