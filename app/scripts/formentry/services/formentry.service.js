/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function() {
  'use strict';

  angular
        .module('app.formentry')
        .factory('FormentryService', FormentryService);

  FormentryService.$inject = ['$http', 'SearchDataService', 'moment',
  'FormValidator', 'CurrentLoadedFormService', '$filter', 'PersonAttributesRestService', 'UserDefaultPropertiesService'];

  function FormentryService($http, SearchDataService, moment, FormValidator,
    CurrentLoadedFormService, $filter, PersonAttributesRestService, UserDefaultPropertiesService) {
    var service = {
      createForm: createForm,
      validateForm:validateForm,
      getEncounter:getEncounter,
      getFormSchema: getFormSchema,
      getCompiledFormSchema: getCompiledFormSchema,
      updateFormPayLoad: updateFormPayLoad,
      getFieldByIdKey:getFieldByIdKey
    };

    var obsId = 0;
    var gFields; // var to hold all the fields on a form
    var readyFields = [];
    var loaded = false;

    return service;

    function getFieldByIdKey(_idorKey, _searchFields) {
      //Search from the schema that is being currently built
      var selectedField;
      if (readyFields.length > 0) {
        _.some(readyFields, function(_field) {
              // console.log(_field)
              if (_field.type !== 'repeatSection' && _field.type !== undefined) {
                if (_field.key === _idorKey || _field.data.id === _idorKey) {
                  selectedField = _field;
                  console.log('matched field', _field);
                  // return selected_field;
                  return true;
                }
              } else if (_field.type === 'repeatSection') {
                _.some(_field.templateOptions.fields[0].fieldGroup,
                  function(_field_) {
                    if (_field_.key === _idorKey || _field_.data.id === _idorKey) {
                      selectedField = _field_;
                      console.log('matched field', _field_);
                      // return selected_field;
                      return true;
                    }
                  });
              } else {
                _.some(_field.fieldGroup, function(__field_) {
                  if (__field_.key === _idorKey ||  __field_.data.id === _idorKey) {
                    selectedField = __field_;
                    console.log('matched field', __field_);
                    // return selected_field;
                    return true;
                  }
                });
              }
            });
      }

      //search form the complete formly schema that is organized in tabs
      if (_searchFields === undefined) {
        _searchFields = gFields;
      }

      // start by looping through the tabs
      if (selectedField === undefined) {
        _.some(_searchFields, function(page) {
              //loop through the sections in a page
              _.some(page.form.fields, function(_section) {
                /*the assumption is that all questions will be in a section
                but maybe we may have a question that is not isn a section
                */
                if (_section.type === 'section')
                {
                  _.some(_section.data.fields, function(_field) {
                    // body...
                    if (_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined) {
                      // console.log('testing selected key_first opt ', _field)
                      if (_field.key === _idorKey || _field.data.id === _idorKey)
                      {
                        selectedField = _field;
                        console.log('matched field', _field);
                        // return selected_field;
                        return true;
                      }
                    } else if (_field.type === 'repeatSection') {
                      _.some(_field.templateOptions.fields[0].fieldGroup,
                        function(_field_) {
                          if (_field_.key === _idorKey || _field_.data.id === _idorKey) {
                            selectedField = _field_;
                            console.log('matched field', _field_);
                            // return selected_field;
                            return true;
                          }
                        });
                    }   else {
                      _.some(_field.fieldGroup, function(__field_) {
                        if (__field_.key === _idorKey ||  __field_.data.id === _idorKey)
                        {
                          selectedField = __field_;
                          console.log('matched field', __field_);
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

      if (selectedField === undefined) console.log('No matching Field found');
      return selectedField;
    }

    function createValidFormName(formName) {
      return formName.replace(/ /gi, '_').toLowerCase();
    }

    function getFormSchema(formName, callback) {
      var schema = {};
      formName = createValidFormName(formName);
      // this should de dropped once we align all forms related issues
      if (formName !== undefined) {
        formName = formName + '.json';
      } else {
        formName = 'form1.json';
      }

      var url = 'scripts/formentry/formschema/' + formName;
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
      if (formName !== undefined) {
        formName = formName + '.compiled.json';
      } else {
        formName = 'form1.compiled.json';
      }

      $http.get('scripts/formentry/formschema/' + formName)
            .success(function(response) {
              callback(response.form);
            })
              .error(function(data, status, headers, config) {
                if (status === 404) {alert('Form Resource not Available');}
              });
    }

    /*
        private method to obs without obs groups
    */
    function getObsValue(_key, _obs) {
      var val = _.find(_obs, function(obs_) {
            // console.log('Check Obs', obs_)
            if (obs_.concept.uuid === convertKeyToUuid(_key.split('_')[1])) {
              return obs_;
            }
          });

      return val;
    }

    function getObsValueSelect(_key, _obs) {
      var fieldKey = _key.key;
      var opts = [];
      _.each(_key.templateOptions.options, function(selectedItem) {
        opts.push(selectedItem.value);
      });

      var val = _.find(_obs, function(obs_) {
        if (obs_.concept.uuid === convertKeyToUuid(fieldKey.split('_')[1])) {
          return obs_;
        }
      });

      return val;
    }

    /*
        Private method to get obs group data
    */
    function getObsGroupValue(_key, _obs) {
      var val = _.filter(_obs, function(obs_) {
        if (_key !== undefined)
            if (obs_.concept.uuid === convertKeyToUuid(_key.split('_')[1])) return obs_;
      });

      return val;
    }

    /*
        Method to auto/prefill the form with existing data from OpenMRS
    */
    function getEncounterHandler(_encounterData, _formlySchema, personAttributes) {
      /*
          Each page/tab has various sections
          each section has a set of various questions/data elements
          The model is simply aware of sections only
      */

      //geting obs data without obs groups
      var obsData = _.filter(_encounterData.obs, function(obs) {
        if (obs.groupMembers === null) {
          return obs;
        }
      });

      //geting obs data with obs groups
      var obsGroupData =  _.filter(_encounterData.obs, function(obs) {
        if (obs.groupMembers !== null) {
          return obs;
        }
      });

      //looping thro' individual pages
      _.each(_formlySchema, function(page) {
        /*looping thro each section in the page and updating the model*/

        var model = page.form.model;
        _.each(page.form.fields, function(_section) {
          if (_section.type === 'section') {
            console.log('Section: ' + _section.key);
            /*
            Updating the section keys in the model;
            It is important that we update the model with the section key
            because for some reason formly does not see the keys
            even though when you log the page keys you see them
            */
            var sectionKey = _section.key;
            var sectionData = model[sectionKey] = {};

            //loop through the individual fields in the section and update accordingly
            _.each(_section.data.fields, function(_field) {
              var fieldKey;
              if (_field.type === 'anchor') {
                return;
              }
              if (_field.key === 'encounterDate') {
                sectionData['encounterDate'] = _encounterData.encounterDatetime;
                _field.data['initialValue'] = _encounterData.encounterDatetime;
              } else if (_field.key === 'encounterProvider') {
                if (_encounterData.provider !== undefined && _encounterData.provider !== null) {
                  sectionData['encounterProvider'] = _encounterData.provider.uuid;
                  _field.data['initialValue'] = _encounterData.provider.uuid;
                  //console.log('test Model');
                  //console.log(model);
                }
              } else if (_field.key === 'encounterLocation') {
                if (_encounterData.location !== undefined) {
                  sectionData['encounterLocation'] = _encounterData.location.uuid;
                  _field.data['initialValue'] = _encounterData.location.uuid;
                  //console.log('test Model');
                  //console.log(model);
                }
              } else if (_field.type === 'select' || _field.type === 'radio' ||
              _field.type === 'ui-select-extended' ||
              _field.type === 'concept-search-select' ||
              _field.type === 'location-attribute') {
                fieldKey = _field.key;

                // var val = getObsValue(fieldKey, obsData);
                var val = getObsValueSelect(_field, obsData);
                // console.log('initial value',val)
                if (_field.key.startsWith('personAttribute')) {
                  var personAttribute = [];
                  personAttribute = PersonAttributesRestService.getPersonAttributeValue(personAttributes, fieldKey);
                  if (personAttribute !== undefined &&
                    personAttribute !== null &&
                    personAttribute.length > 0) {
                    var existingFormLocation = personAttribute[0].value.uuid;                    
                    // var definedDefaultUserLocation=UserDefaultPropertiesService.getCurrentUserDefaultLocation();                       
                    // if(angular.isDefined(definedDefaultUserLocation)){  
                    //   //use defined default user location to prefill the form                       
                    //     if(!angular.isDefined(existingFormLocation)){
                    //     existingFormLocation=definedDefaultUserLocation.uuid;
                    //     }                       
                    // }
                     sectionData[fieldKey] = existingFormLocation;
                    _field.data['initValue'] = existingFormLocation;
                    _field.data['uuid'] = personAttribute[0].uuid;
                  }

                }

                if (val !== undefined) {
                  if (val.value !== null) {
                    sectionData[fieldKey] = val.value.uuid;
                    _field.data['initialValue'] = val.value.uuid;
                    _field.data['uuid'] = val.uuid; //obs uuid
                    // console.log('updated field',_field)
                  }
                }
              } else if (_field.type === 'multiCheckbox') {
                fieldKey = _field.key;
                var multiArr = [];
                var multiUuid = [];
                var val = _.filter(obsData, function(obs) {
                  if (obs.concept.uuid === convertKeyToUuid(fieldKey.split('_')[1])) {
                    return obs;
                  }
                });

                //console.log('matching multiCheckbox:');
                //console.log(val);
                if (val !== undefined) {
                  _.each(val, function(obs) {
                    multiArr.push(obs.value.uuid);
                    multiUuid.push(obs.uuid);
                  });

                  sectionData[fieldKey] = multiArr;
                  _field.data['initialValue'] = multiArr;
                  _field.data['uuid'] = multiUuid; //obs uuid
                }
              } else if (_field.type === undefined) {
                // for grouped non repeating fields
                // console.log('Field Data')
                // console.log(_field)
                fieldKey = _field.key;
                var groupData = getObsGroupValue(fieldKey, obsGroupData);
                fieldKey = _field.key;
                var groupVal = {};
                _.each(_field.fieldGroup, function(_groupField) {
                  if(_groupField.type === 'anchor') {
                    return;
                  }
                  
                  // body...
                  if (_.contains(fieldKey, 'unamed')) {
                    // using the grouping fields
                    if (_groupField.type !== 'multiCheckbox') {
                      if (_.contains(_groupField.key, 'obsDate')) {
                        var val = _groupField.type !== 'anchor'? getObsValue(_groupField.key, obsData) : undefined;
                        if (val !== undefined) {
                          // console.log('Obs Date Key', _groupField.key);
                          // console.log('Obs Date value', val);
                          groupVal[_groupField.key] = new Date(val.obsDatetime);
                          _groupField.data['initialValue'] =  val.obsDatetime;
                          _groupField.data['uuid'] = val.uuid; //obs uuid
                        }
                      } else {
                        var val = _groupField.type !== 'anchor'? getObsValue(_groupField.key, obsData) : undefined;
                        if (val !== undefined) {
                          if (typeof val.value === 'object') {
                            groupVal[_groupField.key] = val.value.uuid;
                            _groupField.data['initialValue'] = val.value.uuid;
                            _groupField.data['uuid'] = val.uuid; //obs uuid
                          } else {
                            groupVal[_groupField.key] = val.value;
                            _groupField.data['initialValue'] = val.value;
                            _groupField.data['uuid'] = val.uuid; //obs uuid
                          }
                        }
                      }
                    } else {
                      var multiArr = [];
                      var multiUuid = [];
                      var val = _.filter(obsData, function(obs) {
                        if (obs.concept.uuid === convertKeyToUuid(fieldKey.split('_')[1])) {
                          return obs;
                        }
                      });

                      //console.log('matching multiCheckbox:');
                      //console.log(val);
                      if (val !== undefined) {
                        _.each(val, function(obs) {
                          multiArr.push(obs.value.uuid);
                          multiUuid.push(obs.uuid);
                        });

                        groupVal[_groupField.key] = multiArr;
                        _groupField.data['initialValue'] = multiArr;
                        _groupField.data['uuid'] = multiUuid; //obs uuid
                      }
                    }

                    if (typeof groupVal === 'object') {
                      sectionData[fieldKey] = groupVal;
                    }
                  } else {
                    //valid group uuids
                    // console.log('This Section Field')
                    // console.log(fieldKey);
                    // console.log('OBS GROUP', obsGroupData)
                    var groupData = getObsGroupValue(fieldKey, obsGroupData);
                    // console.log('NON REPEATING SEC DATA TEST');
                    //console.log(groupData)
                    if (groupData !== undefined) {
                      if (_groupField.type !== 'multiCheckbox') {
                        if (_.contains(_groupField.key, 'obsDate')) {
                          var val = _.find(groupData[0].groupMembers, function(obs) {
                            if (obs.concept.uuid === convertKeyToUuid(_groupField.key.split('_')[1])) {
                              return obs;
                            }
                          });

                          if (val !== undefined) {
                            groupVal[_groupField.key] = new Date(val.obsDatetime);
                            _groupField.data['initialValue'] = val.obsDatetime;
                            _groupField.data['uuid'] = val.uuid; //obs uuid
                          }
                        } else {
                          var val;
                          var thisVal;
                          if (groupData.length > 0) {
                            _.each(groupData, function(obs) {
                              thisVal = _.find(obs.groupMembers, function(_obsVar) {
                                //console.log(obs)
                                if (_obsVar.concept.uuid === convertKeyToUuid(_groupField.key.split('_')[1])) {
                                  return _obsVar;
                                }
                              });

                              if (thisVal !== undefined) val = thisVal;
                            });
                          }

                          //  console.log(val)
                          //  console.log('Key: ', _groupField.key.split('_')[1])
                          if (val !== undefined) {
                            // console.log('current key: '+ key);
                            // console.log(field.model[key]);
                            if (typeof val.value === 'object') {
                              groupVal[_groupField.key] = val.value.uuid;
                              _groupField.data['initialValue'] = val.value.uuid;
                              _groupField.data['uuid'] = val.uuid; //obs uuid
                            } else {
                              groupVal[_groupField.key] = val.value;
                              _groupField.data['initialValue'] = val.value;
                              _groupField.data['uuid'] = val.uuid; //obs uuid
                            }
                          }
                        }
                      } else {
                        var val = [];
                        var thisVal;

                        //if the field group section field is a multi select
                        if (groupData.length > 0) {
                          _.each(groupData, function(obs) {
                            thisVal = _.filter(obs.groupMembers, function(_obsVar) {
                              //console.log(obs)
                              if (_obsVar.concept.uuid === convertKeyToUuid(_groupField.key.split('_')[1])) {
                                return _obsVar;
                              }
                            });

                            if (thisVal !== undefined) val.push(thisVal);
                          });
                        }

                        var multiArr = [];
                        var multiUuid = [];
                        if (val !== undefined) {
                          _.each(val, function(data) {
                            if (angular.isArray(data)) {
                              _.each(data, function(d) {
                                multiArr.push(d.value.uuid);
                                multiUuid.push(d.uuid);
                              });
                            } else {
                              multiArr.push(data.value.uuid);
                              multiUuid.push(data.uuid);
                            }
                          });

                          groupVal[_groupField.key] = multiArr;
                          _groupField.data['initialValue'] = multiArr;
                          _groupField.data['uuid'] = multiUuid; //obs uuid
                        }
                      }

                      //  console.log('Group Value');
                      //  console.log(groupVal)
                      if (typeof groupVal === 'object') {
                        if (groupVal !== null || groupVal !== '' || groupVal !== '') {
                          sectionData[fieldKey] = groupVal;
                        }
                      }
                    }
                  }
                });
              } else if (_field.type === 'repeatSection') {
                // groupped fields
                var repeatingFields;
                fieldKey = _field.key;
                var groupData = getObsGroupValue(fieldKey, obsGroupData);
                var fieldKeys = {};
                var multiArr = [];

                // console.log('REPEATING SEC DATA TEST');
                // console.log('Group Vaaaal ',groupData)
                if (groupData !== undefined) {
                  _.each(_field.templateOptions.fields[0].fieldGroup,
                    function(_repeatingField) {
                      if(_repeatingField.type === 'anchor') {
                        return;
                      }
                      // body...
                      // console.log('getting Here ',_repeatingField)
                      fieldKeys[convertKeyToUuid(_repeatingField.key.split('_')[1])] = {key:_repeatingField.key, type:_repeatingField.type};

                      // update fields with existing data
                      var arr = [];
                      var arrUuid = [];
                      _.each(groupData, function(_data) {
                        _.each(_data.groupMembers, function(obs) {
                            // console.log('getting Here ', obs)
                            if (obs.concept.uuid === convertKeyToUuid(_repeatingField.key.split('_')[1])) {
                              // console.log('Concept uuid',convertKeyToUuid(_repeatingField.key.split('_')[1]));
                              // console.log(obs)
                              if (typeof obs.value === 'object') {
                                arr.push(obs.value.uuid);
                                arrUuid.push(obs.uuid);
                              } else {
                                arr.push(obs.value);
                                arrUuid.push(obs.uuid);
                              }
                            }
                          });
                      });

                      if (arr.length > 0) {
                        _repeatingField.data['initialValue'] = arr;
                        _repeatingField.data['uuid'] = arrUuid;
                        //initialize the array for the next iteration
                        arr = [];
                        arrUuid = [];
                      }
                    });

                  _.each(groupData, function(_data) {
                    var rowVal = {};
                    var arr = [];
                    var arrUuid = [];
                    _.each(_data.groupMembers, function(obs) {
                      //assumed row data
                      if (fieldKeys[obs.concept.uuid]) {
                        console.log(obs.concept.uuid);
                        //  var colKey = 'obs_' + createFieldKey(obs.concept.uuid)
                        var colKey = fieldKeys[obs.concept.uuid].key;
                        //console.log('columns: '+colKey);
                        if (fieldKeys[obs.concept.uuid].type === 'multiCheckbox') {
                          //_repeatingField.data['uuid'] = obs.uuid; //obs uuid (Not well done yet)
                          if (typeof obs.value === 'object') {
                            arr.push(obs.value.uuid);
                            //rowVal[colKey] = obs.value.uuid
                            //_repeatingField.data['initialValue'] = obs.value.uuid;
                          } else {
                            arr.push(obs.value);
                            //rowVal[colKey] = obs.value
                            //_repeatingField.data['initialValue'] = obs.value;
                          }

                          if (arr.length > 0) {
                            rowVal[colKey] = arr;
                            //_repeatingField.data['initialValue'] = arr;
                          }
                        } else {
                          //_repeatingField.data['uuid'] = obs.uuid; //obs uuid
                          if (typeof obs.value === 'object') {
                            rowVal[colKey] = obs.value.uuid;
                                 //_repeatingField.data['initialValue'] = obs.value.uuid;
                          } else {
                            rowVal[colKey] = obs.value;
                            //_repeatingField.data['initialValue'] = obs.value;
                          }
                        }
                      }
                    });

                    if (typeof rowVal === 'object') {
                      if (!_.isEmpty(rowVal))multiArr.push(rowVal);
                    }
                  });
                }
                // console.log('repeating values test');
                // console.log(multiArr)
                sectionData[fieldKey] = multiArr;
              } else {
                // console.log('Other Fields Available...')
                // console.log(_field.type)
                // console.log(_field)

                fieldKey = _field.key;
                var val = _field.type !== 'anchor'? getObsValue(fieldKey, obsData) : undefined;

                if (val !== undefined) {
                  if (typeof val.value === 'object') {
                    sectionData[fieldKey] = val.value.uuid;
                    _field.data['initialValue'] = val.value.uuid;
                    _field.data['uuid'] = val.uuid; //obs uuid
                  } else {
                    if (_field.type === 'datepicker') {
                      sectionData[fieldKey] = new Date(val.value);
                      _field.data['initialValue'] = val.value;
                      _field.data['uuid'] = val.uuid; //obs uuid
                    } else {
                      sectionData[fieldKey] = val.value;
                      _field.data['initialValue'] = val.value;
                      _field.data['uuid'] = val.uuid; //obs uuid
                    }
                  }
                }
              }
            });
          }
        });
      });
    }

    /*
    function to update the form with existing data
    */
    function getEncounter(encData, _formlySchema, personAttributes) {
      /*
      Expected Encounter object format
      {encounterDatetime: 'date',
      encounterType:{display,uuid},
      form:{},
      location:{},
      obs:[{concept:{display,uud},uuid,value{display,uuid},groupMembers:[]}],
      patient:{uuid},
      provider:{},
      uuid:'encounter-uuid'}
      */
      getEncounterHandler(encData, _formlySchema, personAttributes);
    }

    function validateForm() {}

    function validateFieldFormat(_selectedField) {
      //validate the field to see if it is in the right format before creating the formly equavalent
      var pass = true;
      if (_selectedField.type === 'date') {
        //check it has validator provided
        if (_selectedField.validators.length > 0) {
          if (!_selectedField.validators[0].hasOwnProperty('type')) {
            pass = false;
            console.log('This field is a Date type field and you must provide validators', _selectedField);
            console.log('Add this: "validators":[{"type":"date"}]');
          }
        } else {
          pass = false;
          console.log('This field a Date type field and must provide validators', _selectedField);
          console.log('Add this: "validators":[{"type":"date"}]');
        }
      } else if (_selectedField.showDate === 'true') {
        //check it has validator provided
        if (_selectedField.validators.length > 0) {
          if (!_selectedField.validators[0].hasOwnProperty('type')) {
            pass = false;
            console.log('This field is a Date type field and you must provide validators', _selectedField);
            console.log('Add this: "validators":[{"type":"date"}]');
          }
        } else {
          pass = false;
          console.log('This field a Date type field and must provide validators', _selectedField);
          console.log('Add this: "validators":[{"type":"date"}]');
        }
      } else if (_selectedField.concept === undefined ||
        _selectedField.concept === '' ||
        _selectedField.attributeType === undefined ||
        _selectedField.attributeType === '') {
        pass = false;
        console.log('This field is missing the concept attribute', _selectedField);
        console.log('Add this: "concept:concept_uuid');
      } else if (_selectedField.type === undefined || _selectedField.type === '') {
        pass = false;
        console.log('This field is missing the type attribute', _selectedField);
        console.log('Add this: "type:date/number/select/radio/multiCheckbox');
      } else if (_selectedField.label === undefined || _selectedField.label === '') {
        pass = false;
        console.log('This field is missing the label attribute', _selectedField);
        console.log('Add this: "label:your label of choice');
      }

      return pass;
    }

    /*
    Methdod to get all the sections in a schema
    */
    function getFormSections(_formlySchema)
    {
      var sections = [];
      _.each(_formlySchema, function(page) {
        _.each(page.form.fields, function(section) {
          sections.push(section);
        });
      });

      return sections;
    }

    /*
    Private method to get all preloaded values for
    for fields that have been deleted from the model
    This method is important for editing an existing form
    */
    function findValuesToVoid(key, searchSpace)
    {
      var data = [];
      _.each(searchSpace.data.fields, function(field) {
        if (field.type === 'repeatSection' && key === field.key) {
          _.each(field.templateOptions.fields[0].fieldGroup, function(_field) {
            data.push(_field.data);
          });
        }
      });

      return data;
    }

    /* generate of create form payLoad helper functions */
    /*
        Private method to get the initial value of a given field
    */
    function getInitialFieldValue(_fieldKey, _section) {
      //Running this function mannually since find method was not doing a good/perfect job
      var data;
      console.log('Section Key:', _section.key);
      _.each(_section.data.fields, function(_field) {
        if (_field.type !== 'section' && _field.type !== 'group' && _field.type !== 'repeatSection' && _field.type !== undefined) {
          // console.log('testing selected key_first opt ', _field)
          if (_fieldKey === _field.key) {
            data = _field;
            // console.log('matched field',_field);
          }
        } else if (_field.type === 'repeatSection') {
          _.each(_field.templateOptions.fields[0].fieldGroup, function(_field_) {
            if (_field_.key === _fieldKey) {
              data = _field_;
              console.log('matched field-repeating field', _field_);
            }
          });
        } else {
          _.each(_field.fieldGroup, function(__field_) {
            if (__field_.key === _fieldKey) {
              data = __field_;
              // console.log('matched field',__field_);
            }
          });
        }
      });
      // console.log('Testing the revised code with new behavihoour: ');
      // console.log(data);
      if (!_.isEmpty(data)) return data.data;
      else return data;
    }

    /*
    private method to generate/create paylod for obs tied to custom section
    */
    function createPayloadUnNamedSection(groupValues, obs, section)
    {
      _.each(Object.keys(groupValues), function(groupMember) {
        //console.log(groupValues[groupMember])
        if (groupValues[groupMember] !== undefined) {
          if (groupMember.startsWith('obsDate'))  {
            var initData = getInitialFieldValue(groupMember, section);
            var sectectedObsId = groupMember.slice(7).split('_')[0];
            var sectectedObsKey = groupMember.split('_')[1];
            var initData1 = getInitialFieldValue('obs' + sectectedObsId + '_' + sectectedObsKey, section);
            var dateValue;
            var obsValue;
            var value_ = getFormattedValue(groupValues[groupMember]);
            var concept_ = convertKeyToUuid(sectectedObsKey);
            var value2_ = getFormattedValue(groupValues['obs' + sectectedObsId + '_' + sectectedObsKey]);
            if (typeof initData === 'object') {
              dateValue = initData.initialValue;
            }

            if (typeof initData1 === 'object') {
              obsValue = initData1.initialValue;
            }

            if (dateValue !== undefined || obsValue !== undefined) {
              if (dateValue !== value_ || obsValue !== value2_) {
                //check if the value is dropped so that we can void it
                if (value_ === null || value2_ === null || value_ === '' ||
                value2_ === '' || value_ === 'null' || value2_ === 'null') {
                  console.log('Executing Obs to void - 1217');
                  obs.push({uuid:initData.uuid, voided:true});
                } else {
                  obs.push({uuid:initData.uuid, obsDatetime:value_, concept:concept_, value:value2_});
                }
              }
            } else {
              //new val being added
              obs.push({obsDatetime:value_, concept:concept_, value:value2_});
            }
          }
        }
      });
    }

    /*
    private method to generate/create paylod for general obs
    */
    function createPayloadNonObject(passedValue, key, obs, section)
    {
      var value_ = getFormattedValue(passedValue);
      var concept_ = convertKeyToUuid(key.split('_')[1]);
      var initData = getInitialFieldValue(key, section);
      // console.log('field key -1353', key, 'section:',obj)
      // console.log('initData -1354', initData)
      var obsValue;
      if (typeof initData === 'object') {
        obsValue = initData.initialValue;
      }

      if (obsValue !== undefined) {
        if (obsValue !== value_) {
          //check if the value is dropped so that we can void it
          if (passedValue === 'null' || passedValue  === null ||
          passedValue  === '') {
            console.log('Executing Obs to void -- 1253');
            obs.push({uuid:initData.uuid, voided:true, value:obsValue, concept:concept_});
          } else {
            //console.log('Obsuuid - 1264',initData)
            obs.push({uuid:initData.uuid,concept:concept_, value:value_});
          }
        }
      } else {
        //new val being added
        if (typeof passedValue === 'object') {
          /*
          The assumption is that no Object will get to this
          point unless it is a date or blank object
          */
          if (Object.prototype.toString.call(passedValue) === '[object Date]')
            obs.push({concept:concept_, value:value_});
          else
            console.log('Ignoring Empty Object', passedValue);
        } else {
          if (value_ !== null && value_ !== 'null' && value_ !== '')
          obs.push({concept:concept_, value:value_});
        }
      }
    }

    /*
    private method to generate/create paylod for obsGroups
    */
    function createPayloadObsGroup(passedValue, key, obs, groupMembers, section)
    {
      var  obsIndex;
      var obsValue;
      var value_ = getFormattedValue(passedValue);
      var initData = getInitialFieldValue(key, section);
      var concept_ = convertKeyToUuid(key.split('_')[1]);
      // console.log('field key -1033', _groupMember, 'section:',obj)
      // console.log('initData -1034', initData)
      if (typeof initData === 'object') {
        if (initData.initialValue !== undefined) {
          obsIndex = initData.initialValue.indexOf(value_);
          obsValue = initData.initialValue[ obsIndex];
        }
      }

      if (obsValue !== undefined) {
        if (obsValue !== value_) {
          if (value_ === 'null' || value_ === null || value_ === '') {
            console.log('Executing Obs to void -- 1093');
            obs.push({uuid:initData.uuid[ obsIndex], voided:true, value:obsValue, concept:concept_});
          }  else {
            //console.log('Obsuuid-1126',initData.uuid[ obsIndex])
            groupMembers.push({uuid:initData.uuid[ obsIndex], concept:concept_,
                        value:value_});
          }
        }
      } else {
        if (angular.isArray(passedValue) && passedValue.length === 0) {
          //void any existing values
          if (initData.initialValue.length > 0) {
            _.each(initData.uuid, function(itemToVoid) {
              console.log('Executing Obs to void -- 1112');
              obs.push({uuid:itemToVoid, voided:true, value:obsValue, concept:concept_});
            });
          }

          console.log('Ignoring Empty Array');
        } else {
          if (passedValue !== undefined && passedValue !== null && passedValue !== '')
            groupMembers.push({concept:concept_, value:value_});
        }
      }
    }

    /*
    private method to generate/create paylod for obs in an array
    */
    function createPayloadObsArray(passedValue, key, obs, groupMembers,
      section, traversedObjects) {
      var initData = getInitialFieldValue(key, section);
      var  obsIndex;
      var obsValue;
      var value_ = getFormattedValue(passedValue);
      var concept_ = convertKeyToUuid(key.split('_')[1]);
      // console.log('field key -1205', key, 'section:',obj)
      // console.log('initData -1206', initData)
      if (typeof initData === 'object') {
        if (initData.initialValue !== undefined) {
          obsIndex = initData.initialValue.indexOf(value_);
          obsValue = initData.initialValue[ obsIndex];
        }
      }

      if (obsValue !== undefined) {
        //missed option
        traversedObjects.push(value_);
        if (obsValue !== value_) {
          if (value_ === 'null' || value_ === null || value_ === '') {
            console.log('Executing Obs to void -- 1288');
            obs.push({uuid:initData.uuid[ obsIndex], voided:true, value:obsValue, concept:concept_});
          } else {
            //console.log('Obsuuid-1126',initData.uuid[ obsIndex])
            obs.push({uuid:initData.uuid[ obsIndex], concept:concept_,
                        value:value_});
          }
        }
      } else {
        obs.push({concept:concept_, value:value_});
      }
    }

    /*
    private method to generate/create paylod for obsGroups in an array
    */
    function createPayloadObsGroupArray(passedValue, key, obs, groupMembers, section, traversedObjects)
    {
      var initData = getInitialFieldValue(key, section);
      var  obsIndex;
      var obsValue;
      var value_ = getFormattedValue(passedValue);
      var concept_ = convertKeyToUuid(key.split('_')[1]);
      // console.log('field key -1120', arrKey, 'section:',obj)
      // console.log('initData -1121', initData)
      if (typeof initData === 'object') {
        if (initData.initialValue !== undefined) {
          console.log('this crazy value 1 ', value_);
          obsIndex = initData.initialValue.indexOf(value_);
          obsValue = initData.initialValue[ obsIndex];
        }
      }

      if (obsValue !== undefined) {
        console.log('this crazy value 1 ', value_);
        traversedObjects.push(value_);
        console.log('Updated Traversed Object', traversedObjects);
        if (obsValue !== value_) {
          if (value_ === 'null' && value_ === null && value_ === '') {
            console.log('Executing Obs to void -- 1201');
            obs.push({uuid:initData.uuid[ obsIndex], voided:true, value:obsValue, concept:concept_});
          } else {
            //console.log('Obsuuid-1046',initData.uuid[ obsIndex])
            groupMembers.push({uuid:initData.uuid[ obsIndex], concept:concept_,
                          value:value_});
          }
        }
      } else {
        //new val being added
        var value_ = getFormattedValue(passedValue);
        // console.log('Getting Here', getFormattedValue(ArrayVal[arrKey]))
        if (value_ !== '' && value_ !== null && value_ !== 'null')
              groupMembers.push({concept:concept_, value:value_});
      }
    }

    /*
    Method to update the payload for existing encounter
    */
    function updateFormPayLoad(model, _formlySchema, patient, form, params)
    {
      /*
      The objective of this method is to create a payload with only updated
      changes
      */
      var sections = getFormSections(_formlySchema);
      var formPayLoad = {};
      var personAttributes = [];
      var obs = [];
      var val;
      var initData;
      var section;
      var traversedObjects = [];
      // console.log('Test sample model');
      //console.log(model)
      _.each(Object.keys(model), function(obj) {
        val = model[obj];
        //console.log('Section: '+ obj + ' No of Keys: '+ Object.keys(val).length);
        //check if the current key is an object
        if (typeof val === 'object') {
          //This should be a section
          //console.log(obj);
          if (obj.startsWith('section')) {
            _.each(Object.keys(val), function(key) {
              //console.log('item Key: '+ key);
              //get section
              section = _.find(sections, function(sec) {
                if (sec.key === obj) return sec;
              });

              //Handling special keys related to encounter
              if (key === 'encounterProvider' && val[key] !== undefined) {
                //get previous value
                initData = getInitialFieldValue(key, section);
                if (typeof initData === 'object') {
                  if (initData.initialValue !== val[key]) {
                    //add property to the payload
                    formPayLoad.provider = val[key];
                  }
                }
              } else if (key === 'encounterDate' && val[key] !== undefined) {
                //get previous value
                initData = getInitialFieldValue(key, section);
                if (typeof initData === 'object') {
                  if (initData.initialValue !== parseDate(val[key])) {
                    //add property to the payload
                    formPayLoad.encounterDatetime = parseDate(val[key]);
                  }
                }
              } else if (key === 'encounterLocation' && val[key] !== undefined) {
                //get previous value
                initData = getInitialFieldValue(key, section);
                if (typeof initData === 'object') {
                  if (initData.initialValue !== val[key]) {
                    //add property to the payload
                    formPayLoad.location = val[key];
                  }
                }
              } else if (key.startsWith('personAttribute') &&
              val[key] !== undefined) {
                //get previous value
                initData = getInitialFieldValue(key, section);
                if (typeof initData === 'object') {
                  if (initData.initialValue !== val[key]) {
                    //add property to the payload
                    personAttributes.push({uuid:initData.uuid, value:val[key],
                      attributeType:{uuid:convertKeyToUuid(key.split('_')[1])}});
                  }
                }
              } else if (val[key] !== undefined) {
                if (typeof val[key] === 'object') {
                  //this is the case when we have obs groups that are not repeating
                  var groupValues = val[key];
                  var groupMembers = [];
                  //  console.log('OBJECT TYPES')
                  // console.log(key);
                  //  console.log(groupValues);
                  // having valid obs group concept uuid
                  if (_.contains(key, 'unamed')) {
                    console.log('Calling Unamed Section Method');
                    createPayloadUnNamedSection(groupValues, obs, section);
                  } else if (typeof groupValues === 'object') {
                    /*
                    Check if this blank field is an array and has any preloaded data.
                    If field has some data then mark it as voided
                    void.
                    */
                    if (angular.isArray(groupValues) &&
                    groupValues.length === 0) {
                      console.log('Track blank Array: ', groupValues);
                      // console.log('Group Key: ',key);
                      var blanksToVoid = findValuesToVoid(key, section);
                      // console.log(blanksToVoid)
                      if (blanksToVoid !== undefined) {
                        _.each(blanksToVoid, function(_toVoid) {
                          _.each(_toVoid.uuid, function(uuid) {
                            // body...
                            console.log('Executing Obs to void -- 1046');
                            obs.push({uuid:uuid, voided:true});
                          });
                        });
                      }
                    } else if (groupValues !== null &&
                      Object.keys(groupValues).length > 0) {
                      groupMembers = [];
                      _.each(Object.keys(groupValues), function(_groupMember) {
                        if (groupValues[_groupMember] !== undefined)
                        {
                          console.log('group val-1564', _groupMember);
                          if (typeof groupValues[_groupMember] === 'object') {
                            // array object
                            var ArrayVal = groupValues[_groupMember];
                            // console.log('length',Object.keys(ArrayVal).length)
                            groupMembers = [];
                            if (ArrayVal !== undefined &&
                              Object.keys(ArrayVal).length === 0) {
                              //handling items in an obs group
                              console.log('Calling Obs group method -1');
                              createPayloadObsGroup(ArrayVal, _groupMember,
                                obs, groupMembers, section);
                            } else {
                              /*handling repeating groups*/
                              _.each(Object.keys(ArrayVal), function(arrKey) {
                                // console.log('Array item val-1597', arrKey);
                                if (!arrKey.startsWith('$$')) {
                                  var  obsIndex;
                                  var obsValue;
                                  if (!arrKey.startsWith('obs')) {
                                    // console.log('Calling createPayloadObsGroupArray method -1');
                                    // console.log('Traversed Objects -1',traversedObjects);
                                    createPayloadObsGroupArray(ArrayVal[arrKey],
                                      _groupMember, obs, groupMembers, section,
                                      traversedObjects);
                                    //multiCheckbox field
                                    //console.log('Multi ValKey: '+ _groupMember,'  Value: '+ groupValues[_groupMember])
                                    initData = getInitialFieldValue(_groupMember, section);
                                  } else {
                                    // console.log('Calling createPayloadObsGroupArray method -2');
                                    // console.log('Traversed Objects -2',traversedObjects);
                                    createPayloadObsGroupArray(ArrayVal[arrKey],
                                      arrKey, obs, groupMembers,
                                      section, traversedObjects);
                                    initData = getInitialFieldValue(arrKey, section);
                                  }
                                }
                              });
                              // console.log('Init data Object - current', initData)
                            }

                            if (groupMembers.length > 0) {
                              //console.log('Group key',_groupMember);
                              //console.log('Main Key', key);
                              var concept_ = convertKeyToUuid(key.split('_')[1]);
                              obs.push({concept:concept_, groupMembers:groupMembers});
                            }

                            groupMembers = [];
                            // traversedObjects = [];
                          } else {
                            var obsValue;
                            var  obsIndex;
                            if (!_groupMember.startsWith('obs')) {
                              console.log('Calling ObsArray Method');
                              createPayloadObsArray(groupValues[_groupMember],
                                key, obs, groupMembers,
                                section, traversedObjects);
                              //multiCheckbox field
                              // console.log('Multi ValKey--1192: '+ _groupMember,'  Value: '+ groupValues[_groupMember])
                              initData = getInitialFieldValue(key, section);
                            } else {
                              initData = getInitialFieldValue(_groupMember, section);
                              var concept_ = convertKeyToUuid(_groupMember.split('_')[1]);
                              var value_ = getFormattedValue(groupValues[_groupMember]);

                              if (typeof initData === 'object') {
                                obsValue = initData.initialValue;
                              }

                              if (obsValue !== undefined) {
                                if (obsValue !== value_) {
                                  if (value_ === 'null' || value_ === null || value_ === '') {
                                    console.log('Executing Obs to void -- 1323');
                                    obs.push({uuid:initData.uuid, voided:true, value:obsValue, concept:concept_});
                                  }  else {
                                    //console.log('Obsuuid-1159',initData)
                                    obs.push({uuid:initData.uuid, concept:concept_, value:value_});
                                  }
                                }
                              } else {
                                //new val being added
                                if (value_ !== null && value_ !== 'null' && value_ !== '')
                                    groupMembers.push({concept:concept_, value:value_});
                              }
                            }
                          }
                        }
                      });
                      // console.log('Traversed Items,',traversedObjects);
                      // console.log('All Items', initData.initialValue)
                      // //Droping items in the list array that left out
                      if (traversedObjects.length > 0) {
                        if (!_.isEmpty(initData)) {
                          console.log('init date b4 delete ', initData);
                          if (angular.isArray(initData.initialValue)) {
                            _.each(initData.initialValue, function(item) {
                              if (traversedObjects.indexOf(item) === -1) {
                                var  obsIndex = initData.initialValue.indexOf(item);
                                console.log('Executing Obs to void -- 1354');
                                console.log('b4 delete xx ', initData.initialValue);
                                obs.push({voided:true, uuid:initData.uuid[ obsIndex]});
                              }
                            });
                          }
                        }
                      }

                      if (groupMembers.length > 0) {
                        var concept_ = convertKeyToUuid(key.split('_')[1]);
                        obs.push({concept:concept_, groupMembers:groupMembers});
                      }
                    } else {
                      console.log('Calling non object type Section Method -1');
                      console.log('SECTION 1296 --', section);
                      createPayloadNonObject(val[key], key, obs, section);
                    }
                  }
                } else {
                  // value pair are strings or values
                  //console.log('Normal Key pairs');
                  console.log('Calling non object type Section Method -2');
                  createPayloadNonObject(val[key], key, obs, section);
                }
              }
            });
          }
        }
      });

      formPayLoad.obs = obs;
      if (!_.isEmpty(obs)) {
        // console.log('Patient Selected', patient.uuid())
        formPayLoad['patient'] = patient.uuid();
        formPayLoad['encounterType'] = form.encounterTypeUuid;
        if (params !== undefined && params.uuid !== undefined) {
          //encounter uuid for existing encounter
          formPayLoad['uuid'] = params.uuid;
        }
      }

      if (params !== undefined && angular.isDefined(params.visitUuid)) {
        formPayLoad['visit'] = params.visitUuid;
      }

      return {personAttributes:personAttributes,formPayLoad:formPayLoad};
    }

    function createForm(schema, model, callback)
    {
      obsId = 0;
      var defaultValue_;
      var pages = schema.pages;
      var tab;
      var tabs = [];
      var sectionFields = [];
      var pageFields = [];
      var field = {};
      var sectionId = 0;
      var gpSectionRnd = 0; //this a random number for grp sections without an obs group
      var i = 0; //page id

      _.each(pages, function(page) {
        pageFields = [];
        if (i === 0) {
          // adding hidden gender field
          field = {
            key: 'sex',
            type: 'select',
            defaultValue: '',
            data: {id:'sex'},
            templateOptions: {
              label: 'sex',
              type: 'text',
              required:false,
              options:[{name:'Female', value:'F'},{name:'Male', value:'M'}]
            },
            hideExpression:'model.hide !== ""'
          };

          pageFields.push(field);
          addFieldToValidationMetadata(field, {}, pageFields, 'text');
        }

        _.each(page.sections, function(section) {
          sectionFields = [];
          //section fields
          _.each(section.questions, function(sectionField) {
            if (sectionField.default !== undefined) {
              if (sectionField.default === 'today') {
                defaultValue_ = new Date(parseDate(new Date(), 'dd-MMMM-yyyy'));
              } else if (sectionField.default === 'now') {
                defaultValue_ = new Date(Date.now(), 'dd-MMMM-yyyy');
              } else {
                defaultValue_ = sectionField.default;
              }
            } else {
              defaultValue_ = '';
            }

            if (sectionField.type === 'encounterDate') {
              var required = false;
              if (sectionField.required !== undefined) required = Boolean(sectionField.required);

              field = {
                key: sectionField.type,
                type: 'datetimepicker',
                defaultValue: Date.now(),
                data: {encounter:'enc_' + sectionField.type},
                templateOptions: {
                  type: 'text',
                  label: sectionField.label,
                  //   datepickerPopup: 'dd-MMMM-yyyy',
                  required:required
                },
                validators: {
                  dateValidator: FormValidator.getDateValidatorObject(sectionField.validators[0]) //this  will require refactoring as we move forward
                }
              };

              addToReadyFields(field);
            } else if (sectionField.type === 'encounterProvider') {
              var required = false;
              if (sectionField.required !== undefined) required = Boolean(sectionField.required);

              field = {
                key: sectionField.type,
                type: 'ui-select-extended',
                defaultValue:defaultValue_,
                data: {encounter:'enc_' + sectionField.type},
                templateOptions: {
                  type: 'text',
                  label: sectionField.label,
                  valueProp: 'personUuid',
                  labelProp:'display',
                  deferredFilterFunction: SearchDataService.findProvider,
                  getSelectedObjectFunction: SearchDataService.getProviderByUuid,
                  required:required,
                  options:[]
                }
              };

              addToReadyFields(field);
            } else if (sectionField.type === 'encounterLocation') {
              
              //set encounter location to the default user location
              var definedDefaultUserLocation = UserDefaultPropertiesService.getCurrentUserDefaultLocation();
                    if(angular.isDefined(definedDefaultUserLocation)) {  
                      //use defined default user location to prefill the form                       
                        if(!angular.isDefined(defaultValue_) || defaultValue_ === '') {
                          defaultValue_ = definedDefaultUserLocation.uuid;
                        }                       
                    }                    
                    
              var required = false;
              if (sectionField.required !== undefined) required = Boolean(sectionField.required);
              field = {
                key: sectionField.type,
                type: 'ui-select-extended',
                defaultValue:defaultValue_,
                data: {encounter:'enc_' + sectionField.type},
                templateOptions: {
                  type: 'text',
                  label: sectionField.label,
                  valueProp: 'uuId',
                  labelProp:'display',
                  deferredFilterFunction: SearchDataService.findLocation,
                  getSelectedObjectFunction: SearchDataService.getLocationByUuid,
                  required:required,
                  options:[]
                }
              };

              addToReadyFields(field);
            } else if (sectionField.type === 'group') {
              gpSectionRnd = gpSectionRnd + 1;
              field = createGroupFormlyField(sectionField, gpSectionRnd);
            } else if (sectionField.type === 'group_repeating') {
              gpSectionRnd = gpSectionRnd + 1;
              field = createRepeatingFormlyField(sectionField, gpSectionRnd);
            } else {
              field = createFormlyField(sectionField);
            }

            sectionFields.push(createAnchorField(field.key));
            sectionFields.push(field);
            addToReadyFields(field);
            addFieldToValidationMetadata(field, section, pageFields, sectionField.type);
          });
          //creating formly field section
          sectionId = sectionId  + 1;
          var sectionField =
          {
            key:'section_' + sectionId,
            type: 'section',
            templateOptions: {
              label:section.label
            },
            data:{
              fields:sectionFields
            }
          };

          pageFields.push(sectionField);
        });
        //create page fields
        tab =
        {
          title: page.label,
          form:{
            model:model,
            options:{},
            fields:pageFields
          }
        };
        if (i === 0) {
          tab.active = true;
        }

        tabs.push(tab);
        i = i + 1;
      });

      loaded = true;
      gFields = tabs;
      callback(tabs);
    }

    /* Private method to create an array of fields added to the formly schema*/
    function addToReadyFields(field)
    {
      readyFields.push(field);
    }

    function addFieldToValidationMetadata(field, section, page, typeOfField) {
      //console.log('etl stuff', field);
      if (field && field.data && field.data.id && field.data.id !== '') {
        CurrentLoadedFormService.formValidationMetadata[field.data.id] = {
              key: field.key,
              section: section,
              page: page
            };
      }

      if (typeOfField === 'group') {
        _.each(field.fieldGroup, function(groupField) {
          addFieldToValidationMetadata(groupField, section, page, 'field');
        });
      }
    }

    /* form entry helper local functions  */
    /******************************************************************************/
    /* create form helper functions */

    function getConditionalValidationParams(params)
    {
      if (params !== undefined) {
        var conditionalRequired = _.find(params, function(field) {
          if (field.type === 'conditionalRequired')
          return field;
        });

        return conditionalRequired;
      }
    }

    /*
    Private method to create valid keys
    */
    function createFieldKey(key)
    {
      return key.replace(/-/gi, 'n'); // $$ Inserts a "$".
    }

    function convertKeyToUuid(key)
    {
      return key.replace(/n/gi, '-');
    }
    
    function createAnchorField(ownerKey){
      return {
          type: 'anchor',
          data: {id: 'anchor'},
          templateOptions: {
            ownerKey: ownerKey
          }
      };
    }

    /*
    Private method to create  formly fields without group
    */
    function createFormlyField(_obsField) {
      //console.log(_obsField)
      obsId = obsId + 1;
      var defaultValue_;
      if (_obsField.default !== undefined) {
        defaultValue_ = _obsField.default;
      }

      var hideExpression_;
      var disableExpression_ = '';

      var id_;
      if (_obsField.id !== undefined) {
        id_ = _obsField.id;
      }

      if (_obsField.hide !== undefined) {
        hideExpression_ = FormValidator.getHideDisableExpressionFunction(_obsField.hide[0]);
      } else {
        hideExpression_ = '';
      }

      if (_obsField.disable !== undefined) {
        disableExpression_ = FormValidator.getHideDisableExpressionFunction(_obsField.disable[0]);
      }

      if (_obsField.disableExpression !== undefined) {
        disableExpression_ = FormValidator.getHideDisableExpressionFunction_JS(_obsField.disableExpression[0]);
      }

      var obsField = {};
      if (validateFieldFormat(_obsField) !== true) {
        console.log('Something Went Wrong While creating this field', _obsField);
      }
      //console.log('validators', _obsField);
      var validators;
      if (_obsField.showDate === undefined) //load if the field has no this property (this obs datatime)
          validators = _obsField.validators;

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

      if (validators && validators.length !== 0) {
        compiledValidators = FormValidator.getFieldValidators(validators, getFieldByIdKey);
      }

      if (_obsField.type === 'date') {
        var required = 'false';
        if (_obsField.required !== undefined) {
          required = _obsField.required;
        } else {
          //look for conditonal requirements
          var conditionalParams;
          if (validators && validators.length !== 0) {
            conditionalParams = getConditionalValidationParams(validators);
          }

          var conditionalRequired;
          if (conditionalParams !== undefined) {
            conditionalRequired = FormValidator.getConditionalRequiredExpressionFunction(conditionalParams, getFieldByIdKey);
            required = conditionalRequired;
          }
        }

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          type: 'datepicker',
          data: {concept:_obsField.concept,
            id:id_},
          defaultValue: defaultValue_,
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            datepickerPopup: 'dd-MMMM-yyyy'
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.type === 'text') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          type: 'input',
          defaultValue: defaultValue_,
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: _obsField.type,
            label: _obsField.label
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.type === 'number')
      {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          type: 'input',
          defaultValue: defaultValue_,
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: _obsField.type,
            label: _obsField.label,
            min:_obsField.min,
            max:_obsField.max
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if ((_obsField.type === 'radio') ||
      (_obsField.type === 'select') || (_obsField.type === 'multiCheckbox')) {
        var opts = [];
        //Adding unselect option
        if (_obsField.type !== 'multiCheckbox')
          opts.push({name:'', value:undefined});
        //get the radio/select options/multicheckbox
        //console.log(_obsField);
        _.each(_obsField.answers, function(answer) {
          // body...
          var item = {
            name:answer.label,
            value:answer.concept
          };
          opts.push(item);
        });

        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          type: _obsField.type,
          defaultValue: defaultValue_,
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            options:opts
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.type === 'problem') {
        if (validators && validators.length !== 0) {
          defaultValidator = FormValidator.getFieldValidator(_obsField.validators[0], getFieldByIdKey);
        }

        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          defaultValue: defaultValue_,
          type: 'ui-select-extended',
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            valueProp: 'uuId',
            labelProp:'display',
            deferredFilterFunction: SearchDataService.findProblem,
            getSelectedObjectFunction: SearchDataService.getProblemByUuid,
            options:[]
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.type === 'drug') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          type: 'ui-select-extended',
          defaultValue: defaultValue_,
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            valueProp: 'uuId',
            labelProp:'display',
            deferredFilterFunction: SearchDataService.findDrugConcepts,
            getSelectedObjectFunction: SearchDataService.getDrugConceptByUuid,
            options:[]
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          validators: compiledValidators
        };
      } else if (_obsField.type === 'select-concept-answers') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.concept),
          defaultValue: defaultValue_,
          type: 'concept-search-select',
          data: {concept:_obsField.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            options:[],
            displayMember:'label',
            valueMember:'concept',
            questionConceptUuid:_obsField.concept,
            fetchOptionsFunction:SearchDataService.getConceptAnswers
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': onValueChanged
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.type === 'location-attribute') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'personAttribute' + obsId + '_' + createFieldKey(_obsField.attributeType),
          type: 'ui-select-extended',
          defaultValue: defaultValue_,
          data: {attributeType:_obsField.attributeType,
          id:id_},
          templateOptions: {
          type: 'text',
          label: _obsField.label,
          valueProp: 'uuId',
          labelProp:'display',
          deferredFilterFunction: SearchDataService.findLocation,
          getSelectedObjectFunction: SearchDataService.getLocationByUuid,
          options:[]
        },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required
          },
          validators: compiledValidators
        };
      }
      // console.log('Obs field', obsField);
      return obsField;
    }

    /*
    Private method to create Group formly fields
    */
    function createGroupFormlyField(_obsField, gpSectionRnd)
    {
      var hideExpression_;
      var obsField = {};
      var groupingFields = [];
      //gpSectionRnd = gpSectionRnd + 1;
      var sectionKey = _obsField.concept ? _obsField.concept : 'unamed_' + gpSectionRnd;
      //Get the fields in the group section
      _.each(_obsField.questions, function(curField) {
        // process the fields the normal way
        var selField = createFormlyField(curField);
        //selField['key'] = selField['key'] + '@obs_' + sectionKey;
        groupingFields.push(createAnchorField(selField.key));
        groupingFields.push(selField);
        if (curField.showDate === 'true') {
          if (_obsField.hide !== undefined) {
            hideExpression_ = FormValidator.getHideDisableExpressionFunction(_obsField.hide[0]);
          } else {
            hideExpression_ = '';
          }

          var dateField = {
            //className: 'col-md-2',
            key: 'obsDate' + obsId + '_' + createFieldKey(curField.concept),
            type: 'datepicker',
            data: {concept:curField.concept},
            templateOptions: {
              type: 'text',
              label: 'Date',
              datepickerPopup: 'dd-MMMM-yyyy'
            },
            expressionProperties: {
              'templateOptions.required': function($viewValue, $modelValue, scope, element) {
                var value = $viewValue || $modelValue;
                var fkey = selField.key;
                // console.log('This Key', fkey);
                // console.log('Model val now ',scope.model[fkey])
                return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
              }
            },
            hideExpression:hideExpression_,
            validators: {
              dateValidator: FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
            }
          };
          groupingFields.push(dateField);
        }
      });

      obsField = {
        className: 'row',
        key:'obs' + gpSectionRnd + '_' + createFieldKey(sectionKey),
        fieldGroup:groupingFields
      };
      return obsField;
    }

    function onValueChanged(viewVal, modelVal, fieldScope) {
      if (fieldScope.options.data.id) {
        FormValidator.updateListeners(fieldScope.options.data.id, getFieldByIdKey);
      }
    }

    /*
    Private method/function to create a repeating section
    */
    function createRepeatingFormlyField(_obsField, gpSectionRnd)
    {
      var repeatingFields = [];
      //Get the fields in the repeating section
      var sectionKey = _obsField.concept ? _obsField.concept : 'unamed_' + gpSectionRnd;
      _.each(_obsField.questions, function(curField) {
        // process the fields the normal way
        var selField = createFormlyField(curField);
        //selField['className'] = 'col-md-2';
        //selfField['key'] = selfField['key']
        repeatingFields.push(createAnchorField(selField.key));
        repeatingFields.push(selField);
        if (curField.showDate === 'true')
        {
          var dateField = {
            //className: 'col-md-2',
            key: 'obsDate' + obsId + '_' + createFieldKey(curField.concept),
            type: 'datepicker',
            data: {concept:curField.concept},
            templateOptions: {
              type: 'text',
              label: 'Date',
              datepickerPopup: 'dd-MMMM-yyyy'
            },
            expressionProperties: {
              'templateOptions.required': function($viewValue, $modelValue, scope, element) {
                var value = $viewValue || $modelValue;
                var fkey = selField.key;
                // console.log('This Key', fkey);
                // console.log('Model val now ',scope.model[fkey])
                return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
              }
            },
            validators: {
              dateValidator: FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
            }
          };
          repeatingFields.push(dateField);
        }
      });

      var obsField = {
        key:'obs' + gpSectionRnd + '_' + createFieldKey(_obsField.concept),
        type: 'repeatSection',
        templateOptions: {
          label:_obsField.label,
          btnText:'Add',
          fields:[
            {
              className: 'row',
              fieldGroup:repeatingFields
            }
          ]
        }
      };
      return obsField;
    }

    /*Payload Creation helper functions */
    /* private method to format values before posting to the payload*/
    function getFormattedValue(value) {
      console.log('convert to date', value);
      if (!value) return value;

      if (typeof value === 'number') return value;

      if (Object.prototype.toString.call(value) === '[object Date]') {
        // if(_.contains(value,':'))
        console.log('convert to date', value);
        value = moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
      }

      //moment().utc();
      var isDateValid = false;
      if (isDateValid === false) {
        isDateValid = moment(value, 'YYYY-MM-DDTHH:mm:ssZ').isValid();
        if (isDateValid) {
          var stringToValidate = value.substr(0, 10);
          var rgexp = /(^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$)/;
          var isValidDate = rgexp.test(stringToValidate);
          if (isValidDate) {
            isDateValid = true;
          } else {
            isDateValid = false;
          }
        }
      }

      if (isDateValid) {
        var localTime = moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        return localTime;
      }

      return value;
    }

    function parseDate(value, format, offset) {
      var format = format || 'yyyy-MM-dd HH:mm:ss';
      var offset = offset || '+0300';

      if (!(value instanceof Date)) {
        value = new Date(value);
        if (value === null || value === undefined) {
          return '';
        }
      }

      return $filter('date')(value, format, offset);
    }
  }

})();
