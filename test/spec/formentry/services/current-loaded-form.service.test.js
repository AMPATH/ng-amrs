/* global inject */
/* global beforeEach */
/* global describe */
/* global expect */
/* global it */
/*jshint -W026, -W030, -W106 */
(function () {
  'use strict';
  describe('Current Loaded Form Service Navigation Unit Tests', function () {
    beforeEach(function () {
      module('app.formentry');

    });


    var service;
    var formlyModel;
    var validationExpression;
    var validationExpression2;
    var formIds;

    beforeEach(inject(function ($injector) {
      service = $injector.get('CurrentLoadedFormService');
    }));

    beforeEach(function () {
      formlyModel = {
        section_5: {
          obs2_a8a003a6n1350n11dfna1f1n0026b9348838: {
            obs9_a898c56en1350n11dfna1f1n0026b9348838: 'a899b35c-1350-11df-a1f1-0026b9348838'
          },
          obs3_a8a003a6n1350n11dfna1f1n0026b9348838: [
            {
              obs10_a8a07a48n1350n11dfna1f1n0026b9348838: 'ab2723e2-e937-4f4c-8643-ef4a0c9ffa34'
            },
            {
              obs10_a8a07a48n1350n11dfna1f1n0026b9348838: '6d2bcec4-c1f1-4557-a75f-26b53e6448cc'
            }
          ]
        },
        section_1: {
          encounterProvider: 'fe6d47ce-816d-4c36-a8c8-05e593dd2341',
          encounterDate: '2015-09-08T21:00:00.000Z',
          encounterLocation: '',
          obs1_0f8b7f4en1656n46b7nbc93nd1fe4f193f5d: {}
        },
        section_2: {
          obs3_a89ff9a6n1350n11dfna1f1n0026b9348838: '1234565',
          obs4_dc1942b2n5e50n4adcn949dnad6c905f054e: '2015-09-08T21:00:00.000Z'
        },
        section_9: {
          obs9_bc3834ddnef07n4027nbe30n729baa069291: {},
          obs10_275eee16nc358n4f3anac16ne8f24659df87: {},
          obs11_3a69cfcfnf129n4702na8ddnd061d2a16b9d: {},
          obs12_2a4b87ddn977dn4ce8na321n1f13df4a31b2: {}
        }

      };

      validationExpression = '(q1 === null) || (q3 in ["val1", "val2", "val3"])';

      validationExpression2 = '(q1 === null) || ([12, "stringVal", "val3"].indexOf(q3) !== -1)';


      formIds = { q1: 12, q2: new Date(), q3: 'stringVal' };

    });

    it('should have Current Loaded Form Service services are defined', function () {
      expect(service).to.exist;
      expect(service.clearQuestionValueByKey).to.exist;
    });
    
    it('should getAnswerByQuestionKey', function () {
      //case existing key
      var answer = service.getAnswerByQuestionKey(formlyModel, 'obs3_a89ff9a6n1350n11dfna1f1n0026b9348838');
      expect(answer).to.equal('1234565');
      
      //case non-exstant key
      var answer2 = service.getAnswerByQuestionKey(formlyModel, 'not_existing');
      expect(answer2).to.equal(undefined);

    });

    it('should clear non-group question when clearQuestionValueByKey', function () {
      service.clearQuestionValueByKey(formlyModel, 'obs3_a89ff9a6n1350n11dfna1f1n0026b9348838');

      var newValue = service.getAnswerByQuestionKey(formlyModel, 'obs3_a89ff9a6n1350n11dfna1f1n0026b9348838');

      expect((newValue === null || newValue === undefined || newValue === '')).to.equal(true);

    });

    it('should clear group question when clearQuestionValueByKey', function () {
      
      //case array group
      service.clearQuestionValueByKey(formlyModel, 'obs3_a8a003a6n1350n11dfna1f1n0026b9348838');

      var newValue = service.getAnswerByQuestionKey(formlyModel, 'obs3_a8a003a6n1350n11dfna1f1n0026b9348838');

      expect(Array.isArray(newValue)).to.equal(true);
      
      //case object group
      service.clearQuestionValueByKey(formlyModel, 'section_2');

      var newValue2 = service.getAnswerByQuestionKey(formlyModel, 'section_2');

      expect(newValue2).to.deep.equal({});

    });

  });

})();