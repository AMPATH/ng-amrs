/*jshint -W003, -W117, -W098, -W026 */
(function () {
  'use strict';
  angular
    .module('app.patientdashboard')
    .factory('ClinicalSummaryPdfService', ClinicalSummaryPdfService);
  ClinicalSummaryPdfService.$inject = ['$filter'];

  function ClinicalSummaryPdfService($filter) {
    var serviceDefinition;

    serviceDefinition = {
      generatePdf: generatePdf,
      getAmpathLogo: getLogo
    };
    return serviceDefinition;

    function getProviders(providers) {
      var p = '';
      _.each(providers, function (provider) {
        p = p + ' ' + provider.name + ' (' + provider.encounterType + '), '
      });
      return p;
    }

    function constructPatientDetails(patient) {
      var details = [['Patient has no demographics data']];
      try {
        if (patient.demographics !== {}) {
          details = [{
            text: patient.demographics.fullNames() || 'N/A',
            style: 'subheader',
            fillColor: '#dedede'
          }, {
            columns: [{
              text: 'Phone:',
              width: 45,
              style: 'subheader'
            }, {
              text: patient.demographics.phoneNumber() || 'N/A',
              width: '*',
              style: 'headerDetails',
              alignment: 'left'
            }]
          }, {

            columns: [{
              text: 'Age:',
              width: 30,
              style: 'subheader'
            }, {
              text: (patient.demographics.age() || 'N/A').toString(),
              width: 20,
              style: 'headerDetails',
              alignment: 'left'
            }, {
              text: 'DOB:',
              width: 30,
              style: 'subheader'
            }, {
              text: $filter('date')(patient.demographics.birthdate(), "dd-MM-yyyy") || 'N/A',
              width: '*',
              style: 'headerDetails',
              alignment: 'left'
            }]
          }];
        }
      } catch (e) {
      }
      return details;
    }

    function constructPatientDemographicsDetails(patient) {
      var demographics = [['Patient has no demographics data']];
      try {
        if (patient.demographics !== {}) {
          demographics = [
            [{

              columns: [{
                columns: [{
                  text: 'AMRS UID:',
                  width: 43,
                  bold: true,
                }, {
                  text: patient.demographics.commonIdentifiers().ampathMrsUId || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'AMRS MRN:',
                  width: 47,
                  bold: true,
                }, {
                  text: patient.demographics.commonIdentifiers().amrsMrn || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'CCC:',
                  width: 20,
                  bold: true,
                }, {
                  text: patient.demographics.commonIdentifiers().cCC || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'National ID:',
                  width: 47,
                  bold: true,
                }, {
                  text: patient.demographics.commonIdentifiers().kenyaNationalId || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

              ]
            }],
            [{
              columns: [{
                columns: [{
                  text: 'County:',
                  width: 30,
                  bold: true,
                }, {
                  text: patient.demographics.address().county || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'Sub-County:',
                  width: 47,
                  bold: true,
                }, {
                  text: patient.demographics.address().subCounty || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Estate:',
                  width: 27,
                  bold: true,
                }, {
                  text: patient.demographics.address().estateLandmark || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Town/Village:',
                  width: 52,
                  bold: true,
                }, {
                  text: patient.demographics.address().townVillage || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

              ]
            }]
          ];
        }
      } catch (e) {
      }
      return demographics;
    }

    function constructPatientHivSummary(patient) {
      var hivSummary = [['Patient has no Hiv Summary']];
      try {
        if (patient.hivSummary !== {}) {
          hivSummary = [
            [{
              columns: [{
                columns: [{
                  text: 'Last Appt Date:',
                  width: 60,
                  bold: true,
                }, {
                  text: $filter('date')(patient.hivSummary.encounterDatetime(), "dd-MM-yyyy") +
                  ' (' + patient.hivSummary.prevEncounterTypeName() + ')' || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'RTC Date:',
                  width: 40,
                  bold: true,
                }, {
                  text: $filter('date')(patient.hivSummary.rtcDate(), "dd-MM-yyyy") || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Last Viral Load:',
                  width: 60,
                  bold: true,
                }, {
                  text: (patient.hivSummary.vl_1()!=null ? patient.hivSummary.vl_1(): 'N/A').toString() +
                  ' (' + $filter('date')(patient.hivSummary.vl_1Date(), "dd-MM-yyyy") + ')' || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Last CD4 Count:',
                  width: 60,
                  bold: true,
                }, {
                  text: (patient.hivSummary.cd4_1()!=null ? patient.hivSummary.cd4_1(): 'N/A').toString() +
                  ' (' + $filter('date')(patient.hivSummary.cd4_1Date(), "dd-MM-yyyy") + ')' || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

              ]
            }],
            [{
              columns: [{
                columns: [{
                  text: 'Current ARV Regimen:',
                  width: 50,
                  bold: true,
                }, {
                  text: patient.hivSummary.curArvMeds() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'Enrollment Date:',
                  width: 42,
                  bold: true,
                }, {
                  text: $filter('date')(patient.hivSummary.enrollmentDate(), "dd-MM-yyyy") || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'ARV Start Date:',
                  width: 60,
                  bold: true,
                }, {
                  text: $filter('date')(patient.hivSummary.arvStartDate(), "dd-MM-yyyy") || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Current Who Stage:',
                  width: 48,
                  bold: true,
                }, {
                  text: (patient.hivSummary.curWhoStage() || 'N/A').toString(),
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

              ]
            }]
          ];
        }
      } catch (e) {
      }
      return hivSummary;
    }

    function constructPatientVitals(patient) {
      var patientVitals = [['Patient has no Vitals']];
      try {
        if (patient.vitals.length > 0) {
          patient.vitals = patient.vitals.slice(0, 4);
          patientVitals = [
            [{
              text: 'Date',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'BP',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'Pulse',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'Temperature',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'Oxygen Sat',
              fontSize: 10,
              bold: true,
              width: '*',
            }, {
              text: 'Height',
              fontSize: 10,
              bold: true,
              width: '*',
            }, {
              text: 'Weight',
              fontSize: 10,
              bold: true,
              width: '*',
            }, {
              text: 'BMI',
              fontSize: 10,
              bold: true,
              width: '*',
            }


            ]
          ];
          _.each(patient.vitals, function (vital) {
            patientVitals.push([
              $filter('date')(vital.encounterDatetime(), "dd-MM-yyyy") || 'N/A',
              (vital.systolicBp() || '').toString() + '/' + (vital.diastolicBp() || '').toString(),
              (vital.pulse() || '').toString(),
              (vital.temperature() || '').toString(),
              (vital.oxygenSat() || '').toString(),
              (vital.height() || '').toString(),
              (vital.weight() || '').toString(),
              (vital.BMI() || '').toString(),
            ])
          });
        }
      } catch (e) {
      }
      return patientVitals;
    }

    function constructPatientLabTests(patient) {
      var patientLabTests = [['Patient has no Lab Test']];
      try {
        if (patient.labTests.length > 0) {
          patientLabTests = [
            [{
              text: 'Lab Test Date',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'CD4 Count',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'CD4 Percent %',
              bold: true,
              fontSize: 10,
              width: '*',
            }, {
              text: 'Viral Load',
              bold: true,
              fontSize: 10,
              width: '*',
            },{
              text: 'ART',
              fontSize: 10,
              bold: true,
              width: '*',
            }


            ]
          ];
          _.each(patient.labTests, function (labs) {
            if (labs.cd4_count!=null || labs.cd4_percent!=null || labs.hiv_viral_load!=null) {
              patientLabTests.push([
                $filter('date')(labs.test_datetime, "dd-MM-yyyy") || 'N/A',
                (labs.cd4_count!=null? labs.cd4_count: '').toString(),
                (labs.cd4_percent!=null? labs.cd4_percent: '').toString(),
                (labs.hiv_viral_load!=null? labs.hiv_viral_load:'').toString(),
                (labs.cur_arv_meds!=null? labs.cur_arv_meds:'').toString()
              ])
            }
          });
          //patientLabTests = patientLabTests.slice(0, 5);
          if (patientLabTests.length < 2) patientLabTests = [['Patient has no Lab Test']];
        }
      } catch (e) {
        console.log('some weird error0', e)
      }
      return patientLabTests
    }

    function constructPatientReminders(patient) {
      var patientReminders = [['Patient has no clinical reminders']];
      try {
        if (patient.clinicalReminders.length > 0) {
          patient.clinicalReminders = patient.clinicalReminders.slice(0, 4); //get only the first 5
          patientReminders = [];
          _.each(patient.clinicalReminders, function (reminder) {
            patientReminders.push([
              {
                columns: [{
                  text: reminder.title + ':',
                  width: 100,
                  bold: true,
                }, {
                  text: reminder.message,
                  width: '*',
                  // color: '#2a2a2a',
                  bold: true,
                }]
              }
            ])
          });
        }
      } catch (e) {
      }
      return patientReminders
    }

    function constructPatientClinicalNotes(patient) {
      var notes = [['Patient has no clinical notes ']];
      try {
        if (patient.clinicalNotes !== {}) {
          notes = [
            [{
              columns: [{
                columns: [{
                  text: 'Visit Date:',
                  width: 60,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.visitDate || 'N/A') + ' (' + (patient.clinicalNotes.scheduled || 'N/A') + ')',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'Provider(s):',
                  width: 42,
                  bold: true,
                }, {
                  text: getProviders(patient.clinicalNotes.providers),
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Last Viral Load:',
                  width: 60,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.lastViralLoad.value!=null?patient.clinicalNotes.lastViralLoad.value: 'N/A').toString()
                  + ' (' + patient.clinicalNotes.lastViralLoad.date + ')',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Last CD4 Count:',
                  width: 60,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.lastCD4Count.value!=null?patient.clinicalNotes.lastCD4Count.value: 'N/A').toString()
                  + ' (' + patient.clinicalNotes.lastCD4Count.date + ')',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

              ]
            }],
            [{
              columns: [{
                columns: [{
                  text: 'T:',
                  width: 10,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.temperature || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'BP:',
                  width: 15,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.bp || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'P:',
                  width: 10,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.pulse || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'O2:',
                  width: 15,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.oxygenSaturation || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'Ht:',
                  width: 15,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.height || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'W:',
                  width: 10,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.weight || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'BMI:',
                  width: 20,
                  bold: true,
                }, {
                  text: (patient.clinicalNotes.vitals.bmi || 'N/A').toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }

              ]
            }],
            [{
              columns: [{
                columns: [{
                  text: 'Dispensed ARV drugs:',
                  width: 50,
                  bold: true,
                }, {
                  text: patient.clinicalNotes.artRegimen.curArvMeds || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'TB Prophylaxis Plan:',
                  width: 50,
                  bold: true,
                }, {
                  text: patient.clinicalNotes.tbProphylaxisPlan.plan || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }, {
                columns: [{
                  text: 'TB Prophylaxis Start Date:',
                  width: 50,
                  bold: true,
                }, {
                  text: patient.clinicalNotes.tbProphylaxisPlan.startDate || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }, {
                columns: [{
                  text: 'TB Prophylaxis End Date:',
                  width: 50,
                  bold: true,
                }, {
                  text: patient.clinicalNotes.tbProphylaxisPlan.estimatedEndDate || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }

              ]
            }],
            [{
              columns: [{
                columns: [
                  {
                    text: 'CC/HPI:',
                    width: 48,
                    bold: true,
                  }, {
                    text: (patient.clinicalNotes.ccHpi[0].value || 'N/A').toString() || 'N/A',
                    width: '*',
                    alignment: 'left',
                    color: '#2a2a2a',
                  }]
              }]
            }],
            [{
              columns: [{
                columns: [
                  {
                    text: 'Assessment:',
                    width: 50,
                    bold: true,
                  }, {
                    text: (patient.clinicalNotes.assessment[0].value || 'N/A').toString() || 'N/A',
                    width: '*',
                    alignment: 'left',
                    color: '#2a2a2a',
                  }]
              }]
            }],
            [{
              columns: [{
                text: 'RTC Date:',
                width: 48,
                bold: true,
              }, {
                text: patient.clinicalNotes.rtcDate || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }]
          ];
        }
      } catch (e) {
      }
      return notes;
    }

    function generatePdf(patient, callback) {
      callback({
        pageSize: 'LETTER',
        pageMargins: 42,
        //header: {
        //  stack: [
        //    {text: 'hello-header'}
        //  ],
        //  margin: [42,20]
        //},
        footer: {
          stack: [{
            text: 'Health Center: ' + patient.demographics.healthCenter() || 'N/A',
            style: ['quote', 'small']
          }, {
            text: 'Generated on: ' + $filter('date')(new Date(), "dd-MM-yyyy") + ' (Point Of Care)',
            style: ['quote', 'small']
          }
          ],
          margin: [42, 20]
        },
        content: [{
          stack: [
            {
              image: patient.letterHead,
              width: 150,
              alignment: 'center'
            },

            {
              text: 'Ampath Clinical Summary',
              style: 'mainHeader',
              alignment: 'center'
            }, {
              columns: constructPatientDetails(patient)

            },
          ]
        }, {
          table: {
            widths: [535],
            body: constructPatientDemographicsDetails(patient)
          }
        }, {
          style: 'tableExample',
          table: {
            widths: [535],
            body: [
              [{
                stack: [

                  {
                    style: 'tableExample',

                    table: {
                      widths: [535],
                      headerRows: 1,
                      body: [
                        [{
                          text: 'HIV SUMMARY'
                        }],
                        [{

                          style: 'tableExample',
                          table: {
                            widths: [525],
                            body: constructPatientHivSummary(patient)
                          }
                        },]
                      ]
                    },
                    layout: 'headerLineOnly'
                  },
                  {
                    style: 'tableExample',

                    table: {
                      widths: [535],
                      headerRows: 1,
                      body: [
                        [{
                          text: 'PATIENT VITALS'
                        }],
                        [{
                          style: 'tableExample',
                          table: {
                            widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
                            body: constructPatientVitals(patient)
                          }
                        },]
                      ]
                    },
                    layout: 'headerLineOnly'
                  },
                  {
                    style: 'tableExample',

                    table: {
                      widths: [535],
                      headerRows: 1,
                      body: [
                        [{
                          text: 'LAB TEST'
                        }],
                        [{
                          style: 'tableExample',
                          table: {
                           // widths: ['*', '*', '*', '*', '*'],
                            body: constructPatientLabTests(patient)
                          }
                        },]
                      ]
                    },
                    layout: 'headerLineOnly'
                  },
                  {
                    style: 'tableExample',

                    table: {
                      widths: [535],
                      headerRows: 1,
                      body: [
                        [{
                          text: 'REMINDERS'
                        }],
                        [{
                          style: 'tableExample',
                          table: {
                            widths: [525],
                            body: [
                              [
                                {
                                  ul: constructPatientReminders(patient)
                                }
                              ]
                            ]
                          }
                        },]
                      ]
                    },
                    layout: 'headerLineOnly'
                  },
                  {
                    style: 'tableExample',

                    table: {
                      widths: [535],
                      headerRows: 1,
                      body: [
                        [{
                          text: 'CLINICAL NOTES'
                        }],
                        [{
                          style: 'tableExample',
                          table: {
                            widths: [525],
                            body: constructPatientClinicalNotes(patient)
                          }
                        },]
                      ]
                    },
                    layout: 'headerLineOnly'
                  },
                ]
              }]
            ]
          }

        },

        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          mainHeader: {
            fontSize: 14,
            bold: true,
            // color: 'blue',
            margin: [0, 0, 0, 0]
          },
          subheader: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          headerDetails: {
            fontSize: 10,
            bold: false,
            color: '#2a2a2a',
            margin: [0, 10, 0, 0]
          },
          tableExample: {
            margin: [0, 5, 0, 0]
          },
          sectionhead: {
            background: 'yellow',
            fontSize: 12,
            bold: true,
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        },
        defaultStyle: {
          //  alignment:'justify',
          fontSize: 8
        }
      });
    }

    function getLogo(url, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
      };
      img.src = url;
    }


  }

})();
