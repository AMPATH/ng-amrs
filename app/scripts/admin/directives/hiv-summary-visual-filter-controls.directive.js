/* global angular */
/*
 jshint -W003, -W026
 */
(function(){
    'use strict';

    angular
            .module('app.admin')
            .directive('statsHivSummaryVisualFilters',directive);

    function directive(){
        return {
            restrict:"E",
            scope:{
                selectedForms:"=",
                startDate:"=",
                endDate:"=",
                selectedProvider:"=",
                enabledControls:"="
            },
            controller:hivSummaryVisualFilterController,
            link:hivSummaryFilterLink,
            templateUrl:"views/admin/hiv-summary-visual-filter-controls.html"
        };
    }

    hivSummaryVisualFilterController.$inject=['$scope','$rootScope','SearchDataService','moment','$state','$filter','CachedDataService','OpenmrsRestService','LocationModel'];

    function hivSummaryVisualFilterController($scope,$rootScope,SearchDataService,moment,$state,$filter,CachedDataService,OpenmrsRestService,LocationModel){
        $scope.forms=[];
        $scope.selectedForms={};
        $scope.selectedForms.selected=[];
        $scope.selectedEncounterTypes={};
        $scope.selectedEncounterTypes.selected=[];
        $scope.selectAllForms=selectAllForms;
        $scope.selectAllEncounterTypes=selectAllEncounterTypes;
        $scope.locationSelected=locationSelected;
        $scope.handleSelectAllTongle=handleSelectAllTongle;

        $scope.providers=[];
        $scope.selectedProvider={};
        $scope.selectedProvider.selected={};
        $scope.findProviders=findProviders;
        $scope.fetchLocations=fetchLocations;
        $scope.preLoad=preLoad;
        $scope.findingProvider=false;
        $scope.canView=canView;
        var locationService=OpenmrsRestService.getLocationResService();
        $scope.selectedLocations={};
        $scope.selectedLocations.selectedAll=false;
        $scope.selectedLocations.locations=[];
        $scope.locations=[];
        $scope.selectingLocation=true;
        preLoad();

        function preLoad(){
           // loadForms();
            fetchLocations();

        }


        function loadForms(){
            $scope.forms=CachedDataService.getCachedPocForms();
        }

        function canView(param){
            return $scope.enabledControls.indexOf(param)>-1;
        }

        function selectAllForms(){
            if($scope.forms)
                $scope.selectedForms.selected=$scope.forms;
        }

        function selectAllEncounterTypes(){
            if($scope.forms)
                $scope.selectedEncounterTypes.selected=$scope.forms;
        }

        function findProviders(searchText){

            $scope.providers=[];
            if(searchText&&searchText!==' '){
                $scope.findingProvider=true;
                SearchDataService.findProvider(searchText,onProviderSearchSuccess,onProviderSearchError);
            }
        }


        function onProviderSearchSuccess(data){
            $scope.findingProvider=false;
            $scope.providers=data;
        }

        function onProviderSearchError(error){
            $scope.findingProvider=false;
        }

        /**
         Location  related  methods
         **/
        function fetchLocations(){
            $scope.isBusy=true;
            locationService.getLocations(onGetLocationsSuccess,
                    onGetLocationsError,true);
        }
        function onGetLocationsSuccess(locations){
            $scope.isBusy=false;
            $scope.locations=wrapLocations(locations);

        }
        function onGetLocationsError(error){
            $scope.isBusy=false;
        }
        function wrapLocations(locations){
            var wrappedLocations=[];
            for(var i=0;i<locations.length;i++){

                locationService.getLocationByUuidFromEtlOrCatch(locations[i].uuid,true,function(success){
                },function(error){
                    console.log("error"+error);
                });
                var wrapped=wrapLocation(locations[i]);
                wrapped.index=i;
                wrappedLocations.push(wrapped);
            }

            return wrappedLocations;
        }

        function wrapLocation(location){
            return new LocationModel.toWrapper(location);
        }
//signifies    location  selection   copleat
//set  selected  parameters  to parent  scope
        function locationSelected(){
            $scope.$parent.summaryVisualizationDone=false;
            $scope.$parentnoresults=false;
//test  if  all  locations  were  selected
            if($scope.selectedLocations.selectedAll===true){
                $scope.$parent.selectedSearchLocations=[];
                angular.forEach(CachedDataService.getCachedEtlLocations(),function(value,key){

                    $scope.$parent.selectedSearchLocations.push(value.location_id);
                });
            }else{
                $scope.$parent.selectedSearchLocations=[];
                angular.forEach($scope.selectedLocations.locations,function(value,key){
                $scope.$parent.selectedSearchLocations.push(CachedDataService.getCachedEtlLocations()[value.uuId()].location_id);
                });
            }
            $scope.$parent.startDate=$scope.startDate;
            $scope.$parent.endDate=$scope.endDate;
            //enable  button  only  when all  or  a  given  location has  been   selected
            if($scope.selectedLocations.selectedAll===true||$scope.selectedLocations.locations.length>0){
                $scope.$parent.enableSubmitButton=true;
            }else{
                $scope.$parent.enableSubmitButton=false;
            }
        }
        function handleSelectAllTongle(){
            $scope.selectedLocations.selectedAll=!$scope.selectedLocations.selectedAll;
            locationSelected();
        }


    }

    function hivSummaryFilterLink(scope,element,attrs,vm){
        // attrs.$observe('selectedLocation', onLocationUuidChanged);
        // console.log('data-entry');
        // function onLocationUuidChanged(newVal, oldVal) {
        //     if (newVal && newVal !== "") {

        //     }
        // }
    }



})();
