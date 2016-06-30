/*
jshint -W003, -W026
*/
(function() {
  'use strict';

  angular
    .module('app.patientdashboard')
    .directive('clinicalNotes', clinicalNotes);

  function clinicalNotes() {
    var directive = {
      restrict: "E",
      scope: {
        patientUuid: "@",
        notes: '=',
        isBusy: '='
      },
      controller: notesController,
      link: linkFn,
      templateUrl: "views/patient-dashboard/notes-pane.html",
    };

    return directive;
  }

  notesController.$inject = [
    '$scope',
    '$filter',
    '$log',
    'EtlRestService'
  ];

  function notesController($scope, $filter, $log, EtlRestService) {
    $scope.isBusy = true;
    $scope.hasNotes = $scope.hasError = false;
    $scope.fetchNotes = fetchNotes;
    $scope.getMoreNotes = getMoreNotes;
    $scope.disabled = false;
    $scope.fetching = false;
    $scope.allDataLoaded = false;
    $scope.notAvailableMessage = 'Not Available';
    var arvLine = {
      1: 'First',
      2: 'Second',
      3: 'Third',
      4: 'Fourth'
    };

    function getMoreNotes() {
      var startIndex = $scope.notes.length;
      var limit = $scope.notes.length + 10;
      $scope.fetching=true;
      $scope.disabled = true;
      EtlRestService.getClinicalNotes($scope.patientUuid, startIndex, limit).then(function(response) {
        var notes = response.notes;
        $scope.disabled = false;
        $scope.fetching=false;
        if (notes.length>0) {
            $scope.notes = $scope.notes.concat(format(notes));
        } else {
          $scope.allDataLoaded = true;
          $scope.fetching=false;
          $scope.disabled = true; // Disable further calls if there are no more items
        }

      }).catch(function(error) {
        $scope.hasError = true;
        $scope.isBusy = $scope.hasNotes = false;
        $log.error(error);
      });
    }

    function fetchNotes(patientUuid) {
      $scope.isBusy = true;
      EtlRestService.getClinicalNotes(patientUuid).then(function(response) {
        var notes = response.notes;
        if (notes.length>0) {
          $scope.notes = format(notes);
          $scope.isBusy = false;
          $scope.hasNotes = true;
        } else {
          $scope.hasError = true;
          $scope.isBusy = $scope.hasNotes = false;
        }
      }).catch(function(error) {
        $scope.hasError = true;
        $scope.isBusy = $scope.hasNotes = false;
        $log.error(error);
      });
    }

    function format(notes) {
      var notAvailableMessage = 'Not available';
      var dateFormart = 'dd-MM-yyyy'

      if (!Array.isArray(notes)) {
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
        if (!note.scheduled || note.scheduled === '') {
          note.scheduled = 'unscheduled';
        } else {
          note.scheduled = 'scheduled';
        }
        
        // Format providers
        _formatProviders(note.providers, ', ');
        
        // Format Viral load
        if (note.lastViralLoad.value === '' || note.lastViralLoad.value === null) {
          note.lastViralLoad = false;
        } else {
          // format date
          var d = note.lastViralLoad.date
          note.lastViralLoad.date = $filter('date')(d, dateFormart);
        }

        if (note.lastCD4Count.value === '' || note.lastCD4Count.value === null) {
          note.lastCD4Count = null;
        } else {
          // format date
          var d = note.lastCD4Count.date
          note.lastCD4Count.date = $filter('date')(d, dateFormart);
        }

        // Format ARV Regimen line
        if (note.artRegimen.curArvLine &&
          arvLine.hasOwnProperty(note.artRegimen.curArvLine)) {
          note.artRegimen.curArvLine = arvLine[note.artRegimen.curArvLine];
        } else {
          note.artRegimen.curArvLine = 'Not Specified';
        }
        
        if(note.artRegimen.curArvMeds === '' || note.artRegimen.curArvMeds === null) {
          note.artRegimen.curArvMeds = false;
        } else {
          note.artRegimen.curArvMeds =
            $filter('titlecase')(note.artRegimen.curArvMeds);
          note.artRegimen.startDate =
            $filter('date')(note.artRegimen.arvStartDate, dateFormart);
        }  

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
        if (note.vitals.systolicBp === '' || note.vitals.diastolicBp === '') {
          note.vitals.bp = '';
        } else {
          note.vitals.bp = note.vitals.systolicBp + '/' + note.vitals.diastolicBp;
        }
        _formatBlankOrNull(note.vitals, 'Not Available');
        
        // Group ccHpi and Assessemnt
        var grouped = _groupCCHPIAndAssessment(note.ccHpi, note.assessment);
        if(_.isEmpty(grouped)) {
          note.hasCcHpiAssessment = false;
        } else {
          // Formant blank values
          _.each(grouped, function(group) {
            _formatBlankOrNull(group, 'Not Provided');
          });
          note.hasCcHpiAssessment = true;
          note.ccHpiAssessment = grouped;
        }
      });
      return notes;
    }

    function _formatBlankOrNull(obj, text) {
      _.each(Object.keys(obj), function(key) {
        if (obj[key] === '' || obj[key] === null) {
          obj[key] = text;
        }
      });
    }
    
    function _formatProviders(providers, separator) {
      if(providers.length <= 1) return;
      
      // Add separator to every provider but the last
      for(var i=0; i < providers.length-1; i++) {
        providers[i].separator = separator;
      }
    }
    
    function _groupCCHPIAndAssessment(ccHpiArray, assessmentArray) {
        // Grouping CC/HPI and Assessemnt by encounter
        if(_.isEmpty(ccHpiArray) && _.isEmpty(assessmentArray)) {
          return [];
        }

        var ccHpiAssessment = [];
        if(!_.isEmpty(ccHpiArray)) {
          if(_.isEmpty(assessmentArray)) {
            _.each(ccHpiArray, function(ccHpi) {
              var o = {
                encounterType: ccHpi.encounterType,
                ccHpi: ccHpi.value,
                assessment: ''
              };
              ccHpiAssessment.push(o);
            });
          } else {
            // In case assessmentArray is not empty
            _.each(ccHpiArray, function(ccHpi) {
              var o = {
                encounterType: ccHpi.encounterType,
                ccHpi: ccHpi.value,
                assessment: ''
              };
              var ass = _.find(assessmentArray, function(assItem) {
                return ccHpi.encounterType === assItem.encounterType;
              });
              if(ass) {
                o.assessment = ass.value;
              }
              ccHpiAssessment.push(o);
            });
          } 
        } else {
          // ccHpiArray is empty we redo the code the same way.
          _.each(assessmentArray, function(ass) {
            var o = {
              encounterType: ass.encounterType,
              ccHpi: '',
              assessment: ass.value
            };
            ccHpiAssessment.push(o);
          });
        }
        return ccHpiAssessment;
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
