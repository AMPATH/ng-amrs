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
            generateFormPayLoad: generateFormPayLoad,
            updateFormPayLoad: updateFormPayLoad
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

        /*
        private method to obs without obs groups
        */
        function getObsValue(key, obs)
        {
          var val = _.find(obs,function(obs_){
            if(obs_.concept.uuid === key.split('_')[1]) return obs_;
          });

          return val;
        }


        /*
        Private method to get obs group data
        */

        function getObsGroupValue(key, obs)
        {
          var val = _.filter(obs, function(obs_){
          //console.log(obs);
            if(obs_.concept.uuid === key.split('_')[1]) return obs_;
          });
          return val;
        }

        /*
        Method to auto/prefill the form with existing data from OpenMRS
        */
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

            // console.log('Page Test Model ');
            // console.log(model)
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
                  else if(_field.type === 'select' || _field.type === 'radio' || _field.type === 'ui-select-extended')
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
                  else if(_field.type === 'multiCheckbox')
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

                        sec_data[field_key] = multiArr;
                        _field.data['init_val'] = multiArr;
                        _field.data['uuid'] = multi_uuid; //obs uuid
                    }
                  }
                  else if (_field.type === undefined) {
                    // for grouped non repeating fields
                    // console.log('Field Data')
                    // console.log(_field)
                    field_key = _field.key;
                    var group_data = getObsGroupValue(field_key, obs_group_data);
                    field_key = _field.key;

                    var group_val = {};
                    _.each(_field.fieldGroup, function (_group_field) {
                      // body...
                      if(_.contains(field_key, 'unamed')) // using the grouping fields
                      {
                        if(_group_field.type !== 'multiCheckbox')
                        {
                          if(_.contains(_group_field.key, 'obsDate_'))
                          {
                            var val = getObsValue(_group_field.key, obs_data);
                            if(val !== undefined)
                            {
                              group_val[_group_field.key] = val.obsDatetime;
                              _group_field.data['init_val'] = val.obsDatetime;
                              _group_field.data['uuid'] = val.uuid; //obs uuid
                            }
                          }
                          else {
                            var val = getObsValue(_group_field.key, obs_data);

                            if(val !== undefined)
                            {
                              if(typeof val.value === 'object')
                              {
                                group_val[_group_field.key] = val.value.uuid;
                                _group_field.data['init_val'] = val.value.uuid;
                                _group_field.data['uuid'] = val.uuid; //obs uuid
                              }
                              else {
                                group_val[_group_field.key] = val.value;
                                _group_field.data['init_val'] = val.value;
                                _group_field.data['uuid'] = val.uuid; //obs uuid
                              }
                            }

                          }
                        }
                        else {
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

                              group_val[_group_field.key] = multiArr;
                              _group_field.data['init_val'] = multiArr;
                              _group_field.data['uuid'] = multi_uuid; //obs uuid
                          }
                        }
                        if(typeof group_val === 'object')
                        {
                          sec_data[field_key] = group_val;
                        }

                      }
                      else {
                        //valid group uuids
                        var group_data = getObsGroupValue(field_key, obs_group_data);
                        // console.log('NON REPEATING SEC DATA TEST');
                        //console.log(group_data)
                        if(group_data !== undefined)
                        {
                          if(_group_field.type !== 'multiCheckbox')
                          {
                             if(_.contains(_group_field.key, 'obsDate_'))
                             {
                               var val = _.find(group_data[0].groupMembers, function(obs){
                                 if(obs.concept.uuid === _group_field.key.split('_')[1]) return obs;
                               });

                               _.each(group_data, function(_data){

                               })

                               if(val !== undefined)
                               {
                                 group_val[_group_field.key] = val.obsDatetime;
                                 _group_field.data['init_val'] = val.obsDatetime;
                                 _group_field.data['uuid'] = val.uuid; //obs uuid
                               }
                             }
                             else {
                              //  console.log(group_data)
                              //  console.log(group_data[0].groupMembers)

                               var val = _.find(group_data[0].groupMembers, function(obs){
                                 //console.log(obs)
                                 if(obs.concept.uuid === _group_field.key.split('_')[1]) return obs;
                               });

                              //  console.log(val)
                              //  console.log('Key: ', _group_field.key.split('_')[1])
                               if(val !== undefined)
                               {
                                 // console.log('current key: '+ key);
                                 // console.log(field.model[key]);
                                 if(typeof val.value === 'object')
                                 {
                                   group_val[_group_field.key] = val.value.uuid;
                                   _group_field.data['init_val'] = val.value.uuid;
                                   _group_field.data['uuid'] = val.uuid; //obs uuid
                                 }
                                 else {
                                   group_val[_group_field.key] = val.value;
                                   _group_field.data['init_val'] = val.value;
                                   _group_field.data['uuid'] = val.uuid; //obs uuid
                                 }
                               }
                             }
                           }
                           else {
                             //if the field group section field is a multi select
                             var val = _.filter(group_data[0].groupMembers, function(obs){
                               if(obs.concept.uuid === _group_field.key.split('_')[1]) return obs;
                             });
                             var multiArr = [];
                             var multi_uuid = [];
                             if(val !== undefined)
                             {
                               _.each(val, function(data){
                                 multiArr.push(data.value.uuid);
                                 multi_uuid.push(obs.uuid);
                               });
                               group_val[_group_field.key] = multiArr;
                               _group_field.data['init_val'] = multiArr;
                               _group_field.data['uuid'] = multi_uuid; //obs uuid
                             }
                           }
                          //  console.log('Group Value');
                          //  console.log(group_val)
                           if(typeof group_val==='object')
                           {
                             if(!_.isEmpty(group_val))
                             {
                                sec_data[field_key] = group_val;
                             }
                           }
                        }
                      }

                    });
                  }
                  else if(_field.type === 'repeatSection')
                  {
                    //groupped fields
                    var repeating_fields
                    field_key = _field.key;
                    var group_data = getObsGroupValue(field_key, obs_group_data);
                    var field_keys = {};
                    var multiArr = [];
                    // console.log('REPEATING SEC DATA TEST');
                    // console.log(group_data)

                    if (group_data !== undefined)
                    {
                      _.each(_field.templateOptions.fields[0].fieldGroup, function (_repeating_field) {
                        // body...

                        field_keys[_repeating_field.key.split('_')[1]] = {key:_repeating_field.key, type:_repeating_field.type};
                        // update fields with existing data
                        var arr = [];
                        var arr_uuid = [];
                        _.each(group_data, function(_data){
                          _.each(_data.groupMembers, function(obs){
                            if(obs.concept.uuid === _repeating_field.key.split('_')[1]){
                              if (typeof obs.value === 'object')
                              {
                                arr.push(obs.value.uuid);
                                arr_uuid.push(obs.uuid);
                              }
                              else {
                                arr.push(obs.value);
                                arr_uuid.push(obs.uuid);
                              }
                            }
                          });
                        });

                        if(arr.length>0)
                        {
                          _repeating_field.data['init_val'] = arr;
                          _repeating_field.data['uuid'] = arr_uuid;
                          //initialize the array for the next iteration
                          arr = [];
                          arr_uuid = [];
                        }
                      });

                      _.each(group_data, function(_data){
                        var rowVal = {};
                        var arr = [];
                        var arr_uuid = [];
                        _.each(_data.groupMembers, function(obs){
                          //assumed row data
                          if(field_keys[obs.concept.uuid])
                          {
                             //console.log(obs.concept.uuid);
                             var colKey = 'obs_' + obs.concept.uuid

                             //console.log('columns: '+colKey);

                             if(field_keys[obs.concept.uuid].type === 'multiCheckbox')
                             {
                               //_repeating_field.data['uuid'] = obs.uuid; //obs uuid (Not well done yet)
                               if (typeof obs.value === 'object')
                               {
                                 arr.push(obs.value.uuid);
                                 //rowVal[colKey] = obs.value.uuid
                                 //_repeating_field.data['init_val'] = obs.value.uuid;
                               }
                               else {
                                 arr.push(obs.value);
                                 //rowVal[colKey] = obs.value
                                 //_repeating_field.data['init_val'] = obs.value;
                               }
                               if (arr.length>0)
                               {
                                 rowVal[colKey] = arr;
                                 //_repeating_field.data['init_val'] = arr;
                               }

                             }
                             else {
                               //_repeating_field.data['uuid'] = obs.uuid; //obs uuid
                               if (typeof obs.value === 'object')
                               {
                                 rowVal[colKey] = obs.value.uuid
                                 //_repeating_field.data['init_val'] = obs.value.uuid;
                               }
                               else {
                                 rowVal[colKey] = obs.value
                                 //_repeating_field.data['init_val'] = obs.value;
                               }
                             }

                          }
                        });
                        if(typeof rowVal==='object')
                        {
                          if(!_.isEmpty(rowVal))multiArr.push(rowVal);
                        }

                      });
                    }
                    // console.log('repeating values test');
                    // console.log(multiArr)
                    sec_data[field_key] = multiArr;
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
                  // console.log('Updated Fields Available...')
                  // console.log(_field)
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
        Methdod to get all the sections in a schema
        */
        function getFormSections (formly_schema)
        {
          var sections = [];
          _.each(formly_schema, function(page){
            _.each(page.form.fields, function(section){
              sections.push(section);
            });
          });
          return sections;
        }

        /*
        Simple private method to get all preloaded values for
        for fields that have been deleted from the model
        This method is important for editing an existing form
        */
        function findValuesToVoid(key, searchSpace)
        {
          var data=[];
          _.each(searchSpace.templateOptions.fields[0].fieldGroup, function(field){
            if(field.type === 'repeatSection' && key === field.key)
            {
              _.each(field.templateOptions.fields[0].fieldGroup, function(_field){
                data.push(_field.data);
              });
            }
          });
          return data;
        }
        function simpleFind(key, searchSpace)
        {
          var data = angular.copy(searchSpace);
          var result = _.find(data, function(field){
            return field.key === key;
          });
          return result;
        }

        /*
        Private method to get the initial value of a given field
        */
        function getInitialFieldValue(_field_key, _section){
          //Running this function mannually since find method was not doing a good/perfect job
          var data;
          _.each(_section.templateOptions.fields[0].fieldGroup, function(_field){
            if(_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined)
            {
              // console.log('testing selected key_first opt ', _field)
              if (_field_key === _field.key) data =_field;

            }
            else if (_field.type === 'repeatSection'){
              _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                if(_field_.key === _field_key) data =_field_;
              });
            }
            else {
              _.each(_field.fieldGroup, function(_field_){
                if( _field_.key === _field_key) data = _field_
              });
            }
          });

          // console.log('Testing the revised code with new behavihoour: ');
          // console.log(data);

          if(!_.isEmpty(data)) return data.data;
          else return data;
        }


        /*
        Method to update the payload for existing encounter
        */
        function updateFormPayLoad(model, formly_schema, patient, form, uuid)
        {
          /*
          The objective of this method is to create a payload with only updated
          changes
          */
          var sections = getFormSections(formly_schema);

          // var section = _.find(sections, function(sec){
          //   if(sec.key === 'section_1') return sec;
          // });
          //
          // var init_data = getInitialFieldValue('encounterDate', section);
          // console.log('Got VALUE');
          // console.log(init_data);

          var formPayLoad = {};
          var obs = [];
          var val;
          var init_data;
          var section;

          // console.log('Test sample model');
          console.log(model)
          _.each (Object.keys(model), function(obj){
            val = model[obj];
            console.log('Section: '+ obj + ' No of Keys: '+ Object.keys(val).length);

            //check if the current key is an object
            if(typeof val === 'object')
            {
              //This should be a section
              console.log(obj);
              if(obj.startsWith('section')){

                _.each(Object.keys(val), function(key){
                  //console.log('item Key: '+ key);

                  //get section
                  section = _.find(sections, function(sec){
                    if(sec.key === obj) return sec;
                  });

                  //Handling special keys related to encounter
                  if (key === 'encounterProvider' && val[key] !== undefined)
                  {
                    //get previous value
                    init_data = getInitialFieldValue(key, section);
                    if (typeof init_data === 'object')
                    {
                      if (init_data.init_val !== val[key])
                      {
                        //add property to the payload
                        formPayLoad.provider = val[key];
                      }
                    }
                  }
                  else if (key === 'encounterDate' && val[key] !== undefined)
                  {
                    //get previous value
                    init_data = getInitialFieldValue(key, section);
                    if (typeof init_data === 'object')
                    {
                      if (init_data.init_val !== getFormattedValue(val[key]))
                      {
                        //add property to the payload
                        formPayLoad.encounterDatetime = getFormattedValue(val[key]);
                      }
                    }
                  }
                  else if (key === 'encounterLocation' && val[key] !== undefined) {
                    //get previous value
                    init_data = getInitialFieldValue(key, section);
                    if (typeof init_data === 'object')
                    {
                      if (init_data.init_val !== val[key])
                      {
                        //add property to the payload
                        formPayLoad.location = val[key];
                      }
                    }
                  }
                  else if (val[key] !== undefined) {
                    if (typeof val[key] === 'object') {
                      //this is the case when we have obs groups that are not repeating

                      var groupValues = val[key];
                      var groupMembers = [];
                      // console.log('OBJECT TYPES')
                      // console.log(key);
                      // console.log(groupValues);
                      if(_.contains(key, 'unamed')) // having valid obs group concept uuid
                      {
                        _.each(Object.keys(groupValues), function(group_member){
                          //console.log(groupValues[group_member])
                          if (groupValues[group_member] !== undefined)
                          {
                            if (group_member.startsWith('obsDate_'))
                            {
                              init_data = getInitialFieldValue(group_member, section);
                              var init_data_1 = getInitialFieldValue('obs_'+group_member.split('_')[1], section);
                              var date_val;
                              var obs_val;
                              if (typeof init_data === 'object')
                              {
                                date_val = init_data.init_val;
                              }
                              if (typeof init_data_1 === 'object')
                              {
                                obs_val = init_data_1.init_val;
                              }
                              if (date_val !== undefined || obs_val !== undefined)
                              {
                                if(date_val !== getFormattedValue(groupValues[group_member]) || obs_val !== getFormattedValue(groupValues['obs_'+group_member.split('_')[1]]))
                                {
                                  //check if the value is dropped so that we can void it
                                  if(groupValues[group_member]=== null || groupValues['obs_'+group_member.split('_')[1]] === null || groupValues[group_member]=== '' || groupValues['obs_'+group_member.split('_')[1]] === '' || groupValues[group_member] === 'null' || groupValues['obs_'+group_member.split('_')[1]] === 'null')
                                  {
                                    obs.push({uuid:init_data.uuid, voided:true});
                                  }
                                  else {
                                    obs.push({uuid:init_data.uuid, obsDatetime:getFormattedValue(groupValues[group_member]),concept:group_member.split('_')[1], value:getFormattedValue(groupValues['obs_'+group_member.split('_')[1]])});
                                  }
                                }
                              }
                              else {
                                //new val being added
                                obs.push({obsDatetime:getFormattedValue(groupValues[group_member]),concept:group_member.split('_')[1], value:getFormattedValue(groupValues['obs_'+group_member.split('_')[1]])});
                              }

                            }
                          }
                        });

                      }
                      else if (typeof groupValues === 'object')
                      {
                        /*
                        Check if this blank field is an array and has any preloaded data.
                        If field has some data then mark it as voided
                        void.
                        This may be important for repeating sections
                        */
                        if(angular.isArray(groupValues) && groupValues.length===0)
                        {
                          // console.log('Track blank Array: ',groupValues);
                          // console.log('Group Key: ',key);
                          var blanksToVoid = findValuesToVoid(key, section);
                          // console.log(blanksToVoid)
                          if(blanksToVoid !== undefined)
                          {
                            _.each(blanksToVoid,function(_toVoid){
                              _.each(_toVoid.uuid, function (uuid) {
                                // body...
                                obs.push({uuid:uuid, voided:true});
                              });
                            });
                          }
                        }
                        if(Object.keys(groupValues).length>0)
                        {
                          groupMembers = [];
                          var traversed_objects = [];
                          _.each(Object.keys(groupValues), function(group_member){

                            if (groupValues[group_member] !== undefined)
                            {
                              if(typeof groupValues[group_member] === 'object')// array object
                              {
                                // console.log('OBJECT TYPE')
                                // console.log('Testing Object Vals');
                                // console.log('ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
                                var ArrayVal = groupValues[group_member]
                                groupMembers = [];
                                _.each(Object.keys(ArrayVal), function(arrKey){
                                  if(!arrKey.startsWith('$$'))
                                  {

                                    // groupMembers.push({concept:arrKey.split('_')[1],
                                    //             value:getFormattedValue(ArrayVal[arrKey])});
                                    // console.log('ARRAY Section_id: ', obj);
                                    // console.log('Testing grouped values');
                                    // console.log('ARRAY KEY');
                                    // console.log(arrKey);
                                    // console.log('Value: ', getFormattedValue(ArrayVal[arrKey]));
                                    init_data = getInitialFieldValue(arrKey, section);

                                    // console.log('INIT DATA');
                                    // console.log(init_data);

                                    var obs_index;
                                    var obs_val;
                                    if (typeof init_data === 'object')
                                    {
                                      if (init_data.init_val !== undefined)
                                      {
                                        obs_index = init_data.init_val.indexOf(getFormattedValue(ArrayVal[arrKey]));
                                        obs_val = init_data.init_val[obs_index];
                                      }
                                    }

                                    if (obs_val !== undefined)
                                    {
                                      traversed_objects.push(getFormattedValue(ArrayVal[arrKey]));
                                      if(obs_val !== getFormattedValue(ArrayVal[arrKey]))
                                      {
                                          if(getFormattedValue(ArrayVal[arrKey]) ==='null' && getFormattedValue(ArrayVal[arrKey]) === null && getFormattedValue(ArrayVal[arrKey]) ==='')
                                          {
                                            obs.push({uuid:init_data.uuid, voided:true});
                                          }
                                          else {
                                            groupMembers.push({uuid:init_data.uuid[obs_index], concept:arrKey.split('_')[1],
                                                        value:getFormattedValue(ArrayVal[arrKey])});
                                          }
                                      }
                                    }
                                    else {
                                          //new val being added
                                          // console.log('Getting Here', getFormattedValue(ArrayVal[arrKey]))
                                          if(getFormattedValue(ArrayVal[arrKey]) !== '' && getFormattedValue(ArrayVal[arrKey]) !== null && getFormattedValue(ArrayVal[arrKey]) !=='null')
                                            groupMembers.push({concept:arrKey.split('_')[1],
                                                        value:getFormattedValue(ArrayVal[arrKey])});
                                    }
                                  }

                                });

                                if (groupMembers.length>0)
                                {
                                    obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                                }
                                groupMembers = [];
                              }
                              else {
                                  // console.log('NONE OBJECT TYPE')
                                  // console.log('Testing Object Vals');
                                  // console.log('ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
                                // groupMembers.push({concept:group_member.split('_')[1],
                                //             value:getFormattedValue(groupValues[group_member])});
                                init_data = getInitialFieldValue(group_member, section);
                                // console.log('NON ARRAY Section_id: ', obj);
                                // console.log('Testing grouped values Special ');
                                // console.log('GROUP KEY');
                                // console.log(group_member)
                                // console.log('INIT DATA');
                                // console.log(init_data);
                                var obs_val;
                                if (typeof init_data === 'object')
                                {
                                  obs_val = init_data.init_val;
                                }
                                if (obs_val !== undefined)
                                {
                                  if(obs_val !== getFormattedValue(groupValues[group_member]))
                                  {
                                    if(getFormattedValue(groupValues[group_member])==='null' || getFormattedValue(groupValues[group_member]) === null || getFormattedValue(groupValues[group_member]) ==='')
                                    {
                                      obs.push({uuid:init_data.uuid, voided:true});
                                    }
                                    else {
                                      obs.push({uuid:init_data.uuid, concept:group_member.split('_')[1],
                                                  value:getFormattedValue(groupValues[group_member])});
                                    }
                                  }
                                }
                                else {
                                      //new val being added
                                      if(getFormattedValue(groupValues[group_member])!==null && getFormattedValue(groupValues[group_member])!=='null' && getFormattedValue(groupValues[group_member])!=='')
                                        groupMembers.push({concept:group_member.split('_')[1],
                                                    value:getFormattedValue(groupValues[group_member])});
                                }
                              }
                            }
                          });
                          // console.log('Traversed Items,',traversed_objects);
                          // console.log('All Items', init_data.init_val)
                          // //Droping items in the list array that left out
                          if(traversed_objects.length>0)
                          {
                            if(!_.isEmpty(init_data))
                            {
                              _.each(init_data.init_val, function(item){
                                if(traversed_objects.indexOf(item) === -1)
                                {
                                  var obs_index = init_data.init_val.indexOf(item);
                                  obs.push({voided:true, uuid:init_data.uuid[obs_index]});
                                }
                              });
                            }
                          }
                          if (groupMembers.length>0)
                          {
                              obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                          }
                        }
                        else {
                          // value pair are strings or values
                          // console.log('Complex Object Key pairs');
                          // console.log('type of: ', typeof(val[key]), 'Keys: ', Object.keys(val[key]));
                          // console.log('Payload Value ', getFormattedValue(val[key]))
                          init_data = getInitialFieldValue(key, section);
                          var obs_val;
                          if (typeof init_data === 'object')
                          {
                            obs_val = init_data.init_val;
                          }
                          if (obs_val !== undefined)
                          {
                            if(obs_val !== getFormattedValue(val[key]))
                            {
                              //check if the value is dropped so that we can void it
                              if(val[key] ==='null' || val[key]  === null || val[key]  ==='')
                              {
                                obs.push({uuid:init_data.uuid, voided:true});
                              }
                              else {
                                obs.push({uuid:init_data.uuid, concept:key.split('_')[1], value:getFormattedValue(val[key])});
                              }
                            }
                          }
                          else {
                            //new val being added
                            if(typeof val[key] === 'object')
                            {
                              //console.log('Line 957',val[key])
                              /*
                              The assumption is that no Object will get to this
                              point unless it is a date or blank object
                              */
                              if(Object.prototype.toString.call(val[key]) === '[object Date]')
                                obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                              else
                                console.log('Ingoring Empty Object',val[key]);

                            }
                            else {
                              if(getFormattedValue(val[key]) !=='null' && getFormattedValue(val[key]) !==null && getFormattedValue(val[key]) !=='')
                                obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                            }
                          }
                        }
                      }
                    }
                    else {
                      // value pair are strings or values
                      //console.log('Normal Key pairs');
                      init_data = getInitialFieldValue(key, section);
                      var obs_val;
                      if (typeof init_data === 'object')
                      {
                        obs_val = init_data.init_val;
                      }
                      if (obs_val !== undefined)
                      {
                        if(obs_val !== getFormattedValue(val[key]))
                        {
                          //check if the value is dropped so that we can void it
                          if(val[key] ==='null' || val[key]  === null || val[key]  ==='')
                          {
                            obs.push({uuid:init_data.uuid, voided:true});
                          }
                          else {
                            obs.push({uuid:init_data.uuid,concept:key.split('_')[1], value:getFormattedValue(val[key])});
                          }
                        }
                      }
                      else {
                        //new val being added
                        if(typeof val[key] === 'object')
                        {
                          /*
                          The assumption is that no Object will get to this
                          point unless it is a date or blank object
                          */
                          if(Object.prototype.toString.call(val[key]) === '[object Date]')
                            obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                          else
                            console.log('Ingoring Empty Object',val[key]);
                        }
                        else {
                          if(getFormattedValue(val[key])!==null && getFormattedValue(val[key])!=='null' && getFormattedValue(val[key])!=='')
                          obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                        }
                      }
                    }
                  }
                });
              }
            }
          });

          formPayLoad.obs = obs;
          if(!_.isEmpty(obs))
          {
            // console.log('Patient Selected', patient.uuid())
            formPayLoad['patient'] = patient.uuid();
            formPayLoad['encounterType'] = form.encounterType;
            if(uuid !== undefined)
            {
              //encounter uuid for existing encounter
              formPayLoad['uuid'] = uuid;
            }
          }
          return formPayLoad;

        }

        /*
        Method/function to create to create Form payLoad given the model
        */
        function generateFormPayLoad(model/*, patient, form, uuid*/){
          var formPayLoad = {};
          var obs = [];
          var val;
          // console.log('Test sample model');
          // console.log(model)
          _.each (Object.keys(model), function(obj){
            val = model[obj];
            //console.log('Section: '+ obj + 'No of Keys: '+ Object.keys(val).length);

            //check if the current key is an object
            if(typeof val === 'object')
            {
              //This could be a section or just and independent group outside the section
              if(obj.startsWith('section')){

                _.each(Object.keys(val), function(key){
                  //console.log('item Key: '+ key);
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
                    if (typeof val[key] === 'object') {
                      //this is the case when we have obs groups that are not repeating

                      var groupValues = val[key];
                      var groupMembers = [];
                      // console.log('OBJECT TYPES')
                      // console.log(key);
                      // console.log(groupValues);
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
                      else if (typeof groupValues === 'object')
                      {
                        if(Object.keys(groupValues).length>0)
                        {
                          groupMembers = [];
                          _.each(Object.keys(groupValues), function(group_member){

                            if (groupValues[group_member] !== undefined)
                            {
                              if(typeof groupValues[group_member] === 'object')// array object
                              {
                                // console.log('OBJECT TYPE')
                                // console.log('Testing Object Vals');
                                // console.log('ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
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
                                groupMembers = [];
                              }
                              else {
                                  // console.log('NONE OBJECT TYPE')
                                  // console.log('Testing Object Vals');
                                  // console.log('ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
                                groupMembers.push({concept:group_member.split('_')[1],
                                            value:getFormattedValue(groupValues[group_member])});
                              }
                            }
                          });
                          if (groupMembers.length>0)
                          {
                              obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                          }
                        }
                        else {
                          // value pair are strings or values
                          // console.log('Complex Object Key pairs');
                          // console.log('type of: ', typeof(val[key]), 'Keys: ', Object.keys(val[key]));
                          // console.log('Payload Value ', getFormattedValue(val[key]))
                          if(getFormattedValue(val[key])!==null||  getFormattedValue(val[key])!=='null' || getFormattedValue(val[key])!=='')
                          obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                        }
                      }
                    }
                    else {
                      // value pair are strings or values
                      //console.log('Normal Key pairs');
                      obs.push({concept:key.split('_')[1], value:getFormattedValue(val[key])});
                    }
                  }
                });
              }
            }
          });

          formPayLoad.obs = obs;
          // console.log('Sample payLoad');
          // console.log(formPayLoad)
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
            //Adding unselect option
            if (obs_field.type !== 'multiCheckbox')
              opts.push({name:'', value:'null'});
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
          else if(obs_field.type === 'drug'){
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
                deferredFilterFunction: SearchDataService.findDrugConcepts,
                getSelectedObjectFunction: SearchDataService.getDrugConceptByUuid,
                required:required,
                options:[]
              }
            };
          }
        else if(obs_field.type === 'showcodedanswers'){
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
                deferredFilterFunction: SearchDataService.findDrugConcepts,
                getSelectedObjectFunction: SearchDataService.getDrugConceptByUuid,
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
              data: {concept:curField.concept,
                answer_value:''},
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
          // console.log(JSON.stringify(tabs))
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
