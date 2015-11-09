/* global angular */
/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
  'use strict';

  angular
    .module('app.utils')
    .service('UtilService', UtilRestService);

  UtilRestService.$inject = [];

  function UtilRestService(scope, $q, $location, $state, dialogs) {
    var serviceDefinition;
    serviceDefinition = {
      disableBackSpaceOnNoneInputElements: disableBackSpaceOnNoneInputElements,
      confirmBrowserExit: confirmBrowserExit,
      isNullOrUndefined: isNullOrUndefined,
      hasAllMembersUndefinedOrNull: hasAllMembersUndefinedOrNull
    };

    return serviceDefinition;
    function disableBackSpaceOnNoneInputElements() {
      $(function () {
        /*
        * This prevents user from navigating to other pages using backspace key while on the app
        */
        var rx = /INPUT|SELECT|TEXTAREA/i;

        $(document).bind('keydown keypress', function (e) {
          if (e.which === 8) { // 8 == backspace
            if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
              e.preventDefault();
            }
          }
        });

      });

    }

    function confirmBrowserExit(callback) {
      //notifies user when he attempts to close the window using the browser close button
      window.addEventListener('beforeunload', function (e) {
        var confirmationMessage = 'Form changes not saved';
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage;                            //Webkit, Safari, Chrome
      });
    }

    function isNullOrUndefined(obj) {
      return angular.isUndefined(obj) || obj === null || 
      (typeof obj === 'string' && (obj.length ===0 || !obj.trim()));
    }

    function hasAllMembersUndefinedOrNull(obj, arrayOfMembersToCheck) {
      var hasA_nonNullMember = false;

      for (var i = 0; i < arrayOfMembersToCheck.length; i++) {
        if (!isNullOrUndefined(obj[arrayOfMembersToCheck[i]])) {
          hasA_nonNullMember = true;
          break;
        }
      }

      return !hasA_nonNullMember;
    }
  }
})();
