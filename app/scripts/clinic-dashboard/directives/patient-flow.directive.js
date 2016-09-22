(function () {
    'use strict';

    angular
        .module('app.clinicDashboard')
        .directive('patientFlow', patientFlow);

    patientFlow.$inject = [];
    function patientFlow() {
        var directive = {
            bindToController: false,
            controller: patientFlowController,
            link: patientFlowLink,
            restrict: 'E',
            templateUrl: 'views/clinic-dashboard/patient-flow.html',
            scope: {
                locationUuid: '@',
              selectedLocations:"="
            }
        };
        return directive;

        function patientFlowLink(scope, element, attrs, vm) {

            attrs.$observe('locationUuid', onLocationUuidChanged);

            function onLocationUuidChanged(newVal, oldVal) {
                if (newVal && newVal != '') {
                    scope.loadPatientFlowInformation();
                };
            }
        }
    }
    patientFlowController.$inject = ['$scope', '$rootScope', '$stateParams',
        '$state', 'EtlRestService', 'moment', 'ClinicDashboardService',
        'OpenmrsRestService', '$filter'];
    function patientFlowController($scope, $rootScope, $stateParams,
        $state, EtlRestService, moment, ClinicDashboardService, OpenmrsRestService,
        $filter) {

      //scope variables
      $scope.patientStatuses = [];
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = false;
      $scope.averageWaitingTime = null;
      $scope.medianWaitingTime = null;
      $scope.incompleteVisitsCount = null;
      $scope.providerEncounters = [];
      $scope.finalProviderReport = [];
      $scope.selectedLocation = $stateParams.locationuuid || '';
      $scope.showGenerateButton=showGenerateButton;
      $scope.statsByLocation =null;

      //getter setter binding
      $scope.startDate = ClinicDashboardService.getStartDate() || new Date();
      $scope.selectedDate = function (value) {
        if (value) {
          $scope.startDate = value;
          ClinicDashboardService.setStartDate(value);
          $scope.loadPatientFlowInformation();
        } else {
          return $scope.startDate;
        }
      };
      //
      //DataTable Options for providers
      $scope.columns = [];
      $scope.bsTableControl = {options: {}};
      $scope.bsTableLocationWaitTimes = {options: {}};
      $scope.exportList = [
        {name: 'Export Basic', value: ''},
        {name: 'Export All', value: 'all'},
        {name: 'Export Selected', value: 'selected'}];
      $scope.exportDataType = $scope.exportList[1];
      $scope.updateSelectedType = function () {
        console.log($scope.exportDataType.value, $scope.exportDataType.name);
        var bsTable = document.getElementById('bsTable1');
        var element = angular.element(bsTable);
        element.bootstrapTable('refreshOptions', {
          exportDataType: $scope.exportDataType.value
        });
      };
      $scope.state = $state.current.name;

      //date controll functions

      $scope.openDatePopup = openDatePopup;
      $scope.dateControlStatus = {
        startOpened: false,
      };
      $scope.navigateDay = navigateDay;


      //Bootrap table options
      var columns = [
        {
          field: '#',
          title: '#',
          visible: true,
          isDate: false
        },
        {
          field: 'visit_id',
          title: 'Visit #',
          visible: false,
          isDate: false
        },
        {
          field: 'names',
          title: 'Names',
          visible: true,
          isDate: false
        },
        {
          field: 'identifiers',
          title: 'Identifiers',
          visible: false,
          isDate: false
        },
        {
          field: 'registered',
          title: 'Registered',
          visible: true,
          isDate: true
        },
        {
          field: 'triaged',
          title: 'Triaged',
          visible: true,
          isDate: true
        },
        {
          field: 'time_to_be_triaged',
          title: 'Triage Waiting Time (mins)',
          visible: true,
          isDate: false
        },
        {
          field: 'seen_by_clinician',
          title: 'Seen by Clinician',
          visible: true,
          isDate: true
        },
        {
          field: 'time_to_be_seen_by_clinician',
          title: 'Clinician Waiting Time (mins)',
          visible: true,
          isDate: false
        },
        {
          field: 'time_to_complete_visit',
          title: 'Time to Complete Visit (mins)',
          visible: true,
          isDate: false
        },
        {
          field: 'location',
          title: 'Location',
          visible: true,
          isDate: false
        }
      ];

      $scope.btTableOptions = {};

      //methods
      $scope.loadPatientFlowInformation = loadPatientFlowInformation;

      activate();

      function activate() {
        _registerBTtableClickEvents();
        showGenerateButton();
      }

      function openDatePopup($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dateControlStatus.startOpened = true;
      }
      function showGenerateButton(){

        if($scope.state==='clinical-dashboard.daily-appointments.patient-flow'){
          $scope.generateButton= false;

        }
        else{
          $scope.generateButton= true;
        }

      }

      function utcDateToLocal(date) {
        var day = new moment(date).format();
        return day;
      }

      function navigateDay(value) {
        if (value) {
          $scope.selectedDate(new Date($scope.startDate).addDays(value));
          var selectedDateField = document.getElementById('start-date');
          var element = angular.element(selectedDateField);
          element.val($filter('date')($scope.startDate, 'mediumDate'));
          element.triggerHandler('input');
        }
      }

        function loadPatientFlowInformation() {
            if ($scope.isBusy) return;

            clearVariables();
            $scope.isBusy = true;
            var selectedLocations = getSelectedLocations();

            EtlRestService.
                getPatientFlowData(selectedLocations, $scope.startDate,
                loadPatientFlowSuccessful, loadPatientFlowFailed);

        }

        function loadPatientFlowSuccessful(results) {
         // console.log('results',results)
            $scope.patientStatuses = results.result;
            $scope.averageWaitingTime = results.averageWaitingTime;
            $scope.medianWaitingTime = results.medianWaitingTime;
            $scope.incompleteVisitsCount = results.incompleteVisitsCount;
            $scope.statsByLocation=results.statsByLocation;
            console.log('$scope.medianWaitingTime', $scope.statsByLocation)


            $scope.isBusy = false;
            displayCurrentPatientStatusInfo();

            transformVisitsToDummyEncounters();
            groupEncountersByProvider();
            buildDataTable();
            buildLocationWaitTimesTable();

        }

        function loadPatientFlowFailed(error) {
            $scope.isBusy = false;
            $scope.experiencedLoadingErrors = true;
        }
        function transformVisitsToDummyEncounters(){
          _.each($scope.patientStatuses,function(patient){
            //reconstructing an array of objects to contain all provider encounters
            $scope.providerEncounters.push.apply($scope.providerEncounters,patient.encounters);

             /* adding a dummy encounter type to be used to keep track of visits started and the
                details of the person who started the visit
            */
            $scope.providerEncounters.unshift(
              {
              person_name:patient.visit_person_Name,
              location:patient.location,
              encounter_type:8888,
              person_id:patient.visit_person_id,

              encounter_type_name:'Visits_Started'

            });

          });

        }

        function groupEncountersByProvider(){

          var providersPersonIds =[];
          var uniqueProviderPersonIds = {};
          for( var i in $scope.providerEncounters ){
            if( typeof(uniqueProviderPersonIds[$scope.providerEncounters[i].person_id]) == "undefined"){
              providersPersonIds.push($scope.providerEncounters[i].person_id);

            }
            uniqueProviderPersonIds[$scope.providerEncounters[i].person_id] = 0;
          }

          _.each(providersPersonIds, function(provider){
                var row={};
                _.each($scope.providerEncounters,  function(result){

                  if(provider===result.person_id) {
                    row['Person_Name'] = result.person_name;
                    row['Location'] = result.location;
                    //count encounter type per provider
                    row[result.encounter_type_name] = (row[result.encounter_type_name] || 0) + 1;


                  }

                });

            $scope.finalProviderReport.push(row);
          });

          $scope.finalProviderReport=totalPatientSeenByProvider($scope.finalProviderReport,'Visits_Started');
        }

        function totalPatientSeenByProvider(arrayOfObjects,visits){

          var result=[];

          for (var i=0; i < arrayOfObjects.length ; ++i){
            var data =arrayOfObjects[i]
            var sum = 0;
            for (var x in data) {
              if (x !== visits) {

                var value = data[x];

                if (typeof value === 'number') {
                  sum += value;
                }
              }
            }
            data['#Seen'] = sum;
            result.push(data)

          }
          return result;


        }



        function clearVariables() {
            $scope.patientStatuses = [];
            $scope.providerEncounters =[];
            $scope.finalProviderReport=[];
            $scope.experiencedLoadingErrors = false;
            _clearDisplayedPatientStatus();
        }

        function _clearDisplayedPatientStatus() {
            $scope.btTableOptions = {};
            $scope.averageWaitingTime = null;
            $scope.medianWaitingTime = null;
            $scope.incompleteVisitsCount = null;
        }

        //bootstrap table functions to display results
        function displayCurrentPatientStatusInfo() {
            $scope.btTableOptions = getBtTableOptions($scope.patientStatuses, columns);
        }

        function getBtTableOptions(patientStatusArray, columnsMetadata) {
            var btColumns = _generateBTColumns(columnsMetadata);
            return _generateBTTable(patientStatusArray, btColumns);
        }

        function _generateBTTable(tableData, btColumns) {
            return {
                options: {
                    data: tableData,
                    rowStyle: function (row, index) {
                        return { classes: 'none' };
                    },
                    tooltip: true,
                    classes: 'table table-hover',
                    cache: false,
                    height: 550,
                    detailView: false,
                    //detailFormatter: detailFormatter,
                    striped: true,
                    selectableRows: true,
                    showFilter: true,
                    pagination: false,
                    pageSize: 20,
                    pageList: [5, 10, 25, 50, 100, 200],
                    search: true,
                    trimOnSearch: true,
                    singleSelect: false,
                    showColumns: true,
                    showRefresh: true,
                    showMultiSort: false,
                    showPaginationSwitch: true,
                    smartDisplay: true,
                    idField: 'visit_id',
                    minimumCountColumns: 8,
                    clickToSelect: true,
                    showToggle: false,
                    maintainSelected: true,
                    showExport: true,
                    toolbar: '#toolbar',
                    toolbarAlign: 'left',
                    exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
                    columns: btColumns,
                    exportOptions: { fileName: 'patient-status' },
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
                    }

                }
            };
        }

        function _generateBTColumns(columnsMetadata) {
            var columns = [];

            _.each(columnsMetadata, function (header) {
                //var visible =(header!=='location_uuid');
                columns.push({
                    field: header.field,
                    //title: $filter('titlecase')(header.title),
                    title: header.title,
                    align: 'left',
                    valign: 'center',
                    sortable: true,
                    visible: header.visible,
                    tooltip: true,
                    formatter: function (value, row, index) {
                        return _cellFormatter(value, row, index, header);

                    },
                    events: 'actionEvents'
                });
            });

            return columns;
        }

        function _cellFormatter(value, row, index, header) {
            var numbers = 1 + (index);
            //$scope.selectedLocation = row.location_id;
            if (header.field === '#')
                return '<div class="text-center" style="width:43px;height:23px!important;" >' +
                    '<span class="text-info">' + numbers + '</span></div>';
            if (header.isDate && value != null) {
                value = '<span class="text-warning" style="font-weight:bold;">' + new moment(value).format('H:mmA') + '</span> </br>' +
                    '<small>' + new moment(value).format('DD-MM-YYYY') + '</small>';
                return value;
            }

            if (value === null || value === undefined) {
                return '-';
            }
            return ['<a class="clickLink"',
                'title="  " data-toggle="tooltip"',
                'data-placement="top"',
                'href="javascript:void(0)" >' + value + '</a>'
            ].join('');
        }

        function _registerBTtableClickEvents() {
            window.actionEvents = {
                'click .clickLink': function (e, value, row, index) {
                    console.log(row);
                    //fetch patient based on uuid
                    OpenmrsRestService.getPatientService().getPatientByUuid({
                        uuid: row.patient_uuid
                    },
                        function (data) {
                            $rootScope.broadcastPatient = data;
                            $state.go('patient', { uuid: row.patient_uuid });
                        });
                }
            };

        }

      // provider details table

      function buildDataTable() {
        buildColumns();
        buildTableControls();

      }

      function buildSingleColumn(header) {
        var visible = true;
        if (header==='provider_id'){
          visible =false;
        }
        $scope.columns.push({
          field: header,
          title: header.toString().split('_').join(' '),
          align: 'center',
          valign: 'center',
          visible: visible,
          tooltip: true,
          sortable: true,
          formatter: function(value, row, index) {
            return cellFormatter(value, row, index, header);
          }
        });
      }

      function buildColumns() {
        var ProviderTableColumns =[];
        var unique = {};
        for( var i in $scope.finalProviderReport ){
          if( typeof(unique[Object.keys($scope.finalProviderReport[i])]) == "undefined"){
            ProviderTableColumns.push.apply(ProviderTableColumns,Object.keys($scope.finalProviderReport[i]));

          }
          unique[Object.keys($scope.finalProviderReport[i])] = 0;
        }

        //remove duplicate elements from the array
        var uniqueArray = ProviderTableColumns.filter(function(elem, pos) {
          return ProviderTableColumns.indexOf(elem) == pos;
        });

        uniqueArray.splice(uniqueArray.indexOf("#Seen"), 1 );
        uniqueArray.splice(2, 0, "#Seen");

          $scope.columns = [];
          _.each(uniqueArray, function (header) {
            buildSingleColumn(header);
          });
      }


      function buildTableControls() {
        $scope.bsTableControl = {
          options: {
            data: $scope.finalProviderReport,
            rowStyle: function (row, index) {
              return {classes: 'none'};
            },
            tooltip: true,
            classes: 'table table-hover',
            cache: false,
            height: 550,
            detailView: false,
            //detailFormatter: detailFormatter,
            striped: true,
            selectableRows: true,
            showFilter: true,
            pagination: false,
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
            idField: 'visit_id',
            minimumCountColumns: 2,
            clickToSelect: true,
            showToggle: false,
            maintainSelected: true,
            showExport: true,
            toolbar: '#toolbar',
            toolbarAlign: 'left',
            exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
            columns: $scope.columns,
            exportOptions: {fileName: ''},
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
            }

          }
        };
      }



      /**
       * Function to add button on each cell
       */
      function cellFormatter(value, row, index, header) {

        if(header ==='Person Name'){

              return '<div class="" style="padding: inherit; width:100%; max-width: 300px" ><span ' +
                'class="text-info text-capitalize">'+value+'</span></div>';

        }

        if (value === null || value === undefined) {
          return '-';
        }

        return ['<a class="clickLink"',
          'title="  " data-toggle="tooltip"',
          'data-placement="top"',
          'href="javascript:void(0)" >' + value + '</a>'
        ].join('');

      }
      function getSelectedLocations() {
        if ($stateParams.locationuuid) {
          return $stateParams.locationuuid;
        }
        if ($scope.selectedLocations) {
          var selectedLocationObject = $scope.selectedLocations;
          /*if (selectedLocationObject.selectedAll === true)
            return '';*/
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
      //columns for locations stats wait time
      $scope.locationWaitTimesColumn =[
        {
          name: 'location',
          headers:'location'
        },
        {
          name: 'totalVisitsCount',
          headers:'# Visits'
        },
        {
          name: 'completeVisitsCount',
          headers:'# Completed'
        },
        {
          name: 'medianWaitingTime.medianClinicianWaitingTime',
          headers:'median_Clinician_Waiting_Time'
        },
        {
          name: 'medianWaitingTime.medianTriageWaitingTime',
          headers:'median_Triage_Waiting_Time'
        },
        {
          name: 'medianWaitingTime.medianVisitCompletionTime',
          headers:'median_Visit_Completion_Time'
        }];

      function buildLocationWaitTimesTable() {
        locationWaitTimesColumns();
        locationWaitTimesTableControls();

      }

      function locationWaitTimesColumns() {
        $scope.columns = [];
        _.each($scope.locationWaitTimesColumn, function (header) {
          //var visible =(header!=='location_uuid');
          $scope.columns.push({
            field: header.name,
            title: $filter('titlecase')(header.headers.toString().split('_').join(' ')),
            align: 'center',
            valign: 'center',
            sortable:true,
            visible:true,
            tooltip: true,
            formatter: function (value, row, index) {
              return locationWaitTimeCellFormatter(value, row, index, header);

            },
            events:'actionEvents'
          });
        });

      }


      function locationWaitTimesTableControls() {
        $scope.bsTableLocationWaitTimes = {
          options: {
            data: $scope.statsByLocation,
            rowStyle: function (row, index) {
              return {classes: 'none'};
            },
            tooltip: true,
            classes: 'table table-hover',
            cache: false,
            height: 550,
            detailView: false,
            //detailFormatter: detailFormatter,
            striped: true,
            selectableRows: true,
            showFilter: true,
            pagination: false,
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
            idField: 'visit_id',
            minimumCountColumns: 2,
            clickToSelect: true,
            showToggle: false,
            maintainSelected: true,
            showExport: true,
            toolbar: '#toolbar',
            toolbarAlign: 'left',
            exportTypes: ['json', 'xml', 'csv', 'txt', 'png', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'],
            columns: $scope.columns,
            exportOptions: {fileName: ''},
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
            }

          }
        };
      }

      /**
       * Function to add button on each cell
       */
      function locationWaitTimeCellFormatter(value, row, index, header) {

        if(header ==='location'){

          return '<div class="" style="padding: inherit; width:100%; max-width: 300px" ><span ' +
            'class="text-info text-capitalize">'+value+'</span></div>';

        }

        if (value === null || value === undefined) {
          return '-';
        }

        return ['<a class="clickLink"',
          'title="  " data-toggle="tooltip"',
          'data-placement="top"',
          'href="javascript:void(0)" >' + value + '</a>'
        ].join('');

      }



    }
})();
