/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    var mod =
          angular
              .module('app.formentry');

    mod.run(function config(formlyConfig) {
  
    /*
    Testing nested sections in formly way
    */
    // set templates here
    formlyConfig.setType({
      name: 'section',
      template: '<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>'
    });

	formlyConfig.setWrapper({
      name: 'panel',
      types: ['section'],
      templateUrl: 'section.html'
    });
  /*****************************************************************/

  });
})();
