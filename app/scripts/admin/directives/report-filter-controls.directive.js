/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('reportFilters', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        selectedForms: "=",
        startDate: "=",
        endDate: "=",
        selectedProvider: "=",
        enabledControls: "=",
        selectedLocations: "=",
        selectedIndicatorTags: "=",
        reportName: "=",
        isBusy: "=",
        startAge:"=",
        endAge:"=",
        gender:'=',
        reportHeader:'='


      },
      controller: reportFiltersController,
      link: reportFiltersLink,
      templateUrl: "views/admin/report-filter-controls.html"
    };
  }

  reportFiltersController.$inject = ['$scope', '$rootScope', 'SearchDataService', 'moment', '$state', '$filter',
    'CachedDataService', 'LocationModel', 'OpenmrsRestService', 'EtlRestService'];

  function reportFiltersController($scope, $rootScope, SearchDataService, moment, $state, $filter, CachedDataService,
                                   LocationModel, OpenmrsRestService, EtlRestService) {
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
    $scope.selectedLocations.allAggregated = false;
    $scope.selectAllLocations = selectAllLocations;

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
    $scope.onSelectedIndicatorTagChanged = onSelectedIndicatorTagChanged;
    $scope.selectAllTags = selectAllTags;
    $scope.locationsOptions = {};


    //expose member to scope
    $scope.loadIndicatorsSchema = loadIndicatorsSchema;
    $scope.fetchLocations = fetchLocations;
    $scope.reInitialize = init;
    $scope.isBusy = false;

    //pre-load data
    init();
    function init() {
      if (canView('indicator')) loadIndicatorsSchema();
      if (canView('location')) fetchLocations();
      if (canView('ageRangeSlider')) renderAgeRangeSlider();
      if (canView('gender')) defineGenderOptions();
      if (canView('singleIndicator')) loadIndicatorsSchema();

      defineGenderOptions();
      loadForms();
    }

    //age options
    function renderAgeRangeSlider() {
      $scope.ageRangeSlider = $("#ageRangeSlider");
      $scope.ageRangeSlider.ionRangeSlider({
        type: "double",
        min: 0,
        max: 120,
        grid_num: 40,
        from: $scope.startDate||1,
        to: $scope.endDate||120,
        grid: true,
        force_edges: true,
        keyboard: true,
        drag_interval: true,
        onFinish: function (data) {
          $scope.startAge = data.from;
          $scope.endAge = data.to;
        },
      });
    }

    //gender options
    function defineGenderOptions() {
      $scope.genderOptions = {
        placeholder: 'Select Gender...',
        dataTextField: 'name',
        dataValueField: 'id',
        valuePrimitive: true,
        filter: 'contains',
        dataSource: [
          {id:'M', name: 'Male'},
          {id:'F', name: 'Female'}
        ]
      };
      $scope.gender=['M','F']
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      $scope.isBusy = true;
      $scope.indicatorTags = [];
      $scope.selectedIndicatorTags.indicatorTags = [];
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.indicatorTags = result.result;
      $scope.indicatorSelectOptions = {
        placeholder: 'Select desired Indicator(s) or type to search...',
        dataTextField: 'name',
        dataValueField: 'name',
        filter: 'contains',
        autoClose: true,
        itemTemplate: '<span></span>' +
        '<span><strong>#: data.label #' +
        '</strong><br/><span><small>#: data.description #</small></span></span>',
        tagTemplate: '<span class="selected-value"></span><span>#: data.label#</span>',
        dataSource: result.result
      };
      $scope.isBusy = false;
    }


    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.indicatorSelectOptions = {};
      $scope.experiencedLoadingErrors = true;
    }

    function onSelectedIndicatorTagChanged(tag) {

    }

    function loadForms() {
      $scope.forms = CachedDataService.getCachedPocForms();
    }

    function canView(param) {
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
      $scope.locations = wrapLocations(locations);
      $scope.locationsOptions = {
        placeholder: 'Select a location or type to search...',
        dataTextField: 'name()',
        filter: 'contains',
        dataSource: wrapLocations(locations)
      };
      $scope.isBusy = false;
      //$scope.selectedLocations.locations = $scope.locations;
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
      $scope.locationsOptions = {};
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
      if ($scope.selectedLocations.selectedAll === false) {
        $scope.selectedLocations.selectedAll = true;
        $scope.selectedLocations.locations = $scope.locations;
      }
      else {
        $scope.selectedLocations.selectedAll = false;
        $scope.selectedLocations.locations = [];
      }
    }

    function selectAllTags() {
      if ($scope.indicatorTags.length > 0) {
        if ($scope.selectedIndicatorTags.selectedAll === false) {
          $scope.selectedIndicatorTags.selectedAll = true;
          $scope.selectedIndicatorTags.indicatorTags = $scope.indicatorTags;
        }
        else {
          $scope.selectedIndicatorTags.selectedAll = false;
          $scope.selectedIndicatorTags.indicatorTags = [];
        }
      }
    }
  }

  function reportFiltersLink(scope, element, attrs, vm) {
  }
})();
