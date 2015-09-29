(function() {
    'use strict';

    angular
        .module('app.formentry', [
            'formly',
            'formlyBootstrap',
            'app.openmrsRestServices',
            'ngMessages',
            'ui.bootstrap',
	          'ui.select',
            'angularMoment',
            'dialogs.main',
            'pascalprecht.translate',
            'dialogs.default-translations'
        ])


    .run(function(formlyConfig, formlyValidationMessages, formlyApiCheck) {

      // console.log(formlyApiCheck)

    // formlyConfig.disableWarnings = true;


    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

    formlyValidationMessages.addStringMessage('required', 'This field is required');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'max', 'The max value allowed is ', '', 'Too Big');
    formlyValidationMessages.addTemplateOptionValueMessage('min', 'min', 'The min value allowed is ', '', 'Too Small');

    formlyConfig.setType({
      name: 'customInput',
      extends: 'input',
      apiCheck: function(){
        templateOptions: formlyApiCheck.shape({
          foo: formlyApiCheck.string.optional
        })
      }
    });

    formlyConfig.setType({
      name: 'datepicker',
      extends: 'input',
      apiCheck: function(){
        templateOptions: formlyApiCheck.shape({
          foo: formlyApiCheck.string.optional
        })
      }
    });

    formlyConfig.setType({
      name: 'section',
      extends: 'input',
      apiCheck: function(){
        templateOptions: formlyApiCheck.shape({
          foo: formlyApiCheck.string.optional
        })
      }
    });

    formlyConfig.setWrapper({
      name: 'validation',
      types: ['input', 'customInput','datepicker', 'select', 'section', 'multiCheckbox', 'select-concept-answers'],
      templateUrl: 'error-messages.html'
    });

  })
  .config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');

		$translateProvider.translations('es',{
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
