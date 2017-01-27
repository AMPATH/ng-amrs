/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('clinicalAnalyticsVisualization', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        startDate: "=",
        endDate: "=",
        enabledCharts: "=",
        selectedLocations: "=",
        isBusy: "="
      },
      controller: clinicalAnalyticsController,
      link: clinicalAnalyticsLink,
      templateUrl: "views/clinic-dashboard/clinical-analytics-visualization.html"
    };
  }

  clinicalAnalyticsController.$inject = ['$scope', 'moment', '$timeout',
    '$loading', '$stateParams', 'ClinicalAnalyticsService', 'EtlRestService', '$modal'];

  function clinicalAnalyticsController($scope, moment, $timeout, $loading,
                                       $stateParams, ClinicalAnalyticsService, EtlRestService, $modal) {
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.startDate = new Date(new Date().setYear(new Date().getFullYear() - 1));
    $scope.endDate = new Date();
    $scope.generateGraph = generateGraph;
    $scope.width = 0;
    //init bstable
    $scope.columns = [];
    $scope.bsTableControl = {
      options: {}
    };
    //range slider definition
    $scope.rangeSlider = $("#rangeSlider");
    $scope.rangeSlider.ionRangeSlider({
      type: "double",
      min: moment(new Date(new Date().setYear(new Date().getFullYear() - 15))).startOf('month').format("X"),
      max: moment(new Date(new Date().setYear(new Date().getFullYear()))).endOf('month').format("X"),
      from: moment(new Date($scope.startDate)).startOf('month').format("X"),
      to: moment(new Date($scope.endDate)).endOf('month').format("X"),
      grid: true,
      grid_num: 10,
      force_edges: true,
      prettify: function (num) {
        var m = moment(num, "X");
        return m.format("MMMM, YYYY");
      },
      keyboard: true,
      onFinish: function (data) {
        $scope.startDate = new Date(moment.unix(data.from).startOf('month'));
        $scope.endDate = new Date(moment.unix(data.to).endOf('month'));
        
        generateGraph($scope.art, $scope.startDate, $scope.endDate);
        generateGraph($scope.patientStatus, $scope.startDate, $scope.endDate);
        generateGraph($scope.hivComparative, $scope.startDate, $scope.endDate);
      },
    });

    //comparative current_on_art,current_in_care,vl_less_than_1000,reporting_month
    $scope.hivComparative = {
      reportName: 'clinical-hiv-comparative-overview-report',
      chartDefinition: [//define chart columns and chart types
        {indicator: 'currently_in_care_total', chartType: 'spline', name: 'Patients In Care'},
        {indicator: 'on_art_total', chartType: 'spline', name: 'Patients On ART'},
        {indicator: 'perc_tested_appropriately', chartType: 'spline', name: '% on ART with VL'},
        {indicator: 'perc_virally_suppressed', chartType: 'spline', name: '% Virally Suppressed'}
      ],
      groupBy: 'groupByEndDate',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty: false
    };
    $scope.hivComparative.chart = {
      xAxis: {id: 'reporting_month'}, //x axis plot definition
      yAxis: 'currently_in_care_total,on_art_total', //y axis plot definition
      y2Axis: 'perc_virally_suppressed,perc_tested_appropriately', //y2 axis plot definition
      min: 0, //initialize min
      max: 0, //initialize max
      dataPoints: [], //array of values to be plotted
      dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.hivComparative.chartDefinition)
    };

    //art chart current_on_art,current_in_care,vl_less_than_1000,reporting_month
    $scope.patientStatus = {
      reportName: 'clinical-patient-care-status-overview-report',
      chartDefinition: [ //define chart columns and chart types
        {indicator: 'patients_continuing_care', chartType: 'pie', name: 'Patients In Care'},
        {indicator: 'transferred_out_patients', chartType: 'pie', name: 'Transferred Out Patients'},
        {indicator: 'deceased_patients', chartType: 'pie', name: 'Deceased Patients'},
        {indicator: 'untraceable_patients', chartType: 'pie', name: 'Untraceable Patients'},
        {indicator: 'hiv_negative_patients', chartType: 'pie', name: 'HIV Negative Patients'},
        {indicator: 'self_disengaged_from_care', chartType: 'pie', name: 'Self Disengaged From Care'},
        {indicator: 'defaulters', chartType: 'pie', name: 'Defaulters'},
        {indicator: 'other_patient_care_status', chartType: 'pie', name: 'Others'}
      ],
      groupBy: '',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty: false
    };
    $scope.patientStatus.chart = {
      xAxis: {id: ''}, //x axis plot definition
      yAxis: '', //y axis plot definition
      y2Axis: '', //y2 axis plot definition
      min: 0, //initialize min
      max: 0, //initialize max
      dataPoints: [], //array of values to be plotted
      dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.patientStatus.chartDefinition)
    };


    //art chart current_on_art,current_in_care,vl_less_than_1000,reporting_month
    $scope.art = {
      reportName: 'clinical-art-overview-report',
      chartDefinition: [
        {indicator: 'not_on_arv', chartType: 'donut', name: 'Not On Any ARV Drugs'},
        {indicator: 'on_nevirapine', chartType: 'donut', name: 'Nevirapine'},
        {indicator: 'on_efavirenz', chartType: 'donut', name: 'Efavirenz'},
        {indicator: 'on_lopinavir', chartType: 'donut', name: 'Lopinavir'},
        {indicator: 'on_atazanavir', chartType: 'donut', name: 'Atazanavir'},
        {indicator: 'on_raltegravir', chartType: 'donut', name: 'Raltegravir'},
        {indicator: 'on_other_arv_drugs', chartType: 'donut', name: 'Others'}

      ],
      groupBy: '',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty: false
    };
    $scope.art.chart = {
      xAxis: {id: ''}, //x axis plot definition
      yAxis: '', //y axis plot definition
      y2Axis: '', //y2 axis plot definition
      min: 0, //initialize min
      max: 0, //initialize max
      dataPoints: [], //array of values to be plotted
      dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.art.chartDefinition)
    };

    $scope.getSelectedMonth = function (data) {
      var dataPoint = $scope.hivComparative.chart.dataPoints[data.index];
      var selectedMonth = dataPoint.reporting_month.split('/');
      var dateRange = getMonthDateRange(selectedMonth[1], selectedMonth[0]);
      return dateRange;
    };
    //Patient List Function to generate data
    $scope.generatePatientList = function (data, obj, startDate, endDate, animation) {
      if (data && obj && startDate && endDate) {
        var modalInstance = $modal.open({
          templateUrl: 'views/clinic-dashboard/patient-list-modal.html',
          controller: 'PatientListModalCtrl',
          size: 'lg',
          animation: animation,
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          // windowClass:'xx-dialog',
          resolve: {
            data: function () {
              return {
                selectedPoint: data,
                chartObject: obj,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
              };
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selectedProject = selectedItem.ProjectID
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      }
    };

    //adding click event to bootstrap-table links
    function addClickListenerOnTableCells() {
      window.actionEvents = {
        'click .chartPatientList': function (e, value, row, index) {
          try {
            var selectedIndex = e.currentTarget.title.split(',');
            var selectedMonth = row.reporting_month.split('/');
            var dateRange = getMonthDateRange(selectedMonth[1], selectedMonth[0]);
            var value = row[selectedIndex[1]];
            var data = {x: index, value: value, id: selectedIndex[1], index: index, name: selectedIndex[0]};
            $scope.generatePatientList(data, $scope.hivComparative, dateRange.startDate, dateRange.endDate, false);
          } catch (ex) {

          }
        }
      };
    }

    //formats tooltip values
    $scope.formatTooltipValue = function (value, ratio, id, index) {
      var perc = (ratio * 100).toFixed(1);
      return value + ' ' + ' (' + perc + '%)';
    };

    //round off values to 2 dp
    $scope.roundOffValues = function (value, ratio, id, index) {
      return value;
    };

    //Chart Function
    function generateGraph(chart, startDate, endDate) {
      if (chart.isBusy === true) return;
      var selectedLocations = getSelectedLocations();
      if (selectedLocations === undefined) return;
      //show busy indicator
      chart.isBusy = true;
      isBusy(true, chart.reportName);
      //update ui
      chart.startDate = new Date(startDate);
      chart.endDate = new Date(endDate);
      chart.selectedLocations = selectedLocations;
      //reset bstable
       $scope.bsTableControl.options={};
      //hit the server
      EtlRestService.getHivOverviewVisualizationReport(
        moment(new Date(startDate)).startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        moment(new Date(endDate)).endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        chart.reportName,
        chart.groupBy,
        selectedLocations,
        'encounter_datetime|asc',
        '', //indicators
        function (result) {
          chart.isBusy = false;
          $scope.isBusy = false;
          isBusy(false, chart.reportName);
          console.log('Sql query for ' + chart.reportName + ' request=======>', result.sql, result.sqlParams);
          if (result.result) {
            if (result.result.length === 0) {
              $scope.resultIsEmpty = true;
            } else {
              //generate chart
              chart.result=result.result;
              ClinicalAnalyticsService.generateChartObject(result.result, chart.chart,
                chart.chartDefinition);
              //build tabular view
              if (chart.reportName === 'clinical-hiv-comparative-overview-report') {
                chart.isBusy = true;
                 $timeout(function () {
                    $scope.bsTableControl = ClinicalAnalyticsService.generateDataTable(result.result);
                    addClickListenerOnTableCells();
                    chart.isBusy = false;
                 }, 2000);
              }
            }
          }
        },
        function (error) {
          chart.isBusy = false;
          $scope.isBusy = false;
          isBusy(false, chart.reportName);
          chart.hasLoadingError = true;
        }
      );
    }

    $scope.$watchGroup(['startDate', 'endDate', 'isBusy'], function (newValues, oldValues, scope) {
      var startDate = newValues[0];
      var endDate = newValues[1];
      if (endDate > startDate) {
        generateGraph($scope.hivComparative, $scope.startDate, $scope.endDate);
        generateGraph($scope.art, $scope.startDate, $scope.endDate);
        generateGraph($scope.patientStatus, $scope.startDate, $scope.endDate);
        updateRangeSlider();
      }

    });

    function updateRangeSlider() {
      try {
        $scope.rangeSlider.data("ionRangeSlider").update({
          from: moment(new Date($scope.startDate)).startOf('month').format("X"),
          to: moment(new Date($scope.endDate)).endOf('month').format("X"),
        });
      } catch (e) {
      }
    }

    function isBusy(val, elem) {
      if (val === true) {
        $loading.start(elem);
      } else {
        $loading.finish(elem);
      }
    }

    function getMonthDateRange(year, month) {
      var startDate = moment([year, month - 1]);
      var endDate = moment(startDate).endOf('month');
      return {startDate: startDate, endDate: endDate};
    }

    function getSelectedLocations() {
      if ($stateParams.locationuuid) {
        return $stateParams.locationuuid;
      }
      if ($scope.selectedLocations) {
        var selectedLocationObject = $scope.selectedLocations;
        if (selectedLocationObject.selectedAll === true)
          return '';
        var locations;
        if (selectedLocationObject.locations)
          for (var i = 0; i < selectedLocationObject.locations.length; i++) {
            if (i === 0) {
              locations = '' + selectedLocationObject.locations[i].uuId();
            } else {
              locations =
                locations + ',' + selectedLocationObject.locations[i].uuId();
            }
          }
        return locations;
      } else {
        return undefined;
      }
    }

  }

  function clinicalAnalyticsLink(scope, element, attrs, vm) {
  }
})();
