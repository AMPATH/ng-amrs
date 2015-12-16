/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
    .module('app.clinicDashboard')
    .factory('ClinicDashboardService', ClinicDashboardService);
  ClinicDashboardService.$inject = ['$filter','moment'];
  function ClinicDashboardService($filter,moment) {
      var selectedLocation = {selected:undefined};
      var serviceDefinition;
      var locationSelectionEnabled = true;
      var startDate = new Date();
      var selectedMonth = new moment().startOf('month');;
      var month = new moment();
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
        return startDate;
      }

      function setStartDate(date) {
          startDate = date;
        }

      function setSelectedMonth(date) {
            selectedMonth = date;
          }

      function getSelectedMonth() {
          return selectedMonth.format('YYYY-MM-DD');
        }

      function getMonth() {
        return month;
      }

      function setMonth(newMonth) {
        month = newMonth;
      }
    }

})();
