(function() {
  'us strict';

  angular
    .module('app.patientdashboard')
      .service('NotesGeneratorService', NotesGeneratorService);

  NotesGeneratorService.$inject = [
    'EtlRestService',
    'EncounterResService',
    'CONCEPT_UUIDS',
    '$log',
    'EncounterModel',
    'HivSummaryModel',
    'VitalModel',
    '$q'
  ];

  function NotesGeneratorService(EtlRS, EncounterRS, CONCEPT_UUIDS, $log,
    EncounterModel, HivSummaryModel, VitalModel, $q) {
    var self = this;
    self.generateNote = generateNote;
    self.generateNotes = generateNotes;

    var DEFAULT_NO_NOTES = 40;
    var TB_PROPHY_PERIOD = 6;     // In months.

    var encounterRepresentation = 'custom:(uuid,encounterDatetime,' +
      'patient:(uuid,uuid),form:(uuid,name),location:ref,encounterType:ref,'+
      'encounterProviders:(provider:full,encounterRole:ref),' +
      'obs:(uuid,obsDatetime,concept:(uuid,name:(uuid,name)),value:ref,' +
      'groupMembers:(uuid,concept:(uuid,name:(uuid,name)),obsDatetime,value:ref)))';

    var encOrder = {
      2: 1,           // ADULTRETURN
      1: 10,          // ADULTINITIAL
      4: 1,           // PEDSRETURN
      3: 10,          // PEDSINITIAL
      110: 20,        // TRIAGE
      99999: 30,      // Special Lab encounter code
      21: 40,         // OUTREACHFIELDFU
      17: 50,         // ECSTABLE
      other: 100      // Any other encounter
    };

    function generateNotes(patientUuid, callback, failback, startIndex, limit, endDate) {
      // Make endDate today if not specified
      if(endDate) {
        if(typeof endDate === 'string') {
          try {
            endDate = Date.parse(endDate);
          } catch(error) {
            $log.error('An error occured parsing date ' + endDate, error);
          }
        }
      } else {
        endDate = moment();
      }

      // Set startIndex to 0 if not passed
      var startIndex = startIndex || 0;

      // Limit to 10 notes if not specified (i.e 10 encounters going backward)
      var limit = limit || DEFAULT_NO_NOTES;

      // Get HIV Summary & vitals
      var hivPromise = EtlRS.getHivSummary(patientUuid, startIndex, limit);
      var vitalPromise = EtlRS.getVitals(patientUuid, startIndex, limit);

      var encParams = {
        patientUuid: patientUuid,
        rep: encounterRepresentation
      };
      var encPromise = EncounterRS.getPatientEncounters(encParams);

      $q.allSettled([hivPromise, vitalPromise, encPromise]).then(function(data) {
        var hivSummaries = null;
        var vitals = null;
        var encounters = null;

        if(data[0].status === 'fulfilled') {
          var hivSummaries = data[0].value.result;
        } else {
          throw new Error('error fetching summaries');
        }

        if(data[1].status === 'fulfilled') {
          var vitals = data[1].value.result;
        } else {
          throw new Error('error fetching vitals');
        }

        if(data[2].status === 'fulfilled') {
          var encounters = data[2].value;
        } else {
          throw new Error('error fetching encounters');
        }

        if(!hivSummaries || _.isEmpty(hivSummaries)) {
          $log.error('Could not generate notes because no hiv summaries have' +
                      ' been returned');
          failback('No summaries returned');
          throw new Error('No summaries returned');
        } else {
          // TODO: Need to determine whether it is wise to fail if others are
          // not available as well.

          // Create array of models
          var hivModels = HivSummaryModel.toArrayOfModels(hivSummaries);

          var summaryDateGrouped = {};
          _.each(hivModels, function(model) {
            var key = moment(model.encounterDatetime()).format('MMM_DD_YYYY');
            model.ordering = encOrder[model.encounterType()] || encOrder.other;
            if(Array.isArray(summaryDateGrouped[key])) {
              summaryDateGrouped[key].push(model);
            } else {
              summaryDateGrouped[key] = [model];
            }
          });

          // Sort the groups according to ordering column
          _.each(summaryDateGrouped, function(group) {
            group.sort(function compare(x, y) {
              return x.ordering - y.ordering;
            });
          });

          // Now pick the most preferred encounter in every group.
          var massagedHivModels = _.map(summaryDateGrouped, function(group) {
            return _.first(group);
          });

          // Deal with vitals.
          if(vitals && !_.isEmpty(vitals)) {
            var vitalModels = VitalModel.toArrayOfModels(vitals);

            // Create a date grouped representation
            var vitalDateGrouped = {};
            _.each(vitalModels, function(model) {
              var key = moment(model.encounterDatetime()).format('MMM_DD_YYYY');
              vitalDateGrouped[key] = model;
            });
          }

          // Deal with encounters
          if(encounters && !_.isEmpty(encounters)) {
            // Group encounters by date
            var encDateGrouped = {};
            _.each(encounters, function(encounter) {
              var key = moment(encounter.encounterDatetime).format('MMM_DD_YYYY');
              if(Array.isArray(encDateGrouped[key])) {
                encDateGrouped[key].push(encounter);
              } else {
                encDateGrouped[key] = [encounter];
              }
            });
          }

          // Generate notes for each Hiv summary date.
          var notes = [];
          for(var dateKey in summaryDateGrouped) {
            var note = generateNote(_.first(summaryDateGrouped[dateKey]),
                        vitalDateGrouped[dateKey], encDateGrouped[dateKey]);
            notes.push(note);
          }

          // pass the notes to callback
          callback(notes);
        }
      });
    }
    /**
     * This method will try to generate note for available data, i.e it won't
     * fail because one of the expected data object is null
     */
    function generateNote(hivSummaryModel, vitalsModel, encounters) {
      if(Array.isArray(encounters) && !_.isEmpty(encounters)) {
        //Create a corresponding array of models
        var encModelArray = EncounterModel.toArrayOfModels(encounters);
      }
      var noInfo = '';
      var note = {
        visitDate:hivSummaryModel.encounterDatetime(),
        scheduled: hivSummaryModel.scheduledVisit(),
        providers:[],
        lastViralLoad: {
          value: hivSummaryModel.vl_1(),
          date: hivSummaryModel.vl_1Date(),
        },
        lastCD4Count: {
          value: hivSummaryModel.cd4_1(),
          date: hivSummaryModel.cd4_1Date()
        },
        artRegimen: {
          curArvMeds: noInfo,
          curArvLine: noInfo,
          startDate: noInfo
        },
        tbProphylaxisPlan: {
          plan: noInfo,
          startDate: noInfo,
          estimatedEndDate: noInfo
        },
        ccHpi: '',
        assessment: '',
        vitals: {
          weight: noInfo,
          height: noInfo,
          bmi: noInfo,
          temperature: noInfo,
          oxygenSaturation: noInfo,
          systolicBp: noInfo,
          diastolicBp: noInfo,
          pulse: noInfo
        },
        rtcDate: hivSummaryModel.rtcDate()
      };

      if(vitalsModel && !_.isEmpty(vitalsModel)) {
          note.vitals = {
            weight: vitalsModel.weight(),
            height: vitalsModel.height(),
            bmi: vitalsModel.BMI(),
            temperature: vitalsModel.temperature(),
            oxygenSaturation: vitalsModel.oxygenSat(),
            systolicBp: vitalsModel.systolicBp(),
            diastolicBp: vitalsModel.diastolicBp(),
            pulse: vitalsModel.pulse()
          };
      }

      //Get the providers & regimens
      if(Array.isArray(encounters) && !_.isEmpty(encounters)) {
        $log.debug('Passed encounters', encounters);
        $log.debug('Generated providers', note.providers);

        note.providers = _getProviders(encModelArray);

        // Get CC/HPI & Assessment
        var ccHpi = _findTextObsValue(encounters, CONCEPT_UUIDS.CC_HPI,
                      __findObsWithGivenConcept);

        var assessment = _findTextObsValue(encounters, CONCEPT_UUIDS.ASSESSMENT,
                      __findObsWithGivenConcept);

        note.ccHpi = ccHpi || 'None';
        note.assessment = assessment || 'None';

        // Get TB prophylaxis
        note.tbProphylaxisPlan = _constructTBProphylaxisPlan(encounters, hivSummaryModel,
                              __findObsWithGivenConcept);
      } else {
        $log.debug('encounters array is null or empty');
      }

      // Get ART regimen
      if(!_.isEmpty(hivSummaryModel.curArvMeds())) {
        // Just use the stuff from Etl
        note.artRegimen = {
          curArvMeds: hivSummaryModel.curArvMeds(),
          curArvLine: hivSummaryModel.curArvLine(),
          arvStartDate: hivSummaryModel.arvStartDate()
        };
      } else {
        // TODO: Try getting it from encounters.
      }


      return note;
    }

    function _getProviders(encModelArray) {
      var providers = [];
      _.each(encModelArray, function(encModel) {
          var provider = {
              uuid: encModel.providerUuid(),
              name: encModel.providerName(),
              encounterType: encModel.encounterTypeName()
          };
          providers.push(provider);
      });
      return _.uniq(providers, false, function(provider){
        return provider.uuid + provider.encounterType;
      });
    }

    /*
     * TODO: Make this recursive to be able to search deeper than one level
     */
    function __findObsWithGivenConcept(obsArray, conceptUuid, grouper) {
      var grouper = grouper || false;
      var found = null;
      if(grouper) {
        found = [];
        _.each(obsArray, function(obs){
            if(obs.groupMembers !== null && obs.concept !== null
                    && obs.concept.uuid === conceptUuid) {
               found.push(obs);
            }
        });
      } else {
       // Non grouper concepts
       found = _.find(obsArray, function(obs) {
         return (obs.concept !== null && obs.concept.uuid === conceptUuid);
       });
     }
      return found;
    }

    function _findTextObsValue(encArray, conceptUuid, obsfinder) {
      var value = null;
      var found = null;

      _.find(encArray, function(enc) {
          found = obsfinder(enc.obs, conceptUuid);
          return found !== null && !_.isEmpty(found);
      });

      if(found) {
        value = found.value;
      }
      return value;
    }

    /**
     * Algorithm:
     * -> Check for existence of tb prophylaxis plan, if found and plan is
     *    continue or start then report and fetch start date.
     * -> if plan is stop then see calculate the duration the patient was on
     *    prophylaxis and fetch reason if available.
     * -> if it is to change the fetch the reasone.
     */
    function _constructTBProphylaxisPlan(encArray, hivSummaryModel, obsfinder) {
      // Find plan.
      var tbProphy = {
        plan: 'Not available',
        estimatedEndDate: 'Unknown',
      };
      var planConceptUuid = CONCEPT_UUIDS.TB_PROPHY_PLAN;
      var found = null;

      _.find(encArray, function(enc) {
          found = obsfinder(enc.obs, planConceptUuid);
          return found !== null && !_.isEmpty(found);
      });

      if(found) {
        tbProphy.plan = found.value.display;
      }

      // Calculate estimated end date of plan (6 months after starting)
      var tempDate = moment(hivSummaryModel.tbProphylaxisStartDate());
      if(tempDate.isValid()) {
        tbProphy.startDate = hivSummaryModel.tbProphylaxisStartDate();
        tbProphy.estimatedEndDate =
              moment(hivSummaryModel.tbProphylaxisStartDate())
                                .add(TB_PROPHY_PERIOD, 'months')
                                    .toDate().toISOString();
      } else {
        tbProphy.startDate = 'Not available';
        tbProphy.estimatedEndDate = 'N/A'
      }
      return tbProphy;
    }
  }
})();
