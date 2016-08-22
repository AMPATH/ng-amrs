/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .factory('PatientRequiringViralLoadService', PatientRequiringViralLoadService);
  PatientRequiringViralLoadService.$inject = [];
  function PatientRequiringViralLoadService() {
    var selectedLocation = {locations:[]};
    var serviceDefinition;
    var startDate =new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    var endDate =new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) - 1;
    serviceDefinition = {
      getSelectedLocations: getSelectedLocations,
      setSelectedLocations: setSelectedLocations,
      getStartDate: getStartDate,
      setStartDate: setStartDate,
      getEndDate: getEndDate,
      setEndDate: setEndDate
    };
    return serviceDefinition;
    function getSelectedLocations() {
      return selectedLocation;
    }

    function setSelectedLocations(location) {
      selectedLocation = location;
    }

    function getStartDate() {
      return startDate;
    }

    function setStartDate(date) {
      startDate = date;
    }

    function getEndDate() {
      return endDate;
    }

    function setEndDate(date) {
      endDate = date;
    }

  }

})();

