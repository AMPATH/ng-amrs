/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .directive('reportList', directive);

  function directive() {
    return {

      restrict: 'E',
      scope: {
        locationUuid: '@',
        reportName: '@',
        enabledControls: '@',
        indicators: '@',
        title: '@',
        params: '=',
        cellFormatter: '&',
        accessor: '='
      },
      controller: reportListController,
      link: reportListLink,
      templateUrl: 'views/admin/report-list-directive.html'
    };
  }

  reportListController.$nject =

    ['$rootScope', '$scope', '$stateParams', 'EtlRestService', 'HivSummaryIndicatorService', 'moment', '$filter', '$state', '$timeout', '$modal'];

  function reportListController($rootScope, $scope, $stateParams, EtlRestService, HivSummaryIndicatorService, moment,
    $filter, $state, $timeout, $modal) {
    //Patient List Directive Properties & Methods
    $scope.selectedLocation = $scope.locationUuid || '';
    $scope.selectedIndicatorBox = $stateParams.indicator || '';
    $scope.selectedLocationName = $stateParams.locationName || '';
    $scope.ChangeView = ChangeView;
    $scope.dataVailable = false;
    //Hiv Summary Indicators Service Properties & Methods
    $scope.countBy = 'num_persons';
    $scope.groupBy = 'groupByLocation';
    $scope.loadReport = loadReport;
    $scope.getIndicatorLabelByName = getIndicatorLabelByName;
    $scope.state = $state.current.name;
    $scope.rotateXAxis = false;
    $scope.datapoints = [];
    $scope.datacolumns = [];
    $scope.datax = {
      id: 'location'
    };

    //UX Scope Params
    $scope.isBusy = false;
    $scope.experiencedLoadingError = false;
    $scope.resultIsEmpty = false;

    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function(val) {
      $scope.countBy = val;
      loadReport();
    };

    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {
      options: {}
    };
    $scope.exportList = [{
      name: 'Export Basic',
      value: ''
    }, {
      name: 'Export All',
      value: 'all'
    }, {
      name: 'Export Selected',
      value: 'selected'
    }];
    $scope.exportDataType = $scope.exportList[1];
    $scope.updateSelectedType = function() {
      var bsTable = document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType: $scope.exportDataType.value
      });
    };

    //Start Initialization
    init();

    //scope methods
    function init() {
      $timeout(function() {
        loadIndicatorsSchema();
      }, 1000);
    }

    function loadReport() {
      $scope.experiencedLoadingErrors = false;
      $scope.resultIsEmpty = false;
      if ($scope.isBusy === true) return;
      $scope.isBusy = true;
      var params = {};
      params = Object.assign($scope.params, {
        indicators: $scope.indicators
      });
      EtlRestService.getReport($scope.params, onFetchHivSummaryIndicatorsSuccess, onFetchHivSummaryIndicatorsError);

    }

    function onFetchHivSummaryIndicatorsSuccess(result) {
      $scope.isBusy = false;
      console.log('Sql query for HivSummaryIndicators request=======>', result.sql, result.sqlParams);
      if (result.size === 0) {
        $scope.allDataLoaded = true;
      } else {
        $scope.dataVailable = true;
        buildDataTable(result.result);
        $scope.chartFilters = true;
      }
    }

    function onFetchHivSummaryIndicatorsError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function loadIndicatorsSchema() {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      $scope.indicatorTags = [];
      $scope.isBusy = true;
      if ($scope.reportName && $scope.reportName !== '')
        EtlRestService.getIndicatorsSchema($scope.reportName, onFetchIndicatorsSchemaSuccess,
          onFetchIndicatorsSchemaError);

    }

    function onFetchIndicatorsSchemaSuccess(result) {
      $scope.isBusy = false;
      $scope.indicatorTags = result.result;
      //loadHivSummaryIndicators();
    }

    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    /**
     * Filters indicator by $scope.selectedIndicatorTags using key value pairs.
     * @property $scope.defaultIndicators, $scope.indicators $scope.selectedIndicatorTags.
     */

    function getIndicatorLabelByName(name) {
      var found = $filter('filter')($scope.indicatorTags, {
        name: name
      })[0];
      if (found) return found.label;
    }

    function getIndicatorDetails(name) {
      var found = $filter('filter')($scope.indicatorTags, {
        name: name
      })[0];
      if (found) return found;
    }

    /**
     * Method to fetch cached data to avoid round trips.
     */
    function loadCachedData() {
      if (HivSummaryIndicatorService.getIndicatorTags()) {
        $scope.indicators = HivSummaryIndicatorService.getIndicators($scope.state);
        $scope.indicatorTags = HivSummaryIndicatorService.getIndicatorTags();
        $scope.startDate = HivSummaryIndicatorService.getStartDate();
        $scope.endDate = HivSummaryIndicatorService.getEndDate();
        $scope.startAge = HivSummaryIndicatorService.getReportFilters().startAge;
        $scope.endAge = HivSummaryIndicatorService.getReportFilters().endAge;
        $scope.gender = HivSummaryIndicatorService.getReportFilters().gender;
        $scope.selectedLocations = HivSummaryIndicatorService.getSelectedLocation();
        $scope.selectedIndicatorTags = HivSummaryIndicatorService.getSelectedIndicatorTags($scope.state);
        buildDataTable();
        //  $scope.chartFilters = true;
        return true;
      }
    }

    function ChangeView() {
      $state.go('admin.hiv-summary-combined');
    }

    /**
     * converts wrapped selected indicators and locations to comma separated strings
     */
    function getSelectedIndicators(selectedIndicatorObject) {
      var indicators;
      if (selectedIndicatorObject.indicatorTags)
        for (var i = 0; i < selectedIndicatorObject.indicatorTags.length; i++) {
          if (i === 0) {
            indicators = '' + selectedIndicatorObject.indicatorTags[i].name;
          } else {
            indicators =
              indicators + ',' + selectedIndicatorObject.indicatorTags[i].name;
          }
        }
      return indicators;
    }


    /**
     * Function to cache data in order to prevent app from hitting the server when a resource is requested
     */
    function cacheResource() {
      HivSummaryIndicatorService.setIndicatorTags($scope.indicatorTags);
      HivSummaryIndicatorService.setIndicators($scope.indicators, $scope.state);
      HivSummaryIndicatorService.setStartDate($scope.startDate);
      HivSummaryIndicatorService.setEndDate($scope.endDate);
      HivSummaryIndicatorService.setReportFilters({
        startAge: $scope.startAge,
        endAge: $scope.endAge,
        gender: $scope.gender
      });
      HivSummaryIndicatorService.setSelectedIndicatorTags($scope.selectedIndicatorTags, $scope.state);
      // if($scope.selectedLocations && $scope.selectedLocations.locations.length>0)
      HivSummaryIndicatorService.setSelectedLocation($scope.selectedLocations);

    }

    /**
     * Functions to populate and define bootstrap data table
     */
    function buildDataTable(result) {
      $timeout(function() {
        buildColumns(result);
        buildTableControls(result);
      }, 1000);
    }

    function buildSingleColumn(header) {
      var visible = (header.name !== 'location_uuid');
      $scope.columns.push({
        field: header.name.toString(),
        title: $filter('titlecase')(header.name.toString().split('_').join(' ')),
        align: 'center',
        valign: 'center',
        class: header.name === 'location' ? 'bst-table-min-width' : undefined,
        visible: visible,
        tooltip: true,
        sortable: true,
        formatter: function(value, row, index) {
          return cellFormatter(value, row, index, header);
        }
      });
    }

    function buildColumns(result) {
      $scope.columns = [];
      var tableIndicators = [{
        name: 'location'
      }];
      var indicators = $scope.indicators.split(',');
      var arrayLength = indicators.length;
      for (var i = 0; i < arrayLength; i++) {
        tableIndicators.push(_.findWhere($scope.indicatorTags, {
          name: indicators[i]
        }));
      }
      _.each(tableIndicators, function(header) {
        buildSingleColumn(header);
      });
    }

    function buildTableControls(result) {
      $scope.bsTableControl = {
        options: {
          data: result,
          rowStyle: function(row, index) {
            return {
              classes: 'none'
            };
          },
          tooltip: true,
          classes: 'table table-hover',
          cache: false,
          height: 550,
          detailView: false,
          detailFormatter: detailFormatter,
          striped: true,
          selectableRows: true,
          showFilter: true,
          pagination: true,
          pageSize: 20,
          pageList: [5, 10, 25, 50, 100, 200],
          search: true,
          trimOnSearch: true,
          singleSelect: false,
          showColumns: true,
          showRefresh: true,
          showMultiSort: true,
          showPaginationSwitch: true,
          smartDisplay: true,
          idField: 'location',
          minimumCountColumns: 2,
          clickToSelect: true,
          showToggle: false,
          maintainSelected: true,
          showExport: true,
          toolbar: '#toolbar',
          toolbarAlign: 'left',
          exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
          columns: $scope.columns,
          exportOptions: {
            fileName: 'hivSummaryIndicators'
          },
          iconSize: undefined,
          iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
          icons: {
            paginationSwitchDown: 'glyphicon-chevron-down',
            paginationSwitchUp: 'glyphicon-chevron-up',
            refresh: 'glyphicon-refresh',
            toggle: 'glyphicon-list-alt',
            columns: 'glyphicon-th',
            sort: 'glyphicon-sort',
            plus: 'glyphicon-plus',
            minus: 'glyphicon-minus',
            detailOpen: 'glyphicon-plus',
            detailClose: 'glyphicon-minus'
          },
          fixedColumns: true,
          fixedNumber: 1,
          onPostBody: function() {
            //please make sure you calibrate results[0].style.maxHeight with relation to height (550)
            var results = document.getElementsByClassName("fixed-table-body-columns");
            results[0].style.maxHeight = '380px';
          },
          onExpandRow: function onExpandRow(index, row, $detail) {
            //$scope.fixedColumns=false;
            //$('#bsTable').bootstrapTable('hideColumn','encounter_datetime');

          }
        }
      };
    }

    /**
     * Function to format detailed view
     */
    function detailFormatter(index, row) {
      var html = [];
      _.each(row, function(value, key) {
        if (key === 'location_uuid' || key === 'state') return;
        var label = getIndicatorLabelByName(key) || key;
        label = $filter('titlecase')(label.toString().split('_').join(' '));
        var key = $filter('titlecase')(key.toString().split('_').join(' '));
        html.push('<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
          '<p><b>' + key + '</b> (<span class="text-info">' + label + '</span>): ' + value + '</p></div>');
      });
      return html.join('');
    }

    /**
     * Function to add button on each cell
     */
    function cellFormatter(value, row, index, header) {
      if (header.name === 'location') return '<div class="text-center" style="height:43px!important;" >' +
        '<span class="text-info text-capitalize">' + value + '</span></div>';
      if (header.name === 'state') return;
      return ['<a class="btn btn-large btn-default" style="padding: inherit; width:100%; max-width: 300px"',
        'title="' + getIndicatorLabelByName(header.name) + ' (in ' + row.location + ')" data-toggle="tooltip"',
        'data-placement="top"',
        'href="#/admin-dashboard/hiv-summary-indicators/location/' + row.location_uuid + '/indicator/' + header.name + '/locationName/' + row.location + '">' + value + '</a>'
      ].join('');


    }
  }

  function getDataPoints(result) {
    var dataPoints = [];
    for (var i = 0; i < result.length; i++) {
      var dataPoint = {};
      var dataColumn = {};
      var row = result[i];
      for (var key in row) {
        dataPoint[key] = row[key];
      }
      dataPoints.push(dataPoint);
    }
    return dataPoints;
  }

  function getColumns(indicators) {
    var columns = [];
    indicators.forEach(function(indicator) {
      columns.push({
        id: indicator,
        type: 'bar'
      });
    });
    return columns;
  }

  function reportListLink(scope, element, attrs, vm) {

    scope.$on('loadData', function(event, data) {
      if (data) {
        scope.params = Object.assign(scope.params, {
          locationUuids: data
        });
      }
      //call directive function here
      scope.loadReport();
    });
  }


})();
