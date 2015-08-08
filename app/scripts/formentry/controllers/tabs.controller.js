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
         FormentryService.getFormSchema('form1', function(schema){
          formSchema = schema;
          //$scope.vm.userFields = $scope.vm.formlyFields;
          if (Object.keys(formSchema).length>0)
          {
            FormentryService.createForm(formSchema, function(formlySchema){
              $scope.vm.formlyFields = formlySchema;
              // $scope.vm.tabs =[
              //   {
              //     title: 'Page 1',
              //     active: true,
              //     form:{
              //       options:{},
              //       fields:$scope.vm.formlyFields
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

        // $scope.vm.tabs = [
        //   {
        //     title: 'Page 1',
        //     active: true,
        //     form: {
        //         options: {},
        //         fields: [
        //           {
        //             key: 'email',
        //             type: 'input',
        //             templateOptions: {
        //               label: 'Username',
        //               type: 'email',
        //               placeholder: 'Email address',
        //               required: true
        //             }
        //           },
        //           {
        //             className: 'row',
        //             key:'fieldGroup',
        //             fieldGroup: [
        //               {
        //                 className: 'col-xs-6',
        //                 type: 'input',
        //                 key: 'firstName1$$fieldGroup',
        //                 templateOptions: {
        //                   label: 'First Name'
        //                 },
        //                 data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //               },
        //               {
        //                 className: 'col-xs-6',
        //                 type: 'input',
        //                 key: 'lastName1$$fieldGroup',
        //                 templateOptions: {
        //                   label: 'Last Name'
        //                 },
        //                 expressionProperties: {
        //                   'templateOptions.disabled': '!model.firstName1$$fieldGroup'
        //                 },
        //                 data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //               }
        //             ]
        //           }
        //         ]
        //       }
        //     },
        //     {
        //       title: 'Tab 2',
        //       form: {
        //         options: {},
        //         fields: [
        //           {
        //             key: 'firstName',
        //             type: 'input',
        //             templateOptions: {
        //               label: 'First Name',
        //               required: true
        //             },
        //             data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //           },
        //           {
        //             key: 'lastName',
        //             type: 'input',
        //             templateOptions: {
        //               label: 'Last Name',
        //               required: true
        //             },
        //             data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //           },
        //           {
        //            key:'obs_rep',
        //            type: 'repeatSection',
        //            templateOptions: {
        //              label:'obs_Field.sectionTitle',
        //              btnText:'Add ',
        //              fields:[
        //                {
        //                  className: 'row',
        //                  fieldGroup:[{
        //                    className: 'col-xs-4',
        //                    type: 'input',
        //                    key: 'investmentName',
        //                    templateOptions: {
        //                      label: 'Name of Investment:'
        //                    },
        //                    data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //                  },
        //                  {
        //                    className: 'col-xs-4',
        //                    type: 'radio',
        //                    key: 'type',
        //                    templateOptions: {
        //                      options: [
        //                        {
        //                          name: 'Text Field',
        //                          value: 'input'
        //                        },
        //                        {
        //                          name: 'TextArea Field',
        //                          value: 'textarea'
        //                        },
        //                        {
        //                          name: 'Radio Buttons',
        //                          value: 'radio'
        //                        },
        //                        {
        //                          name: 'Checkbox',
        //                           value: 'checkbox'
        //                         }
        //                       ],
        //                       label: 'Field Type',
        //                       required: true
        //                     },
        //                     data:{conceptUuid:'test', obsUuid:'',obsGroupUuid:'', answerValue:''}
        //                   }
        //                ]
        //                }
        //              ]
        //            }
        //          }
        //         ]
        //       }
        //     }
        //   ];


          $scope.vm.originalTabs = angular.copy($scope.vm.form);

          // function definition
          $scope.vm.onSubmit = function() {
            console.log('testing submit button');
            //invokeOnAllFormOptions('updateInitialValue');
            angular.forEach($scope.vm.tabs, function(tab) {
              console.log(tab.form.model);
            });

            alert(JSON.stringify($scope.vm.model), null, 2);
          }


          function invokeOnAllFormOptions(fn) {
            angular.forEach($scope.vm.tabs, function(tab) {
              if (tab.form.options && tab.form.options[fn]) {
                tab.form.options[fn]();
              }
            });
          }
    }
})();
