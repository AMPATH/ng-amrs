/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .factory('ClinicDashboardService', ClinicDashboardService);
  ClinicDashboardService.$inject = [];
  function ClinicDashboardService() {
      var selectedLocation = {selected:undefined};
      var serviceDefinition;
      var locationSelectionEnabled = true;
      var startDate = new Date();
      var selectedMonth = new Date();
      var month;
      serviceDefinition = {
          getSelectedLocation: getSelectedLocation,
          setSelectedLocation: setSelectedLocation,
          resetSelectedLocation: resetSelectedLocation,
          setLocationSelectionEnabled: setLocationSelectionEnabled,
          getLocationSelectionEnabled: getLocationSelectionEnabled,
          getStartDate: getStartDate,
          setStartDate: setStartDate,
          setSelectedMonth: setSelectedMonth,
          getSelectedMonth: getSelectedMonth,
          getMonth:getMonth,
          setMonth:setMonth,
        };
      return serviceDefinition;
      function getSelectedLocation() {
        return selectedLocation;
      }

      function setSelectedLocation(location) {
        selectedLocation = location;
      }

      function resetSelectedLocation() {
        selectedLocation = {selected:undefined};
      }

      function setLocationSelectionEnabled(enabled) {
        locationSelectionEnabled = enabled;
      }

      function getLocationSelectionEnabled() {
        return locationSelectionEnabled;
      }

      function getStartDate() {
        console.log('Fettching Start date======>' + startDate);
        return startDate;
      }

      function setStartDate(date) {
          console.log('Start date======>' + date);
          startDate = date;
        }

      function setSelectedMonth(date) {
            selectedMonth = date;
          }

      function getSelectedMonth() {
          return selectedMonth;
        }

      function getMonth() {
        return month;
      }

      function setMonth(newMonth) {
        month = newMonth;
      }
    }

})();
