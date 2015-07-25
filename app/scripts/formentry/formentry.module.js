(function() {
    'use strict';

    angular
        .module('app.formentry', [
            'formly',
            'formlyBootstrap',
            'app.openmrsRestServices',
            'ngMessages',
            'ui.bootstrap'
        ])

    .run(function(formlyConfig, formlyValidationMessages, formlyApiCheck) {
    formlyConfig.setWrapper({
      name: 'validation',
      types: ['input', 'customInput'],
      templateUrl: 'my-messages.html'
    });

    formlyValidationMessages.addStringMessage('required', 'This field is required');

    formlyConfig.setType({
      name: 'customInput',
      extends: 'input',
      apiCheck: {
        templateOptions: formlyApiCheck.shape({
          foo: formlyApiCheck.string.optional
        })
      }
    });
  });

})();
