(function(){
  'use strict';
  
  angular
    .module('ngAmrsApp')
      .directive('patientEncounters', directive);
      
  function directive() {
    return {
      restrict: 'E',
      templateUrl: '../views/appDashboard/patient-encounters-template.html'
    }
  }
})();
