/* jshint -W079, -W098, -W026, -W003, -W106 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  var mockedDataModule = angular
        .module('mock.data', []);
  mockedDataModule.factory('mockData', mockData);
  mockData.$inject = [];

  function mockData() {

    var mock = {
            getMockSchema: getMockSchema,
            getMockTriageSchema: getMockTriageSchema,
            getMockStates: getMockStates,
            getMockObs: getMockObs,
            getMockPersonAttribute:getMockPersonAttribute,
            getMockPersonAttributesArray:getMockPersonAttributesArray,
            getMockPatient: getMockPatient,
            getMockLocations: getMockLocations,
            getMockEtlLocations: getMockEtlLocations,
            getMockedFormList:getMockedFormList,
            getMockTriageRestObs: getMockTriageRestObs
          };

    return mock;

    function getMockPatient() {
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
        attributes: getMockPersonAttribute()
      },
        uuid: 'xxxx',
      };
    }

    function getMockEtlLocations() {
        return {
          startIndex:0, size:1,
          result: [{locationId: 1,
          name: 'Location-1',
          description: 'Moi Teaching and Referral Hospital - Module 1',
          address1: 'P.O Box 30100-3 Eldoret',
          address2: 'xxx',
          uuid: 'passed-uuid'}]
        };
      }

    function getMockedFormList(uuid) {
      return {
        results: [
                {
                  uuid: 'passed-uuid',
                  name: 'AMPATH POC Adult Return Visit Form v0.01',
                  version: '0.01',
                  encounterType: {
                    uuid: '0010c6dffd0f',
                    display: 'ADULTRETURN',
                    name: 'ADULTRETURN',
                    description: 'Outpatient Adult Return Visit',
                  }
                },
                {
                  uuid: 'f42f7c5f2ab',
                  name: 'AMPATH POC Pead Return Visit Form v0.01',
                  version: '0.01',
                  encounterType: {
                    uuid: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                    display: 'ADULTRETURN',
                    name: 'ADULTRETURN',
                    description: 'Outpatient Adult Return Visit'
                  }
                }
              ]
      };

    }

    function getMockLocations() {
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

    function getMockObs()  {
      return {
        uuid: 'passed-uuid',
        display: 'PROBLEM RESOLVED: MALARIA',
        concept: {
          uuid: 'a8af4aa0-1350-11df-a1f1-0026b9348838',
          display: 'PROBLEM RESOLVED'
        }
      };
    }

    function getMockPersonAttribute() {
      return {
        results: [{
                display:  'Health Center 2 = 9',
                uuid:  'passed-uuid',
                value: {
                  uuid:  'location1-uuid',
                  display:  'Location 5 = 5'
                },
                attributeType: {
                  uuid:  'fb121d9dc370',
                  display:  'Health Center 2'
                }
              },
              {
                display:  'Health Center = 4',
                uuid:  'passed-uuid-2',
                value: {
                  uuid:  'location2-uuid',
                  display:  'Location 9 '
                },
                attributeType: {
                  uuid:  '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
                  display:  'Health Center 2'
                }
              }]
      };
    }

    function getMockPersonAttributesArray() {
      var testData = [{uuid:'f123244d-8f1d-4430-9191-98ce60f3723b',
            attributeType:'8d87236c-c2cc-11de-8d13-0010c6dffd0f',
            name:'Health Center',
            value:{uuid:'c09380bc-1691-11df-97a5-7038c432aabf',
            display:'Location-5'}},
            {uuid:'413e25e9-12ad-4cbe-8197-d487e2da1959',
            attributeType:'7ef225db-94db-4e40-9dd8-fb121d9dc370',
            name:'Health Center 2',
            value:{uuid:'c093879e-1691-11df-97a5-7038c432aabf',
            display:'Location-9'}}];
      return testData;

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

    function getMockSchema() {
      return {
  "name": "test version 2",
  "version": "1.0.0",
  "encounterType": "uuid",
  "form": "uuid",
  "processor": "EncounterFormProcessor",
  "pages": [
    {
      "label": "Page Name 1",
      "sections": [
        {
          "label": "Encounter Details",
          "questions": [
            {
              "label": "Visit Date",
              "type": "encounterDatetime",
              "required": "true",
              "default": "",
              "id": "encDate",
              "questionOptions": {
                "rendering": "date"
              },
              "validators": []
            },
            {
              "type": "encounterProvider",
              "label": "Provider",
              "id": "provider",
              "required": "false",
              "default": "",
              "questionOptions": {
                "rendering": "ui-select-extended"
              },
              "disable": {
                "disableWhenExpression": "q1 === 'disq6'"
              },
              "validators": []
            },
            {
              "type": "encounterLocation",
              "label": "Facility name (site/satellite clinic required):",
              "id": "location",
              "required": "false",
              "questionOptions": {
                "rendering": "ui-select-extended"
              },
              "validators": []
            }
          ]
        },
        {
          "label": "Section Name",
          "questions": [
            {
              "type":"personAttribute",
              "label":"Person Attribute Health center",
              "id":"first_person_attribute",
              "required":"false",
              "default":"",
              "questionOptions":{
                "rendering":"ui-select-extended",
                "attributeType":"8d87236c-c2cc-11de-8d13-0010c6dffd0f"
              }
            },
            {
              "type":"obs",
              "label":"question1",
              "id":"q1",
              "required":"false",
              "default":"",
              "historicalExpression":"'previous test'",
              "questionOptions":{
                "rendering":"text",
                "concept":"1232"
              }
            },
            {
              "type": "obs",
              "label": "question4",
              "id": "q4",
              "required": {
                "type": "conditionalRequired",
                "message": "When q1 is requiredanswer, this is required",
                "referenceQuestionId": "q1",
                "referenceQuestionAnswers": [
                  "requiredanswer"
                ]
              },
              "default": "",
              "questionOptions": {
                "rendering": "text",
                "concept": "12324"
              },
              "validators": []
            },
            {
              "type": "obs",
              "label": "question5",
              "id": "q5",
              "required": "false",
              "default": "",
              "questionOptions": {
                "rendering": "text",
                "concept": "123266"
              },
              "validators": [
                {
                  "type": "conditionalAnswered",
                  "message": "Only answer when q1 is answerQ5",
                  "referenceQuestionId": "q1",
                  "referenceQuestionAnswers": [
                    "answerQ5"
                  ]
                }
              ]
            },
            {
              "type": "obs",
              "label": "question6",
              "id": "q6",
              "required": "false",
              "default": "",
              "disable": {
                "disableWhenExpression": "q1 === 'disableq-6'"
              },
              "questionOptions": {
                "rendering": "text",
                "concept": "123267"
              },
              "validators": []
            },
            {
              "type": "obs",
              "label": "question7",
              "id": "q7",
              "required": "false",
              "default": "",
              "hide": {
                "hideWhenExpression": "q1 === 'hideq-7'"
              },
              "questionOptions": {
                "rendering": "text",
                "concept": "1203267"
              },
              "validators": []
            },
            {
              "type": "obs",
              "label": "question2",
              "id": "q2",
              "required": "false",
              "default": "",
              "questionOptions": {
                "rendering": "date",
                "concept": "1234"
              },
              "validators": []
            },
            {
              "type": "obs",
              "label": "question3",
              "id": "q3",
              "required": "false",
              "default": "",
              "historicalExpression":"120",
              "questionOptions": {
                "rendering": "number",
                "concept": "1233"
              },
              "validators": [
                {
                  "type": "js_expression",
                  "failsWhenExpression": "isEmpty(myValue) && !isEmpty(q1) && q1 === 'fail'",
                  "message": "Patient previously marked as on ART. Please provide the treatment category."
                }
              ]
            },
            {
              "label": "Family Planning",
              "id": "onFamilyPlanning",
              "type": "obs",
              "required": "false",
              "historicalExpression":"'a899b35c-1350-11df-a1f1-0026b9348838'",
              "questionOptions": {
                "rendering": "select",
                "concept": "774961c6-232f-4332-8a9f-f5c55ebe86d0",
                "answers": [
                  {
                    "concept": "a899b35c-1350-11df-a1f1-0026b9348838",
                    "label": "Yes"
                  },
                  {
                    "concept": "a899b42e-1350-11df-a1f1-0026b9348838",
                    "label": "No"
                  }
                ]
              },
              "disable": {
                "disableWhenExpression": "q1 === 'disfp'"
              },
              "validators": []
            },
            {
              "label": "Family Planning Method",
              "id": "q12e",
              "type": "obsGroup",
              "questionOptions": {
                "rendering": "repeating"
              },
              "questions": [
                {
                  "label": "Family Planning Method:",
                  "id": "q12e",
                  "type": "obs",
                  "required":"false",
                  "questionOptions": {
                    "rendering": "select",
                    "concept": "a894b1cc-1350-11df-a1f1-0026b9348838",
                    "answers": [
                      {
                        "concept": "a893516a-1350-11df-a1f1-0026b9348838",
                        "label": "Condoms"
                      },
                      {
                        "concept": "b75702a6-908d-491b-9399-6495712c81cc",
                        "label": "Emergency OCP"
                      },
                      {
                        "concept": "a8aff356-1350-11df-a1f1-0026b9348838",
                        "label": "Implant"
                      },
                      {
                        "concept": "a8a71330-1350-11df-a1f1-0026b9348838",
                        "label": "Injectable Hormones"
                      },
                      {
                        "concept": "a8a71650-1350-11df-a1f1-0026b9348838",
                        "label": "IUD"
                      },
                      {
                        "concept": "4a740e33-fee5-4a2b-b679-1904722e3d9e",
                        "label": "Lactation Method"
                      },
                      {
                        "concept": "a897dbd6-1350-11df-a1f1-0026b9348838",
                        "label": "OCP"
                      },
                      {
                        "concept": "a8a714c0-1350-11df-a1f1-0026b9348838",
                        "label": "Rhythm Method"
                      },
                      {
                        "concept": "a8a713f8-1350-11df-a1f1-0026b9348838",
                        "label": "Sterilization"
                      },
                      {
                        "concept": "a8aaf3e2-1350-11df-a1f1-0026b9348838",
                        "label": "Other"
                      }
                    ]
                  }
                }
              ],
              "disable": {
                "disableWhenExpression": "q1 === 'disfp'"
              },
              "validators": []
            },
            {
              "label": "Family Planning Method:",
              "id": "q12e",
              "type": "obs",
              "required":"false",
              "questionOptions": {
                "rendering": "multiCheckbox",
                "concept": "a894b1cc-1350-11df-a1f1-0026b9348838",
                "answers": [
                  {
                    "concept": "a893516a-1350-11df-a1f1-0026b9348838",
                    "label": "Condoms"
                  },
                  {
                    "concept": "b75702a6-908d-491b-9399-6495712c81cc",
                    "label": "Emergency OCP"
                  },
                  {
                    "concept": "a8aff356-1350-11df-a1f1-0026b9348838",
                    "label": "Implant"
                  },
                  {
                    "concept": "a8a71330-1350-11df-a1f1-0026b9348838",
                    "label": "Injectable Hormones"
                  },
                  {
                    "concept": "a8a71650-1350-11df-a1f1-0026b9348838",
                    "label": "IUD"
                  },
                  {
                    "concept": "4a740e33-fee5-4a2b-b679-1904722e3d9e",
                    "label": "Lactation Method"
                  },
                  {
                    "concept": "a897dbd6-1350-11df-a1f1-0026b9348838",
                    "label": "OCP"
                  },
                  {
                    "concept": "a8a714c0-1350-11df-a1f1-0026b9348838",
                    "label": "Rhythm Method"
                  },
                  {
                    "concept": "a8a713f8-1350-11df-a1f1-0026b9348838",
                    "label": "Sterilization"
                  },
                  {
                    "concept": "a8aaf3e2-1350-11df-a1f1-0026b9348838",
                    "label": "Other"
                  }
                ]
              },
              "disable": {
                "disableWhenExpression": "q1 === 'disfp'"
              },
              "validators": [
                {
                  "type": "js_expression",
                  "failsWhenExpression": "arrayContains(myValue, 'a8aaf3e2-1350-11df-a1f1-0026b9348838') && isEmpty(q1)",
                  "message": "Patient previously marked as on ART. Please provide the treatment category."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Page Name 2",
      "sections": [
        {
          "label": "test Groups",
          "questions": [
            {
              "type": "obsGroup",
              "label": "Was patient hospitalized",
              "questionOptions": {
                "rendering": "group",
                "concept": "a8a003a6-1350-11df-a1f1-0026b9348838"
              },
              "questions": [
                {
                  "label": "Reason for hospitalization",
                  "type": "obs",
                  "questionOptions": {
                    "rendering": "text",
                    "concept": "a8a07a48-1350-11df-a1f1-0026b9348838"
                  },
                  "id": "hospitalizationReason",
                  "validators": [
                    {
                      "type": "conditionalAnswered",
                      "message": "Providing diagnosis but didn't answer that patient was hospitalized in question 11a",
                      "referenceQuestionId": "wasHospitalized",
                      "referenceQuestionAnswers": [
                        "a899b35c-1350-11df-a1f1-0026b9348838"
                      ]
                    }
                  ]
                },
                {
                  "label": "Date of hospitalization",
                  "type": "obsGroup",
                  "questionOptions": {
                    "rendering": "group",
                    "concept": "made-up-concept"
                  },
                  "questions": [
                    {
                      "type": "obs",
                      "label": "Start Date",
                      "questionOptions": {
                        "rendering": "date",
                        "concept": "made-up-concept-2"
                      }
                    },
                    {
                      "type": "obs",
                      "label": "End Date",
                      "questionOptions": {
                        "rendering": "date",
                        "concept": "made-up-concept-3"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Page Name 3",
      "sections": [
        {
          "label": "test Group Repeating",
          "questions": [
            {
              "type": "obsGroup",
              "label": "Was patient hospitalized",
              "historicalExpression": "sampleRepeatingGroupValue",
              "questionOptions": {
                "rendering": "repeating",
                "concept": "a8a003a6y1350y11dfya1f1y0026b9348838"
              },
              "questions": [
                {
                  "label": "Reason for hospitalization",
                  "type": "obs",
                  "questionOptions": {
                    "rendering": "text",
                    "concept": "a8a07a48x1350x11dfxa1f1-0026b9348838"
                  },
                  "id": "hospitalizationReason",
                  "validators": [
                    {
                      "type": "conditionalAnswered",
                      "message": "Providing diagnosis but didn't answer that patient was hospitalized in question 11a",
                      "referenceQuestionId": "wasHospitalized",
                      "referenceQuestionAnswers": [
                        "a899b35c-1350-11df-a1f1-0026b9348838"
                      ]
                    }
                  ]
                },
                {
                  "label": "Date of hospitalization",
                  "type": "obsGroup",
                  "questionOptions": {
                    "rendering": "group",
                    "concept": "made-up-concept-4"
                  },
                  "questions": [
                    {
                      "type": "obs",
                      "label": "Start Date",
                      "questionOptions": {
                        "rendering": "date",
                        "concept": "made-up-concept-5"
                      }
                    },
                    {
                      "type": "obs",
                      "label": "End Date",
                      "questionOptions": {
                        "rendering": "date",
                        "concept": "made-up-concept-6"
                      }
                    }
                  ]
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
    
    function getMockTriageRestObs() {
        return {
            uuid: "test-uuid",
            encounterDatetime: "2015-11-30T14:44:38.000+0300",
            form: {
                uuid: "a2b811ed-6942-405a-b7f8-e7ad6143966c",
                name: "Triage Encounter Form v0.01"
            },
            location: {
                uuid: "08fec056-1352-11df-a1f1-0026b9348838",
                display: "Location-13"
            },
            encounterType: {
                uuid: "a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7",
                display: "TRIAGE"
            },
            provider: {
                uuid: "5b6e31da-1359-11df-a1f1-0026b9348838",
                display: "Giniton Giniton Giniton"
            },
            obs: [
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b"
                    },
                    value: {
                        uuid: "a89ad3a4-1350-11df-a1f1-0026b9348838",
                        display: "NOT APPLICABLE"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a894b1cc-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a893516a-1350-11df-a1f1-0026b9348838",
                        display: "CONDOMS"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5731",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a894b1cc-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "b75702a6-908d-491b-9399-6495712c81cc",
                        display: "EMERGENCY OCP"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a899e6d8-1350-11df-a1f1-0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a65e36-1350-11df-a1f1-0026b9348838"
                            },
                            value: 80,
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a65fee-1350-11df-a1f1-0026b9348838"
                            },
                            value: 35,
                            groupMembers: null
                        }
                    ]
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a003a6y1350y11dfya1f1y0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a07a48x1350x11dfxa1f1-0026b9348838"
                            },
                            value: 'testing repeating',
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "made-up-concept-4"
                            },
                            value: null,
                            groupMembers: [
                                {
                                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-5"
                                    },
                                    value: "2015-11-30T14:44:38.000+0300",
                                    groupMembers: null
                                },
                                {
                                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-6"
                                    },
                                    value: "2015-12-30T14:44:38.000+0300",
                                    groupMembers: null
                                }
                            ]
                        }
                    ]
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a003a6y1350y11dfya1f1y0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a07a48x1350x11dfxa1f1-0026b9348838"
                            },
                            value: 'testing repeating 2 now',
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "made-up-concept-4"
                            },
                            value: null,
                            groupMembers: [
                                {
                                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-5"
                                    },
                                    value: "2015-04-30T14:44:38.000+0300",
                                    groupMembers: null
                                },
                                {
                                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-6"
                                    },
                                    value: "2015-05-30T14:44:38.000+0300",
                                    groupMembers: null
                                }
                            ]
                        }
                    ]
                },
                {
                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65e36-1350-11df-a1f1-0026b9348838"
                    },
                    value: 80,
                    groupMembers: null
                },
                {
                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65fee-1350-11df-a1f1-0026b9348838"
                    },
                    value: 35,
                    groupMembers: null
                },
                {
                    uuid: "29953cdb-d4e3-4024-9bb1-e1c0a7fca6ce",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8b02524-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "8b715fed-97f6-4e38-8f6a-c167a42f8923",
                        display: "KENYA NATIONAL HEALTH INSURANCE FUND"
                    },
                    groupMembers: null
                },
                {
                    uuid: "5e12a2f5-678b-4b1e-a646-23221bad8797",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65f12-1350-11df-a1f1-0026b9348838"
                    },
                    value: 50,
                    groupMembers: null
                },
                {
                    uuid: "51e18815-8032-4cb4-b2e8-8c561ee53093",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a6619c-1350-11df-a1f1-0026b9348838"
                    },
                    value: 180,
                    groupMembers: null
                },
                {
                    uuid: "f26402b1-5226-4afd-a60c-c2ea096783c1",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "93aa3f1d-1c39-4196-b5e6-8adc916cd5d6"
                    },
                    value: {
                        uuid: "a89ad3a4-1350-11df-a1f1-0026b9348838",
                        display: "NOT APPLICABLE"
                    },
                    groupMembers: null
                },
                {
                    uuid: "aaaf883b-ba97-45ef-8b32-d37a48bb2342",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a899a9f2-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a899ac7c-1350-11df-a1f1-0026b9348838",
                        display: "NEVER MARRIED"
                    },
                    groupMembers: null
                },
                {
                    uuid: "2cc74686-92ba-49cc-af49-6f1a02e608ba",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65d5a-1350-11df-a1f1-0026b9348838"
                    },
                    value: 120,
                    groupMembers: null
                },
                {
                    uuid: "5d268f3a-a6c9-495a-bf15-605e94a7eb08",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a89ff9a6-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a89b6440-1350-11df-a1f1-0026b9348838",
                        display: "SCHEDULED VISIT"
                    },
                    groupMembers: null
                },
                {
                    uuid: "557a1246-b3a7-49d2-9f27-e1a6c1059496",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a660ca-1350-11df-a1f1-0026b9348838"
                    },
                    value: 65,
                    groupMembers: null
                },
                {
                    uuid: "ccfba5fc-8202-4506-a2ab-7a9dd04569bb",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8af49d8-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a899b42e-1350-11df-a1f1-0026b9348838",
                        display: "NO"
                    },
                    groupMembers: null
                }
            ]
        };
    }
    
    function getMockTriageSchema() {
        return {
  "name": "AMPATH Triage Encounter Form 1.0.0",
  "uuid": "xxxx",
  "processor": "EncounterFormProcessor",
  "pages": [
    {
      "label": "Page 1",
      "sections": [
        {
          "label": "Encounter Details",
          "questions": [
            {
              "label": "Visit Date",
              "type": "encounterDatetime",
              "required": "true",
              "default": "",
              "id":"encDate",
              "questionOptions":{
                "rendering":"date"
              },
              "validators": [
                {
                  "type": "date"
                }
              ]
            },
            {
              "type": "encounterProvider",
              "label": "Provider",
              "id":"provider",
              "required": "true",
              "default":"",
              "questionOptions":{
                "rendering":"ui-select-extended"
              }
            },
            {
              "type": "encounterLocation",
              "label": "Facility name (site/satellite clinic required):",
              "id":"location",
              "required": "true",
              "questionOptions":{
                "rendering":"ui-select-extended"
              }
            },
            {
              "type":"personAttribute",
              "label":"Transfer in from other AMPATH clinic (specify):",
              "id":"transfered_in_to_ampath",
              "required":"true",
              "default":"",
              "questionOptions":{
                "rendering":"ui-select-extended",
                "attributeType":"7ef225db-94db-4e40-9dd8-fb121d9dc370"
              }
            },
            {
              "type":"personAttribute",
              "label":"Transfer out to another AMPATH clinic (specify):",
              "id":"transfered_out_to_ampath",
              "required":"true",
              "default":"",
              "questionOptions":{
                "rendering":"ui-select-extended",
                "attributeType":"8d87236c-c2cc-11de-8d13-0010c6dffd0f"
              }
            },
            {
              "type":"obs",
              "label":"question1",
              "id":"q1",
              "required":"true",
              "default":"",
              "historicalExpression": "'testing'",
              "questionOptions":{
                "rendering":"text",
                "concept":"1232"
              }
            },
            {
              "label": "Patient covered by NHIF:",
              "questionOptions":{
                "rendering":"select",
                "concept": "a8b02524-1350-11df-a1f1-0026b9348838",
                "answers": [
                  {
                    "concept": "8b715fed-97f6-4e38-8f6a-c167a42f8923",
                    "label": "Yes"
                  },
                  {
                    "concept": "a899e0ac-1350-11df-a1f1-0026b9348838",
                    "label": "No"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            },
            {
              "label": "Was this visit scheduled?",
              "id": "scheduledVisit",
              "questionOptions":{
                "rendering":"select",
                "concept": "a89ff9a6-1350-11df-a1f1-0026b9348838",
                "answers": [
                  {
                    "concept": "a89b6440-1350-11df-a1f1-0026b9348838",
                    "label": "Scheduled visit"
                  },
                  {
                    "concept": "a89ff816-1350-11df-a1f1-0026b9348838",
                    "label": "Unscheduled Visit Early"
                  },
                  {
                    "concept": "a89ff8de-1350-11df-a1f1-0026b9348838",
                    "label": "Unscheduled Visit Late"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            },
            {
              "label": "If Unscheduled, actual scheduled date",
              "id": "q7b",
              "type": "obs",
              "questionOptions":{
                "rendering":"date",
                "concept": "dc1942b2-5e50-4adc-949d-ad6c905f054e"
              },
              "validators": [
                {
                  "type": "date",
                  "allowFutureDates": "true"
                },
                {
                  "type": "js_expression",
                  "failsWhenExpression": "!isEmpty(scheduledVisit) && arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit) && isEmpty(myValue)",
                  "message": "Patient visit marked as unscheduled. Please provide the scheduled date."
                },
                {
                  "type": "conditionalRequired",
                  "message": "Patient visit marked as unscheduled. Please provide the scheduled date.",
                  "referenceQuestionId": "scheduledVisit",
                  "referenceQuestionAnswers": [
                    "a89ff816-1350-11df-a1f1-0026b9348838",
                    "a89ff8de-1350-11df-a1f1-0026b9348838"
                  ]
                }
              ],
              "disableExpression": [
                {
                  "disableWhenExpression": "!arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit)"
                }
              ]
            }
          ]
        },
        {
          "label": "PWPs",
          "questions": [
            {
              "label": "Civil Status:",
              "required": "true",
              "questionOptions":{
                "rendering":"select",
                "concept": "a899a9f2-1350-11df-a1f1-0026b9348838",
                "answers": [
                  {
                    "concept": "a899af10-1350-11df-a1f1-0026b9348838",
                    "label": "Cohabitating"
                  },
                  {
                    "concept": "a899af10-1350-11df-a1f1-0026b9348838",
                    "label": "Divorced"
                  },
                  {
                    "concept": "a8aa76b0-1350-11df-a1f1-0026b9348838",
                    "label": "Married monogamous"
                  },
                  {
                    "concept": "a8b03712-1350-11df-a1f1-0026b9348838",
                    "label": "Married polygamous"
                  },
                  {
                    "concept": "a899aba0-1350-11df-a1f1-0026b9348838",
                    "label": "Separated"
                  },
                  {
                    "concept": "a899ac7c-1350-11df-a1f1-0026b9348838",
                    "label": "Single"
                  },
                  {
                    "concept": "a899ae34-1350-11df-a1f1-0026b9348838",
                    "label": "Widowed"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            },
            {
              "label": "Discordant couple:",
              "questionOptions":{
                "rendering":"select",
                "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                "answers": [
                  {
                    "concept": "a899b35c-1350-11df-a1f1-0026b9348838",
                    "label": "Yes"
                  },
                  {
                    "concept": "a899b42e-1350-11df-a1f1-0026b9348838",
                    "label": "No"
                  },
                  {
                    "concept": "a899b50a-1350-11df-a1f1-0026b9348838",
                    "label": "Unknown"
                  },
                  {
                    "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                    "label": "N/A"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            },
            {
              "label": "Is this patient a member of any of the following high risk populations?",
              "questionOptions":{
                "rendering":"select",
                "concept": "93aa3f1d-1c39-4196-b5e6-8adc916cd5d6",
                "answers": [
                  {
                    "concept": "5da55301-e28e-4fdf-8b64-02622dedc8b0",
                    "label": "Client of sex worker"
                  },
                  {
                    "concept": "a89ff438-1350-11df-a1f1-0026b9348838",
                    "label": "Commercial sex worker"
                  },
                  {
                    "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                    "label": "Discordant couple"
                  },
                  {
                    "concept": "a890d57a-1350-11df-a1f1-0026b9348838",
                    "label": "IV drug use"
                  },
                  {
                    "concept": "e19c35f0-12f0-46c2-94ea-97050f37b811",
                    "label": "MSM"
                  },
                  {
                    "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                    "label": "N/A"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            },
            {
              "label": "Were any of the following PWP services provided?",
              "historicalExpression":"HD.getObject('prevEnc').getValue('9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b')",
              "questionOptions":{
                "rendering":"select",
                "concept": "9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b",
                "answers": [
                  {
                    "concept": "f0a280e8-eb88-41a8-837a-f9949ed1b9cd0",
                    "label": "Condom promotion/provision"
                  },
                  {
                    "concept": "bf51f71e-937c-4da5-ae07-654acf59f5bb",
                    "label": "Couple counseling"
                  },
                  {
                    "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                    "label": "Needle exchange"
                  },
                  {
                    "concept": "05656545-86be-4605-9527-34fb580534b1",
                    "label": "Targeted risk reduction"
                  },
                  {
                    "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                    "label": "N/A"
                  }
                ]
              },
              "type": "obs",
              "validators": []
            }
          ]
        },
        {
          "label": "Vital Signs",
          "questions": [
            {
              "type":"obsGroup",
              "label":"test group",
              "questionOptions":{
                "rendering":"group",
                "concept":"a899e6d8-1350-11df-a1f1-0026b9348838"
              },
              "questions":[
                {
                  "label": "BP:Systolic:",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a65d5a-1350-11df-a1f1-0026b9348838",
                    "max": "250",
                    "min": "0",
                    "showDate":"true"
                  },
                  "type": "obs",
                  "historicalExpression":"HD.getObject('prevEnc').getValue('a8a65d5a-1350-11df-a1f1-0026b9348838')",
                  "validators": []
                },
                {
                  "label": "BP:Diastolic:",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a65e36-1350-11df-a1f1-0026b9348838",
                    "max": "150",
                    "min": "0"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "Pulse(Rate/Min):",
                  "historicalExpression":"HD.getObject('prevEnc').getValue('a8a65f12-1350-11df-a1f1-0026b9348838')",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a65f12-1350-11df-a1f1-0026b9348838",
                    "max": "230",
                    "min": "0"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "Temp(C):",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a65fee-1350-11df-a1f1-0026b9348838",
                    "max": "43",
                    "min": "25"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "Weight(Kg):",
                  "id":"weight",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a660ca-1350-11df-a1f1-0026b9348838",
                    "max": "150",
                    "min": "0"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "Height(CM):",
                  "id":"height",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a6619c-1350-11df-a1f1-0026b9348838",
                    "max": "350",
                    "min": "0"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "Sp02:",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a8a66354-1350-11df-a1f1-0026b9348838",
                    "max": "100",
                    "min": "0"
                  },
                  "type": "obs",
                  "validators": []
                },
                {
                  "label": "BMI:Kg/M2",
                  "questionOptions":{
                    "rendering":"number",
                    "concept": "a89c60c0-1350-11df-a1f1-0026b9348838",
                    "max": "100",
                    "min": "0",
                    "calculate":{
                      "calculateExpression":"calcBMI(height,weight)"
                    }
                  },
                  "type": "obs",
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
  }
})();
