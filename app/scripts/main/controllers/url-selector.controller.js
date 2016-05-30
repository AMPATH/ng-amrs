/*jshint -W003, -W098, -W033 */
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
    .controller('UrlSelectorCtrl', UrlSelectorCtrl);
  UrlSelectorCtrl.$nject = ['$rootScope', '$scope', 'OpenmrsSettings', 'EtlRestServicesSettings',
    'AuthService', '$state', '$http'
  ];

  function UrlSelectorCtrl($rootScope, $scope, OpenmrsSettings, EtlRestServicesSettings,
    AuthService, $state, $http) {

    $scope.currentMode = '';

    $scope.currentRestBaseUrl = '';

    $scope.currentEtlRestBaseUrl = '';

    $scope.urlRestBaseList = [];
    $scope.urlEtlRestBaseList = [];

    $scope.urlToAdd = '';

    $scope.urlEtlToAdd = '';

    $scope.addingUrl = false;

    $scope.addingEtlUrl = false;

    $scope.preConfiguredSettings = [];

    //methods
    $scope.addUrlToList = addUrlToList;
    $scope.addEtlUrlToList = addEtlUrlToList;
    $scope.saveSettings = saveSettings;
    $scope.cancelAddingUrl = cancelAddingUrl;
    $scope.selectConfiguration = selectConfiguration;
    $scope.isBusy=false;
    activate();

    function activate() {
      fetchServerTemplates();
      var hasPersistedCurrentUrl = OpenmrsSettings.hasCoockiePersistedCurrentUrlBase() && EtlRestServicesSettings.hasCoockiePersistedCurrentUrlBase();
      if (!hasPersistedCurrentUrl)
        $scope.currentMode = 'SetMode';
      else
        $scope.currentMode = 'ChangeMode';

      $scope.urlRestBaseList = OpenmrsSettings.getUrlBaseList();
      $scope.urlEtlRestBaseList = EtlRestServicesSettings.getUrlBaseList();

      //add current url to list to enable selection
      var currentUrl = OpenmrsSettings.getCurrentRestUrlBase();
      var hasCurUrl = _.contains($scope.urlRestBaseList, currentUrl);
      if (!hasCurUrl) OpenmrsSettings.addUrlToList(currentUrl);

      var currentEtlUrl = EtlRestServicesSettings.getCurrentRestUrlBase();
      var hasCurEtlUrl = _.contains($scope.urlEtlRestBaseList, currentEtlUrl);
      if (!hasCurEtlUrl) EtlRestServicesSettings.addUrlToList(currentEtlUrl);

      $scope.currentRestBaseUrl = currentUrl;
      $scope.currentEtlRestBaseUrl = currentEtlUrl;

    }
    function fetchServerTemplates() {
      $scope.isBusy=true;
      $http.get('servers.json').
      success(function(data, status, headers, config) {
        $scope.isBusy=false;
        $scope.preConfiguredSettings = data;
      }).
      error(function(data, status, headers, config) {
        $scope.isBusy=false;
        // log error
      });
    }
    function addUrlToList() {
      if ($scope.addingUrl) {
        if ($scope.urlToAdd && $scope.urlToAdd !== '') {
          OpenmrsSettings.addUrlToList($scope.urlToAdd);
          $scope.currentRestBaseUrl = $scope.urlToAdd;
          $scope.addingUrl = false;
        }
      } else {
        $scope.addingUrl = true;
      }

    }

    function cancelAddingUrl() {
      $scope.addingUrl = false;
      $scope.addingEtlUrl = false;
    }

    function addEtlUrlToList() {
      if ($scope.addingEtlUrl) {
        if ($scope.urlEtlToAdd && $scope.urlEtlToAdd !== '') {
          EtlRestServicesSettings.addUrlToList($scope.urlEtlToAdd);
          $scope.currentEtlRestBaseUrl = $scope.urlEtlToAdd;
          $scope.addingEtlUrl = false;
        }
      } else {
        $scope.addingEtlUrl = true;
      }
    }

    function saveSettings() {
      EtlRestServicesSettings.setCurrentRestUrlBase($scope.currentEtlRestBaseUrl);
      OpenmrsSettings.setCurrentRestUrlBase($scope.currentRestBaseUrl);
      AuthService.logOut();
    }

    function selectConfiguration(configuration) {
      if (!findAmrsConfiguration(configuration.amrs)){
        $scope.urlRestBaseList.push(configuration.amrs)
      }
      if (!findEtlConfiguration(configuration.etl)){
        $scope.urlEtlRestBaseList.push(configuration.etl)
      }
      $scope.currentRestBaseUrl = findAmrsConfiguration(configuration.amrs);
      $scope.currentEtlRestBaseUrl = findEtlConfiguration(configuration.etl);
    }

    function findEtlConfiguration(url) {
      var found;
      for (var i = 0; i < $scope.urlEtlRestBaseList.length; i++) {
        var val = $scope.urlEtlRestBaseList[i];
        if (angular.equals(val, url) || angular.equals(url, val)) {
          found = i;
        }
      }
      return $scope.urlEtlRestBaseList[found];
    }

    function findAmrsConfiguration(url) {
      var found;
      for (var i = 0; i < $scope.urlRestBaseList.length; i++) {
        var val = $scope.urlRestBaseList[i];
        if (angular.equals(val, url) ||angular.equals(url, val)) {
          found = i;
        }
      }
      return $scope.urlRestBaseList[found];
    }

  }
})();
