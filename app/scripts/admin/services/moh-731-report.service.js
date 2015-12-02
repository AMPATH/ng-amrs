/*jshint -W003, -W117, -W098, -W026 */
(function(){
    'use strict';
    angular
            .module('app.admin')
            .factory('Moh731ReportService',Moh731ReportService);
    Moh731ReportService.$inject=[];
    function Moh731ReportService(){
        var reportSchema;
        var reportSections={};
        var reportDataInSections={};
        var indicatorSections={};
        var sectionSchema={};
        var sectionKeys={};
        var setUp=false;
        var serviceDefinition;
        var startDate=new Date();
        var endDate=new Date();
        var pdfReportSections=[
            ['HIV Exposed Infant (within 2 months)',
                'HIV Exposed Infant (Eligible for CTX 2 months)',
                'On CTX Below 15 yrs',
                'On CTX 15 yrs and Older',
                'Total on CTX (Sum HV03-03 TO HV03-06)'],['Enrolled in Care',
                'Enrolled in care Below 1yr(M)',
                'Enrolled in care Below 1yr(F)',
                'Enrolled in care Below 15yrs(M)',
                'Enrolled in care Below 15yrs(F)',
                'Enrolled in care 15yrs & Older(M)',
                'Enrolled in care 15yrs & Older(F)',
                'Enrolled in care - Total (Sum HV03-09 to HV03-12)'],
            ['3.3 Currently in Care -(from the total sheet-this month only and from last 2 months)',
                'Currently in care Below 1yr(M)',
                'Currently in care Below 1yr(F)',
                'Currently in care Below 15yrs(M)','Currently in care 15yrs and older(F)',
                'Currently in care Below 15yrs(M)','Currently in care 15yrs and older(F)',
                'Currently in Care-Total (Sum HV03-15 to HV03-18)'],
            ['3.4 Starting ART',
                'Starting ART -Below 1yr(M)',
                'Starting ART -Below 1yr(F)',
                'Starting ART -Below 15yrs(M)',
                'Starting ART -Below 15yrs(F)',
                'Starting ART -15yr and Older(M)',
                'Starting ART -15yr and Older(F)',
                'Starting on ART -Total (Sum HV03-21 to HV03-24)',
                'Starting -Preganant',
                'Starting -TB Patient'],
            ['3.5 Revisits on ART (from the tallay sheet -this month only and from last 2 months)',
                'Revisit on ART -Below 1yr(M)','Revisit on ART -Below 1yr(F)',
                'Revisit on ART -Below 15yrs(M)','Revisit on ART -Below 15yrs(F)',
                'Revisit on ART -15yrs and older(M)','Revisit on ART -15yrs and older(F)',
                'Total Revisit on ART (Sum HV03-29 to HV03-32)'],
            ['3.6 Currently on ART [ALL] - (Add 3.4 and 3.5 e.g HV03-34=HV03-20+HV03-28)'
                        ,'Currently on ART - Below 1yr(M)','Currently on ART - Below 1yr(F)',
                'Currently on ART - Below 15 yrs(M)','Currently on ART - Below 15 yrs(F)',
                'Currently on ART -15yr and older(M)','Currently on ART -15yr and older(F)',
                'Total currently on ART (Sum HV03-35 to HV03-38)']
                    ,['3.7 Cumulative Ever on ART',
                        'Ever on ART - Below 15yrs',
                        'Ever on ART - 15yrs & older','Total Ever on ART (Sum HV03-40 to HV03-43)'],
            ['3.8 Survival and Retention on ART at 12 months',
                'ART Net Cohort at 12 months','On Original 1st Line at 12 months',
                'On alternative 1st Line at 12 months',
                'On 2nd Line (or higher) at 12 months','Total on therapy at 12 months (Sum HV03-46 to HV03-48)'
            ],['3.9 Screening',
                'Screened for TB -Below 15yrs(M)','Screened for TB -Below 15yrs(F)',
                'Screened for TB -15yrs & older(M)','Screened for TB -15yrs & older(F)',
                'Total Screened for TB (Sum HV03-50 to HV03-53)',
                'Screened for cervical cancer (F 18 years and older)'],
            ['3.10 Prevention with Positives','Modern contraceptive methods','Provided with condoms'],
            ['3.11 HIV Care Visits','Females (18 years and older','Scheduled','unscheduled','Total HIV Care visit']];
        var reportSectionsKeys=[
            ['HIV Exposed Infant (within 2 months)',
                'HIV_Exposed_Infant',
                'On_CTX_Below_15_yrs',
                'On_CTX_15_yrs_and_Older',
                'Total on CTX (Sum HV03-03 TO HV03-06)']
                    ,['Enrolled in Care',
                        'enrolled_in_care_males_lt_one',
                        'enrolled_in_care_females_lt_one',
                        'enrolled_in_care_males_1_to_15',
                        'enrolled_in_care_females_1_to_15',
                        'enrolled_in_care_males_15_and_older',
                        'enrolled_in_care_females_15_and_older',
                        'enrolled_in_care_total'],
            ['3.3 Currently in Care -(from the total sheet-this month only and from last 2 months)',
                'currently_in_care_males_lt_one',
                'currently_in_care_females_lt_one',
                'currently_in_care_males_1_to_15',
                'currently_in_care_females_1_to_15',
                'currently_in_care_males_15_and_older',
                'currently_in_care_females_15_and_older',
                'currently_in_care_total)'],
            ['3.4 Starting ART','starting_art_males_lt_one','starting_art_females_lt_one',
                ,'starting_art_males_1_to_15','starting_art_females_1_to_15',
                'starting_art_males_15_and_older','starting_art_females_15_and_older',
                'starting_art_total',
                'Starting_Preganant','Starting_TB_Patient'],
            ['3.5 Revisits on ART (from the tallay sheet -this month only and from last 2 months)',
                'revisits_on_art_males_lt_one','revisits_on_art_females_lt_one',
                'revisits_on_art_males_1_to_15','revisits_on_art_females_1_to_15',
                'revisits_on_art_males_15_and_older','revisits_on_art_females_15_and_older',
                'revisits_on_art_total'],
            ['3.6 Currently on ART [ALL] - (Add 3.4 and 3.5 e.g HV03-34=HV03-20+HV03-28)'
                        ,'on_art_males_lt_one','on_art_females_lt_one',
                'on_art_males_1_to_15','on_art_females_1_to_15',
                'on_art_males_15_and_older','on_art_females_15_and_older',
                'on_art_total']
                    ,['3.7 Cumulative Ever on ART',
                        'Ever_on_art_Below_15yrs',
                        'Ever_on_art_15yrs_&_older','on_art'],
            ['3.8 Survival and Retention on ART at 12 months',
                'ART_Net_Cohort_at_12 months',
                'on_original_first_line',
                'on_alternative_first_line',
                'on_second_line',
                'on_art'
            ],['3.9 Screening',
                'screened_for_tb_males_lt_15','screened_for_tb_females_lt_15',
                'screened_for_tb_males_15_and_older','screened_for_tb_females_15_and_older',
                'screened_for_tb',
                'Screened_for_cervical_cance'],
            ['3.10 Prevention with Positives','using_modern_contracept_method','condoms_provided'],
            ['3.11 HIV Care Visits','female_gte_18yo_visits','scheduled_visits','unscheduled_visits','on_art']];

        serviceDefinition={
            getReportSchema:getReportSchema,
            setReportSchema:setReportSchema,
            generateReportDataSections:generateReportDataSections,
            isSetUp:isSetUp,
            getReportSections:getReportSections,
            generateReport:generateReport,
            getSectionSchema:getSectionSchema,
            setSectionSchema:setSectionSchema,
            generatePdfReportSchema:generatePdfReportSchema,
            generateReportSection:generateReportSection,
            getPdfSections:getPdfSections,
            getPdfSectionsKeys:getPdfSectionsKeys
        };
        return serviceDefinition;
        function getPdfSections(){
            return pdfReportSections;
        }
        function getPdfSectionsKeys(){
            return reportSectionsKeys;
        }
        function  getSectionSchema(){
            return  sectionSchema;
        }
        function setSectionSchema(schema){
            sectionSchema=schema;
        }
        function  getReportSections(){
            return reportSections;
        }


        function getReportSchema(){
            return reportSchema;
        }

        function setReportSchema(schema){
            reportSchema=schema;
        }
        /**
         * generate  an  object  of  indicator   section
         * @param {type} reportSchema
         * @returns {undefined}
         */
        function generateIndicatorSection(reportSchema){
            angular.forEach(reportSchema,function(value,key){
                try{
                    console.log("ndicaor  key"+value.indicator_key.name+">.section key"+value.section_key);
                    indicatorSections[value.indicator_key.name]=value.section_key;
                }catch(e){
                    //  console.log(e+"Exception  at generate  indicator  sections");
                }
            },[]);
            //  console.log(indicatorSections)
        }

        function getIndicatorSection(indicatorLabel){
            return  indicatorSections[indicatorLabel];
        }
        /**
         * Method to filter  moh 731 report data to the correct  sections
         * @param {type} reportData
         * @param {type} reportSchema
         * @returns {undefined}
         */
        function generateReportDataSections(reportData,reportSchema){
            //test  if indicatorsSection variable  is  populated

            //attemp to load indicator section  variable
            generateIndicatorSection(reportSchema);

            if(angular.isDefined(reportData)&&angular.isDefined(reportSchema)){
                angular.forEach(reportSchema,function(value,key){
                    //Get all fields  in a row  in  this  section
                    console.log(value);
                    console.log("++++++++++");
                    if(angular.isDefined(value.indicator_key)){
                        reportSections[value.section_key]=[];
                        var indicatorPosition=0;
                        angular.forEach(reportData[0],function(value_2,key_2){
                            //Get all fields  in a row  in  this  section
                            if(getIndicatorSection(key_2)===value.section_key)
                            {
                                reportSections[value.section_key].push(key_2);
                            }
                            indicatorPosition++;
                        },[]);
                    }
                },[]);
                //create report date   in  sections

                //  reportSchema.sections
                setUp=true;
            }else{
                setUp=false;
                return false;
            }

        }
        function getReportSectionLabel(sectionKey){
            if(!angular.isDefined(sectionKeys[sectionKey])){
                angular.forEach(getSectionSchema(),function(value,key){
                    try{
                        if(value.label===sectionKey){
                            sectionKeys[sectionKey]=sectionKey+" "+value.description;
                            return sectionKey+" "+value.description;
                            ;
                        }else{

                        }
                    }catch(e){
                        console.log(e);
                    }
                },[]);
                return "";
            }else
                console.log("return  section  key  from cache");
            return sectionKeys[sectionKey];
        }
        function generateReport(reportData){
            angular.forEach(reportSections,function(value,key){
                if(!angular.isDefined(reportDataInSections[getReportSectionLabel(key)])){
                    reportDataInSections[getReportSectionLabel(key)]=[];
                }
                reportDataInSections[getReportSectionLabel(key)]=[];
                //get  section  data
                angular.forEach(value,function(value_2,key_2){
                    reportDataInSections[getReportSectionLabel(key)].push({value_2:reportData[value_2+""]});
                },[]);
//

            },[]);
            console.log(reportDataInSections);
            return reportDataInSections;
        }
        function getindicatorSections(){
            return indicatorSections;
        }
        function getStartDate(){
            return startDate;
        }

        function setStartDate(date){
            startDate=date;
        }

        function getEndDate(){
            return endDate;
        }

        function setEndDate(date){
            endDate=date;
        }
        function isSetUp(){
            return setUp;
        }

        function generatePdfReportSchema(params){
// sample param  structure           params={facilityName:'GK Dispensary Eldoret',
//                district:params.district,
//                county:"county",
//                facility:'facility',month:'month',year:'year'};
            return {
                content:[
                    {
                        text:params.facilityName,
                        style:'header',
                        alignment:'center'
                    },
                    {
                        stack:[
                            'National Aids And STI Controll Program',
                            {text:'MOH-731 Comprehensive hiv/aids Facility Report Form',style:'subheader'},
                        ],
                        style:'subheader'
                    },
                    {
                        columns:[
                            {
                                width:'*',
                                text:'Facility:'+params.facility
                            }

                        ]
                    },
                    {
                        columns:[
                            {
                                width:'*',
                                text:'District:'+params.district
                            },
                            {
                                width:'*',
                                text:'County:'+params.county
                            },
                            {
                                width:'*',
                                text:'Start date: '+params.startDate,alignment:'right'
                            },{
                                width:'*',
                                text:'End date: '+params.endDate,alignment:'right'


                            },
                        ]
                    },
                    {}

                ],
                styles:{
                    header:{
                        fontSize:14,
                        bold:true,
                        margin:[0,0,0,10]
                    },
                    subheader:{
                        fontSize:12,
                        bold:true,
                        margin:[0,10,0,5]
                    },
                    tableExample:{
                        margin:[0,5,0,15]
                    },
                    sectionhead:{
                        background:'yellow',
                        fontSize:12,
                        bold:true,
                    },
                    tableHeader:{
                        bold:true,
                        fontSize:13,
                        color:'black'
                    }
                },
                defaultStyle:{
                    //  alignment:'justify',
                    fontSize:10
                }

            };

        }
        function generateReportSection(sectionData){
            return 	{
                style:'tableExample',
                table:{
                    widths:[300,10,10,10,'*'],
                    body:[
                        [{text:sectionData.sectionHead,style:'sectionhead'},'','','',''],
                        [
                            {
                                table:{
                                    widths:['*'],
                                    body:sectionData.sectionLabels
                                }
                            },
                            {text:''
                            },
                            {text:''
                            },
                            {text:''
                            },
                            [
                                {table:{
                                        widths:[50,'*'],
                                        body:sectionData.sectionDataValues
                                    },
                                }
                            ]
                        ]
                    ]
                }
            };

        }

    }

})();
