/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.admin')
        .directive('patientCreationStatistics', patientCreationStatistics);

    function patientCreationStatistics() {
        return {
            restict: "E",
            scope: {
              location: "@", period: "@"
            },
            controller: patientCreationStatisticsController,
            templateUrl: "views/admin/patient-creation-statistics.html"
        };
    }

    patientCreationStatisticsController.$inject = ['$scope', '$rootScope', 'EtlRestService',
      'moment', '$state', '$filter', 'OpenmrsRestService'];

    function patientCreationStatisticsController($scope, $rootScope, EtlRestService,
          moment, $state, $filter, OpenmrsRestService) {
        $scope.startDate = new Date();
        $scope.endDate = new Date();
        $scope.currentPage = 1;
        $scope.startFrom='';

        $scope.statisticSearchString='';
        $scope.isBusyStatistics = false;
        $scope.isBusyStatisticsDetails=false;
        $scope.experiencedStatisticsLoadError = false;
        $scope.creationstatistics=false;
        $scope.showStatistics = false;

        $scope.experiencedStatisticsDetailLoadError=false;
        $scope.showCreationDetails=false;
        $scope.showPatientsInLocation=false;
        $scope.selectedLocation='';
        $scope.patientInLocationSearchString='';
        $scope.patientDetails=false;
        $scope.selectedLocationId='';
        $scope.loadPatient ='';
        $scope.dateRangeError=false;

      //Pagination Params
      $scope.nextStartIndex = 0;
      $scope.allDataLoaded = false;

        $scope.selectedDate = function (value) {
            if (value) {
                $scope.startDate = value;
                $scope.showStatistics=false;
                $scope.showPatientsInLocation=false;
            }
            else {
                return $scope.startDate;
            }
        };

        $scope.selectedEndDate = function (value) {
            if (value) {
                $scope.endDate = value;
                $scope.showStatistics=false;
                $scope.showPatientsInLocation=false;
            }
            else {
                return $scope.endDate;
            }
        };

        $scope.openDatePopup = openDatePopup;
        $scope.dateControlStatus = {
            startOpened: false
        };

        $scope.openEndDatePopup = openEndDatePopup;
        $scope.endDateControlStatus = {
            startOpened: false
        };

        function openDatePopup ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateControlStatus.startOpened = true;
        };

         function openEndDatePopup ($event) {
             $event.preventDefault();
             $event.stopPropagation();
             $scope.endDateControlStatus.startOpened = true;
        };

        $scope.loadPatientCreationStats=function(){
            $scope.showStatistics=true;
          if ($scope.isBusyStatisticsDetails === true || $scope.isBusyStatistics) return;
           $scope.isBusyStatistics = true;
           $scope.patientCreationStatisticsLoadError=false;

            if ($scope.endDate<$scope.startDate){
                $scope.dateRangeError="The selected end date Must be greater than start date";
                 $scope.isBusyStatistics = false;
                return;
            }

           if ($scope.endDate && $scope.endDate !== '' && $scope.startDate && $scope.startDate !== '') {
           $scope.isBusyStatistics = true;
           EtlRestService.getPatientsCreatedByPeriod(
                moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                moment($scope.endDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                onSuccessPatientStatisticsQuery,
                onFailedPatientStatisticsQuery
           );
           }
        };

        function onSuccessPatientStatisticsQuery(data){
            $scope.patientStatistics=data;
            $scope.nextStartIndex = +data.startIndex + data.size;
            $scope.isBusyStatistics = false;
            $scope.experiencedStatisticsLoadError=false;
            $scope.showCreationDetails=false;
        }

        function onFailedPatientStatisticsQuery(error){
            $scope.experiencedStatisticsLoadError=true;
            $scope.isBusyStatistics=false;
        }

            $scope.loadPatientDetails =function (locationId,locationName,loadNextOffset) {
              if($scope.isBusy === true) return;
              $scope.isBusy = true;
            $scope.showCreationDetails=true;
            $scope.showStatistics=false;
            if(loadNextOffset!==true)resetPaging();
            if ($scope.isBusyStatisticsDetails === true || $scope.isBusyStatistics) return;
            $scope.showPatientsInLocation=true;
            $scope.selectedLocation=locationName;
            $scope.selectedLocationId=locationId;
            $scope.isBusyStatisticsDetails=true;
            $scope.experiencedStatisticsDetailLoadError=false;

            if ($scope.endDate<$scope.startDate){
                $scope.dateRangeError="The selected end date Must be greater than start date";
              $scope.isBusy = false;
                return;

            }

            if ($scope.endDate && $scope.endDate !== '' && $scope.startDate && $scope.startDate !== '' && $scope.selectedLocationId && $scope.selectedLocationId !== '')
            EtlRestService.getDetailsOfPatientsCreatedInLocation(
                    $scope.selectedLocationId,
                    moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    moment($scope.endDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    onSuccessDetailsOfPatientsCreatedInLocationQuery,
                    onFailedDetailsOfPatientsCreatedInLocationQuery, $scope.nextStartIndex, 300
            );
      };

       function onSuccessDetailsOfPatientsCreatedInLocationQuery(patientInLocation){
           if($scope.showStatistics)
           $scope.showStatistics=false;
           $scope.experiencedStatisticsDetailLoadError=false;
           $scope.isBusyStatisticsDetails=false;
           $scope.isBusy = false;
           //update pagination parameters
           if (patientInLocation.size === 0){
             $scope.allDataLoaded = true;
           }else{
             $scope.patientInLocation.length!=0?$scope.patientInLocation.push.apply($scope.patientInLocation,patientInLocation.result):
               $scope.patientInLocation=patientInLocation.result;
             $scope.nextStartIndex +=  patientInLocation.size;
           }
        }

        function onFailedDetailsOfPatientsCreatedInLocationQuery(error){
                   $scope.experiencedStatisticsDetailLoadError=true;
                   $scope.isBusyStatisticsDetails=false;
        }
      function resetPaging(){
        $scope.nextStartIndex = 0;
        $scope.patientInLocation = [];
        $scope.allDataLoaded = false;
      }
        $scope.loadPatient = loadPatient;
        function loadPatient(patientUuid) {
          /*
            Get the selected patient and save the details in the root scope
            so that we don't do another round trip to get the patient details
            */
          OpenmrsRestService.getPatientService().getPatientByUuid({ uuid: patientUuid },
                 function(data) {
                   $rootScope.broadcastPatient = data;
                   $state.go('patient', { uuid: patientUuid });
                 }
            );
        }



    }
})();
