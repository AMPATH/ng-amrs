/*jshint -W003, -W098, -W033 */
(function(){
    'use strict';

    angular
            .module('app.admin')
            .controller('moh731ReportCtrl',moh731ReportCtrl);
    moh731ReportCtrl.$nject=
            ['$rootScope','$scope','$stateParams','EtlRestService','moment',
                '$filter','$state','Moh731ReportService','CachedDataService'];

    function moh731ReportCtrl($rootScope,$scope,$stateParams,EtlRestService,moment,$filter,$state,Moh731ReportService,CachedDataService){
        //Patient List Directive Properties & Methods
        $scope.endDate=new Date();
        $scope.startDate=new Date(moment().subtract(1,'months').calendar());

        $scope.selectedLocation=$stateParams.locationuuid||'';
        $scope.selectedIndicatorBox=$stateParams.indicator||'';
        $scope.selectedSearchLocations=[];
        $scope.reportGeneration=false;
        $scope.reportName='MOH-731';
        $scope.countBy='num_persons';
        $scope.dataSortedByLocation=[];

        $scope.reportData=[];
        $scope.getReportData=getReportData;
        $scope.LocationData={};
        $scope.getReportSectionLabel=getReportSectionLabel;
        $scope.generateMoh731PdfReport=generateMoh731PdfReport;
        $scope.TableData=[];
        //UX Scope Params
        $scope.isBusy=false;
        $scope.experiencedLoadingError=false;

        //Dynamic DataTable Params
        $scope.indicators=[];  //set filtered indicators to []
        $scope.currentPage=1;
        $scope.defaultIndicators=[]; //initialize unfiltered indicators to []
        $scope.counter=0;
        //DataTable Options
        $scope.columns=[];
        $scope.bsTableControl={options:{}};
        $scope.exportList=[
            {name:'Export Basic',value:''},
            {name:'Export All',value:'all'},
            {name:'Export Selected',value:'selected'}];
        $scope.exportDataType=$scope.exportList[1];
        $scope.updateSelectedType=function(){
            var bsTable=document.getElementById('bsTable');
            var element=angular.element(bsTable);
            element.bootstrapTable('refreshOptions',{
                exportDataType:$scope.exportDataType.value
            });
        };


        ///Multi-Select Properties/ Params
        $scope.selectedIndicatorTags={};
        $scope.selectedIndicatorTags.selectedAll=false;
        $scope.selectedIndicatorTags.indicatorTags=[];
        $scope.indicatorTags=[];
        $scope.onSelectedIndicatorTagChanged=onSelectedIndicatorTagChanged;
        $scope.isBusy=false;


        init();

        //scope methods
        function init(){
            buildColumns();
            buildTableControls();
            var bsTable=document.getElementById('bsTable');
            var element=angular.element(bsTable);
            element.bootstrapTable('refreshOptions',{
                exportDataType:$scope.exportDataType.value
            });
        }
        $scope.$on('generate-moh-731-pdf-report',function(event,args){


            generateMoh731PdfReport($rootScope.selectedPdfRow.location,$rootScope.selectedPdfRow)
        });
        function buildColumns(){
            $scope.columns=[];

            $scope.titles=[];
            _.each($scope.titles,function(header){
                var visible=(header.location_uuid!=='location_uuid');
                $scope.columns.push({
                    field:"fields",
                    title:header,
                    align:'center',
                    valign:'bottom',
                    class:header.name==='location'?'bst-table-min-width':undefined,
                    visible:visible,
                    tooltip:true,
                    formatter:function(value,row,index){
                        return cellFormatter(value,row,index,header);
                    }
                });
            });
        }
        function buildTableControls(){
            $scope.bsTableControl={
                options:{
                    data:$scope.TableData,
                    rowStyle:function(row,index){
                        return {classes:'none'};
                    },
                    tooltip:true,
                    classes:'table table-hover',
                    cache:false,
                    height:550,
                    detailView:true,
                    detailFormatter:detailFormatter,
                    striped:true,
                    selectableRows:true,
                    showFilter:true,
                    pagination:true,
                    pageSize:20,
                    pageList:[5,10,25,50,100,200],
                    search:true,
                    trimOnSearch:true,
                    singleSelect:false,
                    showColumns:true,
                    showRefresh:true,
                    showMultiSort:true,
                    showPaginationSwitch:true,
                    smartDisplay:true,
                    idField:'location',
                    minimumCountColumns:2,
                    clickToSelect:true,
                    showToggle:false,
                    maintainSelected:true,
                    showExport:true,
                    toolbar:'#toolbar',
                    toolbarAlign:'left',
                    exportTypes:['json','xml','csv','txt','png','sql','doc','excel','powerpoint','pdf'],
                    columns:$scope.columns,
                    exportOptions:{fileName:'MOH-731 Report'},
                    iconSize:undefined,
                    iconsPrefix:'glyphicon',// glyphicon of fa (font awesome)
                    icons:{
                        paginationSwitchDown:'glyphicon-chevron-down',
                        paginationSwitchUp:'glyphicon-chevron-up',
                        refresh:'glyphicon-refresh',
                        toggle:'glyphicon-list-alt',
                        columns:'glyphicon-th',
                        sort:'glyphicon-sort',
                        plus:'glyphicon-plus',
                        minus:'glyphicon-minus',
                        detailOpen:'glyphicon-plus',
                        detailClose:'glyphicon-minus'
                    },
                    fixedColumns:true,
                    fixedNumber:2,
                    onExpandRow:function onExpandRow(index,row,$detail){
                        var result=document.getElementsByClassName("fixed-table-body-columns");
                        result[0].style.visibility='hidden';
                    },
                    onCollapseRow:function onCollapseRow(index,row,$detail){

                        var result=document.getElementsByClassName("fixed-table-body-columns");
                        result[0].style.visibility='visible';
                    }
                }
            };


        }
        /**
         * generate Pdf report  from rowdata and  Location
         * @param {type} locationName
         * @param {type} rowData
         * @returns {undefined}
         */
        function generateMoh731PdfReport(locationName,rowData){

            $scope.facilityData=CachedDataService.getCachedEtlLocations()[rowData["location_uuid"]];
            var params={facilityName:$scope.facilityData.description+"",
                district:$scope.facilityData.county_district+"",
                county:"county",
                facility:$scope.facilityData.description+"",startDate:$filter('date')($scope.startDate,"M/yy"),endDate:$filter('date')($scope.endDate,"M/yy")};
            var mainReportjson=Moh731ReportService.generatePdfReportSchema(params);
            //generate Pdf  report
            $scope.indicatorNumber=0;
            $scope.sectionNumber=0;
            //$scope.indicatorNumber=0;
            angular.forEach(Moh731ReportService.getPdfSections(),function(sectionData,key){
                //get section labels  and  data1
                var el=0;
                $scope.sectionLabel=[];
                $scope.sectionValues=[];
                angular.forEach(sectionData,function(sectionLabel,key){

                    if(el!==0){
                        $scope.sectionLabel.push([sectionLabel]);
                        //push section  data
                                     $scope.datavalue="";
                        if(angular.isDefined(rowData[Moh731ReportService.getPdfSectionsKeys()[$scope.sectionNumber][el]]))
                        {
                            $scope.datavalue=rowData[Moh731ReportService.getPdfSectionsKeys()[$scope.sectionNumber][el]];
                        }else{
                            $scope.datavalue="-";
                        }

                        $scope.sectionValues.push(
                                ['HIV'+$scope.indicatorNumber,$scope.datavalue+""]);
                        $scope.indicatorNumber++;
                    }
                    el++;
                },[]);
//add section  number
                $scope.sectionNumber++;
                var sectionData={
                    sectionHead:sectionData[0],sectionLabels:$scope.sectionLabel
                    ,sectionDataValues:$scope.sectionValues};
                var reportSection=Moh731ReportService.generateReportSection(sectionData);

                //add section main  json
                mainReportjson.content.push(reportSection);
            },[]);

            //final  report  schema


            pdfMake.createPdf(mainReportjson).open();

        }

        function loadIndicatorsSchema(){
            $scope.experiencedLoadingErrors=false;
            if($scope.isBusy===true)return;
            $scope.indicatorTags=[];
            $scope.isBusy=true;
            if($scope.reportName&&$scope.reportName!=='')
                EtlRestService.getIndicatorsSchemaWithSections($scope.reportName
                        ,onFetchIndicatorsSchemaSuccess,
                        onFetchIndicatorsSchemaError);

        }
        function onFetchIndicatorsSchemaSuccess(result){
            $scope.isBusy=false;
            $scope.indicatorTags=result.result[0];
            Moh731ReportService.setReportSchema(result.result[0]);
            Moh731ReportService.setSectionSchema(result.result[1]);
        }

        function onFetchIndicatorsSchemaError(error){
            $scope.isBusy=false;
            $scope.experiencedLoadingErrors=true;
        }

        function getReportData(){
            //clean bSData table
            $scope.experiencedLoadingErrors=false;
            $scope.noresults=false;
            $scope.reportGeneration=false;
            if($scope.isBusy===true)
                return;
            $scope.isBusy=true;
            $scope.indicators=[];
            if($scope.reportName&&$scope.reportName!==''
                    &&$scope.startDate&&$scope.startDate!=='')
                EtlRestService.getMoh731Report($scope.reportName,moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                        $scope.selectedSearchLocations,$scope.countBy,onFetchMoh731ReportSuccess,onFetchMoh731ReportError);
        }

        function onFetchMoh731ReportSuccess(result){

            $scope.reportGeneration=true;
            $scope.isBusy=false;
            $scope.dataSortedByLocation={};

            $scope.LocationData={};

            if(angular.isDefined(result.result)&&result.result.length>0){
                $scope.moh731ReportData=result.result;
                angular.forEach(result.result,function(resultRow,key){
                    //test location  of  the  result  row

                    if(angular.isDefined($scope.dataSortedByLocation[resultRow.location_uuid])){
                          $scope.dataSortedByLocation[resultRow.location_uuid].push(resultRow)
                    }else{
                           $scope.dataSortedByLocation[resultRow.location_uuid]=[];
                        $scope.dataSortedByLocation[resultRow.location_uuid].push(resultRow);
                    }
                },[]);
                //processs dataSortedLocation
                angular.forEach($scope.dataSortedByLocation,function(LocationRow,key){
                      $scope.LocationData[key]={};
                      angular.forEach(LocationRow,function(LocationObjects,key2){
                        angular.forEach(LocationObjects,function(actualValue,actualkey){
                            $scope.LocationData[key][actualkey]=actualValue;
                        },[]);

                    },[]);
                },[]);

                //Clean Current Bs Table Data
                var len=$scope.TableData.length;
                var tlen=$scope.columns.length;
                $scope.TableData.splice(0,len);
                var tlen=$scope.columns.splice(0,tlen);
                angular.forEach($scope.LocationData,function(actualValue,actualkey){
                    if(angular.isDefined(actualValue)){
                        $scope.TableData.push(actualValue);

                    }
                },[]);

                //start  of variable  names  to  label  names  change  on the  report  table
                //generate Pdf  report 
                $scope.indicatorNumber=0;
                $scope.sectionNumber=0;
                //$scope.indicatorNumber=0;
                angular.forEach(Moh731ReportService.getPdfSections(),function(sectionData,key){
                    //get section labels  and  data1
                    var el=0;
                    $scope.sectionLabel=[];
                    $scope.sectionValues=[];
                    angular.forEach(sectionData,function(sectionLabel,key){


                        if(angular.isDefined(sectionLabel)&&angular.isDefined(Moh731ReportService.getPdfSectionsKeys()[$scope.sectionNumber])){

                            if(el==0){
                                //inject  fixed  location  column
                                sectionLabel="Location";
                                var actualKey='location';
                            }else{
                                var actualKey=Moh731ReportService.getPdfSectionsKeys()[$scope.sectionNumber][el];
                            }
                            if(sectionLabel!=="location_uuid"){

                                $scope.columns.push({
                                    field:actualKey,
                                    title:sectionLabel,
                                    align:'center',
                                    class:actualKey==='location'?'bst-table-min-width-mid':undefined,
                                    valign:'bottom',
                                    tooltip:true,
                                    formatter:function(value,row,index){

                                        return cellFormatter(value,row,index,actualKey);

                                    }
                                });
                            }
                        }


                        $scope.indicatorNumber++;

                        el++;
                    },[]);
//add section  number

                    $scope.sectionNumber++;
                },[]);

                $scope.dataSortedByLocation=null;
                if(false){
                    Moh731ReportService.generateReportDataSections(result.result,Moh731ReportService.getReportSchema());
                    Moh731ReportService.getReportSections();
                }else{

                }
                $scope.reportData=Moh731ReportService.generateReport(result.result[0]);

            }
        }
        function getReportSectionLabel(sectionKey){
            angular.forEach(Moh731ReportService.setSectionSchema(),function(value,key){
                try{
                    if(value.label===sectionKey){
                        return value.description;
                    }else{
                    }
                }catch(e){
                    console.log(e);
                }
            },[]);
            return "";
        }







        function onSelectedIndicatorTagChanged(tag){
            filterIndicators();
        }



        function getIndicatorDetails(name){
            var found=$filter('filter')($scope.indicatorTags,{name:name})[0];
            if(found)
                return found;
        }


        //get  Hiv  summary  flat table  error
        function onFetchMoh731ReportError(error){
            $scope.isBusy=false;
            $scope.experiencedLoadingErrors=true;
        }

        /**
         * Function to format detailed view
         */
        function detailFormatter(index,row){
            var $body=angular.element(document.body);   // 1
            var $rootScope=$body.scope().$root;         // 2
            $rootScope.$apply(function(){               // 3
                $rootScope.selectedPdfRow=row;
                $rootScope.selectedPdfIndex=index;
            });
            var html=[];
            html.push('<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">'+
                    '<a href="#/moh-731-generate-pdf" class="btn btn-info">Generate Pdf</a></div>');
            _.each(row,function(value,key){
                if(key==='location_uuid'||key==='state')return;
                var label="label";
                label=$filter('titlecase')(label.toString().split('_').join(' '));
                var key=$filter('titlecase')(key.toString().split('_').join(' '));
                html.push('<div class="well well-sm " style="padding:2px; height:43px!important;margin-bottom: 5px !important; ">'+
                        '<b>'+key+'</b><br>'+value+'</div>');
            });
            //adding a get pdf  report  link
            return html.join('');
        }

        /**
         * Function to add button on each cell
         */

        function cellFormatter(value,row,index,header){

            if(header==="Location"){
                return  CachedDataService.getCachedEtlLocations()[row["location_uuid"]].name

            }else{
                if(row[header]===undefined){

                    return "-";
                }else{

                    return ['<a class="btn btn-large btn-default" style="padding: inherit; width:100%; max-width: 300px">'+row[header]+'</a>'];
                }
                // return ;
            }

        }


    }
})();
