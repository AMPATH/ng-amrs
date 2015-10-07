/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.etlRestServices')
    .service('EtlRestService', EtlRestService);

  EtlRestService.$inject = ['EtlRestServicesSettings', '$resource'];

  function EtlRestService(EtlRestServicesSettings, $resource) {
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
      getDailyVisits: getDailyVisits
    };
    return serviceDefinition;

    function getResource(path) {
      return $resource(EtlRestServicesSettings.getCurrentRestUrlBase().trim() + path,
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getHivSummary(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/hiv-summary');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }

      var params = { startIndex: startIndex, uuid: patientUuid, limit: limit };
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getVitals(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/vitals');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }

      var params = { startIndex: startIndex, uuid: patientUuid, limit: limit };
      return resource.get(params).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getPatientTests(patientUuid, startIndex, limit, successCallback, failedCallback) {
      var resource = getResource('patient/:uuid/data');
      if (!startIndex) {
        startIndex = 0;
      }

      if (!limit) {
        limit = 20;
      }

      var params = { startIndex: startIndex, uuid: patientUuid, limit: limit };
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
      var resource = getResource('location/:uuid/appointment-schedule');

      var params = { endDate: endDate, startDate: startDate, uuid: locationUuid };

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

    function getDailyVisits(locationUuid, startDate, endDate, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/daily-visits');

      var params = { endDate: endDate, startDate: startDate, uuid: locationUuid };

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

      var params = { startDate: monthDate, uuid: locationUuid };

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

    function getDefaultersList(locationUuid, numberOfDaysDefaulted, successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/defaulter-list');

      var params = { defaulterPeriod: numberOfDaysDefaulted, uuid: locationUuid };

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

    function getMonthlyAppointmentAndVisits(locationUuid, monthDate,
      successCallback, failedCallback, startIndex, limit) {
      var resource = getResource('location/:uuid/monthly-appointment-visits');

      var params = { startDate: monthDate, uuid: locationUuid };

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
  }
})();
