/* global angular */
/*
 jshint -W003, -W026
 */
(function(){
  'use strict';

  angular
    .module('app.admin')
    .directive('statsHivMonthlySummaryFilters',directive);

  function directive(){
    return {
      restrict:"E",
      scope:{
        selectedForms:"=",
        startDate:"=",
        endDate:"=",
        selectedProvider:"=",
        enabledControls:"=",
        selectedLocations:"="

      },
      controller:hivMonthlySummaryFilterController,
      link:hivSummaryFilterLink,
      templateUrl:"views/admin/hiv-monthly-summary-filter-controls.html"
    };
  }

  hivMonthlySummaryFilterController.$inject=['$scope','$rootScope','SearchDataService','EtlRestService','moment','$state','$filter','CachedDataService','OpenmrsRestService','LocationModel'];

  function hivMonthlySummaryFilterController($scope,$rootScope,SearchDataService,EtlRestService,moment,$state,$filter,CachedDataService,OpenmrsRestService,LocationModel){
    $scope.forms = [];
    $scope.selectedForms = {};
    $scope.selectedForms.selected = [];
    $scope.selectedEncounterTypes = {};
    $scope.selectedEncounterTypes.selected = [];
    $scope.selectAllForms = selectAllForms;
    $scope.selectAllEncounterTypes = selectAllEncounterTypes;

    //location var
    $scope.selectedLocations = {};
    $scope.selectedLocations.selectedAll = false;
    $scope.selectedLocations.locations = [];
    $scope.selectAllLocations= selectAllLocations;

    $scope.providers = [];
    $scope.selectedProvider = {};
    $scope.selectedProvider.selected = {};
    $scope.findProviders = findProviders;
    $scope.findingProvider = false;
    $scope.canView = canView;
    var locationService = OpenmrsRestService.getLocationResService();

    ///Multi-Select Properties/ Params
    $scope.selectedIndicatorTags = {};
    $scope.selectedIndicatorTags.selectedAll = false;
    $scope.selectedIndicatorTags.indicatorTags = [];
    $scope.indicatorTags = [];
    $scope.onSelectedIndicatorTagChanged=onSelectedIndicatorTagChanged;
    $scope.reportName='hiv-summary-report';
    $scope.selectAllTags= selectAllTags;


    //pre-load data
    init();
    function init() {
      loadIndicatorsSchema();
      loadForms();
      fetchLocations();
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if($scope.isBusy === true) return;
      $scope.isBusy = true;
      $scope.indicatorTags =[];
      $scope.selectedIndicatorTags.indicatorTags=[];
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.isBusy = false;
      $scope.indicatorTags =result.result;
    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }
    function onSelectedIndicatorTagChanged(tag) {

    }
    function loadForms() {
      $scope.forms = CachedDataService.getCachedPocForms();
    }

    function canView(param){
      return $scope.enabledControls.indexOf(param) > -1;
    }

    function selectAllForms() {
      if ($scope.forms)
        $scope.selectedForms.selected = $scope.forms;
    }

    function selectAllEncounterTypes() {
      if ($scope.forms)
        $scope.selectedEncounterTypes.selected = $scope.forms;
    }

    function findProviders(searchText) {

      $scope.providers = [];
      if (searchText && searchText !== ' ') {
        $scope.findingProvider = true;
        SearchDataService.findProvider(searchText, onProviderSearchSuccess, onProviderSearchError);
      }
    }

    function onProviderSearchSuccess(data) {
      $scope.findingProvider = false;
      $scope.providers = data;
    }

    function onProviderSearchError(error) {
      $scope.findingProvider = false;
    }

    function fetchLocations() {
      $scope.isBusy = true;
      locationService.getLocations(onGetLocationsSuccess,
        onGetLocationsError, false);
    }

    function onGetLocationsSuccess(locations) {
      $scope.isBusy = false;
      $scope.locations = wrapLocations(locations);
      //$scope.selectedLocations.locations = $scope.locations;
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
    }

    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        var wrapped = wrapLocation(locations[i]);
        wrapped.index = i;
        wrappedLocations.push(wrapped);
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      return LocationModel.toWrapper(location);
    }
    function selectAllLocations() {
      if ( $scope.selectedLocations.selectedAll === false){
        $scope.selectedLocations.selectedAll = true;
        $scope.selectedLocations.locations =  $scope.locations;
      }
      else{
        $scope.selectedLocations.selectedAll = false;
        $scope.selectedLocations.locations = [];
      }
    }
    function selectAllTags() {
      if ( $scope.selectedIndicatorTags.selectedAll === false){
        $scope.selectedIndicatorTags.selectedAll = true;
        $scope.selectedIndicatorTags.indicatorTags = $scope.indicatorTags;
      }
      else{
        $scope.selectedIndicatorTags.selectedAll = false;
        $scope.selectedIndicatorTags.indicatorTags = [];
      }
    }
  }

  function hivSummaryFilterLink(scope, element, attrs, vm) {
  }
})();
