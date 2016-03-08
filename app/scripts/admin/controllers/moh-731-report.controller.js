/*jshint -W003, -W098, -W033 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('moh731ReportCtrl', moh731ReportCtrl);
  moh731ReportCtrl.$nject = ['$rootScope', '$scope', '$stateParams',
    'EtlRestService', 'moment',
    '$filter', '$state', 'Moh731ReportService', 'CachedDataService',
    '$timeout'
  ];

  function moh731ReportCtrl($rootScope, $scope, $stateParams, EtlRestService,
    moment, $filter, $state, Moh731ReportService,
    CachedDataService, $timeout) {

    $scope.endDate = new Date();
    $scope.startDate = new Date(moment().subtract(1, 'months').calendar());

    $scope.reportGeneration = false;
    var reportNames = ['MOH-731-report','MOH-731-allsites-report']
    $scope.reportName = reportNames[0];
    $scope.countBy = 'num_persons';
    $scope.startIndex = 0;
    $scope.limit=1000000;
    var groupByTypes = ['groupByLocation'];
    $scope.groupBy = groupByTypes[0];
    $scope.generateMoh731Report = generateMoh731Indicators;




    //UX Scope Params
    $scope.isBusy = false;
    $scope.experiencedLoadingError = false;
    $scope.resultIsEmpty = false;
    $scope.getIndicatorLabelByName =getIndicatorLabelByName;
    $scope.selectedLocation = $stateParams.locationuuid || '';
    $scope.selectedIndicatorBox = $stateParams.indicator || '';
    $scope.loadPatientList = loadPatientList;


    //Dynamic DataTable Params
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.fixedColumns = true;

    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {
      options: {}
    };
    $scope.reportModeList = [{
      name: 'Combine Locations',
      value: 'groupByNone'
    }, {
      name: 'Separate Locations',
      value: 'groupByLocation'
    }];
    $scope.selectedReportMode = $scope.reportModeList[1];
    $scope.updateReportMode = function() {
      var bsTable = document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('removeAll');
      if ($scope.selectedReportMode.value === 'groupByLocation') {
        if ($scope.indicators.length < 0) generateMoh731Indicators();
        element.bootstrapTable('append', $scope.indicators);
      } else {
        generateCombinedLocationReport();
        element.bootstrapTable('append', $scope.aggregatedIndicators);
      }
    };

    //Start Initialization
    init();

    //scope methods
    function init() {
      if (!loadCachedData())loadIndicatorsSchema();

    }

    function generateMoh731Indicators() {
      if ($scope.isBusy === true) return;
      $scope.experiencedLoadingErrors = false;
      $scope.resultIsEmpty = false;
      $scope.indicators = [];
      $scope.isBusy = true;
      //Pre-generate location summary for the PDF Report Header
      $scope.locationSummary = '';
      $scope.locationSummary = getSelectedLocationName($scope.selectedLocations);
      var locations = '';
      if ($scope.selectedLocation !== '') {
        locations = $scope.selectedLocation;
      } else {
        locations = getSelectedLocations($scope.selectedLocations);
      }

      if($scope.selectedLocations.allAggregated === true) {
           $scope.reportName = reportNames[1];
            $scope.groupBy = '';
            locations = '';
      }

      if ($scope.countBy && $scope.countBy !== '' && $scope.reportName &&
        $scope.reportName !== '' && $scope.startDate && $scope.startDate !==
        '') {
        EtlRestService.getMoh731Report(
          $scope.reportName,
          moment(new Date($scope.startDate)).startOf('day').format(
            'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format(
            'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          locations, $scope.countBy, onFetchMoh731IndicatorsSuccess,
          onFetchMoh731IndicatorsError,
          $scope.groupBy,
          $scope.startIndex,
          $scope.limit
        );
      }
    }


    function onFetchMoh731IndicatorsSuccess(result) {
      $scope.isBusy = false;
      $scope.indicators = [];
      console.log('Sql query for MOH731 request=======>', result.sql, result.sqlParams);
      if (result.result.length === 0) {
        $scope.resultIsEmpty = true;
      } else {
        $scope.indicators = result.result;

      }
      buildDataTable();
      $scope.selectedReportMode = $scope.reportModeList[1];
    }

    function onFetchMoh731IndicatorsError(error) {
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
      $scope.indicatorTags.unshift( {name: 'location'}, {name: 'location_uuid'})


    }


    function onFetchIndicatorsSchemaError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        loadPatientList(toParams.indicator, toParams.locationuuid)
      });

    function loadPatientList(indicator, location) {
      $scope.selectedIndicatorBox = indicator;
      $scope.selectedLocation = location;
      Moh731ReportService.setIndicatorDetails(getIndicatorDetails(indicator));
      cacheResource(); //cache report before changing view/state
    }

    function cacheResource() {
      Moh731ReportService.setIndicatorTags($scope.indicatorTags);
      Moh731ReportService.setIndicators($scope.indicators);
      Moh731ReportService.setStartDate($scope.startDate);
      Moh731ReportService.setEndDate($scope.endDate);
    }
    function getIndicatorDetails(name) {
      var found = $filter('filter')($scope.indicatorTags, {name: name})[0];
      if (found)return found;
    }

    /**
     * Method to fetch cached data to avoid round trips.
     */
    function loadCachedData() {
      if (Moh731ReportService.getIndicatorTags()) {
        $scope.indicators = Moh731ReportService.getIndicators();
        $scope.indicatorTags = Moh731ReportService.getIndicatorTags();
        $scope.startDate = Moh731ReportService.getStartDate();
        $scope.endDate = Moh731ReportService.getEndDate();
        buildDataTable();
        return true;
      }
    }

    function generateCombinedLocationReport() {
      $scope.aggregatedIndicators = [];
      _.every($scope.indicators, function(indicator) {
        var newindicator = {};
        for (var property in indicator) {
          if (property === 'location') {
            var count = 'All';
            if ($scope.selectedLocations.locations.length > 0)
              count = $scope.selectedLocations.locations.length;
            newindicator[property] = count +
              ' Locations Selected'
          } else if (property === 'location_uuid' || property ===
            'location_id') {
            newindicator[property] = indicator[property];
          } else {
            newindicator[property] = getSumByIndicatorKey(property);
          }
        };
        $scope.aggregatedIndicators.unshift(newindicator);
        return;
      });
    }

    function getSumByIndicatorKey(prop) {
      if ($scope.indicators == null) {
        return 0;
      }
      return $scope.indicators.reduce(function(a, b) {
        return b[prop] == null ? a : a + b[prop];
      }, 0);
    };

    function getSelectedLocations(selectedLocationObject) {
      var locations;
      try {
        if (angular.isDefined(selectedLocationObject.locations)) {
          for (var i = 0; i < selectedLocationObject.locations.length; i++) {
            if (i === 0) {
              locations = '' + selectedLocationObject.locations[i].uuId();
            } else {
              locations =
                locations + ',' + selectedLocationObject.locations[i].uuId();
            }
          }
        }
      } catch (e) {

      }
      return locations;
    }

    function getSelectedLocationName(selectedLocationObject) {
      var locations = '';
      try {
        if (angular.isDefined(selectedLocationObject.locations)) {
          for (var i = 0; i < selectedLocationObject.locations.length; i++) {
            if (i === 0) {
              locations = '' + selectedLocationObject.locations[i].name();
            } else {
              locations =
                locations + ', ' + selectedLocationObject.locations[i].name();
            }
          }
        }
      } catch (e) {

      }
      return locations.toString();
    }
    function getIndicatorLabelByName(name) {
      var found = $filter('filter')($scope.indicatorKeys, {name: name})[0];
      if (found)return found.label;


    }


    /**
     * Functions to populate and define bootstrap data table
     */
    function buildDataTable() {
      $timeout(function() {
        buildColumns();
        buildTableControls();
      }, 500);

    }

    function buildSingleColumn(header) {
      var visible = true;
      if (header==='location_uuid'||header==='location_id'){
        visible =false;
      }
      $scope.columns.push({
        field: header,
        title: $filter('titlecase')(header.toString().split('_').join(' ')),
        align: 'center',
        valign: 'center',
        class: header === 'location' ? 'bst-table-min-width' : undefined,
        visible: visible,
        tooltip: true,
        sortable: true,
        formatter: function(value, row, index) {
          return cellFormatter(value, row, index, header);
        }
      });
    }

    function buildColumns() {
      if ($scope.indicators.length > 0) $scope.indicatorKeys = Object.keys(
        $scope.indicators[0]); // ['alpha', 'beta']
      $scope.columns = [];
      _.each($scope.indicatorKeys, function(header) {
        buildSingleColumn(header);
      });
    }

    $scope.$on('generate-moh-731-pdf-report', function(event, args) {
      generateMoh731PdfReport($rootScope.selectedPdfRow.location,
        $rootScope.selectedPdfRow)
    });

    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data: $scope.indicators,
          rowStyle: function(row, index) {
            return {
              classes: 'none'
            };
          },
          tooltip: true,
          classes: 'table table-hover',
          cache: false,
          height: 550,
          detailView: true,
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
          exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc',
            'excel', 'powerpoint', 'pdf'
          ],
          columns: $scope.columns,
          exportOptions: {
            fileName: 'MOH-731 Report'
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
          fixedColumns: $scope.fixedColumns,
          fixedNumber: 2,
          onExpandRow: function onExpandRow(index, row, $detail) {
            var result = document.getElementsByClassName(
              "fixed-table-body-columns");
            result[0].style.visibility = 'hidden';
          },
          onCollapseRow: function onCollapseRow(index, row, $detail) {
            var result = document.getElementsByClassName(
              "fixed-table-body-columns");
            result[0].style.visibility = 'visible';
          },

          onPostBody: function() {
            //please make sure you calibrate results[0].style.maxHeight with relation to height (550)
            var results = document.getElementsByClassName(
              "fixed-table-body-columns");
            results[0].style.maxHeight = '380px';
          }
        }
      };

    }

    /**
     * Function to format detailed view
     */
    function detailFormatter(index, row) {
      //expose indexes to scope
      var $body = angular.element(document.body);
      var $rootScope = $body.scope().$root;
      $rootScope.$apply(function() {
        $rootScope.selectedPdfRow = row;
        $rootScope.selectedPdfIndex = index;
      });
      var html = [];
      html.push(
        '<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
        '<a href="#/moh-731-generate-pdf" class="btn btn-info">Generate Pdf</a></div>'
      );
      _.each(row, function(value, key) {
        //var label = key;
        var label = getIndicatorLabelByName(key) || key;
        label = $filter('titlecase')(label.toString().split('_').join(' '));
        var key = $filter('titlecase')(key.toString().split('_').join(' '));
        if (key === 'Location Uuid' || key === 'state' || key ===
          'Location Id') return;
        //for separate locations
        if (key === 'Location' && $scope.selectedReportMode.value ===
          'groupByLocation') {
          html.push(
            '<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
            '<p><b>' + key + '</b> (<span class="text-info">' + label +
            '</span>): ' + value + '</p></div>');
        } else if (key === 'Location' && $scope.selectedReportMode.value ===
          'groupByNone') {
          //for combined locations
          var count = 'All';
          if ($scope.selectedLocations.locations.length > 0)
            count = $scope.selectedLocations.locations.length;
          html.push(
            '<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
            '<p><b>' + key + '</b> (<span class="text-info">' + label +
            '</span>): ' + count +
            ' Locations Selected' + '</p></div>');
        } else {
          html.push(
            '<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">' +
            '<p><b>' + key + '</b> (<span class="text-info">' + label +
            '</span>): ' + value + '</p></div>');
        }
      });
      return html.join('');
    }
    $scope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'moh-731-report-by-location') {
          event.preventDefault();
         if(toParams.location!==undefined){
           var selectedRow=  $filter('filter')($scope.indicators, {location: toParams.location})[0];
           generateMoh731PdfReport(selectedRow.location,
             selectedRow);
         }


        }
      });

    /**
     * Function to add report (pdf) generation button
     */
    function cellFormatter(value, row, index, header) {
      //for separate locations
      if (header === 'location' && $scope.groupBy === 'groupByLocation') {
        var html = [];
        html.push(
          '<div class="text-center" style="height:43px!important;" ><a href="#/moh-731-pdf/location/'+row.location_id+'" ' +
          'title="Generate PDF Report for '+value+' " data-toggle="tooltip"class="btn btn-default" ' +
          'style="height:43px!important; width:100%!important">' +
          '<span class="text-info text-capitalize">' + value + '</span></a></div>');
        return html.join('');
      } else if (header === 'location' && $scope.groupBy === 'groupByNone') {
        var html = [];
        //for combined locations
        html.push(
          '<div class="text-center" style="height:43px!important;" ><span ' +
          'class="text-info text-capitalize">' + $scope.selectedLocations.locations
          .length + ' Locations Selected' + '</span></div>');
        return html.join('');
      } else {
        //for other fields other than location
        var html = [];
        html.push(
          '<div class="text-center" style="height:43px!important;" ><a href="#/admin-dashboard/moh-731-reports/location/' + row.location_uuid +  '/indicator/' + header+'" '+
          'title="'+header.replace(/_/g, " ")+' '+' in '+ row.location +' " data-toggle="tooltip"class="btn btn-default" ' +
          'style="height:43px; width:100%; max-width: 300px">' +
           value + '</a></div>');
        return html.join('');
      }
    }


    /**
     * generate Pdf report  from rowdata and  Location
     * @param {type} locationName
     * @param {type} rowData
     * @returns {undefined}
     */
    function generateMoh731PdfReport(locationName, rowData) {
      //test if  pdf is  for  combined  locations
      var params = {};
      if ($scope.selectedReportMode.value !==
        'groupByLocation') {
        //combined  locations
        params = {
          facilityName: $scope.locationSummary,
          district: 'N/A',
          county: 'N/A',
          facility: $scope.locationSummary,
          startDate: $filter('date')($scope.startDate, 'M/yy'),
          endDate: $filter('date')($scope.endDate, 'M/yy')
        };

      } else {
        //normal data grouped by location DEFAULT
        params = {
          facilityName: rowData["location"],
          district: 'N/A',
          county: 'N/A',
          facility: rowData["location"],
          startDate: $filter('date')($scope.startDate, 'M/yy'),
          endDate: $filter('date')($scope.endDate, 'M/yy')
        };
      }
      var mainReportjson = Moh731ReportService.generatePdfReportSchema(params);
      //generate Pdf  report
      $scope.indicatorNumber = 0;
      $scope.sectionNumber = 0;
      //$scope.indicatorNumber=0;
      angular.forEach(Moh731ReportService.getPdfSections(), function(
        sectionData, key) {
        //get section labels  and  data1
        var el = 0;
        $scope.sectionLabel = [];
        $scope.sectionValues = [];
        angular.forEach(sectionData, function(sectionLabel, key) {

          if (el !== 0) {
            $scope.sectionLabel.push([sectionLabel]);
            //push section  data
            $scope.datavalue = '';
            if (angular.isDefined(rowData[Moh731ReportService.getPdfSectionsKeys()[
                $scope.sectionNumber][el]])) {
              $scope.datavalue = rowData[Moh731ReportService.getPdfSectionsKeys()[
                $scope.sectionNumber][el]];
            } else {
              $scope.datavalue = '-';
            }

            $scope.sectionValues.push(
              ['HIV' + $scope.indicatorNumber, $scope.datavalue +
                ''
              ]);
            $scope.indicatorNumber++;
          }
          el++;
        }, []);
        //add section  number
        $scope.sectionNumber++;
        var sectionData = {
          sectionHead: sectionData[0],
          sectionLabels: $scope.sectionLabel,
          sectionDataValues: $scope.sectionValues
        };
        var reportSection = Moh731ReportService.generateReportSection(
          sectionData);

        //add section main  json
        mainReportjson.content.push(reportSection);
      }, []);

      //final  report  schema
      pdfMake.createPdf(mainReportjson).open();

    }

  }

})();
