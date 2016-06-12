(function() {
  'use strict';
  
  describe('NotesGeneratorService Unit Tests', function() {
    beforeEach(function(){
      module('ngAmrsApp');
      module('app.patientdashboard');
      module('app.etlRestServices');
      module('mock.data');
      module('models');
      module('openmrs-ngresource.restServices')
    });
    var noteGS;
    var encMockService;
    var etlMockService;
    var VitalEtlModel;
    var HivSummaryModel;
    var httpBackend;
    var etlRestSetting;
    var restSetting;
    
    var etlHivSummary, hivSummaryModel, encounters, etlVital, vitalsModel;
    var expectedNote;
    
    beforeEach(inject(function($injector){
      noteGS = $injector.get('NotesGeneratorService');
      encMockService = $injector.get('EncounterMockService');
      VitalEtlModel = $injector.get('VitalModel');
      HivSummaryModel = $injector.get('HivSummaryModel');
      etlMockService = $injector.get('EtlMockService');
      httpBackend = $injector.get('$httpBackend');
      etlRestSetting = $injector.get('EtlRestServicesSettings');
      restSetting = $injector.get('OpenmrsSettings');
    }));
    
    beforeEach(function() {
      //Get the stuff
      etlHivSummary = etlMockService.getHivSummaryETLRestMock();
      hivSummaryModel = new HivSummaryModel.hivSummary(etlHivSummary);
      
      encounters = [
        encMockService.getAdultReturnRestMock(),
        encMockService.getTriageRestMock()
      ];
      
      etlVital = etlMockService.getVitalsETLRestMock();
      vitalsModel = new VitalEtlModel.vital(etlVital);
      
      function getEstimatedDate(startDate, period) {
        return moment(startDate).add(period, 'months')
                              .toDate().toISOString();
      }
      
      expectedNote = {
        visitDate:hivSummaryModel.encounterDatetime(), 
        scheduled: hivSummaryModel.scheduledVisit(),
        providers:[{
          uuid:'pd13dddc-1359-11df-a1f1-0026b9348838',
          name: 'Unknown Unknown Unknown',
          encounterType: 'ADULTRETURN'
        }, {
          uuid:'pb6e31da-1359-11df-a1f1-0026b9348838',
          name: 'Giniton Giniton Giniton',
          encounterType: 'TRIAGE'
        }],
        lastViralLoad: {
          value: hivSummaryModel.vl_1(),
          date: hivSummaryModel.vl_1Date(),
        },
        lastCD4Count: {
          value: hivSummaryModel.cd4_1(),
          date: hivSummaryModel.cd4_1Date()
        },
        artRegimen: {
          curArvMeds: hivSummaryModel.curArvMeds(),
          curArvLine: hivSummaryModel.curArvLine(),
          arvStartDate: hivSummaryModel.arvStartDate()
        },
        tbProphylaxisPlan: {
          plan: 'START DRUGS',
          startDate:hivSummaryModel.tbProphylaxisStartDate(),
          estimatedEndDate: getEstimatedDate(
                              hivSummaryModel.tbProphylaxisStartDate(), 6)
        },
        ccHpi: 'None',
        assessment: 'None', 
        vitals: {
          weight: vitalsModel.weight(),
          height: vitalsModel.height(),
          bmi: vitalsModel.BMI(),
          temperature: vitalsModel.temperature(),
          oxygenSaturation: vitalsModel.oxygenSat(),
          systolicBp: vitalsModel.systolicBp(),
          diastolicBp: vitalsModel.diastolicBp(),
          pulse: vitalsModel.pulse()
        },
        rtcDate: hivSummaryModel.rtcDate()
      };
    });
    
    it('generateNote() should generate a correct note given all required ' + 
       'parameters', function(){
        var aNote = noteGS.generateNote(hivSummaryModel, vitalsModel, encounters);
        // console.log('expected', JSON.stringify(expectedNote.vitals,null,2));
        // console.log('aNote',JSON.stringify(aNote.vitals,null,2));
        expect(aNote).to.be.an.object;
        expect(aNote).to.deep.equal(expectedNote);
    });
    
    it('generateNotes() should generate an expected array of notes', function() {
      var rep = 'custom:(uuid,encounterDatetime,' + 
        'patient:(uuid,uuid),form:(uuid,name),location:ref,encounterType:ref,'+
        'encounterProviders:(provider:full,encounterRole:ref),' +
        'obs:(uuid,obsDatetime,concept:(uuid,name:(uuid,name)),value:ref,' +
        'groupMembers:(uuid,concept:(uuid,name:(uuid,name)),obsDatetime,value:ref)))';
      
      var encResponse = {
        results: encounters
      }; 
      var vitalResponse = {
        'startIndex': 0,
        'size': 1,
        'result': etlVital
      };
      var hivResponse = {
        'startIndex': 0,
        'size': 1,
        'result': etlHivSummary
      };
      var vitalUrl = etlRestSetting.getCurrentRestUrlBase() +
                        'patient/passed-uuid/vitals?limit=20&startIndex=0';
      var hivUrl = etlRestSetting.getCurrentRestUrlBase() +
                      'patient/passed-uuid/hiv-summary?limit=20&startIndex=0';
      var encUrl = restSetting.getCurrentRestUrlBase() +
                      'encounter?patient=passed-uuid&v='+rep;
       
       
      httpBackend.whenGET(vitalUrl).respond(vitalResponse);
      httpBackend.whenGET(hivUrl).respond(hivResponse);
      httpBackend.whenGET(encUrl).respond(encResponse);
      
      var expected = [expectedNote];
      noteGS.generateNotes('passed-uuid', function(notes) {
        expect(notes).to.be.an.array;
        expect(notes.length).to.equal(1);
        expect(notes).to.deep.equal(expected);
      },0,20);      
    });
  });
})();
