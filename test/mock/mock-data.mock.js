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
              getMockObs: getMockObs
          };

          return mock_data;

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

          function getMockSchema() {
              return {
                'schema':{
                  'form':{'name':'form1', 'uuid':'xxx'},
                  'encounter':[{'encounterDatetime':'', 'type':'datepicker'},
                              {'encounterProvider':'','type':'provider-field'},
                              {'encounterLocation':'','type':'location-field'}],
                  'obs':[
                    {'obsConceptGroupUuid':'1234567',
                    'obsConceptUuid':'12345', 'type':'number',
                    'label':'Weight(Kg)'}
                  ]
                }
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
          "obs2_a8afdb8c-1350-11df-a1f1-0026b9348838": [
            {
              "obs_a8a07386-1350-11df-a1f1-0026b9348838": "44",
              "obs_a899e444-1350-11df-a1f1-0026b9348838": "a897d1a4-1350-11df-a1f1-0026b9348838"
            }
          ]
        },
        "section_4": {
          "obs4_a89c2d8a-1350-11df-a1f1-0026b9348838": [
            {
              "obs_a8af4aa0-1350-11df-a1f1-0026b9348838": "a890e4b6-1350-11df-a1f1-0026b9348838"
            }
          ]
        }
      };
        }


    }
})();
