/* global angular, PDFDocument,drawBarcode,convertToPath,blobStream*/
/*
jshint -W003, -W026
*/
(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('printLabels', vitals);

  function vitals() {
    return {
      restict: 'E',
      scope: {
        patientUuid: '@'
      },
      controller: printLabelsController,
      link: printLabelsLink,
      templateUrl: 'views/patient-dashboard/print-labels-pane.html'
    };
  }

  printLabelsController.$inject = ['$scope', 'IdentifierResService',
    'OpenmrsRestService', '$rootScope', '$filter'
  ];

  function printLabelsController($scope, IdentifierResService, OpenmrsRestService,
    $rootScope, $filter) {
    $scope.loadIdentifers = loadIdentifers;
    $scope.labOrders = [];
    $scope.patientIdentifer = '';
    $scope.valuationDate = new Date();
    $scope.valuationDatePickerIsOpen = false;
    $scope.opens = [];
    $scope.copies = 2;
    $scope.patient = $rootScope.broadcastPatient;
    $scope.patientIdentifer = $scope.patient.commonIdentifiers().ampathMrsUId

    $scope.$watch(function() {
      return $scope.valuationDatePickerIsOpen;
    }, function(value) {
      $scope.opens.push('valuationDatePickerIsOpen: ' + value + ' at: ' + new Date());
    });

    $scope.valuationDatePickerOpen = function($event) {

      if ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // This is the magic
      }
      this.valuationDatePickerIsOpen = true;
    };
    $scope.selectAll = function() {
      // Loop through all the entities and set their isChecked property
      for (var i = 0; i < $scope.labOrders.length; i++) {
        $scope.labOrders[i].isChecked = $scope.allItemsSelected;
      }
    };
    $scope.selectEntity = function() {
      // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
      for (var i = 0; i < $scope.labOrders.length; i++) {
        if (!$scope.labOrders[i].isChecked) {
          $scope.allItemsSelected = false;
          return;
        }
      }

      //If not the check the "allItemsSelected" checkbox
      $scope.allItemsSelected = true;
    };
    $scope.printMultipleLabels = function() {
      var labels = [];
      for (var i = 0; i < $scope.labOrders.length; i++) {
        var order = $scope.labOrders[i];
        if (order.isChecked) {
          for (var c = 0; c < $scope.copies; c++) {
            labels.push({
              orderDate: $filter('date')(order.dateActivated, 'dd/MM/yyyy'),
              testName: order.display,
              identifier: $scope.patientIdentifer,
              orderNumber: order.orderNumber
            });
          }
        }
      }
      generateBarcodes(labels);
    };
    $scope.printLabel = function(order) {
      var labels = [];
      for (var c = 0; c < $scope.copies; c++) {
        var label = {
          orderDate: $filter('date')(order.dateActivated, 'dd/MM/yyyy'),
          testName: order.display,
          identifier: $scope.patientIdentifer,
          orderNumber: order.orderNumber
        };
        labels.push(label);
      }
      generateBarcodes(labels);
    };

    function getAlternativeIdentifer(identifiers) {
      if ($scope.patient.commonIdentifiers().ampathMrsUId === undefined) {
        $scope.patientIdentifer = identifiers[0].identifier;
      }
    }

    function generateBarcodes(labels) {
      var doc = new PDFDocument({
        size: [162, 92]
      });
      labels.forEach(function(label, i) {
        if (i > 0) {
          doc.addPage();
        }
        var barcodeString = drawBarcode('svg', label.orderNumber, {
          height: 20,
          maxWidth: 160
        });
        var svgPath = convertToPath(barcodeString);

        doc = drawText(doc, 'Date Ordered : ' + label.orderDate, {
          x: 2,
          y: 2
        });
        doc = drawText(doc, 'Test : ' + label.testName, {
          x: 2,
          y: 15
        });
        doc = drawText(doc, 'Patient ID : ' + label.identifier, {
          x: 2,
          y: 30
        });
        doc = drawText(doc, 'Order Number : ' + label.orderNumber, {
          x: 2,
          y: 45
        });
        doc.save();
        doc.translate(0, 60)
          .path(svgPath.path)
          .fill('#000000')
          .restore();
      });

      doc.end();
      var stream = doc.pipe(blobStream());
      stream.on('finish', function() {

        //var blob = stream.toBlob('application/pdf');
        var url = stream.toBlobURL('application/pdf');
        window.open(url);
        // iframe.src = stream.toBlobURL('application/pdf');
      });
    }

    function activate() {
      fetchAllLabOrders($scope.patientUuid);
    }

    function fetchAllLabOrders(patientUuid) {
      $scope.isBusy = true;
      $scope.experiencedLoadingError = false;
      OpenmrsRestService.getOrderResService().getOrdersByPatientUuid(patientUuid,
        onFetchOrdesSuccess, onFetchOrdesFailed, true
      );
    }

    function measureHeight(text, fontSize, min, width) {
      var temp = new PDFDocument();
      temp.fontSize(fontSize);
      temp.x = 0;
      temp.y = 0;
      temp.text(text, {
        width: width
      });

      return temp.y;
    }

    function fittedSize(text, fontSize, min, step, bounds) {
      if (fontSize <= min) {
        return min;
      }

      var height = measureHeight(text, fontSize, min, bounds.width);

      if (height <= bounds.height) {
        return fontSize;
      }

      return fittedSize(text, fontSize - step, min, step, bounds);
    }

    function drawText(doc, text, options) {
      var bounds = {
        width: 158,
        height: 12
      };
      var bestSize = fittedSize(text, 14, 8, 0.25, bounds);
      doc.fontSize(bestSize);

      doc.text(text, options.x, options.y, {
        width: bounds.width,
        height: bounds.height,
        ellipsis: false
      });
      return doc;
    }

    activate();

    function loadIdentifers() {
      if ($scope.isBusy === true) {
        return;
      }

      $scope.isBusy = true;
      $scope.experiencedLoadingError = false;

      if ($scope.patientUuid && $scope.patientUuid !== '') {
        IdentifierResService.getPatientIdentifiers($scope.patientUuid,
          onFetchIdentifersSuccess, onFetchIdentifersFailed);
      }
    }

    function onFetchIdentifersSuccess(identifiers) {
      $scope.identifiers = identifiers.results;
      getAlternativeIdentifer(identifiers.results);

    }

    function onFetchOrdesSuccess(result) {
      $scope.isBusy = false;
      $scope.labOrders = result.results || [];
    }

    function onFetchOrdesFailed(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingError = true;
      $scope.labOrders = [];
    }

    function onFetchIdentifersFailed() {
      $scope.experiencedLoadingError = true;
      $scope.isBusy = false;
    }
  }

  function printLabelsLink(scope, element, attrs, $scope) {
    attrs.$observe('patientUuid', onPatientUuidChanged);

    function onPatientUuidChanged(newVal, oldVal) {
      if (newVal && newVal != "") {
        scope.isBusy = false;
        scope.loadIdentifers();
      }
    }
  }

})();
