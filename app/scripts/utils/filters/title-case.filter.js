/*jshint -W098, -W030 */
(function() {
  'use strict';
  
  angular
    .module('app.utils')
      .filter('titlecase', titleCaseFilter);
      
  function titleCaseFilter() {
    return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
  } 
})();
