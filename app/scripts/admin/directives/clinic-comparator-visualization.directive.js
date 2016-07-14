/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('clinicalComparatorVisualization', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        startDate: "=",
        endDate: "=",
        enabledCharts: "=",
        selectedLocations: "@",
        isBusy: "=",
        indicators: "=",
        selectedIndicatorTags: "=",
        reportName: "=",
        chartFilters: "=",
        location:"="
      },
      controller: clinicalComparatorVisualization,
      link: dataAnalyticsLink,
      templateUrl: "views/admin/clinic-comparator-visualization.html"
    };
  }

  clinicalComparatorVisualization.$inject = ['$scope', 'moment',
    '$loading', '$stateParams',  'EtlRestService',  '$filter'];

  function clinicalComparatorVisualization($scope, moment, $loading,
                                       $stateParams,  EtlRestService,  $filter) {

    $scope.generateGraph = generateGraph;
    $scope.selectedAxis = {
      xAxis: '',
      yAxis: []
    };

    $scope.chart = {
      bindto: '#chart',
      data: {
        x: 'reporting_month',
        columns: [],
        type: 'bar'
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      },
      zoom: {
        enabled: true
      },
      axis: {
        x: {
          label: {
            text: 'Month',
            position: 'outer-center'
          },

          type: 'category'
        },
        y: {
          label: {
            text: 'Y label',
            position: 'outer-middle'
          }
        },
        y2: {
          show: false,
          label: {
            text: 'Percent(%)',
            position: 'outer-middle'
          }
        }
      }

    };

    $scope.xAxisSource = [];
    $scope.yAxisSource = [];
    $scope.chartType = [
      {name: 'spline'},
      {name: 'bar'}
    ];


    function init() {
      $scope.$on("location", function(event, data) {
        $scope.yAxisSource = data;

      });

      $scope.xAxisSource = [{name:'month'}];

      for (var i = 0; i < $scope.indicators.length; ++i) {
        $scope.indicators[i].month =
          $filter('date')($scope.indicators[i].month, 'MMM, y');
      }

    }

    function generateGraph() {
      $scope.chart.data.type =$scope.chartType.name.name;
      $scope.chart.data.x = $scope.selectedAxis.xAxis.name;
      $scope.chart.axis.x.label.text = $scope.selectedAxis.xAxis.label;
      $scope.chart.axis.x.type = $scope.selectedAxis.xAxis.name === 'month'||
      $scope.selectedAxis.xAxis.name ==='location'?'category':'indexed';
      //generate columns

      var col = [];
      //y-axis
      var yAxisLabel =[];

      _.each( $scope.selectedAxis.yAxis, function (indicator) {
        var label=indicator.label;
        var columnRow = [indicator.name];
        _.each($scope.indicators, function (row) {
          columnRow.push(row[indicator.name]);
        });
        col.push(columnRow);
        for(var i=0; i<col.length;i++){
          for(var j=0; j<col[i].length;j++){
            if(col[i][j]===undefined){
              col[i][j]=0;
            }
          }
        }
        yAxisLabel.push(label);
        $scope.chart.axis.y.label.text= yAxisLabel;

      });

      //x-axis
      var columnRow = [$scope.selectedAxis.xAxis.name];
      _.each($scope.indicators, function (row) {
        columnRow.push(row[$scope.selectedAxis.xAxis.name]);
      });
      col.push(columnRow);
      $scope.chart.data.columns = col;
      //create chart
      c3.generate($scope.chart);

    }

    $scope.$watchGroup(['startDate', 'endDate', 'isBusy', 'selectedIndicatorTags', 'indicators','location'], function (newValues, oldValues, scope) {
      var startDate = newValues[0];
      var endDate = newValues[1];
      if (endDate > startDate) {
                init();
      }

    });
  }

  function dataAnalyticsLink(scope, element, attrs, vm) {
  }
})();
