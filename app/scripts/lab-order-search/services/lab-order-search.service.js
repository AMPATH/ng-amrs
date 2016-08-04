(function() {
'use strict';

  angular
  .module('app.labordersearch')
  .factory('LabOrderSearchService', LabOrderSearchService);

  LabOrderSearchService.$inject = [];

  function LabOrderSearchService() {

    var orderID = null;
    var orderData = null;
    var hivSummaryData = null;
    var isOrderSearch = false;
    
    return {
      getOrderData: getOrderData,
      setOrderData: setOrderData,
      setHivSummaryData: setHivSummaryData,
      getHivSummaryData: getHivSummaryData,
      setOrderID: setOrderID,
      getOrderID: getOrderID,
      setIsOrderSearch: setIsOrderSearch,
      getIsOrderSearch: getIsOrderSearch,
      reset: reset
    };

    function setOrderData(data) {
      orderData = data;
    }
    function getOrderData() {
      return orderData;
    }

    function setHivSummaryData(data) {
      hivSummaryData = data;
    }

    function getHivSummaryData() {
      return hivSummaryData;
    }

    function setOrderID(id) {
      orderID = id;
    }

    function getOrderID() {
      return orderID;
    }

    function setIsOrderSearch(isOrdSearch) {
      isOrderSearch = isOrdSearch;
    }

    function getIsOrderSearch() {
      return isOrderSearch;
    }

    function reset() {
      orderID = null;
      orderData = null;
      hivSummaryData = null;
    }
  }
})();
