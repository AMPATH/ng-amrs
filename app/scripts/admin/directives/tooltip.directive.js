/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.admin')
        .directive('tooltip', directive);

    function directive() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs){
          $(element).hover(function(){
            // on mouseenter
            $(element).tooltip('show');
          }, function(){
            // on mouseleave
            $(element).tooltip('hide');
          });
        }
      };
    }
})();
