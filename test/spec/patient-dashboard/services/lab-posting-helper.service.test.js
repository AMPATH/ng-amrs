(function () {
    'use strict';

    describe('LabPostingHelperService Unit Tests', function () {

        beforeEach(function () {
            module('ngAmrsApp');
            module('app.patientdashboard');
            //module('app.etlRestServices');
        });

        var labPosting;
        var ecounterObs;

        beforeEach(inject(function ($injector) {
            labPosting = $injector.get('LabPostingHelperService');
        }));

        beforeEach(function () {
            ecounterObs = [
                {
                    concept: {
                        uuid: 'a8a17e48-1350-11df-a1f1-0026b9348838'
                    },
                    value: 'a8a09ac8-1350-11df-a1f1-0026b9348838'
                },
                {
                    concept: {
                        uuid: 'a898bdc6-1350-11df-a1f1-0026b9348838'
                    },
                    value: '0906b973-25da-4e87-a272-84692cdd8453'
                },
                {
                    concept: {
                        uuid: 'some-group-concept'
                    },
                    groupMembers: [
                        {
                            concept: {
                                uuid: 'a89abee6-1350-11df-a1f1-0026b9348838'
                            },
                            value: 'a8a70156-1350-11df-a1f1-0026b9348838'
                        },
                        {
                            concept: {
                                uuid: 'a89addfe-1350-11df-a1f1-0026b9348838'
                            },
                            value: 'a8967656-1350-11df-a1f1-0026b9348838'
                        },
                        {
                            concept: {
                                uuid: 'a8afb80a-1350-11df-a1f1-0026b9348838'
                            },
                            value: {
                                uuid: 'a896f3a6-1350-11df-a1f1-0026b9348838'
                            }
                        }
                    ],
                    value: null
                },
                {
                    concept: {
                        uuid: '0a98f01f-57f1-44b7-aacf-e1121650a967'
                    },
                    value: '5931c4d4-4406-4d71-b75d-2205d905cc24'
                },
                {
                    concept: {
                        uuid: 'a899cf5e-1350-11df-a1f1-0026b9348838'
                    },
                    value: '25c753d8-870f-11e0-85d3-000d6014b64c'
                }
            ];
        });

        it('should have required services injected ',
            function () {
                expect(labPosting).to.be.defined;
            });


        it('should find obs by concept uuid when findObsByConceptUuid is called ',
            function () {
                var obs = [
                    {
                        concept: {
                            uuid: 'some-concept'
                        },
                        value: 'some-value'
                    },
                    {
                        concept: {
                            uuid: 'other-concept'
                        },
                        value: 10
                    },
                    {
                        concept: {
                            uuid: 'some-group-concept'
                        },
                        groupMembers: [
                            {
                                concept: {
                                    uuid: 'concept 1'
                                },
                                value: 1
                            },
                            {
                                concept: {
                                    uuid: 'concept 2'
                                },
                                value: 2
                            },
                            {
                                concept: {
                                    uuid: 'concept 3'
                                },
                                value: 3
                            }
                        ],
                        value: null
                    }
                ];

                var obs1 = 'other-concept';
                var obs2 = 'concept 2';

                var found1 = labPosting.findObsByConceptUuid(obs, obs1);
                //console.log('obs1', found1);
                expect(found1).to.be.defined;
                expect(found1.value === 10).to.be.true;

                var found2 = labPosting.findObsByConceptUuid(obs, obs2);
                //console.log('obs2', found2);
                expect(found2).to.be.defined;
                expect(found2.value === 2).to.be.true;
            });

        it('should create the correct DNA PCR payload when createDnaPcrPayload is triggered',
            function () {
                var order = {
                    "display": "DNA PCR, QUANTITATIVE",
                    "uuid": "45c15e3b-6d6b-47d1-b6ba-589e9444c1e1",
                    "orderNumber": "ORD-27",
                    "accessionNumber": null,
                    "orderReason": null,
                    "orderReasonNonCoded": null,
                    "urgency": "ROUTINE",
                    "action": "NEW",
                    "commentToFulfiller": null,
                    "dateActivated": "2016-07-05T16:12:56.000+0300",
                    "orderer": {
                        "uuid": "7086ff3e-86a9-407a-b651-4e5d36cfba95",
                        "display": "prov-id - Test3 Test3",
                        "identifier": "prov-id"
                    }
                };

                var encounterLocationUud = 'some-location-uuid';
                var patientId = '88889999000';
                var patientName = 'someName';
                var patientSex = 'f';
                var bday = '2011-01-01';
                var dateReceived = '2014-01-01';

                var expectedPcrPayload = {
                    type: "DNAPCR",
                    locationUuid: "some-location-uuid",
                    orderNumber: "ORD-27",
                    providerIdentifier: "prov-id",
                    patientName: "someName",
                    patientIdentifier: "88889999000",
                    sex: "f",
                    birthDate: "2011-01-01",
                    infantProphylaxisUuid: "a8967656-1350-11df-a1f1-0026b9348838",
                    pmtctInterventionUuid: "0906b973-25da-4e87-a272-84692cdd8453",
                    feedingTypeUuid: "a8a70156-1350-11df-a1f1-0026b9348838",
                    entryPointUuid: "a8a09ac8-1350-11df-a1f1-0026b9348838",
                    motherHivStatusUuid: "a896f3a6-1350-11df-a1f1-0026b9348838",
                    dateDrawn: "2016-07-05",
                    dateReceived: "2014-01-01"
                };

                var actualPayload = labPosting.createDnaPcrPayload(order, ecounterObs, encounterLocationUud,
                    patientId, patientName, patientSex, bday, dateReceived);

                console.log('expected', JSON.stringify(expectedPcrPayload));
                console.log('actual', JSON.stringify(actualPayload));
                expect(actualPayload).to.deep.equal(expectedPcrPayload);
            });

        it('should create the correct Viral Load payload when createDnaPcrPayload is triggered',
            function () {
                var order = {
                    "display": "HIV VIRAL LOAD, QUANTITATIVE",
                    "uuid": "45c15e3b-6d6b-47d1-b6ba-589e9444c1e1",
                    "orderNumber": "ORD-27",
                    "accessionNumber": null,
                    "orderReason": null,
                    "orderReasonNonCoded": null,
                    "urgency": "ROUTINE",
                    "action": "NEW",
                    "commentToFulfiller": null,
                    "dateActivated": "2016-07-05T16:12:56.000+0300",
                    "orderer": {
                        "uuid": "7086ff3e-86a9-407a-b651-4e5d36cfba95",
                        "display": "prov-id - Test3 Test3",
                        "identifier": "prov-id"
                    }
                };

                var encounterLocationUud = 'some-location-uuid';
                var patientId = '88889999000';
                var patientName = 'someName';
                var patientSex = 'f';
                var bday = '2011-01-01';
                var dateReceived = '2014-01-01';
                var artStartDateInitial = '2014-01-01';
                var artStartDateCurrent = '2015-01-01';
                var artRegimenIds = '876##909'
                var sampleType = 2;

                var expectedVlPayload = {
                    type: "VL",
                    locationUuid: "some-location-uuid",
                    orderNumber: "ORD-27",
                    providerIdentifier: "prov-id",
                    patientName: "someName",
                    patientIdentifier: "88889999000",
                    sex: "f",
                    birthDate: "2011-01-01",
                    artStartDateInitial: "2014-01-01",
                    artStartDateCurrent: "2015-01-01",
                    sampleType: 2,
                    artRegimenUuid: '876##909',
                    vlJustificationUuid: "5931c4d4-4406-4d71-b75d-2205d905cc24",
                    dateDrawn: "2016-07-05",
                    dateReceived: "2014-01-01"
                };

                var actualPayload = labPosting.createViralLoadPayload(order, ecounterObs, encounterLocationUud,
                    patientId, patientName, patientSex, bday, dateReceived, artStartDateInitial,
                    artStartDateCurrent, sampleType, artRegimenIds);

                console.log('expected', JSON.stringify(expectedVlPayload));
                console.log('actual', JSON.stringify(actualPayload));
                expect(actualPayload).to.deep.equal(expectedVlPayload);
            });

        it('should create the correct CD4 payload when createDnaPcrPayload is triggered',
            function () {
                var order = {
                    "display": "CD4 Panel",
                    "uuid": "45c15e3b-6d6b-47d1-b6ba-589e9444c1e1",
                    "orderNumber": "ORD-27",
                    "accessionNumber": null,
                    "orderReason": null,
                    "orderReasonNonCoded": null,
                    "urgency": "ROUTINE",
                    "action": "NEW",
                    "commentToFulfiller": null,
                    "dateActivated": "2016-07-05T16:12:56.000+0300",
                    "orderer": {
                        "uuid": "7086ff3e-86a9-407a-b651-4e5d36cfba95",
                        "display": "prov-id - Test3 Test3",
                        "identifier": "prov-id"
                    }
                };

                var encounterLocationUud = 'some-location-uuid';
                var patientId = '88889999000';
                var patientName = 'someName';
                var patientSex = 'f';
                var bday = '2011-01-01';
                var dateReceived = '2014-01-01';

                var expectedCd4Payload = {
                    type: "CD4",
                    locationUuid: "some-location-uuid",
                    orderNumber: "ORD-27",
                    providerIdentifier: "prov-id",
                    patientName: "someName",
                    patientIdentifier: "88889999000",
                    sex: "f",
                    birthDate: "2011-01-01",
                    dateDrawn: "2016-07-05",
                    dateReceived: "2014-01-01"
                };

                var actualPayload = labPosting.createCD4Payload(order, ecounterObs, encounterLocationUud,
                    patientId, patientName, patientSex, bday, dateReceived);

                console.log('expected', JSON.stringify(expectedCd4Payload));
                console.log('actual', JSON.stringify(actualPayload));
                expect(actualPayload).to.deep.equal(expectedCd4Payload);
            });

    });

})();