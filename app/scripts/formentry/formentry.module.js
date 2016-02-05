/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('app.formentry', [
            'formlyBootstrap',
            'app.openmrsRestServices',
            'ngMessages',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
	        'ui.select',
            'ui.router',
            'angularMoment',
            'dialogs.main',
            'pascalprecht.translate',
            'dialogs.default-translations',
            'darthwade.dwLoading',
            'app.utils',
            'sticky',
            'openmrs.angularFormentry'
        ])
    .config(function($stateProvider) {
      $stateProvider
          .state('forms', {
            url: '/form/:formuuid/patient/:uuid',
            templateUrl: 'views/formentry/formentry.html',
            controller: 'FormentryCtrl',
            data: { requireLogin: true }
          })
        .state('visit', {
          url: '/form/:formuuid/patient/:uuid/visit/:visitUuid',
          templateUrl: 'views/formentry/formentry.html',
          controller: 'FormentryCtrl',
          data: { requireLogin: true }
        })
        .state('tabs', {
          url: '/form/tabs',
          templateUrl: 'views/formentry/tab.html',
          controller: 'tabCtrl',
          data: { requireLogin: true }
        });
    })
    .run(['FormentryConfig','OpenmrsSettings', function(FormentryConfig, OpenmrsSettings){
        FormentryConfig.setOpenmrsBaseUrl(OpenmrsSettings.getCurrentRestUrlBase());
    }])
  .config(['dialogsProvider','$translateProvider', function(dialogsProvider,$translateProvider) {
    dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');

		$translateProvider.translations('es', {
      DIALOGS_ERROR: 'Error',
			DIALOGS_ERROR_MSG: 'Se ha producido un error desconocido.',
			DIALOGS_CLOSE: 'Cerca',
			DIALOGS_PLEASE_WAIT: 'Espere por favor',
			DIALOGS_PLEASE_WAIT_ELIPS:'Espere por favor...',
			DIALOGS_PLEASE_WAIT_MSG: 'Esperando en la operacion para completar.',
			DIALOGS_PERCENT_COMPLETE: '% Completado',
			DIALOGS_NOTIFICATION: 'Notificacion',
			DIALOGS_NOTIFICATION_MSG: 'Notificacion de aplicacion Desconocido.',
			DIALOGS_CONFIRMATION: 'Confirmacion',
			DIALOGS_CONFIRMATION_MSG: 'Se requiere confirmacion',
			DIALOGS_OK: 'Bueno',
			DIALOGS_YES: 'Si',
			DIALOGS_NO: 'No'
		});

		$translateProvider.preferredLanguage('en-US');
	}]);

})();
