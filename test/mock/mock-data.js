/* jshint -W079, -W098, -W026, -W003 */
'use strict';
var mockData = (function() {
    return {
        getMockSchema: getMockSchema,
        getMockStates: getMockStates
    };

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
})();
