/*
jshint -W098, -W003, -W068, -W004, -W033, -W026, -W030, -W117
*/
(function () {
    'use strict';

    angular
        .module('app.formentry')
        .factory('SearchDataService', SearchDataService);

    SearchDataService.$inject = ['ProviderResService', 'LocationResService', 'LocationModel', 'ProviderModel','ConceptResService', 'ConceptModel','DrugResService','DrugModel'];

    function SearchDataService(ProviderResService, LocationResService, LocationModelFactory, ProviderModelFactory, ConceptResService, ConceptModelFactory, DrugResService, DrugModelFactory) {

        var problemConceptClassesArray = ['Diagnosis','Symptom','Symptom/Finding','Finding'];
        var drugConceptClassesArray=['Drug'];
        var service = {
            findProvider: findProvider,
            getProviderByUuid: getProviderByPersonUuid,
            findLocation: findLocation,
            getLocationByUuid: getLocationByUuid,
            findProblem:findProblem,
            getProblemByUuid:getProblemByUuid,
            findDrugConcepts:findDrugConcepts,
            getDrugConceptByUuid:getDrugConceptByUuid,
            findDrugs:findDrugs,
            findDrugByUuid:findDrugByUuid
        };

        return service;

        function findLocation(searchText, onSuccess, onError) {
            LocationResService.findLocation(searchText,
                function (locations) {
                    var wrapped = wrapLocations(locations);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function getLocationByUuid(uuid, onSuccess, onError) {
            LocationResService.getLocationByUuid(uuid,
                function (location) {
                    var wrapped = wrapLocation(location);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function findProblem(searchText, onSuccess, onError) {
            ConceptResService.findConcept(searchText,
                function (concepts) {
                    var filteredConcepts = ConceptResService.filterResultsByConceptClassesName(concepts,problemConceptClassesArray);
                    var wrapped = wrapConcepts(filteredConcepts);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function getProblemByUuid(uuid, onSuccess, onError) {
            ConceptResService.getConceptByUuid(uuid,
                function (concept) {
                    var wrapped = wrapConcept(concept);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function findProvider(searchText, onSuccess, onError) {
            ProviderResService.findProvider(searchText,
                function (providers) {
                    var wrapped = wrapProviders(providers);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function getProviderByPersonUuid(uuid, onSuccess, onError) {
            ProviderResService.getProviderByPersonUuid(uuid,
                function (provider) {
                    var wrapped = wrapProvider(provider);
                    onSuccess(wrapped);
                },
                function (error) {
                    onError(onError);
                });
        }

        function findDrugConcepts(searchText, onSuccess, onError) {
          ConceptResService.findConcept(searchText,
            function (concepts) {
              var filteredConcepts = ConceptResService.filterResultsByConceptClassesName(concepts,drugConceptClassesArray);
              var wrapped = wrapConcepts(filteredConcepts);
              onSuccess(wrapped);
            },
            function (error) {
              onError(onError);
            });
        }

        function getDrugConceptByUuid(uuid, onSuccess, onError) {
          ConceptResService.getConceptByUuid(uuid,
            function (concept) {
              var wrapped = wrapConcept(concept);
              onSuccess(wrapped);
            },
            function (error) {
              onError(onError);
            });
        }

        function findDrugs(searchText, onSuccess, onError) {
          DrugResService.findDrugs(searchText,
            function (drugs) {
              var wrapped = wrapDrugs(drugs);
              onSuccess(wrapped);
            },
            function (error) {
              onError(onError);
            });
        }

        function findDrugByUuid(uuid, onSuccess, onError) {
          DrugResService.findDrugByUuid(uuid,
            function (drug) {
              var wrapped = wrapDrug(drug);
              onSuccess(wrapped);
            },
            function (error) {
              onError(onError);
            });
        }

        function wrapDrug(drug) {
          return DrugModelFactory.toWrapper(drug);
        }

        function wrapDrugs(drugs) {
          var wrappedDrugs = [];
          for (var i = 0; i < drugs.length; i++) {
            wrappedDrugs.push(wrapDrug(drugs[i]));
          }
          return wrappedDrugs;
        }

        function wrapProvider(provider) {
            return ProviderModelFactory.toWrapper(provider);
        }

        function wrapProviders(providers) {
            var wrappedProviders = [];
            for (var i = 0; i < providers.length; i++) {
                wrappedProviders.push(wrapProvider(providers[i]));
            }
            return wrappedProviders;
        }

        function wrapLocations(locations) {
            var wrappedLocations = [];
            for (var i = 0; i < locations.length; i++) {
                wrappedLocations.push(wrapLocation(locations[i]));
            }
            return wrappedLocations;
        }

        function wrapLocation(location) {
            return LocationModelFactory.toWrapper(location);
        }

        function wrapConcept(concept) {
            return ConceptModelFactory.toWrapper(concept);
        }

        function wrapConcepts(concepts) {
            var wrappedObjects = [];
            for (var i = 0; i < concepts.length; i++) {
                wrappedObjects.push(wrapConcept(concepts[i]));
            }
            return wrappedObjects;
        }
    }

})();
