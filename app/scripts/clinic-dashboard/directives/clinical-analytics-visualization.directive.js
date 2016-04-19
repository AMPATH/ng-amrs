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
        isBusy:"="
      },
      controller: clinicalAnalyticsController,
      link: clinicalAnalyticsLink,
      templateUrl: "views/clinic-dashboard/clinical-analytics-visualization.html"
    };
  }

  clinicalAnalyticsController.$inject = ['$scope', 'SearchDataService', 'moment', '$state', '$filter',
    '$loading', '$stateParams', 'ClinicalAnalyticsService', 'EtlRestService'];

  function clinicalAnalyticsController($scope, SearchDataService, moment, $state, $filter, $loading,
                                       $stateParams, ClinicalAnalyticsService, EtlRestService) {
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.startDate = new Date(new Date().setYear(new Date().getFullYear() - 1));
    $scope.endDate = new Date();
    $scope.generateGraph=generateGraph;
    $scope.width=0;
    $scope.sliderProperties={
      min: $scope.startDate.getTime(),
      max:  $scope.endDate.getTime(),
      smallStep: 8640000000,
      largeStep: 8640000000,
      tickPlacement:'both',
      tooltip: {
        template: "#= kendo.toString(new Date(value), 'dd/MMMM/yyyy') #"
      }
    };


    //comparative current_on_art,current_in_care,vl_less_than_1000,reporting_month
    $scope.hivComparative = {
      reportName: 'clinical-hiv-comparative-overview-report',
      chartDefinition:[//define chart columns and chart types
        {indicator: 'currently_in_care_total', chartType: 'spline', name: 'Patients In Care'},
        {indicator: 'on_art_total', chartType: 'spline', name: 'Patients On ART'},
        {indicator: 'perc_tested_appropriately', chartType: 'spline', name: '% on ART with VL'},
        {indicator: 'perc_virally_suppressed', chartType: 'spline', name: '% Virally Suppressed'}
      ],
      groupBy:'groupByEndDate',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty:false
    };
    $scope.hivComparative.chart= {
      xAxis: {id:'reporting_month'}, //x axis plot definition
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
      groupBy:'',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty:false
    };
    $scope.patientStatus.chart= {
        xAxis:{id: ''}, //x axis plot definition
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
      chartDefinition:  [
        {indicator: 'not_on_arv', chartType: 'donut', name: 'Not On Any ARV Drugs'},
        {indicator: 'on_nevirapine', chartType: 'donut', name: 'Nevirapine'},
        {indicator: 'on_efavirenz', chartType: 'donut', name: 'Efavirenz'},
        {indicator: 'on_lopinavir', chartType: 'donut', name: 'Lopinavir'},
        {indicator: 'on_atazanavir', chartType: 'donut', name: 'Atazanavir'},
        {indicator: 'on_raltegravir', chartType: 'donut', name: 'Raltegravir'},
        {indicator: 'on_other_arv_drugs', chartType: 'donut', name: 'Others'}

      ],
      groupBy:'',
      isBusy: false,
      hasLoadingError: false,
      resultIsEmpty:false
    };
    $scope.art.chart= {
        xAxis: {id: ''}, //x axis plot definition
        yAxis: '', //y axis plot definition
        y2Axis: '', //y2 axis plot definition
        min: 0, //initialize min
        max: 0, //initialize max
        dataPoints: [], //array of values to be plotted
        dataColumns: ClinicalAnalyticsService.defineXAndYAxis($scope.art.chartDefinition)
    };


    //Patient List Function to generate data
    $scope.generatePatientList = function (data) {
      console.log('patient list is being generated', data);
    };

    //Patient List Functions
    $scope.updatePieChartParameters = function (data) {
      var dataPoint =$scope.hivComparative.chart.dataPoints[data.index];
      var selectedMonth =dataPoint.reporting_month.split('/');
      var dateRange=getMonthDateRange(selectedMonth[1], selectedMonth[0]);
      generateGraph($scope.art, dateRange.startDate, dateRange.endDate);
      generateGraph($scope.patientStatus, dateRange.startDate, dateRange.endDate);
      console.log('patient list is being generated', data, dateRange);
    };


    //formats tooltip values
    $scope.formatTooltipValue = function (value, ratio, id, index) {
      var perc=(ratio*100).toFixed(1);
      return value +' ' + ' ('+perc+'%)';
    };

    //round off values to 2 dp
    $scope.roundOffValues= function (value, ratio, id, index) {
      return value;
    };

    //Chart Function
    function generateGraph(chart, startDate, endDate) {
      if(chart.isBusy===true) return;
      var selectedLocations=getSelectedLocations();
      if(selectedLocations===undefined) return;
      //show busy indicator
      chart.isBusy=true;
      isBusy(true, chart.reportName);
      //update ui
      chart.startDate=new Date(startDate);
      chart.endDate=new Date(endDate);

      //hit the server
      EtlRestService.getHivOverviewVisualizationReport(
        moment(new Date(startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        moment(new Date(endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        chart.reportName,
        chart.groupBy,
        selectedLocations,
        'encounter_datetime|asc',
        '', //indicators
        function (result) {
          chart.isBusy=false;
          $scope.isBusy=false;
          isBusy(false, chart.reportName);
          console.log('Sql query for '+chart.reportName+' request=======>', result.sql, result.sqlParams);
          if (result.result) {
            if (result.result.length === 0) {
              $scope.resultIsEmpty = true;
            } else {
              ClinicalAnalyticsService.generateChartObject(result.result, chart.chart,
                chart.chartDefinition);
            }
          }
        },
        function (error) {
          chart.isBusy=false;
          $scope.isBusy=false;
          isBusy(false, chart.reportName);
          chart.hasLoadingError=true;
        }
      );
    }

    $scope.$watchGroup(['startDate', 'endDate', 'isBusy'], function (newValues, oldValues, scope) {
      var startDate = newValues[0];
      var endDate = newValues[1];
      if(endDate>startDate) {
        generateGraph($scope.hivComparative, $scope.startDate, $scope.endDate);
        generateGraph($scope.art, $scope.startDate, $scope.endDate);
        generateGraph($scope.patientStatus, $scope.startDate, $scope.endDate);
      }

    });

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
      return { startDate: startDate, endDate: endDate };
    }
    function getSelectedLocations() {
      if ($stateParams.locationuuid) {
        return $stateParams.locationuuid;
      } if ($scope.selectedLocations) {
        var selectedLocationObject =$scope.selectedLocations;
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
