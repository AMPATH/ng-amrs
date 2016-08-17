/* global angular */
/*
jshint -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('app.clinicDashboard')
        .directive('defaulterList', appointmentSchedule);

  function appointmentSchedule() {
      return {
          restict: 'E',
          scope: { locationUuid: '@' },
          controller: defaulterListController,
          link: defaulterListLink,
          templateUrl: 'views/clinic-dashboard/defaulter-list.html',
        };
    }

  defaulterListController.$inject = ['$scope', '$rootScope', 'EtlRestService', 'DefaulterModel', 'moment', '$state',
    'OpenmrsRestService','$filter','$timeout'];

  function defaulterListController($scope, $rootScope, EtlRestService, DefaulterModel, moment, $state,
                                   OpenmrsRestService,$filter,$timeout) {

    //non-function types scope members
    $scope.patients = [];
    $scope.defaulterThreshold = 30;

    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;

    //function types scope members
    $scope.loadDefaulterList = loadDefaulterList;

   // $scope.loadPatient = loadPatient;

    $scope.utcDateToLocal = utcDateToLocal;

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

    //Dynamic DataTable Params
    // $scope.indicators = [];  //set filtered indicators to []
    $scope.currentPage = 1;
    $scope.counter = 0;
    $scope.setCountType = function (val) {
      $scope.countBy = val;
      // loadHivSummaryIndicators()
    };

    $scope.patientTags =[
      {
        name: '#',
        headers:'#'
      },
      {
        name: 'identifiers',
        headers:'identifiers'
      },
      {
        name: 'person_name',
        headers:'person_name'
      },
      {
        name: 'rtc_date',
        headers:'RTC_Date'
      },
      {
        name: 'encounter_datetime',
        headers:'Last_Appointment'
      },
      {
        name: 'filed_id',
        headers:'Filing ID'
      }
    ] ;



    //DataTable Options
    $scope.columns = [];
    $scope.bsTableControl = {options: {}};
    $scope.exportList = [
      {name: 'Export Basic', value: ''},
      {name: 'Export All', value: 'all'},
      {name: 'Export Selected', value: 'selected'}];
    $scope.exportDataType = $scope.exportList[1];
    $scope.updateSelectedType = function () {
      console.log($scope.exportDataType.value, $scope.exportDataType.name);
      var bsTable = document.getElementById('bsTable');
      var element = angular.element(bsTable);
      element.bootstrapTable('refreshOptions', {
        exportDataType: $scope.exportDataType.value
      });
    };


    activate();

    function activate() {

    }


    function utcDateToLocal(date) {
      var day = new moment(date).format();
      return day;
    }

    function loadDefaulterList(loadNextOffset) {
          $scope.experiencedLoadingErrors = false;

          if ($scope.isBusy === true) return;
          if(loadNextOffset!==true)resetPaging();
          $scope.isBusy = true;

          if ($scope.locationUuid && $scope.locationUuid !== '')
                EtlRestService.getDefaultersList($scope.locationUuid, $scope.defaulterThreshold,
                  onFetchDefaultersListSuccess, onFetchDefaultersListError, $scope.nextStartIndex, 300);

        }
    function resetPaging(){
      $scope.nextStartInts = [];
      $scope.allDataLoaded = false;
      $scope.nextStartIndex = 0;
      $scope.patients = [];
    }

    function _sortDefaulterList(defaultersList) {
      /*
      This is a custom method to be used to sort defaulters list based
      on how files are arranged in the cabinets using the amrs universal
      identifier. This may only be applicable to MTRH for now

      The AMRS universal Id is an 11 digit identifier that is made up of
      9 digits and a check-digit (i.e. 123456789-1)
      The last four digits of this identifier will be used to sort the defaulters list
      to fit the specifications of the file arrangement in the cabinets

      Last for digits will used to sort the list (i.e. 6789)
      This number is further split into primary set and secondary set
      the first 2 digits are used as the primary sorting field
      and the last 2 digits are used as the secondary sorting field

      for example in this case 67 is the primary sort field and
      89 is the secondary sort field
      */
      var universalIDregex = /[0-9]{9}-[0-9]{1}/i;
      _.each(defaultersList, function(patient){
        var identifiers = patient.identifiers;
        var priSortField = '9999'; //set the highest sort order for values without amrs universal id. This is to push the to the bottom of the list
        var secSortField = '9999'
        if(!_.isUndefined(identifiers) && !_.isNull(identifiers)) {
          var identifierList = identifiers.split(',');
          patient.priSortField = priSortField;
          patient.secSortField = secSortField;
          patient.universalId = '';

          var universalId = _.find(identifierList, function(id){
            var trimmedId = id.trim();
            if(universalIDregex.test(trimmedId)) {
              return id;
            }
          });

          if (!_.isUndefined(universalId)) {
            var trimmedId = universalId.trim();
            priSortField = trimmedId.substr(5,2);
            secSortField = trimmedId.substr(7,2);
            patient.priSortField = priSortField;
            patient.secSortField = secSortField;
            patient.universalId = trimmedId;
          }
        } else {
          patient.priSortField = priSortField;
          patient.secSortField = secSortField;
          patient.universalId = '';
        }
      });

      //sort the list based on primary and secondary id
      defaultersList.sort(function(a, b) {
        return a.priSortField - b.priSortField  ||  a.secSortField - b.secSortField;
      });

    }

    function onFetchDefaultersListSuccess(defaulters) {
      $scope.isBusy = false;
      //update pagination parameters
      if (defaulters.size === 0){
        $scope.allDataLoaded = true;
      }else{
        $scope.patients.length!=0?$scope.patients.push.apply($scope.patients,defaulters.result):
          $scope.patients =defaulters.result;
        $scope.nextStartIndex +=  defaulters.size;
      }
      buildDataTable();
    }

    function onFetchDefaultersListError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    /**
     * Functions to populate and define bootstrap data table
     */

    function buildDataTable() {
      //$timeout(function() {
        buildColumns();
        buildTableControls();
    //  }, 100);

    }

    function buildColumns() {
      $scope.columns = [];
      _.each($scope.patientTags, function (header) {
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
           // console.log('this is the value ',value,row);
            return cellFormatter(value, row, index, header);

          },
          events:'actionEvents'
        });
      });
    }

    //addding click event to bootstrap-table links
    window.actionEvents = {
      'click .clickLink': function (e, value, row, index) {
        console.log(row);
        //fetch patient based on uuid
        OpenmrsRestService.getPatientService().getPatientByUuid({
            uuid: row.patient_uuid
          },
          function(data) {
            $rootScope.broadcastPatient = data;
            $state.go('patient', {uuid: row.patient_uuid});
          });
      }
    };

    function buildTableControls() {
      $scope.bsTableControl = {
        options: {
          data: $scope.patients,
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
          idField: 'patientUuid',
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
      var numbers = 1 + (index);
      if (header.name === '#') return '<div class="text-center" style="width:43px;height:23px!important;" >' +
        '<span class="text-info text-capitalize">' + numbers + '</span></div>';

      if (header.name === 'universalId') return '<div class="text-center" style="width:100px;height:23px!important;" >' +
          '<span class="text-info text-capitalize"> <a class="clickLink" href="javascript:void(0)">' + row.universalId + '</a></span></div>';
      if(header.name==='rtc_date') return '<div class="text-center" style="height:43px!important;" ><span ' +
        'class="text-info text-capitalize">'+ $filter('date')(row.rtc_date, 'dd-MM-yyyy')+'</span>' +'<br/>'+
        '<span>' +row.days_since_rtc+ ' ' +'days ago'+
        '</span></div>';

      if(header.name==='encounter_datetime') return '<div class="text-center" style="height:43px!important;" ><span ' +
        'class="text-info text-capitalize">'+ $filter('date')(row.encounter_datetime, 'dd-MM-yyyy')+'</span>' +'<br/>'+
        '<span>' +row.encounter_type_name+
        '</span></div>';
      return ['<a  class="clickLink"',
        'title="  " data-toggle="tooltip"',
        'data-placement="top"',
        'href="javascript:void(0)" >' + value + '</a>'
      ].join('');
    }


  }

  function defaulterListLink(scope, element, attrs, vm) {
    attrs.$observe('locationUuid', onLocationUuidChanged);

    function onLocationUuidChanged(newVal, oldVal) {
          if (newVal && newVal != '') {
            scope.isBusy = false;
            scope.patients = [];
            scope.loadDefaulterList();
          }
        }
  }

})();
