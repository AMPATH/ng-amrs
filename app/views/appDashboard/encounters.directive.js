(function(){
  'use strict';
  
  angular
    .module('ngAmrsApp')
      .directive('patientEncounters', directive);
      
  function directive() {
    return {
      restrict: 'E',
      templateUrl: '_patient-encounters-template.html'
    }
  }
})();
