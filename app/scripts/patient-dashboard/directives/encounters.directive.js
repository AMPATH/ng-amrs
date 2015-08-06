(function(){
  'use strict';
  
  angular
    .module('app.patientdashboard')
      .directive('patientEncounters', directive);
      
  function directive() {
    return {
      restrict: 'E',
      templateUrl: 'views/patient-dashboard/patient-encounters-template.html'
    }
  }
})();
