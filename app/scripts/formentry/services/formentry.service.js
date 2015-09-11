/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

    FormentryService.$inject = ['$http', 'SearchDataService', 'moment', 'FormValidator'];

    function FormentryService($http, SearchDataService, moment, FormValidator) {
        var service = {
            createForm: createForm,
            getConceptUuid:getConceptUuid,
            validateForm:validateForm,
            getEncounter:getEncounter,
            getFormSchema: getFormSchema,
            getCompiledFormSchema: getCompiledFormSchema,
            generateFormPayLoad: generateFormPayLoad,
            updateFormPayLoad: updateFormPayLoad,
            lastFormValidationMetadata: {},
            currentFormModel: {}
        };
        var obs_id = 0;

        return service;

        function getFieldKeyById(id_, searchFields)
        {
          var result;
          _.each(searchFields, function(cfield){
            if(cfield.data && cfield.data.id === id_) result = cfield.key
          })
          return result;
        }


        function getFieldValidator(params)
        {
           //console.log('Validation params');
           //console.log(params);

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
                  // console.log('Today: '+curDate);
                  // console.log('Date Entered: '+dateValue.clearTime());
                  // console.log(dateValue.isAfter(curDate));
                  return !dateValue.isAfter(curDate);
                }
                if (value === undefined) return true;

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
               
                if(value !== undefined && value !== null && value !== '')
                {
                     console.log('before lunch: ', value);
                  dateValue = Date.parse(value,'d-MMM-yyyy').clearTime();
                }
                if(dateValue !== undefined && dateValue !== null && value !== '')
                {
                  //return !dateValue.isBefore(curDate);
                  return true;
                }
                else return true;

              },
              message: '"Should be a future date!"'
            };
          }
          
          if((params.type === 'conditional-answered'))
          {
            return {
              expression: function(viewValue, modelValue, elementScope) {
                  
                  var val = viewValue || modelValue;
                  
                  var referenceQuestionkey = getFieldKeyFromGlobalById(params.referenceQuestionId);
                  
                  var referenceQuestionCurrentValue = FormValidator.getAnswerByQuestionKey(service.currentFormModel, referenceQuestionkey);
                   
                   var referenceQuestionAllowableAnswers = params.referenceQuestionAnswers;
                   
                   var isValid = false;
                                      
                   _.each(referenceQuestionAllowableAnswers, function(answer) {
                       if(referenceQuestionCurrentValue === answer)
                        isValid = true;
                   });
                  console.log('isValid',isValid);
                  return isValid;
              },
              message: params.message
            };
          }
          
          
          

          if(params.field !== undefined && params.value !== undefined)
          {
            var result;
            var results;
            // if(params.value.length>0)
            // {
            //   var i = 0;
            //   _.each(params.value, function(val){
            //     //result = 'model.' + 'obs_' + createFieldKey(params.field) + ' !== ' +
            //     // result = 'scope.model.' + 'obs_' + createFieldKey(params.field) + ' === ' +
            //     // '"' + val + '"';
            //     result = val;
            //     if(i === 0) results = result;
            //     else results = results + ' && ' + result;
            //     i=i+1;
            //   });
            // }


            return (function($viewValue, $modelValue, scope, element) {
              //if element is undefined then we are looking for a disable expression
              //if element is defined then we are looking for a hide expression   
                
              var i = 0;
              // console.log('current scope', scope)
              var fkey;
              
              if(params.field === 'gender' || params.field === 'sex') fkey = 'sex';
              else fkey = getFieldKeyById(params.field, scope.fields)
              
              //else fkey = getFieldKeyFromGlobalById(params.field);
              
              _.each(params.value, function(val){
                  
                result = scope.model[fkey] !== val
                //result = FormValidator.getAnswerByQuestionKey(fkey) !== val
                if(i === 0) results = result;
                else results = results  && result;
                i = i+1;
                
              });
              
              
              //console.log('results: ' + results);
              
              if(results === true){
                  //console.log('+++scope ',scope);
                  // console.log('+++model ', scope.model);
                  // console.log('+++this ', this);
                  if(element) {
                      //case hide
                    FormValidator.clearQuestionValueByKey(scope.model, element.options.key);
                  }
                  else {
                      //case disable
                    FormValidator.clearQuestionValueByKey(scope.model, scope.options.key);    
                  }
              }
              return results;
            });
          }
        }
        
        function getFieldKeyFromGlobalById(id){
            var obj = service.lastFormValidationMetadata[id];
            if(obj)
                return service.lastFormValidationMetadata[id].key;
            return null;    
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
            //handle boolen TYPES - dirty hack
            // console.log('Check Boolean ', select_item)
            // if (select_item.value === 'true') opts.push('a899b35c-1350-11df-a1f1-0026b9348838');
            // else if (select_item.value === 'false') opts.push('a899b42e-1350-11df-a1f1-0026b9348838');
            // else
            opts.push(select_item.value);
          });
          var val = _.find(obs,function(obs_){
            // console.log('Check Obs', obs_)
            if(obs_.concept.uuid === convertKey_to_uuid(field_key.split('_')[1]))
            {
              console.log('Check Obs', obs_)
              if(opts.indexOf(obs_.value.uuid) !== -1) return obs_;
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
                _.each(_section.templateOptions.fields[0].fieldGroup, function(_field){
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

                    if (enc_data.provider !== undefined)
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
                    console.log('initial value',val)
                    if (val !== undefined)
                    {
                      if(val.value !== null)
                      {
                        sec_data[field_key] = val.value.uuid;
                        _field.data['init_val'] = val.value.uuid;
                        _field.data['uuid'] = val.uuid; //obs uuid

                        console.log('updated field',_field)
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
                              console.log('Obs Date Key', _group_field.key);
                              console.log('Obs Date value', val);
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
                    console.log('REPEATING SEC DATA TEST');
                    console.log('Group Vaaaal ',group_data)

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
                            console.log('getting Here ', obs)
                            if(obs.concept.uuid === convertKey_to_uuid(_repeating_field.key.split('_')[1])){
                              console.log('Concept uuid',convertKey_to_uuid(_repeating_field.key.split('_')[1]));
                              console.log(obs)
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
                      // sec_data[field_key] = val.value;
                      // _field.data['init_val'] = val.value;
                      // _field.data['uuid'] = val.uuid; //obs uuid
                    }
                  }
                  // console.log('Updated Fields Available...')
                  // console.log(_field.type)
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
          console.log('Section Key:', _section.key)
          _.each(_section.templateOptions.fields[0].fieldGroup, function(_field){
            if(_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined)
            {
              // console.log('testing selected key_first opt ', _field)
              if (_field_key === _field.key)
              {
                data =_field;
                console.log('matched field',_field);
              }

            }
            else if (_field.type === 'repeatSection'){
              _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_){
                if(_field_.key === _field_key)
                {
                  data =_field_;
                  console.log('matched field',_field_);
                }
              });
            }
            else {
              _.each(_field.fieldGroup, function(__field_){
                if( __field_.key === _field_key)
                {
                  data = __field_;
                  console.log('matched field',__field_);
                }
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
                       //console.log('OBJECT TYPES')
                      // console.log(key);
                       //console.log(groupValues);
                      if(_.contains(key, 'unamed')) // having valid obs group concept uuid
                      {
                        _.each(Object.keys(groupValues), function(group_member){
                          //console.log(groupValues[group_member])
                          if (groupValues[group_member] !== undefined)
                          {
                            if (group_member.startsWith('obsDate'))
                            {
                              init_data = getInitialFieldValue(group_member, section);
                              var sl_obs_id = group_member.slice(7).split('_')[0];
                              var sl_obs_key = group_member.split('_')[1]
                              var init_data_1 = getInitialFieldValue('obs' + sl_obs_id + '_' + sl_obs_key, section);
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
                                if(date_val !== getFormattedValue(groupValues[group_member]) || obs_val !== getFormattedValue(groupValues['obs' + sl_obs_id + '_' + sl_obs_key]))
                                {
                                  //check if the value is dropped so that we can void it

                                  if(groupValues[group_member]=== null || groupValues['obs' + sl_obs_id + '_' + sl_obs_key] === null || groupValues[group_member]=== '' || groupValues['obs' + sl_obs_id + '_' + sl_obs_key] === '' || groupValues[group_member] === 'null' || groupValues['obs' + sl_obs_id + '_' + sl_obs_key] === 'null')
                                  {
                                    console.log('Executing Obs to void - 1011')
                                    obs.push({uuid:init_data.uuid, voided:true});
                                  }
                                  else {
                                    obs.push({uuid:init_data.uuid, obsDatetime:getFormattedValue(groupValues[group_member]),concept:convertKey_to_uuid(sl_obs_key), value:getFormattedValue(groupValues['obs' + sl_obs_id + '_'+sl_obs_key])});
                                  }
                                }
                              }
                              else {
                                //new val being added
                                obs.push({obsDatetime:getFormattedValue(groupValues[group_member]),concept:convertKey_to_uuid(sl_obs_key), value:getFormattedValue(groupValues['obs' + sl_obs_id + '_'+sl_obs_key])});
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
                                consol.log('Executing Obs to void -- 1046')
                                obs.push({uuid:uuid, voided:true});
                              });
                            });
                          }
                        }
                        if(Object.keys(groupValues).length>0)
                        {
                          groupMembers = [];
                          var traversed_objects = [];
                          // console.log('group val', groupValues);
                          _.each(Object.keys(groupValues), function(group_member){

                            if (groupValues[group_member] !== undefined)
                            {
                              // console.log('group val-1008', groupValues);
                              if(typeof groupValues[group_member] === 'object')// array object
                              {
                                //  console.log('OBJECT TYPE')
                                //  console.log('Testing Object Vals');
                                //  console.log('ValKey: '+ group_member,'  Value: ', groupValues[group_member])

                                var ArrayVal = groupValues[group_member]
                                // console.log('length',Object.keys(ArrayVal).length)
                                groupMembers = [];
                                if(ArrayVal !== undefined && Object.keys(ArrayVal).length === 0)
                                {
                                  //handling some dates

                                  init_data = getInitialFieldValue(group_member, section);
                                  // console.log('field key -1033', group_member, 'section:',obj)
                                  // console.log('init_data -1034', init_data)
                                  if(typeof init_data === 'object')
                                  {
                                    if (init_data.init_val !== undefined)
                                    {
                                      obs_index = init_data.init_val.indexOf(getFormattedValue(groupValues[group_member]));
                                      obs_val = init_data.init_val[obs_index];
                                    }

                                  }
                                  if (obs_val !== undefined)
                                  {

                                    if(obs_val !== getFormattedValue(groupValues[group_member]))
                                    {
                                      if(getFormattedValue(groupValues[group_member])==='null' || getFormattedValue(groupValues[group_member]) === null || getFormattedValue(groupValues[group_member]) ==='')
                                      {
                                        consol.log('Executing Obs to void -- 1093')
                                        obs.push({uuid:init_data.uuid[obs_index], voided:true});
                                      }
                                      else {
                                        //console.log('Obsuuid-1126',init_data.uuid[obs_index])
                                        groupMembers.push({uuid:init_data.uuid[obs_index], concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                    value:getFormattedValue(groupValues[group_member])});
                                      }
                                    }
                                  }
                                  else {

                                    if(angular.isArray(groupValues[group_member]) && groupValues[group_member].length === 0)
                                    {
                                      //void any existing values
                                      if (init_data.init_val.length>0)
                                      {
                                        _.each(init_data.uuid, function(item_to_void){
                                          consol.log('Executing Obs to void -- 1112')
                                          obs.push({uuid:item_to_void, voided:true});
                                        })
                                      }
                                      console.log('Ignoring Empty Array')
                                    }
                                    else {
                                      if(groupValues[group_member] !== undefined && groupValues[group_member] !== null && groupValues[group_member] !=='')
                                        groupMembers.push({concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                  value:getFormattedValue(groupValues[group_member])});
                                    }

                                  }
                                }
                                else {

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
                                      var obs_index;
                                      var obs_val;

                                      if(!arrKey.startsWith('obs'))
                                      {
                                        //multiCheckbox field
                                        //console.log('Multi ValKey: '+ group_member,'  Value: '+ groupValues[group_member])
                                        init_data = getInitialFieldValue(group_member, section);
                                        // console.log('field key -1086', group_member, 'section:',obj)
                                        // console.log('init_data -1087', init_data)
                                        if(typeof init_data === 'object')
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
                                            if(getFormattedValue(ArrayVal[arrKey])==='null' || getFormattedValue(ArrayVal[arrKey]) === null || getFormattedValue(ArrayVal[arrKey]) ==='')
                                            {
                                              consol.log('Executing Obs to void -- 1165')
                                              obs.push({uuid:init_data.uuid[obs_index], voided:true});
                                            }
                                            else {
                                              //console.log('Obsuuid-1009',init_data.uuid[obs_index])
                                              groupMembers.push({uuid:init_data.uuid[obs_index], concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                          value:getFormattedValue(ArrayVal[arrKey])});
                                            }
                                          }
                                        }
                                        else {
                                          groupMembers.push({concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                      value:getFormattedValue(ArrayVal[arrKey])});
                                        }
                                      }
                                      else {
                                        init_data = getInitialFieldValue(arrKey, section);
                                        // console.log('field key -1120', arrKey, 'section:',obj)
                                        // console.log('init_data -1121', init_data)

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
                                                consol.log('Executing Obs to void -- 1201')
                                                obs.push({uuid:init_data.uuid[obs_index], voided:true});
                                              }
                                              else {
                                                //console.log('Obsuuid-1046',init_data.uuid[obs_index])
                                                groupMembers.push({uuid:init_data.uuid[obs_index], concept:convertKey_to_uuid(arrKey.split('_')[1]),
                                                            value:getFormattedValue(ArrayVal[arrKey])});
                                              }
                                          }
                                        }
                                        else {
                                              //new val being added
                                              // console.log('Getting Here', getFormattedValue(ArrayVal[arrKey]))
                                              if(getFormattedValue(ArrayVal[arrKey]) !== '' && getFormattedValue(ArrayVal[arrKey]) !== null && getFormattedValue(ArrayVal[arrKey]) !=='null')
                                                groupMembers.push({concept:convertKey_to_uuid(arrKey.split('_')[1]),
                                                            value:getFormattedValue(ArrayVal[arrKey])});
                                        }
                                      }
                                    }

                                  });
                                }

                                if(traversed_objects.length>0)
                                {
                                  if(!_.isEmpty(init_data))
                                  {
                                    _.each(init_data.init_val, function(item){
                                      if(traversed_objects.indexOf(item) === -1)
                                      {
                                        var obs_index = init_data.init_val.indexOf(item);
                                        console.log('Executing Obs to void -- 1232')
                                        obs.push({voided:true, uuid:init_data.uuid[obs_index]});
                                      }
                                    });
                                  }
                                }

                                if (groupMembers.length>0)
                                {
                                  //console.log('Group key',group_member);
                                  //console.log('Main Key', key);
                                    //obs.push({concept:key.split('_')[1], groupMembers:groupMembers});
                                    obs.push({concept:convertKey_to_uuid(key.split('_')[1]), groupMembers:groupMembers});
                                    // if(group_member.startsWith('obs_'))
                                    //   {obs.push({concept:convertKey_to_uuid(group_member.split('_')[1]), groupMembers:groupMembers});}
                                    // else {
                                    //   obs.push({concept:convertKey_to_uuid(key.split('_')[1]), groupMembers:groupMembers});
                                    // }
                                }
                                groupMembers = [];
                                traversed_objects = [];
                              }
                              else {
                                  //  console.log('NONE OBJECT TYPE')
                                  // console.log('Testing Object Vals');
                                  // console.log('ValKey: ', group_member,'  Value: ', groupValues[group_member])
                                //  console.log(typeof group_member);
                                // groupMembers.push({concept:group_member.split('_')[1],
                                //             value:getFormattedValue(groupValues[group_member])});

                                var obs_val;
                                var obs_index;
                                if(!group_member.startsWith('obs'))
                                {
                                  //multiCheckbox field
                                  // console.log('Multi ValKey--1192: '+ group_member,'  Value: '+ groupValues[group_member])
                                  init_data = getInitialFieldValue(key, section);
                                  // console.log('field key -1205', key, 'section:',obj)
                                  // console.log('init_data -1206', init_data)

                                  if(typeof init_data === 'object')
                                  {
                                    if (init_data.init_val !== undefined)
                                    {
                                      obs_index = init_data.init_val.indexOf(getFormattedValue(groupValues[group_member]));
                                      obs_val = init_data.init_val[obs_index];
                                    }

                                  }
                                  if (obs_val !== undefined)
                                  {
                                    traversed_objects.push(getFormattedValue(groupValues[group_member]));
                                    if(obs_val !== getFormattedValue(groupValues[group_member]))
                                    {
                                      if(getFormattedValue(groupValues[group_member])==='null' || getFormattedValue(groupValues[group_member]) === null || getFormattedValue(groupValues[group_member]) ==='')
                                      {
                                        consol.log('Executing Obs to void -- 1288')
                                        obs.push({uuid:init_data.uuid[obs_index], voided:true});
                                      }
                                      else {
                                        //console.log('Obsuuid-1126',init_data.uuid[obs_index])
                                        obs.push({uuid:init_data.uuid[obs_index], concept:convertKey_to_uuid(key.split('_')[1]),
                                                    value:getFormattedValue(groupValues[group_member])});
                                      }
                                    }
                                  }
                                  else {
                                    obs.push({concept:convertKey_to_uuid(key.split('_')[1]),
                                                value:getFormattedValue(groupValues[group_member])});
                                  }
                                }
                                else {
                                  init_data = getInitialFieldValue(group_member, section);
                                  // console.log('NON ARRAY Section_id: ', obj);
                                  // console.log('Testing grouped values Special ');
                                  // console.log('GROUP KEY');
                                  // console.log(group_member)
                                  // console.log('INIT DATA');
                                  // console.log(init_data);
                                  // console.log('field key -1246', group_member, 'section:',obj)
                                  // console.log('init_data -1247', init_data)
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
                                        consol.log('Executing Obs to void -- 1323')
                                        obs.push({uuid:init_data.uuid, voided:true});
                                      }
                                      else {
                                        //console.log('Obsuuid-1159',init_data)
                                        obs.push({uuid:init_data.uuid, concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                    value:getFormattedValue(groupValues[group_member])});
                                      }
                                    }
                                  }
                                  else {
                                        //new val being added
                                        if(getFormattedValue(groupValues[group_member])!==null && getFormattedValue(groupValues[group_member])!=='null' && getFormattedValue(groupValues[group_member])!=='')
                                          groupMembers.push({concept:convertKey_to_uuid(group_member.split('_')[1]),
                                                      value:getFormattedValue(groupValues[group_member])});
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
                              _.each(init_data.init_val, function(item){
                                if(traversed_objects.indexOf(item) === -1)
                                {
                                  var obs_index = init_data.init_val.indexOf(item);
                                  consol.log('Executing Obs to void -- 1354')
                                  obs.push({voided:true, uuid:init_data.uuid[obs_index]});
                                }
                              });
                            }
                          }
                          if (groupMembers.length>0)
                          {
                              obs.push({concept:convertKey_to_uuid(key.split('_')[1]), groupMembers:groupMembers});
                          }
                        }
                        else {
                          // value pair are strings or values
                          // console.log('Complex Object Key pairs');
                          // console.log('type of: ', typeof(val[key]), 'Keys: ', Object.keys(val[key]));
                          // console.log('Payload Value ', getFormattedValue(val[key]))
                          init_data = getInitialFieldValue(key, section);
                          // console.log('field key -1304', key, 'section:',obj)
                          // console.log('init_data -1305', init_data)
                          // console.log('init_data type -1305', typeof init_data)
                          var obs_val;
                          if (typeof init_data === 'object')
                          {
                            obs_val = init_data.init_val;
                          }
                          if (obs_val !== undefined)
                          {
                            // console.log('init_data gets here', init_data.init_val)
                            if(obs_val !== getFormattedValue(val[key]))
                            {
                              //check if the value is dropped so that we can void it
                              if(val[key] ==='null' || val[key]  === null || val[key]  ==='')
                              {
                                consol.log('Executing Obs to void -- 1387')
                                obs.push({uuid:init_data.uuid, voided:true});
                              }
                              else {
                                //console.log('Obsuuid-1217',init_data)
                                obs.push({uuid:init_data.uuid, concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
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
                                obs.push({concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
                              else
                                console.log('Ignoring Empty Object',val[key]);

                            }
                            else {
                              if(getFormattedValue(val[key]) !=='null' && getFormattedValue(val[key]) !==null && getFormattedValue(val[key]) !=='')
                                obs.push({concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
                            }
                          }
                        }
                      }
                    }
                    else {
                      // value pair are strings or values
                      //console.log('Normal Key pairs');
                      init_data = getInitialFieldValue(key, section);
                      // console.log('field key -1353', key, 'section:',obj)
                      // console.log('init_data -1354', init_data)
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
                            consol.log('Executing Obs to void -- 1437')
                            obs.push({uuid:init_data.uuid, voided:true});
                          }
                          else {
                            //console.log('Obsuuid - 1264',init_data)
                            obs.push({uuid:init_data.uuid,concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
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
                            obs.push({concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
                          else
                            console.log('Ignoring Empty Object',val[key]);
                        }
                        else {
                          if(getFormattedValue(val[key])!==null && getFormattedValue(val[key])!=='null' && getFormattedValue(val[key])!=='')
                          obs.push({concept:convertKey_to_uuid(key.split('_')[1]), value:getFormattedValue(val[key])});
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
          var disableExpression_;
          
          var id_;
          if(obs_field.id !== undefined)
          {
            id_ = obs_field.id;
          }
          if(obs_field.hide !== undefined)
          {
            hideExpression_= getFieldValidator(obs_field.hide[0], obs_id);
          }
          else {
            hideExpression_ = '';
          }
          
          
          if(obs_field.disable !== undefined)
          {
            disableExpression_= getFieldValidator(obs_field.disable[0], obs_id);
          }
          else {
            disableExpression_ = '';
          }
          
          var obsField = {};
          if (validateFieldFormat(obs_field) !== true)
          {
            console.log('Something Went Wrong While creating this field', obs_field)
          }
          if(obs_field.type === 'date')
          {
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);

            obsField = {
              key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
              type: 'datepicker',
              data: {concept:obs_field.concept,
                id:id_},
                defaultValue: defaultValue_,
              templateOptions: {
                type: 'text',
                label: obs_field.label,
                datepickerPopup: 'dd-MMMM-yyyy',
                required:required
                
              },
               expressionProperties: {
                'templateOptions.disabled': disableExpression_
               },
              hideExpression:hideExpression_,
              validators: {
                dateValidator: getFieldValidator(obs_field.validators[0]) //this  will require refactoring as we move forward
              }
            }
          }
          else if ((obs_field.type === 'text') || (obs_field.type === 'number'))
          {
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);

            obsField = {
              key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
              type: 'input',
              defaultValue: defaultValue_,
              data: {concept:obs_field.concept,
                id:id_},
              templateOptions: {
                type: obs_field.type,
                label: obs_field.label,
                required:required
              },
               expressionProperties: {
                'templateOptions.disabled': disableExpression_
               },
              hideExpression:hideExpression_
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
              key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
              type: obs_field.type,
              defaultValue: defaultValue_,
              data: {concept:obs_field.concept,
                id:id_},
                ngModelAttrs: {
                  customExpression: {
                    expression: 'custom-expression'
                  }
                },
              templateOptions: {
                type: obs_field.type,
                label: obs_field.label,
                required:required,
                options:opts,
                customExpression: function(value, options, scope, $event) {
                  //Not being used for now but will be a great feature for various stuff
                  // alert('Custom expression!');
                  // console.log(arguments);
                  // console.log(scope.model);
                  // _.each(Object.keys(scope.model), function(key){
                  //   if(key !== 'obs_' + createFieldKey('a899e444-1350-11df-a1f1-0026b9348838') && !key.startsWith('$$'))
                  //   {
                  //     console.log('Current Value',scope.model[key]);
                  //     delete scope.model[key];
                  //   }
                  // });
                }
              },
              expressionProperties: {
                'templateOptions.disabled': disableExpression_
               },
              hideExpression:hideExpression_
            }
          }
          else if(obs_field.type === 'problem'){
              //console.log('validators', obs_field);
            var validators = obs_field.validators;
            
            //set the validator to default validator
            var compiledValidator = {
              expression: function(viewValue, modelValue, scope, element) {
                  return true;
              },
              message: ''
            };
            
            if(validators && validators.length !== 0){
                compiledValidator = getFieldValidator(obs_field.validators[0])
            }
            
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);
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
                required:required,
                options:[]
              },
              expressionProperties: {
                'templateOptions.disabled': disableExpression_
               },
              hideExpression:hideExpression_,
              validators: {
                conditionalValidators: compiledValidator //this  will require refactoring as we move forward
              }
            };
          }
          else if(obs_field.type === 'drug'){
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);
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
                required:required,
                options:[]
              },
              expressionProperties: {
                'templateOptions.disabled': disableExpression_
               }
            };
          }
        else if(obs_field.type === 'select-concept-answers'){
            var required=false;
            if (obs_field.required !== undefined) required=Boolean(obs_field.required);
            obsField = {
              key: 'obs' + obs_id + '_' + createFieldKey(obs_field.concept),
              defaultValue: defaultValue_,
              type: 'concept-search-select',
              data: {concept:obs_field.concept,
                id:id_},
              templateOptions: {
                type: 'concept-search-select',
                label: obs_field.label,
                required:required,
                options:[],
                displayMember:'label',
                valueMember:'concept',
                questionConceptUuid:obs_field.concept,
                fetchOptionsFunction:SearchDataService.getConceptAnswers


              },
              expressionProperties: {
                'templateOptions.disabled': disableExpression_
               },
              hideExpression:hideExpression_
            };
          }
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
                hideExpression_= getFieldValidator(obs_field.hide[0], obs_id);
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
                hideExpression:hideExpression_,
              validators: {
                dateValidator: getFieldValidator(curField.validators[0]) //this  will require refactoring as we move forward
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
                hideExpression:hideExpression_,
              validators: {
                dateValidator: getFieldValidator(curField.validators[0]) //this  will require refactoring as we move forward
                }
              }
              repeatingFields.push(dateField);
            }
          })
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
        function createForm(schema, callback)
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
                      dateValidator: getFieldValidator(sec_field.validators[0]) //this  will require refactoring as we move forward
                    }
                  }
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
                addFieldToValidationMetadata(field, section, pageFields, sec_field.type);
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
            // adding hidden gender field
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
            // callback(tabs);
            i = i+1;
          });

          //return tabs;
          // console.log(JSON.stringify(tabs))
          //console.log('Foooooooooorm', service.lastFormValidationMetadata);
          callback(tabs);
        }
        
        function addFieldToValidationMetadata(field, section, page, typeOfField){
            //console.log('etl stuff', field);
            if(field && field.data && field.data.id && field.data.id !== ''){
                service.lastFormValidationMetadata[field.data.id] = {
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
