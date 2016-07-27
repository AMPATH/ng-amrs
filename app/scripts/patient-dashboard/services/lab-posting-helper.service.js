(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .service('LabPostingHelperService', labPostingHelperService);

    labPostingHelperService.$inject = ['moment'];
    function labPostingHelperService(moment) {

        var orderTypes = [
            {
                type: 'DNAPCR',
                conceptUuid: 'a898fe80-1350-11df-a1f1-0026b9348838',
                display: 'DNA PCR'
            },
            {
                type: 'VL',
                conceptUuid: 'a8982474-1350-11df-a1f1-0026b9348838',
                display: 'Viral Load'
            },
            {
                type: 'CD4',
                conceptUuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
                display: 'CD4 Panel'
            },
            {
                type: 'Other',
                conceptUuid: '',
                display: 'Others'
            }
        ];

        var sampleTypes = [
            {
                id: 1,
                display: 'Frozen Plasma'
            },
            {
                id: 2,
                display: 'Venous Blood  (EDTA )'
            },
            {
                id: 3,
                display: 'DBS Capillary ( infants)'
            },
            {
                id: 4,
                display: 'DBS Venous'
            }
        ];

        var labLocations = [
            {
                name: 'Alupe',
                value: 'alupe'
            },
            {
                name: 'Ampath',
                value: 'ampath'
            }
        ];

        var definition = {
            findObsByConceptUuid: findObsByConceptUuid,
            createDnaPcrPayload: createDnaPcrPayload,
            createViralLoadPayload: createViralLoadPayload,
            createCD4Payload: createCD4Payload,

            getOrderTypes: getOrderTypes,
            determineOrderType: determineOrderType,
            getSampleTypes: getSampleTypes,
            getLabLocations: getLabLocations
        };
        return definition;

        //function to find the obs with given concept uuid
        function findObsByConceptUuid(obsObject, conceptUuid) {

            if (!obsObject || obsObject === null || !conceptUuid || conceptUuid === null) return;

            var found = [];
            _findObsByConceptUuidRecursively(obsObject, conceptUuid, found);

            if (found.length > 0) {
                return found[0];
            }
        }

        function getOrderTypes() {
            return orderTypes;
        }

        function getSampleTypes() {
            return sampleTypes;
        }

        function getLabLocations() {
            return labLocations;
        }

        function determineOrderType(order) {
            if (order === null || order === undefined) return;

            var foundType;
            _.each(orderTypes,
                function (type) {
                    if (type.conceptUuid === order.concept.uuid) {
                        foundType = type;
                    }
                });

            if (foundType)
                return foundType;

            return {
                type: 'Other',
                conceptUuid: ''
            };
        }

        function _findObsByConceptUuidRecursively(obsObject, conceptUuid, foundArray) {
            if (!angular.isArray(foundArray))
                foundArray = [];

            if (_.isEmpty(obsObject)) {
                return;
            }

            if (angular.isArray(obsObject)) {
                _.each(obsObject, function (obj) {
                    _findObsByConceptUuidRecursively(obj, conceptUuid, foundArray);
                    return;
                });
            }

            if (typeof obsObject === 'object') {
                if (obsObject.concept && obsObject.concept.uuid === conceptUuid) {
                    foundArray.push(obsObject)
                } else {
                    for (var o in obsObject) {
                        _findObsByConceptUuidRecursively(obsObject[o], conceptUuid, foundArray);
                    }
                }
            }
        }

        //function to create DNA PCR payload

        function createDnaPcrPayload(order, encounterObs, encounterLocationUuid,
            patientIdentifier, patientName, sex, birthDate, dateRecieved) {

            var infantProphylaxisUuid, pmtctInterventionUuid, feedingTypeUuid;
            var entryPointUuid, motherHivStatusUuid;

            infantProphylaxisUuid = _findObsValueByConceptUuid(encounterObs,
                'a89addfe-1350-11df-a1f1-0026b9348838');

            pmtctInterventionUuid = _findObsValueByConceptUuid(encounterObs,
                'a898bdc6-1350-11df-a1f1-0026b9348838');

            feedingTypeUuid = _findObsValueByConceptUuid(encounterObs,
                'a89abee6-1350-11df-a1f1-0026b9348838');

            entryPointUuid = _findObsValueByConceptUuid(encounterObs,
                'a8a17e48-1350-11df-a1f1-0026b9348838');

            motherHivStatusUuid = _findObsValueByConceptUuid(encounterObs,
                'a8afb80a-1350-11df-a1f1-0026b9348838');

            return {
                type: "DNAPCR",
                locationUuid: encounterLocationUuid,
                orderNumber: order.orderNumber,
                providerIdentifier: order.orderer.identifier,
                patientName: patientName,
                patientIdentifier: patientIdentifier,
                sex: sex,
                birthDate: _formatDate(birthDate),
                infantProphylaxisUuid: infantProphylaxisUuid,
                pmtctInterventionUuid: pmtctInterventionUuid,
                feedingTypeUuid: feedingTypeUuid,
                entryPointUuid: entryPointUuid,
                motherHivStatusUuid: motherHivStatusUuid,
                dateDrawn: _formatDate(order.dateActivated),
                dateReceived: _formatDate(dateRecieved)
            };
        }

        function _formatDate(date) {
            var momentDate = moment(date);
            return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : "";
        }

        function _findObsValueByConceptUuid(encounterObs, conceptUuid) {
            var obsObject = findObsByConceptUuid(encounterObs, conceptUuid);
            if (obsObject && obsObject !== null && obsObject.value) {
                if (typeof obsObject.value === 'object' && obsObject.value.uuid)
                    return obsObject.value.uuid;
                return obsObject.value
            }
        }

        //function to create VL payload
        function createViralLoadPayload(order, encounterObs, encounterLocationUuid,
            patientIdentifier, patientName, sex, birthDate, dateRecieved,
            artStartDateInitial, artStartDateCurrent, sampleType, artRegimenIds) {

            var vlJustificationUuid;
            vlJustificationUuid = _findObsValueByConceptUuid(encounterObs,
                '0a98f01f-57f1-44b7-aacf-e1121650a967');

            return {
                type: "VL",
                locationUuid: encounterLocationUuid,
                orderNumber: order.orderNumber,
                providerIdentifier: order.orderer.identifier,
                patientName: patientName,
                patientIdentifier: patientIdentifier,
                sex: sex,
                birthDate: _formatDate(birthDate),
                artStartDateInitial: _formatDate(artStartDateInitial),
                artStartDateCurrent: _formatDate(artStartDateCurrent),
                sampleType: sampleType,
                artRegimenUuid: artRegimenIds,
                vlJustificationUuid: vlJustificationUuid,
                dateDrawn: _formatDate(order.dateActivated),
                dateReceived: _formatDate(dateRecieved)
            };
        }

        //function to create CD4 payload
        function createCD4Payload(order, encounterObs, encounterLocationUuid,
            patientIdentifier, patientName, sex, birthDate, dateRecieved) {

            return {
                type: "CD4",
                locationUuid: encounterLocationUuid,
                orderNumber: order.orderNumber,
                providerIdentifier: order.orderer.identifier,
                patientName: patientName,
                patientIdentifier: patientIdentifier,
                sex: sex,
                birthDate: _formatDate(birthDate),
                dateDrawn: _formatDate(order.dateActivated),
                dateReceived: _formatDate(dateRecieved)
            };
        }


    }
})();