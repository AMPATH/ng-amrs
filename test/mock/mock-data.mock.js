/* jshint -W079, -W098, -W026, -W003, -W106 */
(function() {
    'use strict';
    var mockedDataModule = angular
        .module('mock.data', []);

    mockedDataModule.factory('mockData', mockData);

    mockData.$inject = [];

    function mockData() {

      var mock_data = {
              getMockSchema: getMockSchema,
              getMockStates: getMockStates,
              getMockObs: getMockObs,
              getMockModel: getMockModel,
              getMockPatient: getMockPatient,
              getMockObsField:getMockObsField,
              getMockLocations: getMockLocations
          };

          return mock_data;

          function getMockPatient(){
            return {
              identifiers:['test-patient'],
            person:{
              age: 63,
              birthdate: '1951-12-09T00:00:00.000+0245',
              dead: false,
              deathDate: null,
              gender: 'F',
              preferredName:{
                familyName: 'Testty',
                givenName: 'Testty',
                middleName: 'Testty'
              },
              preferredAddress: {
                address1: null,
                address2: null,
                address3: null,
                address4: 'AINABKOI',
                address5: 'KIPKURERE',
                address6: 'TIMBOROA',
                cityVillage: 'KAHUHO A',
                country: null,
                countyDistrict: 'ELDORET EAST',
                postalCode: null,
                preferred: true,
                stateProvince: null},
              attributes: '_attributes'
            },
            uuid: 'xxxx',
            };
          }

          function getMockLocations()
          {
            var testLocations = [
              {
                uuid: 'uuid_1',
                name: 'Location-1',
                display: 'Location-1',
                description: 'Mock Location 1'
              },
              {
                uuid: 'uuid_100',
                name: 'Location-100',
                display: 'Location-100',
                description: 'Mock Location 2'
              },
              {
                uuid: 'uuid_101',
                name: 'Location-101',
                display: 'Location-101',
                description:'Mock Location 3'
              }
            ];

            return testLocations;
          }

          function getMockObs()
          {
            return {
                uuid: 'passed-uuid',
                display: 'PROBLEM RESOLVED: MALARIA',
                concept: {
                  uuid: 'a8af4aa0-1350-11df-a1f1-0026b9348838',
                  display: 'PROBLEM RESOLVED'
                  }
                };
          }

          function getMockStates() {
              return [
                  {
                      state: 'dashboard',
                      config: {
                          url: '/',
                          templateUrl: 'app/dashboard/dashboard.html',
                          title: 'dashboard',
                          settings: {
                              nav: 1,
                              content: '<i class="fa fa-dashboard"></i> Dashboard'
                          }
                      }
                  }
              ];
          }

          function getMockObsField()
          {
            var obsField = {
              key: 'obs1_a89ff9a6n1350n11dfna1f1n0026b9348838',
              type: 'select',
              data: {concept:'a89ff9a6-1350-11df-a1f1-0026b9348838',
                id:'q7a'},
                defaultValue: '',
              templateOptions: {
                type: 'text',
                label: '7a. Visit Type',
                required:false,
                options:[]
              },
               expressionProperties: {
                'templateOptions.disabled': false
               },
              hideExpression:''
            }
            return obsField;
          }

          function getMockSchema() {
              return {
                "name": "test-form",
                "uuid": "xxxx",
                "processor": "postEncounterForm",
                "pages": [
                  {
                    "label":"page 1",
                    "sections":[
                      {
                        "label":"Encounter Details",
                        "questions":[
                          {
                            "label": "Visit Date",
                            "type": "encounterDate",
                            "required": "true",
                            "validators":[{"type":"date"}]
                          },
                          {
                            "type": "encounterProvider",
                            "label": "Provider",
                            "required": "true"
                          },
                          {
                            "type": "encounterLocation",
                            "label": "Facility Name",
                            "required": "true"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "label":"Page 2",
                    "sections":[
                      {
                        "label": "Visit Type",
                        "questions": [
                          {
                            "concept": "a89ff9a6-1350-11df-a1f1-0026b9348838",
                            "id":"q7a",
                            "label": "7a. Visit Type",
                            "type": "select",
                            "validators": [],
                            "answers":[
                              {"concept": "a89b6440-1350-11df-a1f1-0026b9348838", "label": "Scheduled visit"},
                              {"concept": "a89ff816-1350-11df-a1f1-0026b9348838", "label": "Unscheduled Visit Early"},
                              {"concept": "a89ff8de-1350-11df-a1f1-0026b9348838", "label": "Unscheduled Visit Late"}
                            ]
                          },
                          {
                            "concept": "dc1942b2-5e50-4adc-949d-ad6c905f054e",
                            "type": "date",
                            "validators": [ {"type": "date", "allowFutureDates": "true"} ],
                            "label": "7b. If Unscheduled, actual scheduled date"
                          }
                        ]
                      },
                      {
                        "label":"Problem List",
                        "questions":[
                          {
                            "concept": "a89c2d8a-1350-11df-a1f1-0026b9348838",
                            "type": "group_repeating",
                            "label": "23a. Problem Added",
                            "questions":[
                              {
                                "concept": "a8ae835e-1350-11df-a1f1-0026b9348838",
                                "label": "Problem Added",
                                "type": "problem",
                                "validators": []
                              }
                            ]
                          }
                    ]
                  }
                  ]
                }
                ]
              };
          }

      function getMockModel()
      {
            return {
        "section_1": {
          "encounterDate": "2015-08-18T00:00:00.000+0300",
          "encounterProvider": "5d13dddc-1359-11df-a1f1-0026b9348838",
          "encounterLocation": "00b47ef5-a29b-40a2-a7f4-6851df8d6532"
        },
        "section_2": {
          "obs_a89ff9a6-1350-11df-a1f1-0026b9348838": "a89b6440-1350-11df-a1f1-0026b9348838",
          "obs_dc1942b2-5e50-4adc-949d-ad6c905f054e": "2015-08-04T00:00:00.000+0300"
        },
        "section_3": {
          "obs4_a89c2d8a-1350-11df-a1f1-0026b9348838": [
            {
              "obs_a8ae835e-1350-11df-a1f1-0026b9348838": "a890e4b6-1350-11df-a1f1-0026b9348838"
            }
          ]
        }
      };
    }


    }
})();
