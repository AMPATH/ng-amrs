/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

    FormentryService.$inject = ['$http', 'SearchDataService', 'moment', 'FormValidator', 'CurrentLoadedFormService'];

    function FormentryService( $http, SearchDataService, moment, FormValidator, CurrentLoadedFormService) {
        var service = {
            createForm: createForm,
            validateForm:validateForm,
            getEncounter:getEncounter,
            getFormSchema: getFormSchema,
            getCompiledFormSchema: getCompiledFormSchema,
            updateFormPayLoad: updateFormPayLoad,
            getFieldById_Key:getFieldById_Key
        };

        var obs_id = 0;
        var g_fields; // var to hold all the fields on a form
        var readyFields = [];
        var loaded = false;

        function getFieldById_Key(id_key, searchFields)
        {
          var selected_field;

          //Search from the schema that is being currently built
          if(readyFields.length>0)
          {
            // _.each(readyFields, function(_field){
              _.some(readyFields, function(_field){
              // console.log(_field)
              if(_field.type !== 'repeatSection' && _field.type !== undefined)
              {
                if (_field.key === id_key || _field.data.id === id_key )
                {
                  selected_field =_field;
                  console.log('matched field',_field);
                  // return selected_field;
                  return true;
                }
              }
              else if (_field.type === 'repeatSection'){
                // _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                _.some(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                  if(_field_.key === id_key || _field_.data.id === id_key)
                  {
                    selected_field =_field_;
                    console.log('matched field',_field_);
                    // return selected_field;
                    return true;
                  }
                });
              }
              else {
                // _.each(_field.fieldGroup, function(__field_){
                _.some(_field.fieldGroup, function(__field_){
                  if( __field_.key === id_key ||  __field_.data.id === id_key)
                  {
                    selected_field = __field_;
                    console.log('matched field',__field_);
                    // return selected_field;
                    return true;
                  }
                });
              }
            })
          }

          //search form the complete formly schema that is organized in tabs
          if (searchFields === undefined) searchFields = g_fields;
          // start by looping through the tabs

          if (selected_field === undefined)
          {
            // _.each(searchFields, function(page){
            _.some(searchFields, function(page){
              //loop through the sections in a page
              // _.each(page.form.fields, function(_section){
              _.some(page.form.fields, function(_section){
                /*the assumption is that all questions will be in a section
                but maybe we may have a question that is not isn a section
                */
                if(_section.type === 'section')
                {
                  // _.each(_section.templateOptions.fields[0].fieldGroup, function (_field) {
                  _.some(_section.data.fields, function (_field) {
                    // body...
                    if(_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined)
                    {
                      // console.log('testing selected key_first opt ', _field)
                      if (_field.key === id_key || _field.data.id === id_key )
                      {
                        selected_field =_field;
                        console.log('matched field',_field);
                        // return selected_field;
                        return true;
                      }
                    }
                    else if (_field.type === 'repeatSection'){
                      // _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                      _.some(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                        if(_field_.key === id_key || _field_.data.id === id_key)
                        {
                          selected_field =_field_;
                          console.log('matched field',_field_);
                          // return selected_field;
                          return true;
                        }
                      });
                    }
                    else {
                      // _.each(_field.fieldGroup, function(__field_){
                      _.some(_field.fieldGroup, function(__field_){
                        if( __field_.key === id_key ||  __field_.data.id === id_key)
                        {
                          selected_field = __field_;
                          console.log('matched field',__field_);
                          // return selected_field;
                          return true;
                        }
                      });
                    }
                  });
                }
              });
            });
          }

          if (selected_field === undefined) console.log('No matching Field found')
          return selected_field;
        }

        return service;

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
          var url = 'scripts/formentry/formschema/'+formName;

          $http.get(url, {cache: true})
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
            // console.log('Check Obs', obs_)
            if(obs_.concept.uuid === convertKey_to_uuid(key.split('_')[1])) return obs_;
          });
          return val;
        }

        function getObsValueSelect(key, obs)
        {
          var field_key = key.key

          var opts = [];
          _.each(key.templateOptions.options, function(select_item){

            opts.push(select_item.value);
          });
          var val = _.find(obs,function(obs_){
            // console.log('Check Obs', obs_)
            if(obs_.concept.uuid === convertKey_to_uuid(field_key.split('_')[1]))
            {
              console.log('Check Obs', obs_)
              // if(opts.indexOf(obs_.value.uuid) !== -1)
              return obs_;
            }
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
          if(key !== undefined)
            if(obs_.concept.uuid === convertKey_to_uuid(key.split('_')[1])) return obs_;
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
                console.log('Section: ' + _section.key);
                /*
                Updating the section keys in the model;
                It is important that we update the model with the section key
                because for some reason formly does not see the keys
                even though when you log the page keys you see them
                */
                var sec_key = _section.key;
                var sec_data = model[sec_key] = {};

                //loop through the individual fields in the section and update accordingly
                _.each(_section.data.fields, function(_field){
                  // console.log('Fields Available...')
                  // console.log(_field)
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

                    if (enc_data.provider !== undefined && enc_data.provider !== null)
                    {
                      sec_data['encounterProvider'] = enc_data.provider.uuid;
                      _field.data['init_val'] = enc_data.provider.uuid;
                      //console.log('test Model');
                      //console.log(model);
                    }
                  }
                  else if(_field.key === 'encounterLocation')
                  {
                    if (enc_data.location !== undefined)
                    {
                      sec_data['encounterLocation'] = enc_data.location.uuid;
                      _field.data['init_val'] = enc_data.location.uuid;
                      //console.log('test Model');
                      //console.log(model);
                    }
                  }
                  else if(_field.type === 'select' || _field.type === 'radio' || _field.type === 'ui-select-extended'|| _field.type==='concept-search-select')
                  {
                    field_key = _field.key;
                    // var val = getObsValue(field_key, obs_data);
                    var val = getObsValueSelect( _field, obs_data);
                    // console.log('initial value',val)
                    if(_field.type==='concept-search-select'){
                      // console.log('concept-search-select+++++++',_field);
                      // console.log('initial value',val)
                    }
                    if (val !== undefined)
                    {
                      if(val.value !== null)
                      {
                        sec_data[field_key] = val.value.uuid;
                        _field.data['init_val'] = val.value.uuid;
                        _field.data['uuid'] = val.uuid; //obs uuid

                        // console.log('updated field',_field)
                      }
                    }
                  }
                  else if(_field.type === 'multiCheckbox')
                  {
                    field_key = _field.key;
                    var multiArr = [];
                    var multi_uuid = [];
                    var val = _.filter(obs_data,function(obs){
                      if(obs.concept.uuid === convertKey_to_uuid(field_key.split('_')[1])) return obs;
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
                          if(_.contains(_group_field.key, 'obsDate'))
                          {

                            var val = getObsValue(_group_field.key, obs_data);
                            if(val !== undefined)
                            {
                              // console.log('Obs Date Key', _group_field.key);
                              // console.log('Obs Date value', val);
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
                            if(obs.concept.uuid === convertKey_to_uuid(field_key.split('_')[1])) return obs;
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
                        // console.log('This Section Field')
                        // console.log(field_key);
                        // console.log('OBS GROUP', obs_group_data)
                        var group_data = getObsGroupValue(field_key, obs_group_data);
                        // console.log('NON REPEATING SEC DATA TEST');
                        //console.log(group_data)
                        if(group_data !== undefined)
                        {

                          if(_group_field.type !== 'multiCheckbox')
                          {
                             if(_.contains(_group_field.key, 'obsDate'))
                             {
                               var val = _.find(group_data[0].groupMembers, function(obs){
                                 if(obs.concept.uuid === convertKey_to_uuid(_group_field.key.split('_')[1])) return obs;
                               });

                              //  _.each(group_data, function(_data){
                               //
                              //  })

                               if(val !== undefined)
                               {
                                 group_val[_group_field.key] = val.obsDatetime;
                                 _group_field.data['init_val'] = val.obsDatetime;
                                 _group_field.data['uuid'] = val.uuid; //obs uuid
                               }
                             }
                             else {
                              //  console.log('Area of interest')
                              //  console.log(_group_field)
                              //  console.log(group_data)
                               //console.log(group_data[0].groupMembers)
                              var val;
                              var this_val
                               if(group_data.length>0)
                               {
                                //  val = _.find(group_data[0].groupMembers, function(obs){
                                //    //console.log(obs)
                                //    if(obs.concept.uuid === convertKey_to_uuid(_group_field.key.split('_')[1])) return obs;
                                //  });

                                 _.each(group_data, function(obs){
                                   this_val = _.find(obs.groupMembers, function(obs_var){
                                     //console.log(obs)
                                     if(obs_var.concept.uuid === convertKey_to_uuid(_group_field.key.split('_')[1])) return obs_var;
                                   });
                                   if (this_val !== undefined) val = this_val;
                                 })

                               }

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
                             var val = [];
                             var this_val;
                             //if the field group section field is a multi select
                             if(group_data.length>0)
                             {
                              //  val = _.filter(group_data[0].groupMembers, function(obs){
                              //    if(obs.concept.uuid === convertKey_to_uuid(_group_field.key.split('_')[1])) return obs;
                              //  });

                               _.each(group_data, function(obs){
                                 this_val = _.filter(obs.groupMembers, function(obs_var){
                                   //console.log(obs)
                                   if(obs_var.concept.uuid === convertKey_to_uuid(_group_field.key.split('_')[1])) return obs_var;
                                 });
                                 if (this_val !== undefined) val.push(this_val) ;
                               })
                             }
                             var multiArr = [];
                             var multi_uuid = [];
                             if(val !== undefined)
                             {
                               _.each(val, function(data){
                                 if(angular.isArray(data))
                                 {
                                   _.each(data, function(d){
                                     multiArr.push(d.value.uuid);
                                     multi_uuid.push(d.uuid);
                                   })
                                 }
                                 else {
                                   multiArr.push(data.value.uuid);
                                   multi_uuid.push(data.uuid);
                                 }
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
                             if(group_val!==null || group_val !== '' || group_val !== '')
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
                    // console.log('Group Vaaaal ',group_data)

                    if (group_data !== undefined)
                    {
                      _.each(_field.templateOptions.fields[0].fieldGroup, function (_repeating_field) {
                        // body...
                        // console.log('getting Here ',_repeating_field)
                        field_keys[convertKey_to_uuid(_repeating_field.key.split('_')[1])] = {key:_repeating_field.key, type:_repeating_field.type};
                        // update fields with existing data
                        var arr = [];
                        var arr_uuid = [];
                        _.each(group_data, function(_data){
                          _.each(_data.groupMembers, function(obs){
                            // console.log('getting Here ', obs)
                            if(obs.concept.uuid === convertKey_to_uuid(_repeating_field.key.split('_')[1])){
                              // console.log('Concept uuid',convertKey_to_uuid(_repeating_field.key.split('_')[1]));
                              // console.log(obs)
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
                             console.log(obs.concept.uuid);
                            //  var colKey = 'obs_' + createFieldKey(obs.concept.uuid)
                             var colKey = field_keys[obs.concept.uuid].key

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
                    // console.log('Other Fields Available...')
                    // console.log(_field.type)
                    // console.log(_field)
                    field_key = _field.key;
                    var val = getObsValue(field_key, obs_data);
                    if (val !== undefined)
                    {
                      if (typeof val.value === 'object')
                      {
                        sec_data[field_key] = val.value.uuid;
                        _field.data['init_val'] = val.value.uuid;
                        _field.data['uuid'] = val.uuid; //obs uuid
                      }
                      else {
                        sec_data[field_key] = val.value;
                        _field.data['init_val'] = val.value;
                        _field.data['uuid'] = val.uuid; //obs uuid
                      }

                    }
                  }

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

        function validateForm()
        {

        }

        function validateFieldFormat(sel_field)
        {
          //validate the field to see if it is in the right format before creating the formly equavalent
          var pass = true;
          if(sel_field.type === 'date')
          {
            //check it has validator provided
            if(sel_field.validators.length>0)
            {
              if(!sel_field.validators[0].hasOwnProperty('type'))
              {
                pass = false;
                console.log('This field is a Date type field and you must provide validators', sel_field);
                console.log('Add this: "validators":[{"type":"date"}]')
              }
            }
            else {
              pass = false;
              console.log('This field a Date type field and must provide validators', sel_field);
              console.log('Add this: "validators":[{"type":"date"}]')
            }

          }
          else if(sel_field.showDate === 'true')
          {
            //check it has validator provided
            if(sel_field.validators.length>0)
            {
              if(!sel_field.validators[0].hasOwnProperty('type'))
              {
                pass = false;
                console.log('This field is a Date type field and you must provide validators', sel_field);
                console.log('Add this: "validators":[{"type":"date"}]')
              }
            }
            else {
              pass = false;
              console.log('This field a Date type field and must provide validators', sel_field);
              console.log('Add this: "validators":[{"type":"date"}]')
            }

          }
          else if (sel_field.concept === undefined || sel_field.concept === '')
          {
            pass = false;
            console.log('This field is missing the concept attribute', sel_field);
            console.log('Add this: "concept:concept_uuid')
          }
          else if (sel_field.type === undefined || sel_field.type === '')
          {
            pass = false;
            console.log('This field is missing the type attribute', sel_field);
            console.log('Add this: "type:date/number/select/radio/multiCheckbox')
          }
          else if (sel_field.label === undefined || sel_field.label === '')
          {
            pass = false;
            console.log('This field is missing the label attribute', sel_field);
            console.log('Add this: "label:your label of choice')
          }

          return pass;
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
          _.each(searchSpace.data.fields, function(field){
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

/* generate of create form payLoad helper functions */
        /*
        Private method to get the initial value of a given field
        */
        function getInitialFieldValue(_field_key, _section){
          //Running this function mannually since find method was not doing a good/perfect job
          var data;
          console.log('Section Key:', _section.key)
          _.each(_section.data.fields, function(_field){
            if(_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined)
            {
              // console.log('testing selected key_first opt ', _field)
              if (_field_key === _field.key)
              {
                data =_field;
                // console.log('matched field',_field);
              }

            }
            else if (_field.type === 'repeatSection'){
              _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                if(_field_.key === _field_key)
                {
                  data =_field_;
                  console.log('matched field-repeating field',_field_);
                }
              });
            }
            else {
              _.each(_field.fieldGroup, function(__field_){
                if( __field_.key === _field_key)
                {
                  data = __field_;
                  // console.log('matched field',__field_);
                }
              });
            }
          });

          // console.log('Testing the revised code with new behavihoour: ');
          // console.log(data);

          if(!_.isEmpty(data)) return data.data;
          else return data;
        }

        function createPayloadUn_namedSection(groupValues, obs, section)
        {

          _.each(Object.keys(groupValues), function(group_member){
            //console.log(groupValues[group_member])
            if (groupValues[group_member] !== undefined)
            {
              if (group_member.startsWith('obsDate'))
              {
                var init_data = getInitialFieldValue(group_member, section);
                var sl_obs_id = group_member.slice(7).split('_')[0];
                var sl_obs_key = group_member.split('_')[1]
                var init_data_1 = getInitialFieldValue('obs' + sl_obs_id + '_' + sl_obs_key, section);
                var date_val;
                var obs_val;
                var value_ = getFormattedValue(groupValues[group_member]);
                var concept_ = convertKey_to_uuid(sl_obs_key);
                var value2_ = getFormattedValue(groupValues['obs' + sl_obs_id + '_' + sl_obs_key]);

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
                  if(date_val !== value_ || obs_val !== value2_)
                  {
                    //check if the value is dropped so that we can void it

                    if(value_ === null || value2_ === null || value_ === '' || value2_ === '' || value_ === 'null' || value2_ === 'null')
                    {
                      console.log('Executing Obs to void - 1217')
                      obs.push({uuid:init_data.uuid, voided:true});
                    }
                    else {
                      obs.push({uuid:init_data.uuid, obsDatetime:value_, concept:concept_, value:value2_});
                    }
                  }
                }
                else {
                  //new val being added
                  obs.push({obsDatetime:value_, concept:concept_, value:value2_});
                }

              }
            }
          });

        }


        function createPayloadNonObject(passed_val, key, obs, section)
        {
          var value_ = getFormattedValue(passed_val);
          var concept_ = convertKey_to_uuid(key.split('_')[1]);

          var init_data = getInitialFieldValue(key, section);
          // console.log('field key -1353', key, 'section:',obj)
          // console.log('init_data -1354', init_data)
          var obs_val;
          if (typeof init_data === 'object')
          {
            obs_val = init_data.init_val;
          }
          if (obs_val !== undefined)
          {
            if(obs_val !== value_)
            {
              //check if the value is dropped so that we can void it
              if(passed_val ==='null' || passed_val  === null || passed_val  ==='')
              {
                console.log('Executing Obs to void -- 1253')
                obs.push({uuid:init_data.uuid, voided:true, value:obs_val, concept:concept_});
              }
              else {
                //console.log('Obsuuid - 1264',init_data)
                obs.push({uuid:init_data.uuid,concept:concept_, value:value_});
              }
            }
          }
          else {
            //new val being added
            if(typeof passed_val === 'object')
            {
              /*
              The assumption is that no Object will get to this
              point unless it is a date or blank object
              */
              if(Object.prototype.toString.call(passed_val) === '[object Date]')
                obs.push({concept:concept_, value:value_});
              else
                console.log('Ignoring Empty Object',passed_val);
            }
            else {
              if(value_ !== null && value_ !== 'null' && value_ !== '')
              obs.push({concept:concept_, value:value_});
            }
          }
        }


        function createPayloadObsGroup(passed_val, key, obs, groupMembers, section)
        {
          var obs_index;
          var obs_val;
          var value_ = getFormattedValue(passed_val);
          var init_data = getInitialFieldValue(key, section);
          var concept_ = convertKey_to_uuid(key.split('_')[1]);
          // console.log('field key -1033', group_member, 'section:',obj)
          // console.log('init_data -1034', init_data)
          if(typeof init_data === 'object')
          {
            if (init_data.init_val !== undefined)
            {
              obs_index = init_data.init_val.indexOf(value_);
              obs_val = init_data.init_val[obs_index];
            }

          }
          if (obs_val !== undefined)
          {

            if(obs_val !== value_)
            {
              if(value_ ==='null' || value_ === null || value_ ==='')
              {
                console.log('Executing Obs to void -- 1093')
                obs.push({uuid:init_data.uuid[obs_index], voided:true, value:obs_val, concept:concept_});
              }
              else {
                //console.log('Obsuuid-1126',init_data.uuid[obs_index])
                groupMembers.push({uuid:init_data.uuid[obs_index], concept:concept_,
                            value:value_});
              }
            }
          }
          else {

            if(angular.isArray(passed_val) && passed_val.length === 0)
            {
              //void any existing values
              if (init_data.init_val.length>0)
              {
                _.each(init_data.uuid, function(item_to_void){
                  console.log('Executing Obs to void -- 1112')
                  obs.push({uuid:item_to_void, voided:true, value:obs_val, concept:concept_});
                })
              }
              console.log('Ignoring Empty Array')
            }
            else {
              if(passed_val !== undefined && passed_val !== null && passed_val !=='')
                groupMembers.push({concept:concept_, value:value_});
            }

          }
        }

        function createPayloadObsArray(passed_val, key, obs, groupMembers, section, traversed_objects)
        {
          var init_data = getInitialFieldValue(key, section);
          var obs_index;
          var obs_val;
          var value_ = getFormattedValue(passed_val);
          var concept_ = convertKey_to_uuid(key.split('_')[1]);

          // console.log('field key -1205', key, 'section:',obj)
          // console.log('init_data -1206', init_data)

          if(typeof init_data === 'object')
          {
            if (init_data.init_val !== undefined)
            {
              obs_index = init_data.init_val.indexOf(value_);
              obs_val = init_data.init_val[obs_index];
            }

          }

          if (obs_val !== undefined)
          {
            //missed option
            traversed_objects.push(value_);
            if(obs_val !== value_)
            {
              if(value_ ==='null' || value_ === null || value_ ==='')
              {
                console.log('Executing Obs to void -- 1288')
                obs.push({uuid:init_data.uuid[obs_index], voided:true, value:obs_val, concept:concept_});
              }
              else {
                //console.log('Obsuuid-1126',init_data.uuid[obs_index])
                obs.push({uuid:init_data.uuid[obs_index], concept:concept_,
                            value:value_});
              }
            }
          }
          else {
            obs.push({concept:concept_, value:value_});
          }
        }

        function createPayloadObsGroupArray(passed_val, key, obs, groupMembers, section, traversed_objects)
        {
          var init_data = getInitialFieldValue(key, section);
          var obs_index;
          var obs_val;
          var value_ = getFormattedValue(passed_val);
          var concept_ = convertKey_to_uuid(key.split('_')[1]);
          // console.log('field key -1120', arrKey, 'section:',obj)
          // console.log('init_data -1121', init_data)

          if (typeof init_data === 'object')
          {
            if (init_data.init_val !== undefined)
            {
              console.log('this crazy value 1 ', value_)
              obs_index = init_data.init_val.indexOf(value_);
              obs_val = init_data.init_val[obs_index];
            }
          }

          if (obs_val !== undefined)
          {
            console.log('this crazy value 1 ', value_)
            traversed_objects.push(value_);
            console.log('Updated Traversed Object',traversed_objects)
            if(obs_val !== value_)
            {
                if(value_ ==='null' && value_ === null && value_ ==='')
                {
                  console.log('Executing Obs to void -- 1201')
                  obs.push({uuid:init_data.uuid[obs_index], voided:true, value:obs_val, concept:concept_});
                }
                else {
                  //console.log('Obsuuid-1046',init_data.uuid[obs_index])
                  groupMembers.push({uuid:init_data.uuid[obs_index], concept:concept_,
                              value:value_});
                }
            }
          }
          else {
                //new val being added
                var value_ = getFormattedValue(passed_val);
                // console.log('Getting Here', getFormattedValue(ArrayVal[arrKey]))
                if(value_ !== '' && value_ !== null && value_ !=='null')
                  groupMembers.push({concept:concept_, value:value_});
          }
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

          var formPayLoad = {};
          var obs = [];
          var val;
          var init_data;
          var section;
          var traversed_objects = [];

          // console.log('Test sample model');
          //console.log(model)
          _.each (Object.keys(model), function(obj){
            val = model[obj];
            //console.log('Section: '+ obj + ' No of Keys: '+ Object.keys(val).length);

            //check if the current key is an object
            if(typeof val === 'object')
            {
              //This should be a section
              //console.log(obj);
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
                      //  console.log('OBJECT TYPES')
                      // console.log(key);
                      //  console.log(groupValues);
                      if(_.contains(key, 'unamed')) // having valid obs group concept uuid
                      {
                        console.log('Calling Unamed Section Method')
                        createPayloadUn_namedSection(groupValues, obs, section);
                      }
                      else if (typeof groupValues === 'object')
                      {
                        /*
                        Check if this blank field is an array and has any preloaded data.
                        If field has some data then mark it as voided
                        void.
                        */
                        if(angular.isArray(groupValues) && groupValues.length===0)
                        {
                          console.log('Track blank Array: ',groupValues);
                          // console.log('Group Key: ',key);
                          var blanksToVoid = findValuesToVoid(key, section);
                          // console.log(blanksToVoid)
                          if(blanksToVoid !== undefined)
                          {
                            _.each(blanksToVoid,function(_toVoid){
                              _.each(_toVoid.uuid, function (uuid) {
                                // body...
                                console.log('Executing Obs to void -- 1046')
                                obs.push({uuid:uuid, voided:true});
                              });
                            });
                          }
                        }
                        else if(Object.keys(groupValues).length>0)
                        {
                          groupMembers = [];


                          _.each(Object.keys(groupValues), function(group_member){

                            if (groupValues[group_member] !== undefined)
                            {
                              console.log('group val-1564', group_member);
                              if(typeof groupValues[group_member] === 'object')// array object
                              {


                                var ArrayVal = groupValues[group_member]
                                // console.log('length',Object.keys(ArrayVal).length)

                                groupMembers = [];
                                if(ArrayVal !== undefined && Object.keys(ArrayVal).length === 0)
                                {
                                  //handling items in an obs group
                                  console.log('Calling Obs group method -1');
                                  createPayloadObsGroup(ArrayVal, group_member, obs, groupMembers, section);
                                }
                                else {
                                  /*handling repeating groups*/
                                  _.each(Object.keys(ArrayVal), function(arrKey){
                                    // console.log('Array item val-1597', arrKey);
                                    if(!arrKey.startsWith('$$'))
                                    {
                                      var obs_index;
                                      var obs_val;

                                      if(!arrKey.startsWith('obs'))
                                      {
                                        // console.log('Calling createPayloadObsGroupArray method -1');
                                        // console.log('Traversed Objects -1',traversed_objects);
                                        createPayloadObsGroupArray(ArrayVal[arrKey], group_member, obs, groupMembers, section, traversed_objects)

                                        //multiCheckbox field
                                        //console.log('Multi ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
                                        init_data = getInitialFieldValue(group_member, section);

                                      }
                                      else {
                                        // console.log('Calling createPayloadObsGroupArray method -2');
                                        // console.log('Traversed Objects -2',traversed_objects);
                                        createPayloadObsGroupArray(ArrayVal[arrKey], arrKey, obs, groupMembers, section, traversed_objects)
                                        init_data = getInitialFieldValue(arrKey, section);

                                      }
                                    }

                                  });
                                  // console.log('Init data Object - current', init_data)
                                }


                                if (groupMembers.length>0)
                                {
                                  //console.log('Group key',group_member);
                                  //console.log('Main Key', key);
                                    //obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                                    var concept_ = convertKey_to_uuid(key.split('_')[1]);
                                    obs.push({concept:concept_, groupMembers:groupMembers});
                                    // if(group_member.startsWith('obs_'))
                                    //   {obs.push({concept:convertKey_to_uuid(group_member.split('_')[1]), groupMembers:groupMembers});}
                                    // else {
                                    //   obs.push({concept:convertKey_to_uuid(key.split('_')[1]), groupMembers:groupMembers});
                                    // }
                                }
                                groupMembers = [];
                                // traversed_objects = [];
                              }
                              else {
                                var obs_val;
                                var obs_index;
                                if(!group_member.startsWith('obs'))
                                {
                                  console.log('Calling ObsArray Method')
                                  createPayloadObsArray(groupValues[group_member], key, obs, groupMembers, section, traversed_objects)

                                  //multiCheckbox field
                                  // console.log('Multi ValKey--1192: '+ group_member,'  Value: '+ groupValues[group_member])
                                  init_data = getInitialFieldValue(key, section);

                                }
                                else {
                                  init_data = getInitialFieldValue(group_member, section);
                                  var concept_ = convertKey_to_uuid(group_member.split('_')[1]);
                                  var value_ = getFormattedValue(groupValues[group_member]);

                                  if (typeof init_data === 'object')
                                  {
                                    obs_val = init_data.init_val;
                                  }
                                  if (obs_val !== undefined)
                                  {
                                    if(obs_val !== value_)
                                    {
                                      if(value_ ==='null' || value_ === null || value_ ==='')
                                      {
                                        console.log('Executing Obs to void -- 1323')
                                        obs.push({uuid:init_data.uuid, voided:true, value:obs_val, concept:concept_});
                                      }
                                      else {
                                        //console.log('Obsuuid-1159',init_data)
                                        obs.push({uuid:init_data.uuid, concept:concept_, value:value_});
                                      }
                                    }
                                  }
                                  else {
                                        //new val being added
                                        if(value_ !== null && value_ !=='null' && value_ !=='')
                                          groupMembers.push({concept:concept_, value:value_});
                                  }
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
                              console.log('init date b4 delete ', init_data)
                              if (angular.isArray(init_data.init_val))
                              {
                                _.each(init_data.init_val, function(item){
                                  if(traversed_objects.indexOf(item) === -1)
                                  {
                                    var obs_index = init_data.init_val.indexOf(item);
                                    console.log('Executing Obs to void -- 1354')
                                    console.log('b4 delete xx ', init_data.init_val)
                                    obs.push({voided:true, uuid:init_data.uuid[obs_index]});
                                  }
                                });
                              }
                            }
                          }
                          if (groupMembers.length>0)
                          {
                              var concept_ = convertKey_to_uuid(key.split('_')[1]);
                              obs.push({concept:concept_, groupMembers:groupMembers});
                          }
                        }
                        else {
                          console.log('Calling non object type Section Method -1')
                          createPayloadNonObject(val[key], key, obs, section)
                        }
                      }
                    }
                    else {
                      // value pair are strings or values
                      //console.log('Normal Key pairs');
                      console.log('Calling non object type Section Method -2')
                      createPayloadNonObject(val[key], key, obs, section);
                    }
                  }
                });
                //testing if this works fine hereif(traversed_objects.length>0)

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
                            if (group_member.startsWith('obsDate'))
                            {
                              obs.push({obsDatetime:getFormattedValue(groupValues[group_member]),concept:group_member.split('_')[1], value:getFormattedValue(groupValues['obs' + group_member.slice(7).split('_')[0] + '_' +group_member.split('_')[1]])});
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
        
        function createForm(schema, model, callback)
        {
          obs_id = 0;
          var defaultValue_;
          var pages = schema.pages;
          var tab;
          var tabs = [];
          var sectionFields = [];
          var pageFields = [];
          var field ={};
          var section_id = 0;
          var gpSectionRnd = 0 ; //this a random number for grp sections without an obs group
          var i=0; //page id

          _.each(pages, function(page){
            pageFields = [];
            if (i === 0)
            {
              // adding hidden gender field
              field = {
                key: 'sex',
                type: 'select',
                defaultValue: '',
                data: {},
                templateOptions: {
                  label: 'sex',
                  type: 'text',
                  required:false,
                  options:[{name:'Female', value:'F'},{name:'Male', value:'M'}]
                },
                hideExpression:'model.hide !== ""'
              }
              pageFields.push(field);
            }
            _.each(page.sections, function(section){
              sectionFields = [];
              //section fields
              _.each(section.questions, function(sec_field){
                if (sec_field.default !== undefined)
                {
                  if (sec_field.default === 'today')
                  {
                    defaultValue_ = Date.today().clearTime();
                  }
                  else if (sec_field.default === 'now')
                  {
                    defaultValue_ = Date.today();
                  }
                  else {
                    defaultValue_ = sec_field.default;
                  }
                }
                else {
                  defaultValue_ = '';
                }

                if(sec_field.type === 'encounterDate')
                {
                  var required=false;
                  if (sec_field.required !== undefined) required=Boolean(sec_field.required);

                  field = {
                    key: sec_field.type,
                    type: 'datepicker',
                    defaultValue: defaultValue_,
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      datepickerPopup: 'dd-MMMM-yyyy',
                      required:required
                    },
                    validators: {
                      dateValidator: FormValidator.getDateValidatorObject(sec_field.validators[0]) //this  will require refactoring as we move forward
                    }
                  }
                  addToReadyFields(field)
                }
                else if(sec_field.type === 'encounterProvider')
                {
                  var required=false;
                  if (sec_field.required !== undefined) required=Boolean(sec_field.required);

                  field = {
                    key: sec_field.type,
                    type: 'ui-select-extended',
                    defaultValue:defaultValue_,
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      valueProp: 'personUuid',
                      labelProp:'display',
                      deferredFilterFunction: SearchDataService.findProvider,
                      getSelectedObjectFunction: SearchDataService.getProviderByUuid,
                      required:required,
                      options:[]
                    }
                  }
                  addToReadyFields(field);
                }
                else if(sec_field.type === 'encounterLocation')
                {
                  var required=false;
                  if (sec_field.required !== undefined) required=Boolean(sec_field.required);

                  field = {
                    key: sec_field.type,
                    type: 'ui-select-extended',
                    defaultValue:defaultValue_,
                    data: {encounter:'enc_' + sec_field.type},
                    templateOptions: {
                      type: 'text',
                      label: sec_field.label,
                      valueProp: 'uuId',
                      labelProp:'display',
                      deferredFilterFunction: SearchDataService.findLocation,
                      getSelectedObjectFunction: SearchDataService.getLocationByUuid,
                      required:required,
                      options:[]
                    }
                  }
                  addToReadyFields(field);
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
                addToReadyFields(field)
                addFieldToValidationMetadata(field, section, pageFields, sec_field.type);
              });
              //creating formly field section
              section_id = section_id  + 1;

              var sec_field =
              {
                key:'section_' + section_id,
                type: 'section',
                templateOptions: {
                  label:section.label
                },
                data:{
                  fields:sectionFields
                }
              }
              pageFields.push(sec_field);
            });
            // adding hidden gender field
            //create page fields
            tab =
            {
              title: page.label,
              form:{
                model:model,
                options:{},
                fields:pageFields
              }
            }
            if (i === 0) {
              tab.active = true;
            }
            tabs.push(tab);
            // g_fields = tabs;
            // callback(tabs);
            i = i+1;
          });

          loaded = true;
          g_fields = tabs;
          callback(tabs);
        }

/* Private method to create an array of fields added to the formly schema*/
function addToReadyFields(field)
{
  readyFields.push(field);
}

function addFieldToValidationMetadata(field, section, page, typeOfField){
    //console.log('etl stuff', field);
    if(field && field.data && field.data.id && field.data.id !== ''){
        CurrentLoadedFormService.formValidationMetadata[field.data.id] = {
            key: field.key,
            section: section,
            page: page
        };
    }

    if(typeOfField === 'group'){
           _.each(field.fieldGroup, function(groupField){
               addFieldToValidationMetadata(groupField, section, page, 'field');
           });
    }
}

/* form entry helper local functions  */
/******************************************************************************/
/* create form helper functions */

  function getConditionalValidationParams(params)
  {
    if(params !== undefined)
    {
      var conditionalRequired = _.find(params, function(field){
        if(field.type === 'conditionalRequired')
        return field;
      })
      return conditionalRequired;
    }
  }

  /*
  Private method to create valid keys
  */
  function createFieldKey(key)
  {
    return key.replace(/-/gi,'n'); // $$ Inserts a "$".
  }

  function convertKey_to_uuid(key)
  {
    return key.replace(/n/gi,'-');
  }


  /*
  Private method to create  formly fields without group
  */
  function createFormlyField(obs_field){
    //console.log(obs_field)
    obs_id = obs_id + 1;
    var defaultValue_
    if(obs_field.default !== undefined)
    {
        defaultValue_ = obs_field.default;
    }
    // else {
    //   defaultValue_ = '';
    // }
    var hideExpression_;
    var disableExpression_ = '';

    var id_;
    if(obs_field.id !== undefined)
    {
      id_ = obs_field.id;
    }
    if(obs_field.hide !== undefined)
    {
      hideExpression_= FormValidator.getHideDisableExpressionFunction(obs_field.hide[0]);
    }
    else {
      hideExpression_ = '';
    }


    if(obs_field.disable !== undefined)
    {
      disableExpression_= FormValidator.getHideDisableExpressionFunction(obs_field.disable[0]);
    }
    
    if(obs_field.disableExpression !== undefined){
       disableExpression_= FormValidator.getHideDisableExpressionFunction_JS(obs_field.disableExpression[0]);
    }

    var obsField = {};
    if (validateFieldFormat(obs_field) !== true)
    {
      console.log('Something Went Wrong While creating this field', obs_field)
    }
    //console.log('validators', obs_field);

      var validators;
      if (obs_field.showDate === undefined) //load if the field has no this property (this obs datatime)
          validators = obs_field.validators;

      //set the validator to default validator
      var defaultValidator = {
        expression: function(viewValue, modelValue, scope) {
            return true;
        },
        message: ''
      };

      var compiledValidators = {
          defaultValidator: defaultValidator
      };

      if(validators && validators.length !== 0){
          compiledValidators = FormValidator.getFieldValidators(validators, getFieldById_Key);
      }



    if(obs_field.type === 'date')
    {
      var required='false';
      if (obs_field.required !== undefined)
      {

        required=obs_field.required;
      }
      else {
        //look for conditonal requirements
        var conditionalParams;
        if(validators && validators.length !== 0){
            conditionalParams = getConditionalValidationParams(validators);
        }
        var conditionalRequired;
        if(conditionalParams !== undefined)
        {
          conditionalRequired = FormValidator.getConditionalRequiredExpressionFunction(conditionalParams, getFieldById_Key);
          required = conditionalRequired;
        }

      }

      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        type: 'datepicker',
        data: {concept:obs_field.concept,
          id:id_},
          defaultValue: defaultValue_,
        templateOptions: {
          type: 'text',
          label: obs_field.label,
          datepickerPopup: 'dd-MMMM-yyyy'
        },
         expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      }
    }
    else if (obs_field.type === 'text')
    {
      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;

      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        type: 'input',
        defaultValue: defaultValue_,
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: obs_field.type,
          label: obs_field.label
        },
         expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      }
    }
    else if (obs_field.type === 'number')
    {
      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;

      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        type: 'input',
        defaultValue: defaultValue_,
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: obs_field.type,
          label: obs_field.label,
          min:obs_field.min,
          max:obs_field.max
        },
         expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      }
    }
    else if ((obs_field.type === 'radio') || (obs_field.type === 'select') || (obs_field.type === 'multiCheckbox'))
    {
      var opts= [];
      //Adding unselect option
      if (obs_field.type !== 'multiCheckbox')
        opts.push({name:'', value:undefined});
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

      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;

      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        type: obs_field.type,
        defaultValue: defaultValue_,
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: 'text',
          label: obs_field.label,
          options:opts
        },
        expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      }
    }
    else if(obs_field.type === 'problem'){


      if(validators && validators.length !== 0){
          defaultValidator = FormValidator.getFieldValidator(obs_field.validators[0], getFieldById_Key);
      }

      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;
      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        defaultValue: defaultValue_,
        type: 'ui-select-extended',
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: 'text',
          label: obs_field.label,
          valueProp: 'uuId',
          labelProp:'display',
          deferredFilterFunction: SearchDataService.findProblem,
          getSelectedObjectFunction: SearchDataService.getProblemByUuid,
          options:[]
        },
        expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      };
    }
    else if(obs_field.type === 'drug'){
      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;
      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        type: 'ui-select-extended',
        defaultValue: defaultValue_,
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: 'text',
          label: obs_field.label,
          valueProp: 'uuId',
          labelProp:'display',
          deferredFilterFunction: SearchDataService.findDrugConcepts,
          getSelectedObjectFunction: SearchDataService.getDrugConceptByUuid,
          options:[]
        },
        expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
         validators: compiledValidators
      };
    }
  else if(obs_field.type === 'select-concept-answers'){
      var required='false';
      if (obs_field.required !== undefined) required=obs_field.required;
      obsField = {
        key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
        defaultValue: defaultValue_,
        type: 'concept-search-select',
        data: {concept:obs_field.concept,
          id:id_},
        templateOptions: {
          type: 'text',
          label: obs_field.label,
          options:[],
          displayMember:'label',
          valueMember:'concept',
          questionConceptUuid:obs_field.concept,
          fetchOptionsFunction:SearchDataService.getConceptAnswers

        },
        expressionProperties: {
          'templateOptions.disabled': disableExpression_,
          'templateOptions.required': required,
          'templateOptions.hasListeners' : onValueChanged
         },
        hideExpression:hideExpression_,
        validators: compiledValidators
      };
    }
    // console.log('Obs field', obsField);
    return obsField;
  }

/*
Private method to create Group formly fields
*/
function createGroupFormlyField(obs_field, gpSectionRnd)
{
  var hideExpression_;

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
      if(obs_field.hide !== undefined)
      {
        hideExpression_= FormValidator.getHideDisableExpressionFunction(obs_field.hide[0]);
      }
      else {
        hideExpression_ = '';
      }
      var dateField = {
      //className: 'col-md-2',
      key: 'obsDate' + obs_id + '_' + createFieldKey(curField.concept),
      type: 'datepicker',
      data: {concept:curField.concept,
        answer_value:''},
      templateOptions: {
        type: 'text',
        label: 'Date',
        datepickerPopup: 'dd-MMMM-yyyy'
        },
        expressionProperties: {
          'templateOptions.required': function($viewValue, $modelValue, scope, element) {

            var value = $viewValue || $modelValue;
            var fkey = selField.key
            // console.log('This Key', fkey);
            // console.log('Model val now ',scope.model[fkey])
            return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
           }
         },
        hideExpression:hideExpression_,
      validators: {
        dateValidator: FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
        }
      }
      groupingFields.push(dateField);
    }
  });

  obsField = {
    className: 'row',
    key:'obs' + gpSectionRnd + '_' + createFieldKey(sectionKey),
    fieldGroup:groupingFields
  }

  return obsField;
}

function onValueChanged(viewVal, modelVal, fieldScope){
              if(fieldScope.options.data.id){
                FormValidator.updateListeners(fieldScope.options.data.id, getFieldById_Key);
              }
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

    var selField = createFormlyField(curField);
    //selField['className'] = 'col-md-2';
    //selfField['key'] = selfField['key']
    repeatingFields.push(selField);
    if(curField.showDate === 'true')
    {
      var dateField = {
      //className: 'col-md-2',
      key: 'obsDate' + obs_id + '_' + createFieldKey(curField.concept),
      type: 'datepicker',
      data: {concept:curField.concept,
        answer_value:''},
      templateOptions: {
        type: 'text',
        label: 'Date',
        datepickerPopup: 'dd-MMMM-yyyy'
        },
        expressionProperties: {
          'templateOptions.required': function($viewValue, $modelValue, scope, element) {

            var value = $viewValue || $modelValue;
            var fkey = selField.key
            // console.log('This Key', fkey);
            // console.log('Model val now ',scope.model[fkey])
            return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
           }
         },
      validators: {
        dateValidator: FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
        }
      }
      repeatingFields.push(dateField);
    }
  });
  
  var obsField = {
    key:'obs' + gpSectionRnd + '_' + createFieldKey(obs_field.concept),
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

/*Payload Creation helper functions */
/* private method to format values before posting to the payload*/
function getFormattedValue(value){
    console.log(value)
    if(!value) return value;

    if(typeof value === 'number') return value;

    if(Object.prototype.toString.call(value) === '[object Date]'){
      // if(_.contains(value,':'))
      console.log('convert to date', value)
        value = moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
    }

    //moment().utc();

    var isDateValid = false;
    if (isDateValid === false)
    {
      isDateValid = moment(value, 'YYYY-MM-DDTHH:mm:ssZ').isValid();
      if (isDateValid)
      {
        var stringToValidate = value.substr(0, 10);
        console.log('xxxx ',stringToValidate)
        var rgexp = /(^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$)/;
        var isValidDate = rgexp.test(stringToValidate);
        console.log('yyyy ',isValidDate)
        if (isValidDate)
        {
          isDateValid = true;
        }
        else {
          isDateValid = false;
        }
      }


    }



    if(isDateValid)
    {
      console.log('convert to date XXX', value)
      var localTime = moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
      return localTime;
    }
console.log('Returned value',value);
    return value;
}
    }

})();
