/*jshint -W003, -W098, -W033 */
(function(){
    'use strict';

    angular
            .module('app.admin')
            .controller('HivVisualSummaryIndicatorsCtrl',HivVisualSummaryIndicatorsCtrl);
    HivVisualSummaryIndicatorsCtrl.$nject=
            ['$rootScope','$scope','$stateParams','EtlRestService','moment','$filter','$state'];

    function HivVisualSummaryIndicatorsCtrl($rootScope,$scope,$stateParams,EtlRestService,moment,$filter,$state){
        //Patient List Directive Properties & Methods
        var date = new Date();
        $scope.startDate = new Date(date.getFullYear(), date.getMonth()-1, 1);
        $scope.endDate  = date;
        $scope.hivSummaryTableData=[];
        $scope.summaryVisualizationDone=false;
        //Hiv Summary Indicators Service Properties & Methods
        $scope.reportName='hiv-summary-report';
        $scope.countBy='num_persons';

        //Hiv Summary Flat Table Properties  Methods
        $scope.loadHivSummaryFlatTable=loadHivSummaryFlatTable;

        //UX Scope Params
        $scope.isBusy=false;
        $scope.experiencedLoadingError=false;

        //Start Initialization
        init();
        //scope methods
        function init(){
         //   if(!loadCachedData())loadIndicatorsSchema();
        }

        //hiv summary  flat  table
        function loadHivSummaryFlatTable(){
            $scope.experiencedLoadingErrors=false;
            $scope.noresults=false;
            $scope.summaryVisualizationDone=false;
            if($scope.isBusy===true)
                return;
            $scope.isBusy=true;
            $scope.indicators=[];
            $scope.hivSummaryTableData=[];
            $scope.hivSummaryDefaultRows=[];
            $scope.hivSummaryDefaultColumns=[];
            if($scope.reportName&&$scope.reportName!==''
                    &&$scope.startDate&&$scope.startDate!=='')
                EtlRestService.getHivSummaryFlatTable(moment(new Date($scope.startDate)).startOf('day')
                  .format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),moment(new Date($scope.endDate)).startOf('day')
                  .format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),getSelectedLocations($scope.selectedLocations),
                  onFetchHivSummaryFlatTableSuccess,onFetchHivSummaryFlatTableError)
        }

      function getSelectedLocations(selectedLocationObject) {
        if (selectedLocationObject.selectedAll === true)
          return;
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
      }

        //get Hiv summary Flat Table
        //get Hiv summary Flat table success
        function onFetchHivSummaryFlatTableSuccess(result){
            $scope.summaryVisualizationDone=true;
            $scope.isBusy=false;

            if(angular.isDefined(result.result)&&result.result.length>0){
                $scope.hivSummaryTableData=result.result;
                //get the json  keys
                angular.forEach($scope.hivSummaryTableData[0],function(value,key){
                    $scope.hivSummaryDefaultColumns.push(key);
                });
                //renders  the  pivot  table
                createVisualSummary();
            }
        }

        //get  Hiv  summary  flat table  error
        function onFetchHivSummaryFlatTableError(error){
            $scope.isBusy=false;
            $scope.experiencedLoadingErrors=true;
        }

        /**
         Methods  to  handle Summery  table  Visualization
         */

        function createVisualSummary(){
            // google.load("visualization", "1", {packages:["corechart", "charteditor"]});
            $scope.showVisualTable=false;

            $scope.renderers=$.extend(
                    $.pivotUtilities.renderers,
                    $.pivotUtilities.c3_renderers,
                    $.pivotUtilities.d3_renderers,
                    $.pivotUtilities.export_renderers

                    );
            $("#pivottable").pivotUI($scope.hivSummaryTableData,
                    {rows:['person_id'],
                        cols:['location'],
                        renderer:$scope.renderers
                    }
            );

        }



    }
})();
