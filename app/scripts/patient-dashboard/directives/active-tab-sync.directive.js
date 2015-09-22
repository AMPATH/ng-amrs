(function () {
	'use strict';

	angular
		.module('app.patientdashboard')
		.directive('activeTabSync', directive);

	function directive() {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.activeListId = 1;
				scope.activeList = function(elem, ind){
					scope.activeListId = ind;
				}
			}
			
		}
	}
})();