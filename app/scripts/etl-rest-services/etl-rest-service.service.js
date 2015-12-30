/*jshint -W003, -W098, -W117, -W026 */



(function(){
    'use strict';

    angular
            .module('app.etlRestServices')
            .service('EtlRestService',EtlRestService);

    EtlRestService.$inject=['EtlRestServicesSettings','$resource'];

    function EtlRestService(EtlRestServicesSettings,$resource){
        var serviceDefinition;
        serviceDefinition={
            getResource:getResource,
            getHivSummary:getHivSummary,
            getVitals:getVitals,
            getPatientTests:getPatientTests,
            getAppointmentSchedule:getAppointmentSchedule,
            getMonthlyAppointmentSchedule:getMonthlyAppointmentSchedule,
            getMonthlyAppointmentAndVisits:getMonthlyAppointmentAndVisits,
            getDefaultersList:getDefaultersList,
            getDailyVisits:getDailyVisits,
            getPatientListByIndicator:getPatientListByIndicator,
            getHivSummaryIndicators:getHivSummaryIndicators,
            getDataEntryStatisticsTypes:getDataEntryStatisticsTypes,
            getDataEntryStatisticsQueryParam:getDataEntryStatisticsQueryParam,
            getDataEntryStatistics:getDataEntryStatistics,
            getPatientsCreatedByPeriod:getPatientsCreatedByPeriod,
            getDetailsOfPatientsCreatedInLocation:getDetailsOfPatientsCreatedInLocation,
            getIndicatorsSchema:getIndicatorsSchema,
            getDailyNotReturnedVisits:getDailyNotReturnedVisits,
            getHivSummaryFlatTable:getHivSummaryFlatTable,
            getPatientByIndicatorAndLocation:getPatientByIndicatorAndLocation,
            getMoh731Report:getMoh731Report,
            getIndicatorsSchemaWithSections:getIndicatorsSchemaWithSections

        };
        return serviceDefinition;

        function getResource(path){
            return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim()+path,
                    {uuid:'@uuid'},
            {query:{method:'GET',isArray:false}});
        }


        function getHivSummary(patientUuid,startIndex,limit,successCallback,failedCallback){
            var resource=getResource('patient/:uuid/hiv-summary');
            if(!startIndex){
                startIndex=0;
            }

            if(!limit){
                limit=20;
            }

            var params={startIndex:startIndex,uuid:patientUuid,limit:limit};
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });
        }

        function getVitals(patientUuid,startIndex,limit,successCallback,failedCallback){
            var resource=getResource('patient/:uuid/vitals');
            if(!startIndex){
                startIndex=0;
            }

            if(!limit){
                limit=20;
            }

            var params={startIndex:startIndex,uuid:patientUuid,limit:limit};
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });
        }

        function getPatientTests(patientUuid,startIndex,limit,successCallback,failedCallback){
            var resource=getResource('patient/:uuid/data');
            if(!startIndex){
                startIndex=0;
            }

            if(!limit){
                limit=20;
            }

            var params={startIndex:startIndex,uuid:patientUuid,limit:limit};
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });
        }

        function getAppointmentSchedule(locationUuid,startDate,endDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/appointment-schedule');

            var params={endDate:endDate,startDate:startDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }

        function getDailyNotReturnedVisits(locationUuid,startDate,endDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/has-not-returned');

            var params={endDate:endDate,startDate:startDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });


        }


        function getDailyVisits(locationUuid,startDate,endDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/daily-visits');

            var params={endDate:endDate,startDate:startDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });
        }



        function getMonthlyAppointmentSchedule(locationUuid,monthDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/monthly-appointment-schedule');

            var params={startDate:monthDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        //console.error(error);
                    });

        }

        function getDefaultersList(locationUuid,numberOfDaysDefaulted,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/defaulter-list');

            var params={defaulterPeriod:numberOfDaysDefaulted,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }



        function getMonthlyAppointmentAndVisits(locationUuid,monthDate,endDate,
                successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/monthly-appointment-visits');
            var params={startDate:monthDate,endDate:endDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }

        function getPatientListByIndicator(locationUuid,startDate,endDate,indicator,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:uuid/patient-by-indicator');

            var params={endDate:endDate,indicator:indicator,startDate:startDate,uuid:locationUuid};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }


            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }


        function getPatientByIndicatorAndLocation(locationIds,startDate,endDate,indicator,successCallback,
                failedCallback,locationUuids,startIndex,limit){
            var resource=getResource('patient-by-indicator');
            var params={endDate:endDate,indicator:indicator,startDate:startDate,locationIds:locationIds,
                locationUuids:locationUuids};
            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                    });

        }



        function getHivSummaryFlatTable(startDate,endDate,locations,successCallback,failedCallback){
            var resource=getResource('hiv-summary-data');
            var params={startDate:startDate,endDate:endDate,locations:locations.toString()};
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }


        function getHivSummaryIndicators(startDate,endDate,report,countBy,successCallback,failedCallback,
                groupBy,locationUuids,orderBy,indicators,startIndex,limit){
            var resource=getResource('get-report-by-report-name');

            var params={endDate:endDate,report:report,countBy:countBy,startDate:startDate,groupBy:groupBy,
                locationUuids:locationUuids,indicators:indicators,order:orderBy};


            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }
        function getIndicatorsSchema(report,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('indicators-schema');

            var params={report:report};
            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }


            if(limit!==undefined){
                params.limit=limit;
            }
            console.log(params);
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }
        function getIndicatorsSchemaWithSections(report,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('indicators-schema-with-sections');

            var params={report:report};
            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }
            console.log(params);
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }



        function getDataEntryStatistics(subType,startDate,endDate,locationUuids,
                encounterTypeUuids,formUuids,providerUuid,creatorUuid,successCallback,failedCallback){
            var resource=getResource('data-entry-statistics/:subType');


            var params=getDataEntryStatisticsQueryParam(subType,startDate,endDate,locationUuids,encounterTypeUuids,
                    formUuids,providerUuid,creatorUuid);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });
        }


        function getDataEntryStatisticsTypes(){
            return [
                {
                    id:'view1',
                    subType:'by-date-by-encounter-type'
                },
                {
                    id:'view2',
                    subType:'by-month-by-encounter-type'
                },
                {
                    id:'view3',
                    subType:'by-provider-by-encounter-type'
                },
                {
                    id:'view4',
                    subType:'by-creator-by-encounter-type'
                }
            ];
        }

        function getDataEntryStatisticsQueryParam(subType,startDate,endDate,locationUuids,encounterTypeUuids,formUuids,providerUuid,creatorUuid){
            var param={
                subType:subType,//mandatory params
                startDate:startDate,
                endDate:endDate
            };

            var paramConfig={};

            var getParamConfigObj=function(arrayProperties){
                var obj={};
                for(var i=0;i<arrayProperties.length;i++){
                    obj[arrayProperties[i]]='prop';
                }
                return obj;
            };

            switch(subType){
                case 'by-date-by-encounter-type':
                    paramConfig=getParamConfigObj(['locationUuids','encounterTypeUuids','formUuids','providerUuid']);
                    break;
                case 'by-month-by-encounter-type':
                    paramConfig=getParamConfigObj(['locationUuids','encounterTypeUuids','formUuids','providerUuid']);
                    break;
                case 'by-provider-by-encounter-type':
                    paramConfig=getParamConfigObj(['locationUuids','encounterTypeUuids','formUuids','providerUuid']);
                    break;
                case 'by-creator-by-encounter-type':
                    paramConfig=getParamConfigObj(['locationUuids','encounterTypeUuids','formUuids','creatorUuid']);
                    break;
            }

            //set-up the param object
            if(locationUuids&&paramConfig.locationUuids){
                param.locationUuids=locationUuids;
            }
            if(encounterTypeUuids&&paramConfig.encounterTypeUuids){
                param.encounterTypeUuids=encounterTypeUuids;
            }
            if(formUuids&&paramConfig.formUuids){
                param.formUuids=formUuids;
            }
            if(providerUuid&&paramConfig.providerUuid){
                param.providerUuid=providerUuid;
            }
            if(creatorUuid&&paramConfig.creatorUuid){
                param.creatorUuid=creatorUuid;
            }

            return param;
        }

        function getPatientsCreatedByPeriod(startDate,endDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('patient/creation/statistics');

            var params={startDate:startDate,endDate:endDate};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }

        function getDetailsOfPatientsCreatedInLocation(location,startDate,endDate,successCallback,failedCallback,startIndex,limit){
            var resource=getResource('location/:location/patient/creation/statistics');
            var params={location:location,startDate:startDate,endDate:endDate};

            if(startIndex!==undefined){
                params.startIndex=startIndex;
            }

            if(limit!==undefined){
                params.limit=limit;
            }

            console.log(params);
            console.log(startIndex);

            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }


        function getMoh731Report(report,startDate,endDate,locations,countBy,successCallback,failedCallback){
            var resource=getResource('get-report-by-report-name');
            var params={startDate:startDate,endDate:endDate,locations:locations.toString(),countBy:countBy,report:report};
            return resource.get(params).$promise
                    .then(function(response){
                        successCallback(response);
                    })
                    .catch(function(error){
                        failedCallback('Error processing request',error);
                        console.error(error);
                    });

        }




    }
})();
