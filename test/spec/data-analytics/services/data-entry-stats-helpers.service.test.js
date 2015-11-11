/* global inject */
/* global beforeEach */
/* global describe */
/* global expect */
/* global it */
/*jshint -W026, -W030, -W106 */
(function () {
  'use strict';
  describe('Data Entry Stats Helpers Service Unit Tests', function () {
    beforeEach(function () {
      module('app.dataAnalytics');
	  module('models');
	  module('mock.etlRestServices');
    });


    var service, locationModelFactory, etlRestServiceMock, moment;
	
	var locationModels;

    beforeEach(inject(function ($injector) {
      service = $injector.get('DataEntryStatsHelpersService');
	  locationModelFactory =  $injector.get('LocationModel');
	  etlRestServiceMock = $injector.get('EtlRestService');
	  moment =  $injector.get('moment');
    }));
	
	beforeEach(function(){
		var testLocations = [{name: '_name',
					  uuid:'uuid1',
                      description: '_description'}, 
                      {name: '_name2',
					  uuid:'uuid2',
                      description: '_description2'}];
					  
					  locationModels = 
					  locationModelFactory.toArrayOfWrappers(testLocations);
	});
	
	afterEach(function () {
			etlRestServiceMock.returnErrorOnNextCall = false;
	});
	
	it('should convert the selectedLocations object into comma separated ' +
			'list of locations uuid when getSelectedLocations',
			function () {
				var selectedLocationObject = {
					selectedAll: false,
					locations: locationModels
				};
				var locations = service.getSelectedLocations(selectedLocationObject);
				
				var expectedString = 'uuid1,uuid2';
				expect(expectedString).to.equal(locations);
				
				//when selected all
				selectedLocationObject.selectedAll = true;
				locations = service.getSelectedLocations(selectedLocationObject);
				expectedString = undefined;
				
				expect(expectedString).to.equal(locations);
				
	  });
	  
	  it('should extract unique values by property  ' +
			'extractUniqueElementsByProperty is invoked with aggregates of view 1',
		function () {
				
				var expectedElementsCount = 11;
				
				var elements = etlRestServiceMock.getDataEntryStatistics().result;				
				
				//eleven unique dates in the json file
				var actualCount = service.extractUniqueElementsByProperty(elements, 'date');
				
				expect(actualCount.length).to.equal(expectedElementsCount);
				
		});
		
		
		it('should group aggregates when groupByX_ThenByY' +
			' is invoked with aggregates of view 1, and required params',
			function () {
				var expectedYelementsCount = 3;
				var expectedXelementsCount = 11;
				
				var elements = etlRestServiceMock.getDataEntryStatistics().result;
				
				
				var uniqueXelements = service.extractUniqueElementsByProperty(elements, 'date');
				var uniqueYelements = service.extractUniqueElementsByProperty(elements, 'encounter_type_id');
				
				
				var groupedItems = service.groupByX_ThenByY(uniqueXelements, uniqueYelements, 
				'date', 'encounter_type_id', elements);
				
				console.log('groupedItems', groupedItems);
				
				console.log('groupedItems', groupedItems[0].value[0]);
				
				expect(groupedItems.length).to.equal(expectedYelementsCount);
				expect(groupedItems[0].value.length).to.equal(expectedXelementsCount);
				expect(groupedItems[0].value[0].value).to.deep.equal(elements[0]);
				
			});
			
			it('should find item by X and Y when findItemByXandY' +
			' is invoked with required params',
			function () {
				var elements = etlRestServiceMock.getDataEntryStatistics().result;
				
				var element1 = elements[0];
				var element2 = elements[5];
				var element3 = elements[14];
				
				var foundElement = service.findItemByXandY('date','encounter_type_id',
				element1['date'], element1['encounter_type_id'], elements);
				
				expect(element1).to.deep.equal(foundElement);
				
				foundElement = service.findItemByXandY('date','encounter_type_id',
				element2['date'], element2['encounter_type_id'], elements);
				
				expect(element2).to.deep.equal(foundElement);
				
				foundElement = service.findItemByXandY('date','encounter_type_id',
				element3['date'], element3['encounter_type_id'], elements);
				
				expect(element3).to.deep.equal(foundElement);
				
			});
			
			it('should generate an array of date objects when getDateArrayFrom is invoked' +
			' with a date and number of days to generate', 
			function(){
				var date = moment('2015-07-06T21:00:00.000Z').utc();
				var arrayOfDate = service.getDateArrayFrom(date.toDate(), 6);
				
				expect(arrayOfDate.length).to.equal(7);
				expect(arrayOfDate[0].toUTCString()).to.equal(moment('2015-07-06T21:00:00.000Z').toDate().toUTCString());
				expect(arrayOfDate[6].toUTCString()).to.equal(moment('2015-07-12T21:00:00.000Z').toDate().toUTCString());
			});

	
    

  });

})();