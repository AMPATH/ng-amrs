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
    .module('ngAmrsApp')
    .controller('UrlSelectorCtrl', UrlSelectorCtrl);
  UrlSelectorCtrl.$nject = ['$rootScope', '$scope', 'OpenmrsSettings', 'EtlRestServicesSettings', 'AuthService'];

  function UrlSelectorCtrl($rootScope, $scope, OpenmrsSettings, EtlRestServicesSettings, AuthService) {

    $scope.currentMode = '';

    $scope.currentRestBaseUrl = '';

    $scope.currentEtlRestBaseUrl = '';

    $scope.urlRestBaseList = [];
    $scope.urlEtlRestBaseList = [];
    
    $scope.urlToAdd = '';
    
    $scope.urlEtlToAdd = '';
    
    //methods
    $scope.addUrlToList = addUrlToList;
    $scope.addEtlUrlToList = addEtlUrlToList;
    $scope.saveSettings = saveSettings;

    activate();

    function activate() {
      var hasPersistedCurrentUrl = OpenmrsSettings.hasCoockiePersistedCurrentUrlBase() && EtlRestServicesSettings.hasCoockiePersistedCurrentUrlBase();
      if (!hasPersistedCurrentUrl)
        $scope.currentMode = 'SetMode';
      else
        $scope.currentMode = 'ChangeMode';

      $scope.currentRestBaseUrl = OpenmrsSettings.getCurrentRestUrlBase();
      $scope.currentEtlRestBaseUrl = EtlRestServicesSettings.getCurrentRestUrlBase();

      $scope.urlRestBaseList = OpenmrsSettings.getUrlBaseList();
      $scope.urlEtlRestBaseList = EtlRestServicesSettings.getUrlBaseList();


    }

    function addUrlToList() {
      if($scope.urlToAdd && $scope.urlToAdd !== ''){
        OpenmrsSettings.addUrlToList($scope.urlToAdd);
      }
    }

    function addEtlUrlToList() {
       if($scope.urlEtlToAdd && $scope.urlEtlToAdd !== ''){
        EtlRestServicesSettings.addUrlToList($scope.urlEtlToAdd);
       }
    }
    
    function saveSettings() {
        EtlRestServicesSettings.setCurrentRestUrlBase($scope.currentEtlRestBaseUrl);
        OpenmrsSettings.setCurrentRestUrlBase($scope.currentRestBaseUrl);
        AuthService.logOut();
    }
    
    function cancel() {
        
    }


  }
})();
