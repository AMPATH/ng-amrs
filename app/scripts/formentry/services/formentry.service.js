/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

    FormentryService.$inject = ['$http', 'SearchDataService'];

    function FormentryService($http, SearchDataService) {
        var service = {
            createForm: createForm,
            getPayLoad: getPayLoad,
            getConceptUuid:getConceptUuid,
            validateForm:validateForm,
            getEncounter:getEncounter,
            getFormSchema: getFormSchema
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
              schema = response.schema;
              callback(schema);
              })
              .error(function(data, status, headers, config) {
                //console.log(data);
                //console.log(status);
                if (status === 404) {alert('Form Resource not Available');}

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


          //geting obs data without obs groups
          var obsData = _.filter(encData.obs,function(obs){
            if(obs.groupMembers === null) return obs
          })

          //geting obs data with obs groups
          var obsGroupArr={};//store distinct obsgroup uuid
          var obsGroupData =  _.filter(encData.obs,function(obs){
            if(obs.groupMembers !== null)
            {
              obsGroupArr['obs_' + obs.concept.uuid] = obs.concept.uuid;
              return obs;
            }
          })
          var key;

          //Start by prefilling the encounter information

          _.each(formlySchema, function(field, x) {
            //console.log('field No: ' + x + ' Field Key: '+ field.key);
            if(angular.isNumber(field.key) || field.key == undefined)
            {
              return; //skip current iteration
            }
            else if(field.key.startsWith('enc_')) //using underscore.js and underscore.string.js Functions
            {
              console.log('Encounter Keys');
              console.log(field.key);
              key = field.key;
              if(key === 'enc_encounterDatetime')
              {
                //update the model property
                field.model[key] = encData.encounterDatetime;
              }
              else if(key === 'enc_encounterLocation')
              {
                //update the model property
                if(encData.location !== null) field.model[key] = encData.location.uuid;
              }
              else if(key === 'enc_encounterProvider')
              {
                //update the model property
                if(encData.provider !== null) field.model[key] = encData.provider.uuid;
              }
              //field.model[key] = encData.encounterDatetime;
            }
            else if(field.key.startsWith('obs_')) //using underscore.js and underscore.string.js Functions
            {
                //get obs fields without groups
                console.log('starting obs prefill');
                key = field.key;
                //console.log('Selected Key: '+ key + 'type: '+ field.type);
                var val;
                var multiArr = []; //for multiselect fields like checkboxes
                if(field.model.obsGroupUuid === '')
                {
                  if(field.type === 'select' || field.type === 'radio')
                  {

                    val = _.find(obsData,function(obs){
                      if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
                    });
                    //console.log('matching obs concept id:');
                    //console.log(val);
                    if (val !== undefined) field.model[key] = val.value.uuid;
                  }
                  else if(field.type === 'multiCheckbox')
                  {

                    val = _.filter(obsData,function(obs){
                      if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
                    });
                    //console.log('matching multiCheckbox:');
                    //console.log(val);
                    if (val !== undefined) {
                      _.each(val, function(obs){
                        multiArr.push(obs.value.uuid);
                      });
                      field.model[key] = multiArr;
                    }
                  }
                  else
                  {
                    val = _.find(obsData,function(obs){
                      if(obs.concept.uuid === field.model.obsConceptUuid) return obs;
                    });
                      //console.log('matching obs concept id: and autofilled model');
                      //console.log(val);
                      //console.log(field.model);
                      if (val !== undefined) field.model[key] = val.value;
                      //console.log(field.model);
                  }
                }
                //obs with obs group uuids
                else if(field.model.obsGroupUuid !== '')
                {
                  if(field.type === 'select' || field.type === 'radio')
                  {
                    //get the group member matching the current key
                    var groupMember;
                    _.each(obsGroupData, function(obs) {
                      groupMember = _.find(obs.groupMembers, function(item) {
                        if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
                      })
                    })
                    val = _.find(obsGroupData,function(obs){
                      if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
                    });
                    //console.log('matching obs concept id:');
                    //console.log(val);
                    if (val !== undefined && groupMember !== undefined) field.model[key] = groupMember.value.uuid;
                  }
                  else if(field.type === 'multiCheckbox')
                  {
                    //get the group member matching the current key
                    var groupMember;
                    _.each(obsGroupData, function(obs) {
                      groupMember = _.filter(obs.groupMembers, function(item) {
                        if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
                      })
                    });

                    val = _.find(obsGroupData,function(obs){
                      if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
                    });
                    //console.log('matching multiCheckbox:');
                    //console.log(val);
                    if (val !== undefined && groupMember !== undefined) {
                      _.each(groupMember, function(obs){
                        multiArr.push(obs.value.uuid);
                      });
                      field.model[key] = multiArr;
                    }
                  }
                  else if(field.type === 'repeatSection')
                  {
                    //get the group member matching the current key
                    var groupMember;
                    key = field.model.obsGroupUuid;

                    for(var dictKey in obsGroupArr)
                    {
                      // console.log('test dictionary')
                      // console.log(obsGroupArr[dictKey]);
                    }

                    val = _.filter(obsGroupData,function(obs){
                      //console.log(obs);
                      if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
                    });

                    console.log('matching repeatSection:');
                    console.log(field);
                    var rowVal = {};
                    if (val !== undefined) {
                      /*
                      Loop field wise in the group to  create a row object
                      */
                      var selgrup;
                      var fieldKeys=[];
                      _.each(field.templateOptions.fields[0].fieldGroup, function(curField){
                         fieldKeys.push(curField.key.split('_')[1]);
                      })
                      multiArr = [];
                      _.each(val,function(data,i){
                        rowVal = {};
                        console.log('Row ' + i + ' Data' );
                        //console.log(data);

                        _.each(data.groupMembers, function (rowData) {

                          /*
                          The expected model row data should be something like
                          {
                          col1key:col1value,
                          col2key:col2value,
                          ---
                          colnkey:colnvalue
                          }
                          */
                          if(fieldKeys.indexOf(rowData.concept.uuid)>=0)
                          {
                            console.log(rowData.concept.uuid);
                            var colKey = 'obs_' + rowData.concept.uuid
                            console.log('columns: '+colKey);
                            if (angular.isObject(rowData.value))
                            {
                              rowVal[colKey] = rowData.value.uuid
                            }
                            else {
                              rowVal[colKey] = rowData.value
                            }
                          }

                        });
                        multiArr.push(rowVal);
                        //console.log('Array Val Repeat');

                        //console.log(multiArr);
                      });
                    }
                    field.model['obs_'+key] = multiArr;
                  }
                  else if(field.type === undefined)
                  {
                    console.log('testing groupSection')
                    /*
                    groupSection should have undefined type since
                    we don't have type in its object definition
                    */
                    var groupMember;
                    key = field.model.obsGroupUuid;
                    if(_.contains(key,'unamed'))
                    {
                      //no valid obs group uuid
                      //console.log('field groups')
                      //console.log(field.fieldGroup);
                    _.each(field.fieldGroup, function(curField){
                        if(curField.type !== 'multiCheckbox')
                        {
                          if(_.contains(curField.key, 'obsDate_'))
                          {
                            var obsVal = _.find(obsData, function(data){
                              if(data.concept.uuid === curField.key.split('_')[1])
                              {
                                return data;
                              }
                            });
                            if(obsVal !== undefined)
                            {
                              field.model['obs_'+key][curField.key] = obsVal.obsDatetime;
                            }
                          }
                          else {
                            var obsVal = _.find(obsData, function(data){
                              if(data.concept.uuid === curField.key.split('_')[1])
                              {
                                return data;
                              }
                            });

                            if(obsVal !== undefined)
                            {
                              // console.log('test group sec obs value');
                              // console.log(obsVal);
                              // console.log('current key: '+ key);
                              // console.log(field.model[key]);
                              if(angular.isObject(obsVal.value))
                              {
                                field.model['obs_'+key][curField.key] = obsVal.value.uuid;
                              }
                              else {
                                field.model['obs_'+key][curField.key] = obsVal.value;
                              }
                            }

                          }
                        }
                        else {
                          //if the field group section field is a multi select
                          var obsVal = _.filter(obsData, function(data){
                            if(data.concept.uuid === curField.key.split('_')[1])
                            {
                              return data;
                            }
                          });
                          multiArr = [];

                          if(obsVal !== undefined)
                          {
                            _.each(obsVal, function(data){
                              multiArr.push(data.value.uuid);
                            });
                            field.model['obs_'+key][curField.key] = multiArr;
                          }
                        }
                    });
                    }
                    else {
                      //has valid obs group uuid
                      var obsGpSecData = _.find(obsGroupData, function(data){
                        if(data.concept.uuid === key.split('_')[1])
                        {
                          return data;
                        }
                      });
                      _.each(field.fieldGroup, function(curField){
                          if(curField.type !== 'multiCheckbox')
                          {
                            if(_.contains(curField.key, 'obsDate_'))
                            {
                              var obsVal = _.find(obsGpSecData.groupMembers, function(data){
                                if(data.concept.uuid === curField.key.split('_')[1])
                                {
                                  return data;
                                }
                              });

                              if(obsVal !== undefined)
                              {
                                field.model['obs_'+key][curField.key] = obsVal.obsDatetime;
                              }
                            }
                            else {
                              var obsVal = _.find(obsGpSecData.groupMembers, function(data){
                                if(data.concept.uuid === curField.key.split('_')[1])
                                {
                                  return data;
                                }
                              });

                              if(obsVal !== undefined)
                              {
                                // console.log('test group sec obs value');
                                // console.log(obsVal);
                                // console.log('current key: '+ key);
                                // console.log(field.model[key]);
                                if(angular.isObject(obsVal.value))
                                {
                                  field.model['obs_'+key][curField.key] = obsVal.value.uuid;
                                }
                                else {
                                  field.model['obs_'+key][curField.key] = obsVal.value;
                                }
                              }

                            }
                          }
                          else {
                            //if the field group section field is a multi select
                            var obsVal = _.filter(obsGpSecData.groupMembers, function(data){
                              if(data.concept.uuid === curField.key.split('_')[1])
                              {
                                return data;
                              }
                            });
                            multiArr = [];

                            if(obsVal !== undefined)
                            {
                              _.each(obsVal, function(data){
                                multiArr.push(data.value.uuid);
                              });
                              field.model['obs_'+key][curField.key] = multiArr;
                            }
                          }
                      });
                    }
                  }
                  else{
                    //get the group member matching the current key
                    var groupMember;
                    _.each(obsGroupData, function(obs) {
                      groupMember = _.find(obs.groupMembers, function(item) {
                        if(obs.concept.uuid === field.model.obsGroupUuid && item.concept.uuid === field.model.obsConceptUuid) return item;
                      })
                    });

                    val = _.find(obsGroupData,function(obs){
                      if(obs.concept.uuid === field.model.obsGroupUuid) return obs;
                 });
                      //console.log('matching obs concept id: and autofilled model');
                      //console.log(val);
                      //console.log(field.model);
                      if (val !== undefined && groupMember !== undefined) field.model[key] = groupMember.value;
                      //console.log(field.model);
                  }
                }
            }


          });
          console.log('obs group data')
          console.log(obsGroupData);

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

        function getPayLoad(schema, patient, form, uuid)
        {
          var payLoad = {};
          //generate encounter section of the payload
          _.each(schema, function(field){

            if(angular.isNumber(field.key) || field.key == undefined)
            {
              return; //skip current iteration
            }

            var val= field.model.encounter;
            //console.log('encounter log');
            //console.log(val);
            //console.log(field.model.encounter + '  ' + field.model[val] );
            payLoad.patient = patient.uuid();
            payLoad.encounterType = form.encounterType;
            /*
            include uuid in the payload for an existing
            encounter
            */
            if(uuid !== undefined)
            {
              payLoad.uuid = uuid;
            }

            if(field.model.encounter === 'enc_encounterDatetime' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.encounterDatetime = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterLocation' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.location = field.model[val];
            }
            else if(field.model.encounter === 'enc_encounterProvider' && field.model[val] !== undefined)
            {
              //add property to the payload
              payLoad.provider = field.model[val];
            }
          })


          //generate obs payload section
          var obs=[];
          // for loop using underscore js
          _.each(schema, function(field, index){
            if(angular.isNumber(field.key) || field.key == undefined)
            {
              return; //skip current iteration
            }
            var val = 'obs_' + field.model.obsConceptUuid;
            //console.log('logging val: ' + val);
            if(val !== 'obs_undefined') // all only obs with some data to be posted
            {
              //console.log(field.model.obsConceptUuid + '  ' + field.model[val] );
              /*
              Add all obs without obs groups
              */
              if((field.model[val] !== undefined) && (field.model.obsGroupUuid === ''))
              {
                if(angular.isArray(field.model[val]))        // multiCheckbox
                {
                  //add property to obs
                  var items = [];
                  items = field.model[val];
                   //console.log(items);
                  for (var l = 0; l < items.length; l++)
                  {
                    obs.push({concept:field.model.obsConceptUuid, value:items[l]});
                  }
                }
                else {
                  //all other inputs
                  //add property to obs
                  obs.push({concept:field.model.obsConceptUuid, value:field.model[val]});

                }
              }
            }
          })


          /*
          Get an array of all obs group available in the schema and
          create an obs group with group members of items having the same obs group uuid
          the assumption here is that we will not have have more than one group sharing
          the same obs group uuid
          in case we have more than one group sharing the same obs group uuid then all
          this members will be grouped in same group
          */
          var obsGroupArr = {}; //dictionary object to store obs group uuids
          _.each(schema, function(field, i){
            if(angular.isNumber(field.key) || field.key == undefined)
            {
              return; //skip current iteration
            }
            //console.log('Pringting Obs Array');
            //console.log(field.model.obsGroupUuid + ' ' + i);
            /*
            we will only add obs groups that have some data
            */

            var val = 'obs_' + field.model.obsConceptUuid;
            if(val !== 'obs_undefined') // allow only obs with some data to be posted
            {
              if(field.model[val] !== undefined)
              {
                if((field.model.obsGroupUuid !== '') && (field.model.obsGroupUuid !== undefined))
                {
                  obsGroupArr[field.model.obsGroupUuid] = field.model.obsGroupUuid;
                }
              }
            }
            else {
              /*
              Taking care of repeating/Group sections which have only
              only obsGroupUuid and not obsConceptUuid in their
              main model definition
              */
              val = 'obs_' + field.model.obsGroupUuid;
              if(_.contains(val, 'unamed'))
              {
                /*
                Process GroupSection Which do not have valid obsGroupUuids
                */

                if(field.model[val] !== undefined)
                {
                  if(Object.keys(field.model[val]).length>0)//only objects with some data
                  {
                    obsGroupArr[field.model.obsGroupUuid] = field.model.obsGroupUuid;
                    //console.log('un_named GroupSection')
                    //console.log(field.model.obsGroupUuid);
                  }

                }
              }
              else if(val !== 'obs_undefined') // allow only obs with some data to be posted
              {
                if(field.model[val] !== undefined)
                {
                  if((field.model.obsGroupUuid !== '') && (field.model.obsGroupUuid !== undefined))
                  {
                    obsGroupArr[field.model.obsGroupUuid] = field.model.obsGroupUuid;
                  }
                }
              }
            }
          })

          /*
          Build obs group array list for each unique obsGroupUuid
          */
          _.each(obsGroupArr,function(key, i){
            //console.log('logging keys in the dictionary ' + key);
            //filter all fields related to the current obs group uuid
            var obsGroupFields = _.filter(schema,function(field){
              // console.log('testing fail value');
              // console.log(field)
              if(angular.isNumber(field.key) || field.key == undefined)
              {
                return; //skip current iteration
              }

              if(field.model.obsGroupUuid === key)
              {
                return field;
              }

            });
            //console.log('obsGroupFields...');
            //console.log(obsGroupFields);
            var groupMembers = [];
            var repSec = false;

            _.each(obsGroupFields, function(field){
              /*
              obss group
              "obs": {
              "concept": "uuid-of-grouping-concept",
              "groupMembers": [...]

              }
              */


              /*
              groupSection should have undefined type since
              we don't have type in its object definition
              */
              if(field.type === undefined)
              {
                repSec = true;
                //group section with valid obs  group uuid
                var val = 'obs_' + field.model.obsGroupUuid;
                console.log('un_named GroupSection-- undefined')
                console.log(field.model.obsGroupUuid);
                if(_.contains(val,'unamed'))
                {
                  //field groupSection without obs group
                  var grpData = angular.copy(field.model[val]) ;
                  //get all fields with obsDate key and their related counter aparts
                  var obsDate =  _.filter(Object.keys(grpData), function(objKey){
                    if(objKey.startsWith('obsDate_')) return objKey
                  });
                  //fields having obsDate
                  if(obsDate.length>0)
                  {

                    _.each(obsDate, function(objKey) {
                      if(angular.isArray(grpData['obs_'+objKey.split('_')[1]]))
                      {
                        //add property to obs
                        var items = [];
                        items = grpData['obs_'+objKey.split('_')[1]];
                         //console.log(items);
                        for (var l = 0; l < items.length; l++)
                        {
                          obs.push({obsDatetime:grpData[objKey],concept:objKey.split('_')[1], value:items[l]});
                        }
                        //_.omit(grpData, grpData['obs_'+objKey.split('_')[1]]);
                        delete grpData['obs_'+objKey.split('_')[1]];
                        //_.omit(grpData, grpData[objKey]);
                        delete grpData[objKey];
                      }
                      else {
                        obs.push({obsDatetime:grpData[objKey], concept:objKey.split('_')[1], value:grpData['obs_'+objKey.split('_')[1]]});
                        //_.omit(grpData, grpData['obs_'+objKey.split('_')[1]]);
                        delete grpData['obs_'+objKey.split('_')[1]];
                        //_.omit(grpData, grpData[objKey]);
                        delete grpData[objKey];
                      }


                    });

                  }
                  //fields without obs date
                  _.each(Object.keys(grpData), function(objKey) {
                    if(angular.isArray(grpData['obs_'+objKey.split('_')[1]]))
                    {
                      //add property to obs
                      var items = [];
                      items = grpData['obs_'+objKey.split('_')[1]];
                       //console.log(items);
                      for (var l = 0; l < items.length; l++)
                      {
                        obs.push({concept:objKey.split('_')[1], value:items[l]});
                      }
                    }
                    else {
                      obs.push({concept:objKey.split('_')[1], value:grpData['obs_'+objKey.split('_')[1]]});

                    }
                  });


                }
                else {
                  //field group having valid obs group uuid
                  groupMembers = [];

                  var grpData = angular.copy(field.model[val]);
                  //get all fields with obsDate key and their related counter aparts
                  var obsDate =  _.filter(Object.keys(grpData), function(objKey){
                    if(objKey.startsWith('obsDate_')) return objKey
                  });
                  //fields having obsDate
                  if(obsDate.length>0)
                  {
                    _.each(obsDate, function(objKey) {
                      if(angular.isArray(grpData['obs_'+objKey.split('_')[1]]))
                      {
                        //add property to obs
                        var items = [];
                        items = grpData['obs_'+objKey.split('_')[1]];
                         //console.log(items);
                        for (var l = 0; l < items.length; l++)
                        {
                          groupMembers.push({obsDatetime:grpData[objKey],concept:objKey.split('_')[1], value:items[l]});
                        }
                        //_.omit(grpData, grpData['obs_'+objKey.split('_')[1]]);
                        delete grpData['obs_'+objKey.split('_')[1]];
                        //_.omit(grpData, grpData[objKey]);
                        delete grpData[objKey];
                      }
                      else {
                        groupMembers.push({obsDatetime:grpData[objKey], concept:objKey.split('_')[1], value:grpData['obs_'+objKey.split('_')[1]]});
                        //_.omit(grpData, grpData['obs_'+objKey.split('_')[1]]);
                        delete grpData['obs_'+objKey.split('_')[1]];
                        //_.omit(grpData, grpData[objKey]);
                        delete grpData[objKey];
                      }


                    });

                  }
                  //fields without obs date
                  _.each(Object.keys(grpData), function(objKey) {
                    if(angular.isArray(grpData['obs_'+objKey.split('_')[1]]))
                    {
                      //add property to obs
                      var items = [];
                      items = grpData['obs_'+objKey.split('_')[1]];
                       //console.log(items);
                      for (var l = 0; l < items.length; l++)
                      {
                        groupMembers.push({concept:objKey.split('_')[1], value:items[l]});
                      }
                    }
                    else {
                      groupMembers.push({concept:objKey.split('_')[1], value:grpData['obs_'+objKey.split('_')[1]]});

                    }
                  });
                  obs.push({concept:key, groupMembers:groupMembers});
                }
              }
              else if(field.type !== 'repeatSection' && field.type !== undefined)
              {
                var val = 'obs_' + field.model.obsConceptUuid;

                if(field.model[val] !== undefined)
                {

                  if(angular.isArray(field.model[val]))        // multiCheckbox
                  {
                    //add property to obs
                    var items = [];
                    items = field.model[val];
                     //console.log(items);
                    for (var l = 0; l < items.length; l++)
                    {
                      groupMembers.push({concept:field.model.obsConceptUuid, value:items[l]});
                    }
                  }
                  else {
                    //add property to obs
                    groupMembers.push({concept:field.model.obsConceptUuid, value:field.model[val]});

                  }
                }
              }
              else if(field.type === 'repeatSection' && field.type !== undefined){
                /*
                Populate payload for repeating section on the form.
                The repeating section uses field groups that has the details about the field
                types.[field.templateOptions.fields[0].fieldGroup]
                */
                repSec = true;
                var val = 'obs_' + field.model.obsGroupUuid;
                if(field.model[val] !== undefined)
                {
                  //add property to obs
                  /*
                  get all group members in the repeating section
                  and build the obs group payLoad for each row in the
                  repeating section
                  */
                  //console.log('Testing repeating section output');
                  //console.log(field.templateOptions.fields[0].fieldGroup);
                  /*
                  The fields object is an array that can accept several objects
                  the assumption here is that schema will have all
                  the repeating fields go in the fieldGroup section
                  and therefore we will have only array item
                  in the fields section
                  NOTE: The model value for a repeating section is an array of each
                  row object
                  */
                  _.each(field.model[val], function(modelVal, i){
                      //console.log('item '+i)
                      //console.log(modelVal);
                      groupMembers = [];
                      for (var colKey in modelVal)
                      {
                        if(!colKey.startsWith('$$hashKey')) // skip the hashKey in the object
                        {
                          if(angular.isArray(modelVal[colKey]))        // multiCheckbox
                          {
                            //add property to obs
                            var items = [];
                            items = modelVal[colKey];
                             //console.log(items);
                            for (var l = 0; l < items.length; l++)
                            {
                              groupMembers.push({concept:colKey.split('_')[1], value:items[l]});

                            }
                          }
                          else {
                            //add property to obs
                            groupMembers.push({concept:colKey.split('_')[1], value:modelVal[colKey]});

                          }
                        }

                      }
                      //add row to payload
                      //add group items to the obs Array
                      console.log('group member');
                      console.log(groupMembers);
                      obs.push({concept:key, groupMembers:groupMembers});
                  });
                }
              }
            });

            //add group items to the obs Array
            if(repSec === false) obs.push({concept:key, groupMembers:groupMembers});

          });


          //add obs to payload
          payLoad.obs = obs;
          console.log('Pringting payload');
          console.log(JSON.stringify(payLoad));
          return JSON.stringify(payLoad);
        }


        /*private method to create formly fields*/
        function createObsFormlyField(obs_Field, f_type)
        {
          var obsField = {};
          /*
          Distinguish a whether a field belongs to a repeatSection
          The repeatSection requires that we omit the model within
          the field definition while the normal or other fields we maintain
          the model property
          */
          if (f_type !== undefined)
          {
            /*
            assumming that all repeatSection fields will have wiil
            have some parameter value to Distinguish them
            */
            if((obs_Field.type === 'datepicker'))
            {
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: 'datepicker',
                /*
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},
                  */
                templateOptions: {
                  type: 'text',
                  label: obs_Field.label,
                  datepickerPopup: 'dd-MMMM-yyyy',
                  required:required
                },
                validators: {
                  dateValidator: getFieldValidator(obs_Field.validators)
                }

              }
              console.log('returned validator');
              console.log( getFieldValidator(obs_Field.validators));
            }
            else if ((obs_Field.type === 'text') || (obs_Field.type === 'number'))
            {
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: 'input',
                /*
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},
                  */
                templateOptions: {
                  type: obs_Field.type,
                  label: obs_Field.label,
                  required:required
                }
        //         ,
        // validators: {
        //   //ipAddress: validatorsArray['ipAddress']
        // }

              }

            }
            else if(obs_Field.type === 'problem'){
                obsField =  {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: 'ui-select-extended',
                // model: {encounter:'obs_' + obs_Field.idName},
                templateOptions: {
                  type: 'text',
                  label: obs_Field.label,
                  valueProp: 'uuId',
                  labelProp:'display',
                  deferredFilterFunction: SearchDataService.findProblem,
                  getSelectedObjectFunction: SearchDataService.getProblemByUuid,
                  required:false,
                  options:[]
                }
              };
            }
            else if ((obs_Field.type === 'radio') || (obs_Field.type === 'select') || (obs_Field.type === 'multiCheckbox'))
            {
              var opts= [];
              //get the radio/select options/multicheckbox
              for(var l = 0; l<obs_Field.obsAnswerConceptUuids.length; l++)
              {
                 var item={
                   name:obs_Field.obsAnswerLabels[l],
                   value:obs_Field.obsAnswerConceptUuids[l]
                   };
                 opts.push(item);
              }
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: obs_Field.type,
                /*
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},
                  */
                templateOptions: {
                  type: obs_Field.type,
                  label: obs_Field.label,
                  required:required,
                  options:opts
                }
              }

            }
          }
          else {
            /*
            All other fields that do belong
            to the repeating section
            */
            if((obs_Field.type === 'datepicker'))
            {
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: 'datepicker',
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},
                templateOptions: {
                  type: 'text',
                  label: obs_Field.label,
                  datepickerPopup: 'dd-MMMM-yyyy',
                  required:required
                },

        validators: {
          dateValidator: getFieldValidator(obs_Field.validators)
        }

              }
            }
            else if ((obs_Field.type === 'text') || (obs_Field.type === 'number'))
            {
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: 'input',
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},
                templateOptions: {
                  type: obs_Field.type,
                  label: obs_Field.label,
                  required:required
                }
        //         ,
        // validators: {
        //   //ipAddress: validatorsArray['ipAddress']
        // }

              }

            }
            else if ((obs_Field.type === 'radio') || (obs_Field.type === 'select') || (obs_Field.type === 'multiCheckbox'))
            {
              var opts= [];
              //get the radio/select options/multicheckbox
              //console.log(obs_Field);
              for(var l = 0; l<obs_Field.obsAnswerConceptUuids.length; l++)
              {
                 var item={
                   name:obs_Field.obsAnswerLabels[l],
                   value:obs_Field.obsAnswerConceptUuids[l]
                   };
                 opts.push(item);
              }
              var required=false;
              if (obs_Field.required !== undefined) required=Boolean(obs_Field.required);

              obsField = {
                key: 'obs_' + obs_Field.obsConceptUuid,
                type: obs_Field.type,
                model: {obsConceptUuid:obs_Field.obsConceptUuid,
                  obsGroupUuid:obs_Field.obsConceptGroupUuid,
                  answerValue:''},

                templateOptions: {
                  type: obs_Field.type,
                  label: obs_Field.label,
                  required:required,
                  options:opts
                }
              }

            }
          }

          return obsField;
        }

        function createForm(schema) {
          var validatorsArray = {};
          validatorsArray['ipAddress'] = {
            expression: function(viewValue, modelValue) {
              var value = modelValue || viewValue;
              //return !value || /(\d{1,3}\.){3}\d{1,3}/.test(value);
              if (value>100) return false;
            },
            message: '$viewValue + " is above normal acceptable range!"'
          };
          var formSchema=[];
          var field ={};

          //add encounter details
          //console.log(encounterFields);
          //console.log(schema);

          //{"encounterType":"", "type":"text", "labelName":"Encounter Type", "idName":"encounterType"},

          _.each (schema.encounter, function(encField) {
            //console.log(encField)
            if(encField.type === 'datepicker')
            {
              field = {
                key: 'enc_' + encField.idName,
                type: 'datepicker',
                model: {encounter:'enc_' + encField.idName},
                templateOptions: {
                  type: 'text',
                  label: encField.labelName,
                  placeholder: encField.labelName,
                  datepickerPopup: 'dd-MMMM-yyyy'
                },
                validators: {
                  dateValidator: getFieldValidator(encField.validators)
                }
              }
            }
            else if(encField.type === 'text')
            {
              field = {
                key: 'enc_' + encField.idName,
                type: 'input',
                model: {encounter:'enc_' + encField.idName},
                templateOptions: {
                  type: 'text',
                  label: encField.labelName,
                  placeholder: encField.labelName
                }
              }
            }
            else if(encField.type === 'provider-field'){
              field = {
                key: 'enc_' + encField.idName,
                type: 'ui-select-extended',
                model: {encounter:'enc_' + encField.idName},
                templateOptions: {
                  type: 'text',
                  label: encField.labelName,
                  valueProp: 'personUuid',
                  labelProp:'display',
                  deferredFilterFunction: SearchDataService.findProvider,
                  getSelectedObjectFunction: SearchDataService.getProviderByUuid,
                  required:false,
                  options:[]
                }
              }
            }
            else if(encField.type === 'location-field'){
              field = {
                key: 'enc_' + encField.idName,
                type: 'ui-select-extended',
                model: {encounter:'enc_' + encField.idName},
                templateOptions: {
                  type: 'text',
                  label: encField.labelName,
                  valueProp: 'uuId',
                  labelProp:'display',
                  deferredFilterFunction: SearchDataService.findLocation,
                  getSelectedObjectFunction: SearchDataService.getLocationByUuid,
                  required:false,
                  options:[]
                }
              }
            }
            else {
              field = {
                key: 'enc_' + encField.idName,
                type: encField.type,
                model: {encounter:'enc_' + encField.idName},
                templateOptions: {
                  type: 'text',
                  label: encField.labelName,
                  placeholder: encField.labelName,
                  options:[]
                }
              }
            }

            formSchema.push(field);
          });


          var gpSectionRnd = 0 ;
          _.each(schema.obs, function(obs_Field) {
            //console.log(obs_Field)
            var obsField ={};
             //this a random number for grp sections without an obs group
            if ((obs_Field.type === 'repeatSection') || (obs_Field.type === 'repeatsection'))
            {
              var repeatingFields = [];
              //Get the fields in the repeating section

              _.each(obs_Field.cols,function(curField){
                // process the fields the normal way
                var selField=createObsFormlyField(curField,'repeating');
                selField['className'] = 'col-md-2';
                repeatingFields.push(selField);
              })
              obsField = {
                key:'obs_' + obs_Field.obsConceptGroupUuid,
                type: 'repeatSection',
                model:{obsGroupUuid:obs_Field.obsConceptGroupUuid},
                templateOptions: {
                  label:obs_Field.sectionTitle,
                  btnText:'Add ' + obs_Field.buttonLabel,
                  fields:[
                    {
                      className: 'row',
                      fieldGroup:repeatingFields
                    }
                  ]
                }
              }
            }
            else if ((obs_Field.type === 'groupSection') || (obs_Field.type === 'groupsection')){
              var groupingFields = [];
              //Get the fields in the group section

              _.each(obs_Field.cols,function(curField){
                // process the fields the normal way
                var selField=createObsFormlyField(curField,'grouped');
                selField['className'] = 'col-md-2';
                groupingFields.push(selField);
                if(curField.showDate === 'true')
                {
                  var dateField = {
                    className: 'col-md-2',
                    key: 'obsDate_' + curField.obsConceptUuid,
                    type: 'datepicker',
                    templateOptions: {
                      type: 'text',
                      label: 'Date',
                      datepickerPopup: 'dd-MMMM-yyyy'
                    },
                    validators: {
                      dateValidator: getFieldValidator({type:'date'})
                    }
                  }
                  groupingFields.push(dateField);
                }
              })
              gpSectionRnd = gpSectionRnd + 1;
              var sectionKey = obs_Field.obsGroupUuid ? 'obs_' + obs_Field.obsGroupUuid : 'unamed_' + gpSectionRnd;
              obsField = {
                className: 'row',
                key:'obs_'+sectionKey,
                model:{obsGroupUuid:sectionKey},
                fieldGroup:groupingFields
              }
              formSchema.push({template: '<hr /><p><strong>'+obs_Field.sectionTitle +'</strong></p>'});
            }
            else {
              obsField=createObsFormlyField(obs_Field);
            }

            formSchema.push(obsField);

          });

          console.log('sample form');
          console.log(formSchema);

          return formSchema;

        }

    }
})();
