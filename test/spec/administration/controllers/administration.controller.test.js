/* global chai */
/* global expect */
/* global it */
/* global angular */
/* global inject */
/* global beforeEach */
/* global describe */
(function() {
  'use strict';
  describe('Controller: AdministrationCtrl ', function(){
    var controller;
    var scope;

    beforeEach(function(){
      module('ngAmrsApp');
      module('app.administration');
      module('mock.data');
    });

    beforeEach(inject(function($controller, $rootScope){
      //Injecting required dependencies
      scope =   $rootScope.$new();
      controller =$controller('AdministrationCtrl', {
        $rootScope:scope,
        $scope:scope
      });
    }));

    it('AdministrationCtrl controller should be created successfully', function() {
      expect(controller).to.exist;
    });


  });
})();
