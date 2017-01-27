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
      defineXAndYAxis: defineXAndYAxis,
      generateChartObject: generateChartObject,
      generateDataTable: generateDataTable
    };
    return serviceDefinition;
    function defineXAndYAxis(columnDefinition) {
      var dataColumns = [];
      _.each(columnDefinition, function (column) {
        dataColumns.push({ id: column.indicator, type: column.chartType, name: column.name });
      });
      return dataColumns;
    }

    function generateDataTable(data) {
      var columns = [];
      var headers = [
        { indicator: 'reporting_date', title: 'Reporting Month' },
        { indicator: 'currently_in_care_total', title: 'Patients In Care' },
        { indicator: 'on_art_total', title: 'Patients On ART' },
        { indicator: 'not_on_art_total', title: 'Patients Not On ART' },
        { indicator: 'patients_requiring_vl', title: 'Patients Qualified For VL' },
        { indicator: 'tested_appropriately', title: 'On ART with VL' },
        { indicator: 'not_tested_appropriately', title: 'On ART without VL' },
        { indicator: 'due_for_annual_vl', title: 'Due For Annual VL' },
        { indicator: 'pending_vl_orders', title: 'Ordered & Pending VL Result' },
        { indicator: 'missing_vl_order', title: 'Missing VL Order' },
        { indicator: 'virally_suppressed', title: 'Virally Suppressed' },
        { indicator: 'not_virally_suppressed', title: 'Not Virally Suppressed' }
      ];
      _.each(headers, function (header) {
        //var visible =(header!=='location_uuid');
        columns.push({
          field: header.indicator,
          title: header.title.toString(),
          align: 'center',
          valign: 'center',
          class: header === 'reporting_date' ? 'bst-table-min-width' : undefined,
          sortable: true,
          visible: true,
          tooltip: true,
          formatter: function (value, row, index) {
            if (header.indicator === 'reporting_date') return '<div class="text-center" style="" >' +
              $filter('date')(value, 'MMM, y') + '</div>';
            return ['<a class="chartPatientList"',
              'title="' + header.title + ',' + header.indicator + '" data-toggle="tooltip"',
              'data-placement="top"',
              'href="javascript:void(0)" >' + value + '</a>'
            ].join('');
          },
          events: 'actionEvents'
        });
      });
      return {
        options: {
          data: data,
          rowStyle: function (row, index) {
            return { classes: 'none' };
          },
          tooltip: true,
          classes: 'table table-hover',
          cache: false,
          height: 360,
          detailView: false,
          striped: true,
          selectableRows: true,
          showFilter: true,
          pagination: true,
          pageSize: 100,
          pageNumber: 1,
          pageList: [5, 10, 25, 50, 100, 200],
          search: false,
          trimOnSearch: true,
          singleSelect: false,
          showColumns: true,
          showRefresh: true,
          showMultiSort: true,
          showPaginationSwitch: true,
          smartDisplay: true,
          idField: 'reporting_month',
          minimumCountColumns: 2,
          clickToSelect: true,
          showToggle: false,
          maintainSelected: true,
          showExport: true,
          toolbar: '#toolbar',
          toolbarAlign: 'left',
          exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
          columns: columns,
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
          fixedNumber: 1
        }
      };
    }

    function generateChartObject(data, chartObject, definition) {
      var plotValues = [];
      var xAxis = chartObject.xAxis.id;
      chartObject.dataColumns = defineXAndYAxis(definition);
      //dataPoint Definition
      chartObject.dataPoints = [];
      for (var i = 0; i < data.length; ++i) {
        var dataPoint = {};
        dataPoint[xAxis] = data[i][xAxis];
        _.each(chartObject.dataColumns, function (column) {
          data[i][column.id] = (data[i][column.id]);
          var val = (data[i][column.id]).toFixed(1);
          plotValues.push(val);
          dataPoint[column.id] = val;
        });
        chartObject.dataPoints.push(dataPoint);
      }
      //min and max definition
      chartObject.min = Math.round(arrayMin(plotValues)) || 0;
      chartObject.max = Math.round(arrayMax(plotValues)) || 100;
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
