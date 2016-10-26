/*jshint -W003, -W117, -W098, -W026 */
(function () {
  'use strict';
  angular
    .module('app.admin')
    .factory('Moh731ReportService', Moh731ReportService);
  Moh731ReportService.$inject = [];

  function Moh731ReportService() {
    var setUp = false;
    var serviceDefinition;
    var startDate = new Date();
    var selectedLocation;
    var indicatorDetails;
    var endDate = new Date();
    var indicatorTags;
    var indicators = [];
    var pdfReportSections = [
      {
        sectionTitle:'3.1 On Cotrimoxazole Prophylaxis (within 2 months)',
        indicators:  [
          {
            label: 'HIV Exposed Infants (within 2 months)',
            ref: 'HV03-01',
            indicator: 'hiv_exposed_infants_below_2_months'
          },
          {
            label: 'HIV Exposed Infant (Eligible for CTX within 2 months)',
            ref: 'HV03-02',
            indicator: 'hiv_exposed_infants_on_pcp_prophylaxis_2_months_and_below'
          },
          {
            label: 'On CTX Below 15 yrs(M)',
            ref: 'HV03-03',
            indicator: 'on_pcp_prophylaxis_males_below_15'
          },
          {
            label: 'On CTX Below 15 yrs(F)',
            ref: 'HV03-04',
            indicator: 'on_pcp_prophylaxis_females_below_15'
          },
          {
            label: 'On CTX 15 yrs and Older(M)',
            ref: 'HV03-05',
            indicator: 'on_pcp_prophylaxis_males_15_and_above'
          },
          {
            label: 'On CTX 15 yrs and Older(F)',
            ref: 'HV03-06',
            indicator: 'on_pcp_prophylaxis_females_15_and_above'
          },
          {
            label: 'Total on CTX (Sum HV03-03 TO HV03-06)',
            ref: 'HV03-07',
            indicator: 'on_pcp_prophylaxis'
          }
        ],
      },
      {
        sectionTitle:'3.2 Enrolled in Care',
        indicators:   [
          {
            label: 'Enrolled in care Below 1yr(M)',
            ref: 'HV03-08',
            indicator: 'enrolled_in_care_males_lt_one'
          },
          {
            label: 'Enrolled in care Below 1yr(F)',
            ref: 'HV03-08',
            indicator: 'enrolled_in_care_females_lt_one'
          },
          {
            label: 'Enrolled in care Below 15yrs(M)',
            ref: 'HV03-09',
            indicator: 'enrolled_in_care_males_below_15'
          },
          {
            label: 'Enrolled in care Below 15yrs(F)',
            ref: 'HV03-10',
            indicator: 'enrolled_in_care_females_below_15'
          },
          {
            label: 'Enrolled in care 15yrs & Older(M)',
            ref: 'HV03-11',
            indicator: 'enrolled_in_care_males_15_and_older'
          },
          {
            label: 'Enrolled in care 15yrs & Older(F)',
            ref: 'HV03-12',
            indicator: 'enrolled_in_care_females_15_and_older'
          },
          {
            label: 'Enrolled in care - Total (Sum HV03-09 to HV03-12)',
            ref: 'HV03-13',
            indicator: 'enrolled_in_care_total'
          },
        ],
      },
      {
        sectionTitle:'3.3 Currently in Care -(from the total sheet-this month only and from last 2 months)',
        indicators: [
          {
            label: 'Currently in care Below 1yr(M)',
            ref: 'HV03-14',
            indicator: 'currently_in_care_males_lt_one'
          },
          {
            label: 'Currently in care Below 1yr(F)',
            ref: 'HV03-14',
            indicator: 'currently_in_care_females_lt_one'
          },
          {
            label: 'Currently in care Below 15yrs(M)',
            ref: 'HV03-15',
            indicator: 'currently_in_care_males_below_15'
          },
          {
            label: 'Currently in care Below 15yrs(F)',
            ref: 'HV03-16',
            indicator: 'currently_in_care_females_below_15'
          },
          {
            label: 'Currently in care 15yrs and older(M)',
            ref: 'HV03-17',
            indicator: 'currently_in_care_males_15_and_older'
          },
          {
            label: 'Currently in care 15yrs and older(F)',
            ref: 'HV03-18',
            indicator: 'currently_in_care_females_15_and_older'
          },
          {
            label: 'Currently in Care-Total (Sum HV03-15 to HV03-18)',
            ref: 'HV03-19',
            indicator: 'currently_in_care_total'
          },
        ],
      },
      {
        sectionTitle:'3.4 Starting ART',
        indicators: [
          {
            label: 'Starting ART -Below 1yr(M)',
            ref: 'HV03-20',
            indicator: 'starting_art_males_lt_one'
          },
          {
            label: 'Starting ART -Below 1yr(F)',
            ref: 'HV03-20',
            indicator: 'starting_art_females_lt_one'
          },
          {
            label: 'Starting ART -Below 15yrs(M)',
            ref: 'HV03-21',
            indicator: 'starting_art_males_below_15'
          },
          {
            label: 'Starting ART -Below 15yrs(F)',
            ref: 'HV03-22',
            indicator: 'starting_art_females_below_15'
          },
          {
            label: 'Starting ART -15yr and Older(M)',
            ref: 'HV03-23',
            indicator: 'starting_art_males_15_and_older'
          },
          {
            label: 'Starting ART -15yr and Older(F)',
            ref: 'HV03-24',
            indicator: 'starting_art_females_15_and_older'
          },
          {
            label: 'Starting on ART -Total (Sum HV03-21 to HV03-24)',
            ref: 'HV03-25',
            indicator: 'starting_art_total'
          },
          {
            label: 'Starting -Pregnant',
            ref: 'HV03-26',
            indicator: 'Starting_Pregnant'
          },
          {
            label: 'Starting -TB Patient',
            ref: 'HV03-27',
            indicator: 'starting_art_and_has_tb'
          },
        ],
      },
      {
        sectionTitle:'3.5 Revisits on ART (from the tally sheet -this month only and from last 2 months)',
        indicators:  [
          {
            label: 'Revisit on ART -Below 1yr(M)',
            ref: 'HV03-28',
            indicator: 'revisits_on_art_males_lt_one'
          },
          {
            label: 'Revisit on ART -Below 1yr(F)',
            ref: 'HV03-28',
            indicator: 'revisits_on_art_females_lt_one'
          },
          {
            label: 'Revisit on ART -Below 15yrs(M)',
            ref: 'HV03-29',
            indicator: 'revisits_on_art_males_below_15'
          },
          {
            label: 'Revisit on ART -Below 15yrs(F)',
            ref: 'HV03-30',
            indicator: 'revisits_on_art_females_below_15'
          },
          {
            label: 'Revisit on ART -15yrs and older(M)',
            ref: 'HV03-31',
            indicator: 'revisits_on_art_males_15_and_older'
          },
          {
            label: 'Revisit on ART -15yrs and older(F)',
            ref: 'HV03-32',
            indicator: 'revisits_on_art_females_15_and_older'
          },
          {
            label: 'Total Revisit on ART (Sum HV03-29 to HV03-32)',
            ref: 'HV03-33',
            indicator: 'revisits_on_art_total'
          },
        ],
      },
      {
        sectionTitle:'3.6 Currently on ART [ALL] - (Add 3.4 and 3.5 e.g HV03-34=HV03-20+HV03-28)',
        indicators:  [
          {
            label: 'Currently on ART - Below 1yr(M)',
            ref: 'HV03-34',
            indicator: 'on_art_males_lt_one'
          },
          {
            label: 'Currently on ART - Below 1yr(F)',
            ref: 'HV03-34',
            indicator: 'on_art_females_lt_one'
          },
          {
            label: 'Currently on ART - Below 15 yrs(M)',
            ref: 'HV03-35',
            indicator: 'on_art_males_below_15'
          },
          {
            label: 'Currently on ART - Below 15 yrs(F)',
            ref: 'HV03-36',
            indicator: 'on_art_females_below_15'
          },
          {
            label: 'Currently on ART -15yr and older(M)',
            ref: 'HV03-37',
            indicator: 'on_art_males_15_and_older'
          },
          {
            label: 'Currently on ART -15yr and older(F)',
            ref: 'HV03-38',
            indicator: 'on_art_females_15_and_older'
          },
          {
            label: 'Total currently on ART (Sum HV03-35 to HV03-38)',
            ref: 'HV03-39',
            indicator: 'on_art_total'
          },
        ],
      },
      {
        sectionTitle:'3.7 Cumulative Ever on ART',
        indicators:   [
          {
            label: 'Ever on ART - Below 15yrs(M)',
            ref: 'HV03-40',
            indicator: 'ever_on_art_males_below_15'
          },
          {
            label: 'Ever on ART - Below 15yrs(F)',
            ref: 'HV03-41',
            indicator: 'ever_on_art_females_below_15'
          },
          {
            label: 'Ever on ART - 15yrs & older(M)',
            ref: 'HV03-42',
            indicator: 'ever_on_art_males_15_and_older'
          },
          {
            label: 'Ever on ART - 15yrs & older(F)',
            ref: 'HV03-43',
            indicator: 'ever_on_art_females_15_and_older'
          },
          {
            label: 'Total Ever on ART (Sum HV03-40 to HV03-43)',
            ref: 'HV03-44',
            indicator: 'ever_on_art'
          },
        ],
      },
      {
        sectionTitle:'3.8 Survival and Retention on ART at 12 months',
        indicators:[
          {
            label: 'ART Net Cohort at 12 months',
            ref: 'HV03-45',
            indicator: 'art_net_cohort_at_12_months'
          },
          {
            label: 'On Original 1st Line at 12 months',
            ref: 'HV03-46',
            indicator: 'on_original_first_line'
          },
          {
            label: 'On alternative 1st Line at 12 months',
            ref: 'HV03-47',
            indicator: 'on_alternative_first_line'
          },
          {
            label: 'On 2nd Line (or higher) at 12 months',
            ref: 'HV03-48',
            indicator: 'on_second_line_or_higher'
          },
          {
            label: 'Total on therapy at 12 months (Sum HV03-46 to HV03-48)',
            ref: 'HV03-49',
            indicator: 'total_on_therapy_at_12_months'
          },
        ],
      },
      {
        sectionTitle:'3.9 Screening',
        indicators:  [
          {
            label: 'Screened for TB -Below 15yrs(M)',
            ref: 'HV03-50',
            indicator: 'screened_for_tb_males_below_15'
          },
          {
            label: 'Screened for TB -Below 15yrs(F)',
            ref: 'HV03-51',
            indicator: 'screened_for_tb_females_below_15'
          },
          {
            label: 'Screened for TB -15yrs & older(M)',
            ref: 'HV03-52',
            indicator: 'screened_for_tb_males_15_and_older'
          },
          {
            label: 'Screened for TB -15yrs & older(F)',
            ref: 'HV03-53',
            indicator: 'screened_for_tb_females_15_and_older'
          },
          {
            label: 'Total Screened for TB (Sum HV03-50 to HV03-53)',
            ref: 'HV03-54',
            indicator: 'screened_for_tb'
          },
          {
            label: 'Screened for cervical cancer (F 18 years and older)',
            ref: 'HV03-55',
            indicator: 'Screened_for_cervical_cancer'
          },
        ],
      },
      {
        sectionTitle:'3.10 Prevention with Positives',
        indicators:[
          {
            label: 'Modern contraceptive methods',
            ref: 'HV09-04',
            indicator: 'using_modern_contracept_method'
          },
          {
            label: 'Provided with condoms',
            ref: 'HV09-05',
            indicator: 'condoms_provided'
          },
        ],
      },
      {
        sectionTitle:'3.11 HIV Care Visits',
        indicators: [
          {
            label: 'Females (18 years and older)',
            ref: 'HV03-70',
            indicator: 'female_gte_18yo_visits'
          },
          {
            label: 'Scheduled',
            ref: 'HV03-71',
            indicator: 'scheduled_visits'
          },
          {
            label: 'Unscheduled',
            ref: 'HV03-72',
            indicator: 'unscheduled_visits'
          },
          {
            label: 'Total HIV Care visit',
            ref: 'HV03-73',
            indicator: 'total_visits'
          },
        ]
      }

    ];


    serviceDefinition = {
      isSetUp: isSetUp,
      generateReportHeaders: generateReportHeaders,
      generatePdfReportObject: generatePdfReportObject,
      getPdfSections: getPdfSections,
      getStartDate: getStartDate,
      setStartDate: setStartDate,
      getEndDate: getEndDate,
      setEndDate: setEndDate,
      getSelectedLocation: getSelectedLocation,
      setSelectedLocation: setSelectedLocation,
      resetSelectedLocation: resetSelectedLocation,
      getIndicatorDetails: getIndicatorDetails,
      setIndicatorDetails: setIndicatorDetails,
      getIndicatorTags: getIndicatorTags,
      setIndicatorTags: setIndicatorTags,
      getIndicators: getIndicators,
      setIndicators: setIndicators,

    };
    return serviceDefinition;

    function getPdfSections() {
      return pdfReportSections;
    }

    function getStartDate() {
      return startDate;
    }

    function setStartDate(date) {
      startDate = date;
    }

    function getEndDate() {
      return endDate;
    }

    function setEndDate(date) {
      endDate = date;
    }

    function isSetUp() {
      return setUp;
    }

    function getSelectedLocation() {
      return selectedLocation;
    }


    function setSelectedLocation(location) {
      selectedLocation = location;
    }

    function getIndicatorDetails() {
      return indicatorDetails;
    }

    function setIndicatorDetails(value) {
      indicatorDetails = value;
    }

    function getIndicators() {
      return indicators;
    }

    function setIndicators(value) {
      indicators = value;
    }

    function getIndicatorTags() {
      return indicatorTags;
    }

    function setIndicatorTags(tags) {
      indicatorTags = tags;
    }

    function resetSelectedLocation() {
      selectedLocation = {selected: undefined};
    }

    function generateReportHeaders(params){
      return {
        content: [{
          text: params.facilityName,
          style: 'header',
          alignment: 'center'
        }, {
          stack: [
            'National AIDS And STI Control Program', {
              text: 'MOH-731 Comprehensive HIV/AIDS Facility Report Form',
              style: 'subheader'
            },
          ],
          style: 'subheader'
        }, {
          columns: [{
            width: '*',
            text: 'Facility:' + params.facility
          }

          ]
        }, {
          columns: [{
            width: '*',
            text: 'District:' + params.district
          }, {
            width: '*',
            text: 'County:' + params.county
          }, {
            width: '*',
            text: 'Start date: ' + params.startDate,
            alignment: 'right'
          }, {
            width: '*',
            text: 'End date: ' + params.endDate,
            alignment: 'right'


          },]
        }, {}

        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          sectionhead: {
            // background: 'yellow',
            fontSize: 12,
            fillColor: '#8c8c8c',
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
          fontSize: 10
        }

      };
    }

    function generatePdfReportObject(params,rowData) {
      var mainReportObject= generateReportHeaders(params);
      angular.forEach(pdfReportSections, function (section, sectionIndex) {
        //get section labels  and  data1
        var sectionIndicatorLabels = [];
        var sectionIndicatorValues = [];
        angular.forEach(section.indicators, function (sectionIndicator, index) {
          sectionIndicatorLabels.push([sectionIndicator.label]);
          var indicatorValue = '-';
          if (angular.isDefined(rowData[sectionIndicator.indicator])) {
            indicatorValue = rowData[sectionIndicator.indicator];
          }
          sectionIndicatorValues.push(
            [sectionIndicator.ref, indicatorValue + '']);
        }, []);

        var sectionData = {
          sectionHead: section.sectionTitle,
          sectionLabels: sectionIndicatorLabels,
          sectionDataValues: sectionIndicatorValues
        };
        var reportSection = generateReportSection(sectionData);

        //add section main  json
        mainReportObject.content.push(reportSection);
      }, []);
      return mainReportObject;
    }

    function generateReportSection(sectionData) {
      return {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [
              [{
                table: {
                  widths: ['*'],
                  body: [
                    [{
                    text: sectionData.sectionHead,
                    style: 'sectionhead'
                    }]
                  ]
                }
              }]
            ],
            [
              {
                //layout: 'noBorders',
                table: {
                  widths: [310, 10, 10, '*'],
                  body: [
                    [{
                      table: {
                        widths: ['*'],
                        body: sectionData.sectionLabels
                      }
                    }, {
                      text: ''
                    }, {
                      text: ''
                    },
                      [{
                        table: {
                          widths: [50, '*'],
                          body: sectionData.sectionDataValues
                        },
                      }]
                    ]
                  ]
                }
              }
            ]

          ]
        }
      };

    }

  }

})();
