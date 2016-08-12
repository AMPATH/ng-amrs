/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.etlRestServices')
    .service('EtlRestService', EtlRestService);

  EtlRestService.$inject = [
    'EtlRestServicesSettings',
    '$resource',
    'CacheFactory',
    '$q'
  ];

  function EtlRestService(EtlRestServicesSettings, $resource, CacheFactory, $q) {
    var defaultCachingProperty =
      CacheFactory(Math.random() + 'cache', {
        maxAge: 5 * 60 * 1000, // Items added to this cache expire after 15 minutes
        cacheFlushInterval: 5 * 60 * 1000, // This cache will clear itself every hour
        deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
      });
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getHivSummary: getHivSummary,
      getVitals: getVitals,
      getPatientTests: getPatientTests,
      getAppointmentSchedule: getAppointmentSchedule,
      getMonthlyAppointmentSchedule: getMonthlyAppointmentSchedule,
      getMonthlyAppointmentAndVisits: getMonthlyAppointmentAndVisits,
      getDefaultersList: getDefaultersList,
      getDailyVisits: getDailyVisits,
      getPatientListByIndicator: getPatientListByIndicator,
      getHivSummaryIndicators: getHivSummaryIndicators,
      getDataEntryStatisticsTypes: getDataEntryStatisticsTypes,
      getDataEntryStatisticsQueryParam: getDataEntryStatisticsQueryParam,
      getDataEntryStatistics: getDataEntryStatistics,
      getPatientsCreatedByPeriod: getPatientsCreatedByPeriod,
      getDetailsOfPatientsCreatedInLocation: getDetailsOfPatientsCreatedInLocation,
      getIndicatorsSchema: getIndicatorsSchema,
      getDailyPatientList: getDailyPatientList,
      getHivSummaryFlatTable: getHivSummaryFlatTable,
      getPatientByIndicatorAndLocation: getPatientByIndicatorAndLocation,
      getMoh731Report: getMoh731Report,
      getIndicatorsSchemaWithSections: getIndicatorsSchemaWithSections,
      getPatientLevelReminders: getPatientLevelReminders,
      getPatientListReportByIndicatorAndLocation: getPatientListReportByIndicatorAndLocation,
      getHivOverviewVisualizationReport: getHivOverviewVisualizationReport,
      getClinicalNotes: getClinicalNotes,
      synchronizeEIDPatientLabResults:synchronizeEIDPatientLabResults,
      getPatientFlowData: getPatientFlowData,
      postOrderToEid: postOrderToEid,
      invalidateUserSession: invalidateUserSession
    };
    return serviceDefinition;

    function getResource(path, cacheProperty) {
      var caching = defaultCachingProperty;
      if (!_.isEmpty(cacheProperty)) {
        caching = cacheProperty;
      }
      return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim() + path, {
        uuid: '@uuid'
      }, {
          get: {
            method: 'GET',
            cache: caching
          }
        });
    }

    function getClinicalNotesResource(path, cacheProperty) {
      var caching = defaultCachingProperty;
      if (!_.isEmpty(cacheProperty)) {
        caching = cacheProperty;
      }
      return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim() + path, {
        uuid: '@uuid'
      }, {
          get: {
            method: 'GET',
            cache: caching
          }
        });
    }

    function getHivSummary(patientUuid, startIndex, limit, successCallback, failedCallback, includeNonClinicalEncounter) {
      var resource = getResource('patient/:uuid/hiv-summary');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }

      var params = {
        startIndex: startIndex,
        uuid: patientUuid,
        limit: limit,

      };
      if(includeNonClinicalEncounter) params.includeNonClinicalEncounter=includeNonClinicalEncounter;
      if (typeof successCallback === 'function') {
        return resource.get(params).$promise.then(function (response) {
          successCallback(response);
        }, function (error) {
          if (typeof failedCallback === 'function') {
            failedCallback('Error processing request', error);
          }
          console.error(error);
        });
      } else {
        return resource.get(params).$promise.then(function (response) {
          return response;
        }, function (response) {
          // Something went crazy
          return $q.reject(response);
        });
      }
    }

    function getClinicalNotes(patientUuid, startIndex, limit) {
      var resource = getResource('patient/:uuid/clinical-notes');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 10;
      }

      var params = {
        startIndex: startIndex,
        uuid: patientUuid,
        limit: limit
      };

      return resource.get(params).$promise;
    }

    function getVitals(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/vitals');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }

      var params = {
        startIndex: startIndex,
        uuid: patientUuid,
        limit: limit
      };

      if (typeof successCallback === 'function') {
        return resource.get(params).$promise.then(function (response) {
          successCallback(response);
        }, function (error) {
          if (typeof failedCallback === 'function') {
            failedCallback('Error processing request', error);
          }
          console.error(error);
        });
      } else {
        return resource.get(params).$promise.then(function (response) {
          return response;
        }, function (response) {
          // Something went crazy
          return $q.reject(response);
        });
      }
    }

    function getPatientTests(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/data');
      if (!startIndex) {
        startIndex = 0;
      }
      if (!limit) {
        limit = 20;
      }

      var params = {
        startIndex: startIndex,
        uuid: patientUuid,
        limit: limit
      };
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getAppointmentSchedule(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        groupBy: 'groupByPerson,groupByd',
        startDate: startDate,
        locationUuids: locationUuid,
        report: 'daily-appointments'
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getDailyPatientList(locationUuid, report, startDate,
      endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        groupBy: 'groupByPerson,groupByd',
        startDate: startDate,
        locationUuids: locationUuid,
        report: report
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });


    }


    function getDailyVisits(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        groupBy: 'groupByPerson,groupByd',
        startDate: startDate,
        locationUuids: locationUuid,
        report: 'daily-attendance'
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }



    function getMonthlyAppointmentSchedule(locationUuid, monthDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/monthly-appointment-schedule');

      var params = {
        startDate: monthDate,
        uuid: locationUuid
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          //console.error(error);
        });

    }

    function getDefaultersList(locationUuid, numberOfDaysDefaulted, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/defaulter-list');

      var params = {
        defaulterPeriod: numberOfDaysDefaulted,
        uuid: locationUuid
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }



    function getMonthlyAppointmentAndVisits(locationUuid, monthDate, endDate,
      successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/monthly-appointment-visits');
      var params = {
        startDate: monthDate,
        endDate: endDate,
        uuid: locationUuid
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getPatientListByIndicator(locationUuid, startDate, endDate, indicator, successCallback, failedCallback, startIndex, limit,
      startAge, endAge, gender) {
      var resource = getResource('location/:uuid/patient-by-indicator');

      var params = {
        endDate: endDate,
        indicator: indicator,
        startDate: startDate,
        uuid: locationUuid,
        startAge: startAge,
        endAge: endAge,
        gender: (gender || ['M', 'F']).toString()
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }


      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getPatientByIndicatorAndLocation(locationIds, startDate, endDate, indicator, successCallback,
      failedCallback, locationUuids, startIndex, limit, startAge, endAge, gender) {
      var resource = getResource('patient-by-indicator');
      var params = {
        endDate: endDate,
        indicator: indicator,
        startDate: startDate,
        locationIds: locationIds,
        locationUuids: locationUuids,
        startAge: startAge,
        endAge: endAge,
        gender: (gender || ['M', 'F']).toString()
      };
      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
        });
    }

    function getPatientListReportByIndicatorAndLocation(locationIds, startDate, endDate, reportName, indicator,
      successCallback, failedCallback, locationUuids, startIndex, limit) {
      var resource = getResource('patient-list-by-indicator');
      var params = {
        endDate: endDate,
        reportName: reportName,
        indicator: indicator,
        startDate: startDate,
        locationIds: locationIds,
        locationUuids: locationUuids
      };
      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
        });

    }



    function getHivSummaryFlatTable(startDate, endDate, locationUuids, successCallback, failedCallback) {
      var resource = getResource('hiv-summary-data');
      var params = {
        startDate: startDate,
        endDate: endDate,
        locationUuids: locationUuids
      };
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }


    function getHivSummaryIndicators(startDate, endDate, report, countBy, successCallback, failedCallback,
      groupBy, locationUuids, orderBy, indicators, startIndex, limit, startAge, endAge, gender) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        endDate: endDate,
        report: report,
        countBy: countBy,
        startDate: startDate,
        groupBy: groupBy,
        locationUuids: locationUuids,
        indicators: indicators,
        order: orderBy,
        startAge: startAge,
        endAge: endAge,
        gender: (gender || ['M', 'F']).toString()

      };


      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getIndicatorsSchema(report, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('indicators-schema');

      var params = {
        report: report
      };
      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }


      if (limit !== undefined) {
        params.limit = limit;
      }
      console.log(params);
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getIndicatorsSchemaWithSections(report, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('indicators-schema-with-sections');

      var params = {
        report: report
      };
      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }
      console.log(params);
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }



    function getDataEntryStatistics(subType, startDate, endDate, locationUuids,
      encounterTypeUuids, formUuids, providerUuid, creatorUuid, groupBy, successCallback, failedCallback) {
      var resource = getResource('data-entry-statistics/:subType');


      var params = getDataEntryStatisticsQueryParam(subType, startDate, endDate, locationUuids, encounterTypeUuids,
        formUuids, providerUuid, creatorUuid, groupBy);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }


    function getDataEntryStatisticsTypes() {
      return [{
        id: 'view1',
        subType: 'by-date-by-encounter-type'
      }, {
          id: 'view2',
          subType: 'by-month-by-encounter-type'
        }, {
          id: 'view3',
          subType: 'by-provider-by-encounter-type'
        }, {
          id: 'view4',
          subType: 'by-creator-by-encounter-type'
        }];
    }

    function getDataEntryStatisticsQueryParam(subType, startDate, endDate, locationUuids, encounterTypeUuids, formUuids, providerUuid, creatorUuid, groupBy) {
      var param = {
        subType: subType, //mandatory params
        startDate: startDate,
        endDate: endDate,
        groupBy: groupBy
      };

      var paramConfig = {};

      var getParamConfigObj = function (arrayProperties) {
        var obj = {};
        for (var i = 0; i < arrayProperties.length; i++) {
          obj[arrayProperties[i]] = 'prop';
        }
        return obj;
      };

      switch (subType) {
        case 'by-date-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids', 'formUuids', 'providerUuid']);
          break;
        case 'by-month-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids', 'formUuids', 'providerUuid']);
          break;
        case 'by-provider-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids', 'formUuids', 'providerUuid']);
          break;
        case 'by-creator-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids', 'formUuids', 'creatorUuid']);
          break;
        case 'patientList':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids', 'formUuids', 'providerUuid', 'creatorUuid']);
          break;
      }

      //set-up the param object
      if (locationUuids && paramConfig.locationUuids) {
        param.locationUuids = locationUuids;
      }
      if (encounterTypeUuids && paramConfig.encounterTypeUuids) {
        param.encounterTypeUuids = encounterTypeUuids;
      }
      if (formUuids && paramConfig.formUuids) {
        param.formUuids = formUuids;
      }
      if (providerUuid && paramConfig.providerUuid) {
        param.providerUuid = providerUuid;
      }
      if (creatorUuid && paramConfig.creatorUuid) {
        param.creatorUuid = creatorUuid;
      }

      return param;
    }

    function getPatientsCreatedByPeriod(startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('patient/creation/statistics');

      var params = {
        startDate: startDate,
        endDate: endDate
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getDetailsOfPatientsCreatedInLocation(location, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:location/patient/creation/statistics');
      var params = {
        location: location,
        startDate: startDate,
        endDate: endDate
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }


    function getMoh731Report(report, startDate, endDate, locations, countBy, successCallback, failedCallback, groupBy, startIndex, limit) {
      var resource = getResource('get-report-by-report-name');
      groupBy = groupBy + ',groupByPerson';
      var params = {
        startDate: startDate,
        endDate: endDate,
        locationUuids: locations,
        countBy: countBy,
        report: report,
        groupBy: groupBy
      };

      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getPatientLevelReminders(referenceDate, patientUuid, report, indicators, successCallback, failedCallback,
      startIndex, limit) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        report: report,
        patientUuid: patientUuid,
        referenceDate: referenceDate,
        indicators: indicators
      };


      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }

    function getHivOverviewVisualizationReport(startDate, endDate, report, groupBy, locationUuids, orderBy,
      indicators, successCallback, failedCallback, startIndex, limit,
      startAge, endAge, gender) {
      var resource = getResource('get-report-by-report-name');

      var params = {
        endDate: endDate,
        report: report,
        startDate: startDate,
        groupBy: groupBy,
        locationUuids: locationUuids,
        indicators: indicators,
        order: orderBy,
        startAge: startAge,
        endAge: endAge,
        gender: (gender || ['M', 'F']).toString()
      };


      if (startIndex !== undefined) {
        params.startIndex = startIndex;
      }

      if (limit !== undefined) {
        params.limit = limit;
      }

      console.log(params);
      console.log(startIndex);

      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });

    }
    function synchronizeEIDPatientLabResults(startDate,endDate,patientUuId,successCallback,failedCallback){
      var resource = getResource('patient-lab-orders',false);
      var params={
        startDate:startDate,
        endDate:endDate,
        patientUuId:patientUuId
      }
      return resource.get(params).$promise
      .then(function(response){
        successCallback(response);
      })
      .catch(function(error){
        failedCallback(error);
      });
      }
      function getPatientFlowData(locationUuids, visitDate, successCallback, failedCallback) {
      var resource = getResource('patient-flow-data');

      var params = {
        locationUuids: locationUuids,
        dateStarted: visitDate
      };

      if (typeof successCallback === 'function') {
        return resource.get(params).$promise.then(function (response) {
          successCallback(response);
        }, function (error) {
          if (typeof failedCallback === 'function') {
            failedCallback('Error processing request', error);
          }
          console.error(error);
        });
      } else {
        return resource.get(params).$promise.then(function (response) {
          return response;
        }, function (response) {
          // Something went crazy
          return $q.reject(response);
        });
      }
    }

    function postOrderToEid(labLocation, eidOrder, successCallback, errorCallback) {
      var resource = getResource('eid/order/:labLocation');

      var payload = JSON.stringify(eidOrder);

      return resource.save({ labLocation: labLocation }, payload).$promise
        .then(function (data) {
          console.log('Order posted successfully to EID: ', data);
          if (typeof successCallback === 'function')
            successCallback(data);
        })
        .catch(function (error) {
          console.log('Error posting order to EID: ', error);
          if (typeof errorCallback === 'function')
            errorCallback(error);
        });
    }

    function invalidateUserSession( successCallback, failedCallback) {
      var resource = getResource('session/invalidate',false);
      return resource.get().$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

  }
})();
