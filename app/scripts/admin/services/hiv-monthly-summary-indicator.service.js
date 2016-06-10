/*jshint -W003, -W117, -W098, -W026 */
(function() {
  'use strict';

  angular
    .module('app.admin')
    .factory('HivMonthlySummaryIndicatorService', HivMonthlySummaryIndicatorService);
  HivMonthlySummaryIndicatorService.$inject = [];
  function HivMonthlySummaryIndicatorService() {
    var selectedLocation = {selected:undefined};
    var indicatorDetails;
    var serviceDefinition;
    var selectedIndicatorTags;
    var locationSelectionEnabled = true;
    var startDate = new Date();
    var endDate = new Date();
    var indicatorTags;
    var indicators;
    var defaultIndicators;
    var selectedPosition;
    var selectedMonth;
    var reportFilters={
      startAge:0,
      endAge:120,
      gender:['M','F']
    };
    serviceDefinition = {
      getSelectedLocation: getSelectedLocation,
      setSelectedLocation: setSelectedLocation,
      resetSelectedLocation: resetSelectedLocation,
      setLocationSelectionEnabled: setLocationSelectionEnabled,
      getLocationSelectionEnabled: getLocationSelectionEnabled,
      getStartDate: getStartDate,
      setStartDate: setStartDate,
      getEndDate: getEndDate,
      setEndDate: setEndDate,
      getIndicatorDetails: getIndicatorDetails,
      setIndicatorDetails: setIndicatorDetails,
      getSelectedIndicatorTags:getSelectedIndicatorTags,
      setSelectedIndicatorTags:setSelectedIndicatorTags,
      getIndicatorTags:getIndicatorTags,
      setIndicatorTags:setIndicatorTags,
      getIndicators:getIndicators,
      setIndicators:setIndicators,
      getDefaultIndicators:getDefaultIndicators,
      setDefaultIndicators:setDefaultIndicators,
      getSelectedPosition:getSelectedPosition,
      setSelectedPosition:setSelectedPosition,
      getSelectedMonth:getSelectedMonth,
      setSelectedMonth:setSelectedMonth,
      getReportFilters:getReportFilters,
      setReportFilters:setReportFilters
    };
    return serviceDefinition;
    function getSelectedLocation() {
      return selectedLocation;
    }

    function setSelectedLocation(location) {
      selectedLocation = location;
    }

    function setSelectedMonth(value) {
      selectedMonth = value;
    }
    function getSelectedMonth() {
      return selectedMonth;
    }

    function setSelectedPosition(value) {
      selectedPosition = value;
    }
    function getSelectedPosition() {
      return selectedPosition;
    }

    function getReportFilters(){
      return reportFilters;
    }

    function setReportFilters(value){
      reportFilters=value;
    }
    function getSelectedIndicatorTags() {
      return selectedIndicatorTags;
    }

    function setSelectedIndicatorTags(tags) {
      selectedIndicatorTags = tags;
    }

    function getIndicators() {
      return indicators;
    }

    function setIndicators(value) {
      indicators = value;
    }

    function getDefaultIndicators() {
      return defaultIndicators;
    }

    function setDefaultIndicators(value) {
      defaultIndicators = value;
    }

    function getIndicatorTags() {
      return indicatorTags;
    }

    function setIndicatorTags(tags) {
      indicatorTags = tags;
    }

    function getIndicatorDetails() {
      return indicatorDetails;
    }

    function setIndicatorDetails(value) {
      indicatorDetails = value;
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

    function getEndDate() {
      return endDate;
    }

    function setEndDate(date) {
      endDate = date;
    }

  }

})();

