/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

    FormentryService.$inject = ['$http', 'SearchDataService', 'moment'];

    function FormentryService($http, SearchDataService, moment) {
        var service = {
            createForm: createForm,
            getConceptUuid:getConceptUuid,
            validateForm:validateForm,
            getEncounter:getEncounter,
            getFormSchema: getFormSchema,
            getCompiledFormSchema: getCompiledFormSchema,
            generateFormPayLoad: generateFormPayLoad
        };

        return service;


        function getFieldValidator(params)
        {
          console.log('Validation params');
          console.log(params);

          if ((params.type === 'date') && (params.allowFutureDates !== 'true'))
          {
            return {
              expression: function(viewValue, modelValue) {
                /*
                using datejs library
                */
                var value = modelValue || viewValue;
                var dateValue;
                var curDate = Date.parse(Date.today(),'d-MMM-yyyy');
                if(value !== undefined)
                {
                  dateValue = Date.parse(value,'d-MMM-yyyy').clearTime();
                }
                if(dateValue !== undefined)
                {
                  console.log('Today: '+curDate);
                  console.log('Date Entered: '+dateValue.clearTime());
                  console.log(dateValue.isAfter(curDate));
                  return !dateValue.isAfter(curDate);
                }

              },
              message: '"Should not be a future date!"'
            };
          }

          if((params.type === 'date') && (params.allowFutureDates === 'true'))
          {
            return {
              expression: function(viewValue, modelValue) {
                /*
                using datejs library
                */
                var value = modelValue || viewValue;
                var dateValue;
                var curDate = Date.parse(Date.today(),'d-MMM-yyyy');
                if(value !== undefined)
                {
                  dateValue = Date.parse(value,'d-MMM-yyyy').clearTime();
                }
                if(dateValue !== undefined)
                {
                  //return !dateValue.isBefore(curDate);
                  return true;
                }
                else return true;

              },
              message: '"Should be a future date!"'
            };
          }
        }

        function getFormSchema(formName, callback) {
          var schema = {};
          // this should de dropped once we align all forms related issues
          if (formName !== undefined)
          {
            formName = formName + '.json';
          }
          else {
              formName = 'form1.json';
          }

          $http.get('scripts/formentry/formschema/'+formName)
            .success(function(response) {

              //console.log('testing json files');
              //console.log(response.schema);
              //schema = response.schema;
              callback(response);
              })
              .error(function(data, status, headers, config) {
                //console.log(data);
                //console.log(status);
                if (status === 404) {alert('Form Resource not Available');}

            });


        }

        function getCompiledFormSchema(formName, callback) {
          var schema = {};
          // this should de dropped once we align all forms related issues
          if (formName !== undefined)
          {
            formName = formName + '.compiled.json';
          }
          else {
              formName = 'form1.compiled.json';
          }

          $http.get('scripts/formentry/formschema/'+formName)
            .success(function(response) {

              //console.log('testing json files');
              //console.log(response.schema);
              //schema = response.schema;
              callback(response.form);
              })
              .error(function(data, status, headers, config) {
                //console.log(data);
                //console.log(status);
                if (status === 404) {alert('Form Resource not Available');}

            });


        }

        function getObsValue(key, obs)
        {
          var val = _.find(obs,function(obs_){
            if(obs_.concept.uuid === key.split('_')[1]) return obs_;
          });

          return val;
        }

        function getObsGroupValue(key, obs)
        {

        }

        function getEncounterHandler(enc_data, formlySchema)
        {
          /*
          Each page/tab has various sections
          each section has a set of various questions/data elements
          The model is simply aware of sections only

          */
          //geting obs data without obs groups
          var obs_data = _.filter(enc_data.obs,function(obs){
            if(obs.groupMembers === null) return obs
          });

          //geting obs data with obs groups
          var obs_group_data =  _.filter(enc_data.obs,function(obs){
            if(obs.groupMembers !== null)return obs;
          });

          //looping thro' individual pages
          _.each(formlySchema, function(page){
            //looping thro each section in the page and updating the model
            //console.log('Model test 1', model);

            var model = page.form.model;

            console.log('Page Test Model ');
            console.log(model)
            _.each(page.form.fields, function(_section){
              if (_section.type === 'section')
              {
                //console.log('Section: ' + _section.key);
                /*
                Updating the section keys in the model;
                It is important that we update the model with the section key
                because for some reason formly does not see the keys
                even though when you log the page keys you see them
                */
                var sec_key = _section.key;
                var sec_data = model[sec_key] = {};

                //loop through the individual fields in the section and update accordingly
                _.each(_section.templateOptions.fields[0].fieldGroup, function(_field){
                  //console.log('Fields Available...')
                  //console.log(_field)
                  var field_key;

                  if(_field.key === 'encounterDate')
                  {
                    sec_data['encounterDate'] = enc_data.encounterDatetime;
                    _field.data['init_val'] = enc_data.encounterDatetime;

                    //console.log('test Model');
                    //console.log(model);
                  }
                  else if(_field.key === 'encounterProvider')
                  {

                    sec_data['encounterProvider'] = enc_data.provider.uuid;
                    _field.data['init_val'] = enc_data.provider.uuid;
                    //console.log('test Model');
                    //console.log(model);
                  }
                  else if(_field.key === 'encounterLocation')
                  {
                    sec_data['encounterLocation'] = enc_data.location.uuid;
                    _field.data['init_val'] = enc_data.location.uuid;
                    //console.log('test Model');
                    //console.log(model);
                  }
                  else if(_field.type === 'select' || _field.type === 'radio')
                  {
                    field_key = _field.key;
                    var val = getObsValue(field_key, obs_data);
                    if (val !== undefined)
                    {
                      sec_data[field_key] = val.value.uuid;
                      _field.data['init_val'] = val.value.uuid;
                      _field.data['uuid'] = val.uuid; //obs uuid
                    }
                  }
                  else if(field.type === 'multiCheckbox')
                  {
                    field_key = _field.key;
                    var multiArr = [];
                    var multi_uuid = [];
                    var val = _.filter(obs_data,function(obs){
                      if(obs.concept.uuid === field_key.split('_')[1]) return obs;
                    });
                    //console.log('matching multiCheckbox:');
                    //console.log(val);
                    if (val !== undefined) {
                      _.each(val, function(obs){
                        multiArr.push(obs.value.uuid);
                        multi_uuid.push(obs.uuid);
                        });
                        field.model[key] = multiArr;
                        sec_data[field_key] = multiArr;
                        _field.data['init_val'] = multiArr;
                        _field.data['uuid'] = multi_uuid; //obs uuid
                    }
                  }
                  else if(_field.type === 'repeatSection')
                  {

                  }
                  else
                  {
                    field_key = _field.key;
                    var val = getObsValue(field_key, obs_data);
                    if (val !== undefined)
                    {
                      sec_data[field_key] = val.value;
                      _field.data['init_val'] = val.value;
                      _field.data['uuid'] = val.uuid; //obs uuid
                    }
                  }
                  console.log('Updated Fields Available...')
                  console.log(_field)
                });
              }
            });

          });
        }


        function getEncounter(encData, formlySchema){
          //cbce861a-790c-4b91-80e6-3d75e671a4de
          //console.log('Sample data from REST API')
          //console.log(uuid);
          /*
          Expected Encounter object format
          {encounterDatetime: 'date',
          encounterType:{display,uuid},
          form:{},
          location:{},
          obs:[{concept:{display,uud},uuid,value{display,uuid},groupMembers:[]}],
          patient:{uuid},
          provider:{},
          uuid:'encounter-uuid'
          */

          getEncounterHandler(encData, formlySchema);

          // //geting obs data without obs groups
          // var obsData = _.filter(encData.obs,function(obs){
          //   if(obs.groupMembers === null) return obs
          // })
          //
          // //geting obs data with obs groups
          // var obsGroupArr={};//store distinct obsgroup uuid
          // var obsGroupData =  _.filter(encData.obs,function(obs){
          //   if(obs.groupMembers !== null)
          //   {
          //     obsGroupArr['obs_' + obs.concept.uuid] = obs.concept.uuid;
          //     return obs;
          //   }
          // })
          // var key;
          //
          // //Start by prefilling the encounter information
          //
          // _.each(formlySchema, function(field, x) {
          //   //console.log('field No: ' + x + ' Field Key: '+ field.key);
          //   if(angular.isNumber(field.key) || field.key == undefined)
          //   {
          //     return; //skip current iteration
          //   }
          //   else if(field.key.startsWith('enc_')) //using underscore.js and underscore.string.js Functions
          //   {
          //     console.log('Encounter Keys');
          //     console.log(field.key);
          //     key = field.key;
          //     if(key === 'enc_encounterDatetime')
          //     {
          //       //update the model property
          //       field.model[key] = encData.encounterDatetime;
          //     }
          //     else if(key === 'enc_encounterLocation')
          //     {
          //       //update the model property
          //       if(encData.location !== null) field.model[key] = encData.location.uuid;
          //     }
          //     else if(key === 'enc_encounterProvider')
          //     {
          //       //update the model property
          //       if(encData.provider !== null) field.model[key] = encData.provider.uuid;
          //     }
          //     //field.model[key] = encData.encounterDatetime;
          //   }
          //   else if(field.key.startsWith('obs_')) //using underscore.js and underscore.string.js Functions
          //   {
          //       //get obs fields without groups
          //       console.log('starting obs prefill');
          //       key = field.key;
          //       //console.log('Selected Key: '+ key + 'type: '+ field.type);
          //       var val;
          //       var multiArr = []; //for multiselect fields like checkboxes
          //       if(field.model.obsGroupUuid === '')
          //       {
          //         if(field.type === 'select' || field.type === 'radio')
          //         {
          //
          //           val = _.find(obsData,function(obs){
          //             if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
          //           });
          //           //console.log('matching obs concept id:');
          //           //console.log(val);
          //           if (val !== undefined) field.model[key] = val.value.uuid;
          //         }
          //         else if(field.type === 'multiCheckbox')
          //         {
          //
          //           val = _.filter(obsData,function(obs){
          //             if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
          //           });
          //           //console.log('matching multiCheckbox:');
          //           //console.log(val);
          //           if (val !== undefined) {
          //             _.each(val, function(obs){
          //               multiArr.push(obs.value.uuid);
          //             });
          //             field.model[key] = multiArr;
          //           }
          //         }
          //         else
          //         {
          //           val = _.find(obsData,function(obs){
          //             if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
          //           });
          //             //console.log('matching obs concept id: and autofilled model');
          //             //console.log(val);
          //             //console.log(field.model);
          //             if (val !== undefined) field.model[key] = val.value;
          //             //console.log(field.model);
          //         }
          //       }
          //       //obs with obs group uuids
          //       else if(field.model.obsGroupUuid !== '')
          //       {
          //         if(field.type === 'select' || field.type === 'radio')
          //         {
          //           //get the group member matching the current key
          //           var groupMember;
          //           _.each(obsGroupData, function(obs) {
          //             groupMember = _.find(obs.groupMembers, function(item) {
          //               if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
          //             })
          //           })
          //           val = _.find(obsGroupData,function(obs){
          //             if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
          //           });
          //           //console.log('matching obs concept id:');
          //           //console.log(val);
          //           if (val !== undefined && groupMember !== undefined) field.model[key] = groupMember.value.uuid;
          //         }
          //         else if(field.type === 'multiCheckbox')
          //         {
          //           //get the group member matching the current key
          //           var groupMember;
          //           _.each(obsGroupData, function(obs) {
          //             groupMember = _.filter(obs.groupMembers, function(item) {
          //               if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
          //             })
          //           });
          //
          //           val = _.find(obsGroupData,function(obs){
          //             if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
          //           });
          //           //console.log('matching multiCheckbox:');
          //           //console.log(val);
          //           if (val !== undefined && groupMember !== undefined) {
          //             _.each(groupMember, function(obs){
          //               multiArr.push(obs.value.uuid);
          //             });
          //             field.model[key] = multiArr;
          //           }
          //         }
          //         else if(field.type === 'repeatSection')
          //         {
          //           //get the group member matching the current key
          //           var groupMember;
          //           key = field.model.obsGroupUuid;
          //
          //           for(var dictKey in obsGroupArr)
          //           {
          //             // console.log('test dictionary')
          //             // console.log(obsGroupArr[dictKey]);
          //           }
          //
          //           val = _.filter(obsGroupData,function(obs){
          //             //console.log(obs);
          //             if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
          //           });
          //
          //           console.log('matching repeatSection:');
          //           console.log(field);
          //           var rowVal = {};
          //           if (val !== undefined) {
          //             /*
          //             Loop field wise in the group to  create a row object
          //             */
          //             var selgrup;
          //             var fieldKeys=[];
          //             _.each(field.templateOptions.fields[0].fieldGroup, function(curField){
          //                fieldKeys.push(curField.key.split('_')[1]);
          //             })
          //             multiArr = [];
          //             _.each(val,function(data,i){
          //               rowVal = {};
          //               console.log('Row ' + i + ' Data' );
          //               //console.log(data);
          //
          //               _.each(data.groupMembers, function (rowData) {
          //
          //                 /*
          //                 The expected model row data should be something like
          //                 {
          //                 col1key:col1value,
          //                 col2key:col2value,
          //                 ---
          //                 colnkey:colnvalue
          //                 }
          //                 */
          //                 if(fieldKeys.indexOf(rowData.concept.uuid)>=0)
          //                 {
          //                   console.log(rowData.concept.uuid);
          //                   var colKey = 'obs_' + rowData.concept.uuid
          //                   console.log('columns: '+colKey);
          //                   if (angular.isObject(rowData.value))
          //                   {
          //                     rowVal[colKey] = rowData.value.uuid
          //                   }
          //                   else {
          //                     rowVal[colKey] = rowData.value
          //                   }
          //                 }
          //
          //               });
          //               if(Object.keys(rowVal).length>0)  multiArr.push(rowVal);
          //               //console.log('Array Val Repeat');
          //
          //               //console.log(multiArr);
          //             });
          //           }
          //           field.model['obs_'+key] = multiArr;
          //         }
          //         else if(field.type === undefined)
          //         {
          //           console.log('testing groupSection')
          //           /*
          //           groupSection should have undefined type since
          //           we don't have type in its object definition
          //           */
          //           var groupMember;
          //           key = field.model.obsGroupUuid;
          //           if(_.contains(key,'unamed'))
          //           {
          //             //no valid obs group uuid
          //             //console.log('field groups')
          //             //console.log(field.fieldGroup);
          //           _.each(field.fieldGroup, function(curField){
          //               if(curField.type !== 'multiCheckbox')
          //               {
          //                 if(_.contains(curField.key, 'obsDate_'))
          //                 {
          //                   var obsVal = _.find(obsData, function(data){
          //                     if(data.concept.uuid === curField.key.split('_')[1])
          //                     {
          //                       return data;
          //                     }
          //                   });
          //                   if(obsVal !== undefined)
          //                   {
          //                     field.model['obs_'+key][curField.key] = obsVal.obsDatetime;
          //                   }
          //                 }
          //                 else {
          //                   var obsVal = _.find(obsData, function(data){
          //                     if(data.concept.uuid === curField.key.split('_')[1])
          //                     {
          //                       return data;
          //                     }
          //                   });
          //
          //                   if(obsVal !== undefined)
          //                   {
          //                     // console.log('test group sec obs value');
          //                     // console.log(obsVal);
          //                     // console.log('Current field Key: ' + curField.key)
          //                     // console.log('current key: obs_'+ key);
          //                     // console.log(field.model['obs_' + key]);
          //                     if(angular.isObject(obsVal.value) && field.model['obs_' + key] !== undefined)
          //                     {
          //                       field.model['obs_'+ key][curField.key] = obsVal.value.uuid;
          //                     }
          //                     else {
          //                       field.model['obs_'+ key][curField.key] = obsVal.value;
          //                     }
          //                   }
          //
          //                 }
          //               }
          //               else {
          //                 //if the field group section field is a multi select
          //                 var obsVal = _.filter(obsData, function(data){
          //                   if(data.concept.uuid === curField.key.split('_')[1])
          //                   {
          //                     return data;
          //                   }
          //                 });
          //                 multiArr = [];
          //
          //                 if(obsVal !== undefined)
          //                 {
          //                   _.each(obsVal, function(data){
          //                     multiArr.push(data.value.uuid);
          //                   });
          //                   field.model['obs_'+key][curField.key] = multiArr;
          //                 }
          //               }
          //           });
          //           }
          //           else {
          //             //has valid obs group uuid
          //             var obsGpSecData = _.find(obsGroupData, function(data){
          //               if(data.concept.uuid === key.split('_')[1])
          //               {
          //                 return data;
          //               }
          //             });
          //             _.each(field.fieldGroup, function(curField){
          //                 if(curField.type !== 'multiCheckbox')
          //                 {
          //                   if(_.contains(curField.key, 'obsDate_'))
          //                   {
          //                     var obsVal = _.find(obsGpSecData.groupMembers, function(data){
          //                       if(data.concept.uuid === curField.key.split('_')[1])
          //                       {
          //                         return data;
          //                       }
          //                     });
          //
          //                     if(obsVal !== undefined)
          //                     {
          //                       field.model['obs_'+key][curField.key] = obsVal.obsDatetime;
          //                     }
          //                   }
          //                   else {
          //                     var obsVal = _.find(obsGpSecData.groupMembers, function(data){
          //                       if(data.concept.uuid === curField.key.split('_')[1])
          //                       {
          //                         return data;
          //                       }
          //                     });
          //
          //                     if(obsVal !== undefined)
          //                     {
          //                       // console.log('test group sec obs value');
          //                       // console.log(obsVal);
          //                       // console.log('current key: '+ key);
          //                       // console.log(field.model[key]);
          //                       if(angular.isObject(obsVal.value))
          //                       {
          //                         field.model['obs_'+key][curField.key] = obsVal.value.uuid;
          //                       }
          //                       else {
          //                         field.model['obs_'+key][curField.key] = obsVal.value;
          //                       }
          //                     }
          //
          //                   }
          //                 }
          //                 else {
          //                   //if the field group section field is a multi select
          //                   var obsVal = _.filter(obsGpSecData.groupMembers, function(data){
          //                     if(data.concept.uuid === curField.key.split('_')[1])
          //                     {
          //                       return data;
          //                     }
          //                   });
          //                   multiArr = [];
          //
          //                   if(obsVal !== undefined)
          //                   {
          //                     _.each(obsVal, function(data){
          //                       multiArr.push(data.value.uuid);
          //                     });
          //                     field.model['obs_'+key][curField.key] = multiArr;
          //                   }
          //                 }
          //             });
          //           }
          //         }
          //         else{
          //           //get the group member matching the current key
          //           var groupMember;
          //           _.each(obsGroupData, function(obs) {
          //             groupMember = _.find(obs.groupMembers, function(item) {
          //               if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
          //             })
          //           });
          //
          //           val = _.find(obsGroupData,function(obs){
          //             if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
          //        });
          //             //console.log('matching obs concept id: and autofilled model');
          //             //console.log(val);
          //             //console.log(field.model);
          //             if (val !== undefined && groupMember !== undefined) field.model[key] = groupMember.value;
          //             //console.log(field.model);
          //         }
          //       }
          //   }
          //
          //
          // });
          // console.log('obs group data')
          // console.log(obsGroupData);

        }

        function validateForm(schema)
        {
          _.each(schema, function(field) {
            // body...
            if(field.model.obsConceptUuid === '')
            {
              return field.templateOptions.label + 'Missing Concept uuid';
            }
            else {
              return '';
            }
          })
        }

        function getConceptUuid()
        {

        }

        /*
        Method/function to create to create Form payLoad given the model
        */
        function generateFormPayLoad(model/*, patient, form, uuid*/){
          var formPayLoad = {};
          var obs = [];
          var val;
          console.log('Test sample model');
          console.log(model)
          _.each (Object.keys(model), function(obj){

            val = model[obj];
            console.log('Section: '+ obj + 'No of Keys: '+ Object.keys(val).length);

            //check if the current key is an object
            if(Object.keys(val).length > 0)
            {
              //This could be a section or just and independent group outside the section
              if(obj.startsWith('section')){

                _.each(Object.keys(val), function(key){
                  console.log('Section Key: '+ key);
                  //Handling special keys related to encounter
                  if (key === 'encounterProvider' && val[key] !== undefined)
                  {
                    //add property to the payload
                    formPayLoad.provider = val[key];
                  }
                  else if (key === 'encounterDate' && val[key] !== undefined)
                  {
                    formPayLoad.encounterDatetime = getFormattedValue(val[key]);
                  }
                  else if (key === 'encounterLocation' && val[key] !== undefined) {
                    //add property to the payload
                    formPayLoad.location = val[key];
                  }
                  else if (val[key] !== undefined) {
                    if (Object.keys(val[key]).length > 0) {
                      //this is the case when we have obs groups that are not repeating

                      var groupValues = val[key];
                      var groupMembers = [];
                      //console.log(key);
                      //console.log(groupValues);
                      if(_.contains(key, 'unamed')) // having valid obs group concept uuid
                      {
                        _.each(Object.keys(groupValues), function(group_member){
                          //console.log(groupValues[group_member])
                          if (groupValues[group_member] !== undefined)
                          {
                            if (group_member.startsWith('obsDate_'))
                            {
                              obs.push({obsDatetime:getFormattedValue(groupValues[group_member]),concept:group_member.split('_')[1], value:getFormattedValue(groupValues['obs_'+group_member.split('_')[1]])});
                            }
                          }
                        });

                      }
                      else if (Object.keys(groupValues).length > 0)
                      {
                        _.each(Object.keys(groupValues), function(group_member){
                          console.log('Testing Array');
                          console.log(groupValues[group_member])
                          if (groupValues[group_member] !== undefined)
                          {
                            var ArrayVal = groupValues[group_member]
                            groupMembers = [];
                            _.each(Object.keys(ArrayVal), function(arrKey){
                              if(!arrKey.startsWith('$$'))
                              {
                                groupMembers.push({concept:arrKey.split('_')[1],
                                            value:getFormattedValue(ArrayVal[arrKey])});
                              }

                            });
                            if (groupMembers.length>0)
                            {
                                obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                            }
                          }
                        });

                      }
                    }
                    else if (angular.isArray(val[key])) {

                      //this is the case when we have obs groups that repeating
                      var groupValues = val[key];
                      var groupMembers = [];
                      //groupArray Values should an array of various objects
                      //Each objec shoubld be saved as in independent obsgroup
                      _.each(groupValues, function(group_member){
                        groupMembers = [];
                        if (Object.keys(group_member).length > 0)
                        {
                          _.each(Object.keys(group_member), function (arg) {
                            // body...
                            groupMembers.push({concept:arg.split('_')[1],
                                        value:getFormattedValue(group_member[arg])});
                          });
                          if (groupMembers.length>0)
                          {
                              obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                          }

                        }
                      });
                    }
                    // else {
                    //   // value pair are strings or values
                    //   obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                    // }

                  }
                });
              }
              else {
                // if we have an independent group then we should assume that
                // their is some grouping. Though this will not always be true
                _each(Object.keys(val), function(key){

                });
              }
            }
            else if (angular.isArray(val)){
              //add property to obs
              var items = [];
              items = val;
               //console.log(items);
              for (var l = 0; l < items.length; l++)
              {
                obs.push({concept:obj.split('_')[1], value:getFormattedValue(items[l])});
              }
            }
            // else {
            //   //The object here shoud be a simple string value
            //   obs.push({concept:obj.split('_')[1], value:getFormattedValue(val)});
            // }
          });

          formPayLoad.obs = obs;
          console.log('Sample payLoad');
          console.log(formPayLoad)
          return formPayLoad;
        }

        /*
        Private method to create  formly fields without group
        */
        function createFormlyField(obs_field){
          var obsField = {};
          if(obs_field.type === 'date')
          {
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);

            obsField = {
              key: 'obs_' + obs_field.concept,
              type: 'datepicker',
              data: {concept:obs_field.concept,
                answer_value:''},
              templateOptions: {
                type: 'text',
                label: obs_field.label,
                datepickerPopup: 'dd-MMMM-yyyy',
                required:required
              },
              validators: {
                //dateValidator: getFieldValidator(obs_field.question.validators)
              }
            }
          }
          else if ((obs_field.type === 'text') || (obs_field.type === 'number'))
          {
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);

            obsField = {
              key: 'obs_' + obs_field.concept,
              type: 'input',
              data: {concept:obs_field.concept,
                answer_value:''},
              templateOptions: {
                type: obs_field.type,
                label: obs_field.label,
                required:required
              }
              //         ,
              // validators: {
              //   //ipAddress: validatorsArray['ipAddress']
              // }
            }
          }
          else if ((obs_field.type === 'radio') || (obs_field.type === 'select') || (obs_field.type === 'multiCheckbox'))
          {
            var opts= [];
            //get the radio/select options/multicheckbox
            //console.log(obs_Field);
            _.each(obs_field.answers, function (answer) {
              // body...
              var item={
                name:answer.label,
                value:answer.concept
                };
              opts.push(item);
            });

            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);

            obsField = {
              key: 'obs_' + obs_field.concept,
              type: obs_field.type,
              data: {concept:obs_field.concept,
                answer_value:''},
              templateOptions: {
                type: obs_field.type,
                label: obs_field.label,
                required:required,
                options:opts
              }
            }
          }
          else if(obs_field.type === 'problem'){
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);
            obsField = {
              key: 'obs_' + obs_field.concept,
              type: 'ui-select-extended',
              data: {concept:obs_field.concept,
                answer_value:''},
              templateOptions: {
                type: 'text',
                label: obs_field.label,
                valueProp: 'uuId',
                labelProp:'display',
                deferredFilterFunction: SearchDataService.findProblem,
                getSelectedObjectFunction: SearchDataService.getProblemByUuid,
                required:required,
                options:[]
              }
            };
          }
          return obsField;
        }

        /*
        Private method to create Group formly fields
        */
        function createGroupFormlyField(obs_field, gpSectionRnd)
        {
          var obsField = {};
          var groupingFields = [];
          //gpSectionRnd = gpSectionRnd + 1;
          var sectionKey = obs_field.concept ? obs_field.concept : 'unamed_' + gpSectionRnd;
          //Get the fields in the group section
          _.each(obs_field.questions, function(curField){
            // process the fields the normal way
            var selField=createFormlyField(curField);
            //selField['key'] = selField['key'] + '@obs_' + sectionKey;
            groupingFields.push(selField);
            if(curField.showDate === 'true')
            {
              var dateField = {
              //className: 'col-md-2',
              key: 'obsDate_' + curField.concept,
              type: 'datepicker',
              templateOptions: {
                type: 'text',
                label: 'Date',
                datepickerPopup: 'dd-MMMM-yyyy'
                },
              validators: {
                //dateValidator: getFieldValidator({type:'date'})
                }
              }
              groupingFields.push(dateField);
            }
          });

          obsField = {
            className: 'row',
            key:'obs' + gpSectionRnd + '_' + sectionKey,
            fieldGroup:groupingFields
          }
          //({template: '<hr /><p><strong>'+obs_Field.sectionTitle +'</strong></p>'});


          return obsField;
        }

        /*
        Private method/function to create a repeating section
        */
        function createRepeatingFormlyField(obs_field, gpSectionRnd)
        {
          var repeatingFields = [];
          //Get the fields in the repeating section

          var sectionKey = obs_field.concept ? obs_field.concept : 'unamed_' + gpSectionRnd;

          _.each(obs_field.questions,function(curField){
            // process the fields the normal way

            var selField=createFormlyField(curField);
            selField['className'] = 'col-md-2';
            //selfField['key'] = selfField['key']
            repeatingFields.push(selField);
          })
          var obsField = {
            key:'obs' + gpSectionRnd + '_' + obs_field.concept,
            type: 'repeatSection',
            templateOptions: {
              label:obs_field.label,
              btnText:'Add',
              fields:[
                {
                  className: 'row',
                  fieldGroup:repeatingFields
                }
              ]
            }
          }
           return obsField;
        }
        function createForm(schema, callback)
        {
          var pages = schema.pages;
          var tab;
          var tabs = [];
          var sectionFields = [];
          var pageFields = [];
          var field ={};
          var section_id = 0;
          var gpSectionRnd = 0 ; //this a random number for grp sections without an obs group
          _.each(pages, function(page){
            pageFields = [];
            _.each(page.sections, function(section){
              sectionFields = [];
              //section fields
              _.each(section.questions, function(sec_field){
                if(sec_field.type === 'encounterDate')
                {
                  field = {
                    key: sec_field.type,
                    type: 'datepicker',
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      datepickerPopup: 'dd-MMMM-yyyy'
                    },
                    validators: {
                      //dateValidator: getFieldValidator(encField.validators)
                    }
                  }
                }
                else if(sec_field.type === 'encounterProvider')
                {
                  field = {
                    key: sec_field.type,
                    type: 'ui-select-extended',
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      valueProp: 'personUuid',
                      labelProp:'display',
                      deferredFilterFunction: SearchDataService.findProvider,
                      getSelectedObjectFunction: SearchDataService.getProviderByUuid,
                      required:false,
                      options:[]
                    }
                  }
                }
                else if(sec_field.type === 'encounterLocation')
                {
                  field = {
                    key: sec_field.type,
                    type: 'ui-select-extended',
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      valueProp: 'uuId',
                      labelProp:'display',
                      deferredFilterFunction: SearchDataService.findLocation,
                      getSelectedObjectFunction: SearchDataService.getLocationByUuid,
                      required:false,
                      options:[]
                    }
                  }
                }
                else if(sec_field.type === 'group')
                {
                  gpSectionRnd = gpSectionRnd + 1;
                  field = createGroupFormlyField(sec_field, gpSectionRnd);
                }
                else if(sec_field.type === 'group_repeating')
                {
                  gpSectionRnd = gpSectionRnd + 1;
                  field = createRepeatingFormlyField(sec_field, gpSectionRnd);
                }
                else {
                  field = createFormlyField(sec_field)
                }
                sectionFields.push(field);
              });
              //creating formly field section
              section_id = section_id  + 1;
              var sec_field =
              {
                key:'section_' + section_id,
                type: 'section',
                templateOptions: {
                  label:section.label,
                  fields:[{
                    className: 'row',
                    fieldGroup: sectionFields
                  }]
                }
              }
              pageFields.push(sec_field);
            });

            //create page fields
            tab =
            {
              title: page.label,
              form:{
                options:{},
                fields:pageFields
              }
            }
            tabs.push(tab);
          });

          //return tabs;
          console.log(JSON.stringify(tabs))
          callback(tabs);
        }

        function getFormattedValue(value){
            if(!value) return value;

            if(angular.isNumber(value)) return value;

            if(Object.prototype.toString.call(value) === '[object Date]'){

               value = moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
            }

            //moment().utc();
            var isDateValid = moment(value, 'YYYY-MM-DDTHH:mm:ssZ').isValid();
            if(isDateValid)
            {
              var localTime = moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
              return localTime;
            }

            return value;
        }

    }
})();
