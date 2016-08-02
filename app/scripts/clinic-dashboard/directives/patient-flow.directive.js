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
            }
        ];

        $scope.btTableOptions = {};

        //methods
        $scope.loadPatientFlowInformation = loadPatientFlowInformation;

        activate();

        function activate() {
            _registerBTtableClickEvents();
        }

        function openDatePopup($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateControlStatus.startOpened = true;
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

            EtlRestService.
                getPatientFlowData($scope.locationUuid, $scope.startDate,
                loadPatientFlowSuccessful, loadPatientFlowFailed);

        }

        function loadPatientFlowSuccessful(results) {
            $scope.patientStatuses = results.result;
            $scope.averageWaitingTime = results.averageWaitingTime;
            $scope.medianWaitingTime = results.medianWaitingTime;
            $scope.incompleteVisitsCount = results.incompleteVisitsCount;
            $scope.isBusy = false;
            displayCurrentPatientStatusInfo();
        }

        function loadPatientFlowFailed(error) {
            $scope.isBusy = false;
            $scope.experiencedLoadingErrors = true;
        }

        function clearVariables() {
            $scope.patientStatuses = [];
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

    }
})();