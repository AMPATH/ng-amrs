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
        $scope.startDate=new Date("January 1, 2015 12:00:00");
        $scope.endDate=new Date();
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

            //    if(!Moh731ReportService.isSetUp())loadIndicatorsSchema();
            buildColumns();
            buildTableControls();
            var bsTable=document.getElementById('bsTable');
            var element=angular.element(bsTable);
            element.bootstrapTable('refreshOptions',{
                exportDataType:$scope.exportDataType.value
            });
        }
        $scope.$on('generate-moh-731-pdf-report',function(event,args){

            //console.log("Row selected",$rootScope.selectedPdfRow);
            generateMoh731PdfReport($rootScope.selectedPdfRow.location,$rootScope.selectedPdfRow)
        });
        function buildColumns(){
            $scope.columns=[];
            $scope.titles=['Location','unscheduled_visits','on_art','starting_art_total','on_pcp_prophylaxis'
                        ,'condoms_provided',
                'using_modern_contracept_methods','female_gte_18yo_visits',];
            _.each($scope.titles,function(header){
                var visible=(header.location_uuid!=='location_uuid');
                var checkbox=(header.name==='state');
                var sortable=(header.name!=='state');
                $scope.columns.push({
                    field:"fields",
                    title:header,
                    align:'center',
                    valign:'bottom',
                    sortable:sortable,
                    checkbox:checkbox,
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
                    showToggle:true,
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
                        // console.log($scope.sectionNumber+"<<The>>>>"+el,rowData);
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
            //  console.log('The  Final Report Schema>>>>>',mainReportjson);

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
                        //   console.log("dataSortedByLocation adding  array for location  id",resultRow.location_uuid)
                        $scope.dataSortedByLocation[resultRow.location_uuid].push(resultRow)
                    }else{
                        //  console.log("dataSortedByLocation Creating  array for  location  id",resultRow.location_uuid)
                        //define  it  as an array 
                        $scope.dataSortedByLocation[resultRow.location_uuid]=[];
                        $scope.dataSortedByLocation[resultRow.location_uuid].push(resultRow);
                    }
                },[]);
                //processs dataSortedLocation 
                angular.forEach($scope.dataSortedByLocation,function(LocationRow,key){
                    // console.log("entering second loop",LocationRow)
                    $scope.LocationData[key]={};
                    // console.log(LocationRow,"Loation  row  with  items"+LocationRow.length)
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
                //title clean up
                // $scope.titles.slice(0,tlen);
                angular.forEach($scope.LocationData,function(actualValue,actualkey){
                    // console.log(actualValue,">>>>>and the  key  is"+actualkey,"Final Data>>>>");
                    if(angular.isDefined(actualValue)){
                        $scope.TableData.push(actualValue);

                    }
                },[]);
                //boostrap  was  here
                //update table columns
                angular.forEach($scope.TableData[0],function(actualValue,actualkey){

                    if(angular.isDefined(actualkey)){
                        if(actualkey!=="location_uuid"){
                            $scope.columns.push({
                                field:actualkey,
                                title:actualkey,
                                align:'center',
                                valign:'bottom',
                                tooltip:true,
                                formatter:function(value,row,index){
                                    return cellFormatter(value,row,index,actualkey);
                                }
                            });
                        }

                    }
                },[]);


                $scope.dataSortedByLocation=null;
                /**
                 * This sections is  for  
                 */

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
                        console.log("about  to return"+value.description);
                        return value.description;
                    }else{
                        console.log(value.label+"The  section Key"+sectionKey+"Missing  match")
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
                html.push('<div class="well well-sm " style="padding:2px; margin-bottom: 5px !important; ">'+
                        '<p><b>'+key+'</b></p>'+value+'</div>');
            });
            //adding a get pdf  report  link
                return html.join('');
        }

        /**
         * Function to add button on each cell
         */

        function cellFormatter(value,row,index,header){
            // console.log(row[header],"Incoming  row  data using header"+header);
            if(header==="Location"){
                // console.log(CachedDataService.getCachedEtlLocations()[row["location_uuid"]],"resolved location");
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
