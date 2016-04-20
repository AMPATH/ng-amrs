/*jshint -W003, -W117, -W098, -W026 */
(function () {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .factory('ClinicalAnalyticsService', ClinicalAnalyticsService);
  ClinicalAnalyticsService.$inject = ['$filter', 'moment'];
  function ClinicalAnalyticsService($filter, moment) {

    var serviceDefinition;
    serviceDefinition = {
      generateXAndYAxis: generateXAndYAxis,
      defineXAndYAxis:defineXAndYAxis,
      generateChartObject: generateChartObject
    };
    return serviceDefinition;
    function defineXAndYAxis(columnDefinition) {
      var dataColumns=[];
      _.each(columnDefinition, function (column) {
        dataColumns.push({id: column.indicator, type: column.chartType, name: column.name});
      });
      return dataColumns;
    }

    function generateChartObject(data, chartObject, definition) {
      var plotValues=[];
      var xAxis=chartObject.xAxis.id;
      chartObject.dataColumns=defineXAndYAxis(definition);
      //dataPoint Definition
      chartObject.dataPoints=[];
      for (var i = 0; i < data.length; ++i) {
        var dataPoint = {};
        dataPoint[xAxis] = data[i][xAxis];
        _.each(chartObject.dataColumns, function (column) {
          var val=(data[i][column.id]).toFixed(1);
          plotValues.push(val);
          dataPoint[column.id] =val;
        });
        chartObject.dataPoints.push(dataPoint);
      }
      //min and max definition
      chartObject.min=Math.round(arrayMin(plotValues))||0;
      chartObject.max=Math.round(arrayMax(plotValues))||100;
      return chartObject;
    }

    function generateXAndYAxis(data, x, y) {
      var xAxis = []; //key
      var yAxis = []; //value
      for (var i = 0; i < data.length; ++i) {
        xAxis.push(data[i][x]);
        yAxis.push(data[i][y]);
      }

      return {
        xAxis: xAxis,
        yAxis: yAxis
      }
    }
    //Helpers
    function arrayMin(arr) {
      var len = arr.length, min = Infinity;
      while (len--) {
        if (Number(arr[len]) < min) {
          min = Number(arr[len]);
        }
      }
      return min;
    };

    function arrayMax(arr) {
      var len = arr.length, max = -Infinity;
      while (len--) {
        if (Number(arr[len]) > max) {
          max = Number(arr[len]);
        }
      }
      return max;
    };


  }

})();
