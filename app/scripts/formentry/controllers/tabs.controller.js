/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('tabCtrl', tabCtrl);

    tabCtrl.$inject = ['$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'EncounterResService', '$timeout', 'FormsMetaData'];

    function tabCtrl($translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, EncounterResService, $timeout, FormsMetaData) {
        $scope.vm = {};
        $scope.vm.model = {};
        $scope.vm.patient = $rootScope.broadcastPatient;
        var formSchema;
        $scope.vm.formlyFields;
        $timeout(function () {
         FormentryService.getFormSchema('form', function(schema){
          formSchema = schema;
          console.log('New Form Schema');
          console.log(formSchema);

          //$scope.vm.userFields = $scope.vm.formlyFields;
          if (Object.keys(formSchema).length>0)
          {
            FormentryService.createForm(formSchema, function(formlySchema){
              $scope.vm.formlyFields = formlySchema;
              // var test = [];
              // test.push(formlySchema);
              // console.log('Fields in the controller');
              // console.log($scope.vm.formlyFields);
              // $scope.vm.tabs =[
              //   {
              //     title: 'Page 1',
              //     active: true,
              //     form:{
              //       options:{},
              //       fields:test
              //     }
              //   }
              // ];
              $scope.vm.tabs = $scope.vm.formlyFields;
              angular.forEach($scope.vm.tabs, function(tab){
                tab.form['model']=$scope.vm.model;
              })
            });
          }
         });

       },1000);

          $scope.vm.originalTabs = angular.copy($scope.vm.form);

          // function definition
          $scope.vm.onSubmit = function() {
            console.log('testing submit button');
            var payLoad = FormentryService.generateFormPayLoad($scope.vm.model);

            //alert(JSON.stringify($scope.vm.model), null, 2);
          }


          $scope.vm.cancel = function()
          {
            console.log($state);
            var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
  					dlg.result.then(function(btn){
  						$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
  					},function(btn){
  						//$scope.vm.confirmed = 'You confirmed "No."';
  					});

          }
    }
})();
