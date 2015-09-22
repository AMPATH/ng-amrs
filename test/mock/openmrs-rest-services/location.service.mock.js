/*
jshint -W098, -W117, -W003, -W026
*/
(function () {
	'use strict';

	var mockedModule = angular
		.module('mock.openmrsRestServices');

	mockedModule.factory('LocationResService', LocationResService);

	LocationResService.$inject = ['$q'];

	function LocationResService($q) {
		var service = {
			isMockService: true,
			getLocations: getLocations,
			getLocationsCalled: false,
			returnFailureOnNextCall: false,
			getMockLocations:getMockLocations
		}
		return service;
		
		function getLocations(successCallback, failedCallback, refreshCache){
			service.getLocationsCalled = true;
			
			if(service.returnFailureOnNextCall===false){
				successCallback(getMockLocations());
			}
			else{
				successCallback('mock error!');
			}
		}
		
		function getMockLocations(){
			var testLocations = [{name: '_name',
                      description: '_description',
                      address1: '_address1',
                      address2: '_address2',
                      cityVillage: '_cityVillage',
                      stateProvince: '_stateProvince',
                      country: '_country',
                      postalCode: '_postalCode',
                      latitude: '_latitude',
                      longitude: '_longitude',
                      address3: '_address3',
                      address4: '_address4',
                      address5: '_address5',
                      address6: '_address6',
                      tags: '_tags',
                      parentLocation: undefined,
                      childLocations: [],
                      attributes: '_attributes'}, 
                      
                      {name: '_name2',
                      description: '_description2',
                      address1: '_address12',
                      address2: '_address22',
                      cityVillage: '_cityVillage2',
                      stateProvince: '_stateProvince2',
                      country: '_country2',
                      postalCode: '_postalCode2',
                      latitude: '_latitude2',
                      longitude: '_longitude2',
                      address3: '_address32',
                      address4: '_address42',
                      address5: '_address52',
                      address6: '_address62',
                      tags: '_tags2',
                      parentLocation:undefined,
                      childLocations: [],
                      attributes: '_attributes2'}];
					  
					  return testLocations;

		}
	}

})();