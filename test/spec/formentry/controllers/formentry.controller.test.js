/*
jshint -W098, -W117, -W030
*/
(function() {
    'use strict';
    describe('Controller: FormentryCtrl', function(){
      var controller;
      var scope;
      var encService;

      beforeEach(function(){module('app.formentry');});

      beforeEach(inject(function($controller, $injector, $rootScope){
        scope = $rootScope.$new();
        controller =$controller('tabCtrl', {$scope:scope});
      }));
      it('should test if tabs test working', function(){
        expect('testing tabs ctr').to.equal('testing tabs ctr');
      });

      it('should test if vm exists', function(){
        expect(scope.vm).to.exist;
        expect(scope.vm).to.be.an('object');
      });

      it('vm.model should exist an object', function(){
        expect(scope.vm.model).to.exist;
        expect(scope.vm.model).to.be.an('object');
      });

      it('vm.tabs should exist as an array object', function(){
        expect(scope.vm.tabs).to.exist;
        expect(scope.vm.tabs).to.be.an('array');
      });

      it('Patient Should exist and be a property of the scope', function(){
        expect(scope).to.have.property(patient);
      });

      it('Should get the form schema with encounter and obs property', function(){

      });


    });

})();
