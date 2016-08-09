/*
 jshint -W003, -W098, -W117, -W109
 */
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
    .module('app.labordersearch')
    .controller('LabOrderSearchCtrl', LabOrderSearchCtrl);

    LabOrderSearchCtrl.$inject = ['$rootScope','$scope', 'OpenmrsRestService', 'EtlRestService', 'LabOrderSearchService', 'PatientModel', 'HivSummaryModel' , '$compile'];

    function LabOrderSearchCtrl($rootScope, $scope,  OpenmrsRestService, EtlRestService, LabOrderSearchService, PatientModel, HivSummaryModel, $compile) {

      $scope.fetchHivSummary = fetchHivSummary;
      $scope.searchLabOrders = searchLabOrders;
      $scope.submitForm = submitForm;
      $scope.showResult = showResult;
      $scope.onLoadStart = onLoadStart;
      $scope.onLoadComplete = onLoadComplete;
      $scope.reset = reset;
      $scope.isInitial = true;
      $scope.showSearchButton = true;
      $scope.showResetButton = false;
      $scope.isLoading = false;
      $scope.isFormInvalid = false;
      $scope.showNoResult = false;
      $scope.orderID = '';
      $scope.order = null;
      $scope.patient = {};
      $scope.hivSummary = {};

      //used to clear search after posting an order
      $scope.modalObject = {
        dismiss: function(txt) {
          $scope.reset();
        }
      };

      $scope.$watch('orderID', function(searchString) {

        if($scope.isInitial) {
          $scope.isInitial = false;
          if(LabOrderSearchService.getOrderID != null) {
            LabOrderSearchService.setIsOrderSearch(true);
            $scope.orderID = LabOrderSearchService.getOrderID();
            $scope.order = LabOrderSearchService.getOrderData();
            $scope.patient = new PatientModel.patient(LabOrderSearchService.getOrderData().patient);
            $scope.hivSummary = new HivSummaryModel.hivSummary(LabOrderSearchService.getHivSummaryData());
            $scope.showResult();
          }
        }
      });

      function submitForm() {

        if($scope.isLoading)
          return;

        if($scope.orderID && $scope.orderID.length > 0) {
          $scope.onLoadStart();
          $scope.searchLabOrders($scope.orderID, onLabOrdersLoadSuccess, onLabOrdersLoadFailure);
        } else
          $scope.isFormInvalid = true;
      };

      function searchLabOrders(orderID, successCallback, failureCallback) {

        var customOrderObjectDefinition = 'custom:(display,uuid,orderNumber,accessionNumber,orderReason,orderReasonNonCoded,urgency,action,commentToFulfiller,dateActivated,instructions,orderer:default,encounter:full,patient:(uuid,identifiers:(identifier,uuid,identifierType:(uuid,name)),person:(uuid,gender,birthdate,dead,age,deathDate,causeOfDeath,preferredName:(givenName,middleName,familyName),attributes,preferredAddress:(preferred,address1,address2,cityVillage,stateProvince,country,postalCode,countyDistrict,address3,address4,address5,address6))),concept:ref)';

        var OrderResService = OpenmrsRestService.getOrderResService();

        OrderResService.getOrderByUuid(orderID, successCallback, failureCallback, customOrderObjectDefinition);
      };

      function onLabOrdersLoadSuccess(data) {

        $scope.showNoResult = !(data && data.patient);
        if(data && data.patient) {

          LabOrderSearchService.setIsOrderSearch(true);
          LabOrderSearchService.setOrderID($scope.orderID);
          LabOrderSearchService.setOrderData(data);

          $scope.order = data;

          $scope.patient = new PatientModel.patient(data.patient);

          $rootScope.broadcastPatient = $scope.patient;

          var uuid = data.patient.person.uuid;
          $scope.fetchHivSummary(uuid);
        }
      }

      function onLabOrdersLoadFailure(error) {
        $scope.showNoResult = true;
        $scope.onLoadComplete();
      }

      function fetchHivSummary(patientUuid) {
          $scope.hivSummary = {};
          EtlRestService.getHivSummary(patientUuid, undefined, undefined, onFetchHivSummarySuccess, onFetchHivSummaryFailed, true);
      }

      function onFetchHivSummarySuccess(hivData) {
          if(hivData.result[0])
              $scope.hivSummary = new HivSummaryModel.hivSummary(hivData.result[0]);

          LabOrderSearchService.setHivSummaryData(hivData);
          $scope.onLoadComplete();
          $scope.showResult();
      };

      function onFetchHivSummaryFailed(error) {
          $scope.hivSummary = {};
          $scope.onLoadComplete();
          $scope.showResult();
      };

      function showResult() {

        var el = $compile( '<post-lab-order patient="patient" hiv-summary="hivSummary" order="order" modal-object="modalObject" isOrderSearch="isOrderSearch"></post-lab-order>' )( $scope );
        angular.element( document.querySelector( '.search-result' )).append(el);
      };

      function reset() {
        $scope.showSearchButton = true;
        $scope.showResetButton = false;
        $scope.isLoading = false;
        $scope.isFormInvalid = false;
        $scope.orderID = '';
        $scope.showNoResult = false;
        LabOrderSearchService.reset();
        //clear search result area
        angular.element( document.querySelector( '.search-result' )).empty();
      };

      function onLoadStart() {
        $scope.isLoading = true;
        $scope.showSearchButton = false;
        $scope.showResetButton = false;
        $scope.isFormInvalid = false;
        angular.element( document.querySelector( '.search-result' )).empty();
        $scope.showNoResult = false;
      };

      function onLoadComplete() {
        $scope.isLoading = false;
        $scope.showSearchButton = true;
        $scope.showResetButton = true;
      };
    }
})();
