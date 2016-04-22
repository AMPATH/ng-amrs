/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('clinicalNotes', clinicalNotes);

    function clinicalNotes() {
        var directive = {
            restrict: "E",
            scope: { patientUuid: "@" },
            controller: notesController,
            link:linkFn,
            templateUrl: "views/patient-dashboard/notes-pane.html",
        };

        return directive;
    }
    
    notesController.$inject = [
      '$scope',
      'NotesGeneratorService',
      '$filter',
      '$log'
    ];
    
    function notesController($scope, NotesGenSvc, $filter, $log) {
      $scope.isBusy = true;
      $scope.hasNotes = $scope.hasError = false;
      $scope.fetchNotes = fetchNotes;
      // Pull notes for the current patient
      fetchNotes($scope.patientUuid);
      console.log('Filtered', $filter('date')('hii hapa'))
      var arvLine = { 1:'First', 2: 'Second', 3: 'Third', 4: 'Fourth'};
      
      function fetchNotes(patientUuid) {
        try {
          // fetch
          $scope.isBusy = true;
          NotesGenSvc.generateNotes(patientUuid, function(notes) {
            $log.debug('Fetched notes: ', _gUtil_.prettyPrint(notes));
            if(!notes || (notes && _.isEmpty(notes))) {
              $scope.hasNotes = false;
            } {
              $scope.notes = format(notes);
              $scope.isBusy = false;
              $scope.hasNotes = true;
            }
          }, 0, 100); 
        } catch(error) {
          $scope.hasError = true;
          $scope.isBusy = $scope.hasNotes = false;
          $log.error(error);
        }
      }
      
      function format(notes) {
        var notAvailableMessage = 'Not available';
        var dateFormart = 'dd-MM-yyyy'
        
        if(!Array.isArray(notes)) { 
          //Single note convert
          var temp = [notes];
        } else {
          // should be an array of notes
          var temp = notes;
        }
        _.each(temp, function(note) {
          // Format date
          note.visitDate = $filter('date')(note.visitDate, dateFormart);
          
          // Format scheduled
          if(!note.scheduled || note.scheduled==='') {
            note.scheduled = 'unscheduled';
          } else {
            note.scheduled = 'scheduled';
          }
          
          // Format Viral load
          if(note.lastViralLoad.value==='') {
            note.lastViralLoad.value = notAvailableMessage;
          } else {
            // format date
            var d = note.lastViralLoad.date
            note.lastViralLoad.date = $filter('date')(d, dateFormart);
          }
          
          if(note.lastCD4Count.value==='') {
            note.lastCD4Count.value = notAvailableMessage;
          } else {
            // format date
            var d = note.lastCD4Count.date
            note.lastCD4Count.date = $filter('date')(d, dateFormart);
          }
          
          // Format ARV Regimen line
          if(note.artRegimen.curArvLine && 
              arvLine.hasOwnProperty(note.artRegimen.curArvLine)) {
            note.artRegimen.curArvLine = arvLine[note.artRegimen.curArvLine];
          } else {
            note.artRegimen.curArvLine = 'Not Specified';
          }
          
          note.artRegimen.curArvMeds = 
                            $filter('titlecase')(note.artRegimen.curArvMeds);
          note.artRegimen.startDate = 
                      $filter('date')(note.artRegimen.arvStartDate, dateFormart);
                            
          // Format prophylaxis
          note.tbProphylaxisPlan.plan = 
                            $filter('titlecase')(note.tbProphylaxisPlan.plan);
          note.tbProphylaxisPlan.startDate = 
                $filter('date')(note.tbProphylaxisPlan.startDate, dateFormart);
          note.tbProphylaxisPlan.estimatedEndDate = 
                $filter('date')(note.tbProphylaxisPlan.estimatedEndDate, dateFormart);
          
          
          // format rtc date
          note.rtcDate = $filter('date')(note.rtcDate, dateFormart);
          
          //format vitals
          if(note.vitals.systolicBp ==='' || note.vitals.diastolicBp ===''){
            note.vitals.bp = '';
          } else {
            note.vitals.bp = note.vitals.systolicBp + '/' + note.vitals.diastolicBp;
          }
          _formatBlank(note.vitals, 'Not Available');
        });
        return notes;
      }
      
      function _formatBlank(obj, text) {
        _.each(Object.keys(obj), function(key) {
          if(obj[key]=== '') {
            obj[key] = text;
          }
        });
      }
    }

    function linkFn(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);

        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.fetchNotes(newVal);
            }
        }
    }
})();
