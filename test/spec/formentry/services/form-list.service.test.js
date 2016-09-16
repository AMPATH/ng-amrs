/* global expect */
/* global inject */
/*jshint -W026, -W030 */

(function() {
  'use strict';

  describe.only('Forms List Service Unit Tests', function() {
    beforeEach(function() {
      module('app.formentry');
    });

    var FormList;
    var rootScope;
    var formOrderMetaData;
    var $q;

    var unsortArray;
    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      FormList = $injector.get('FormListService');
      formOrderMetaData = $injector.get('FormOrderMetaData');
      rootScope = _$rootScope_;
      $q = _$q_;
    }));

    beforeEach(function() {
      unsortArray = [{
        name: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0'
      }, {
        name: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0'
      }, {
        name: 'form 3',
        published: false,
        uuid: 'uuid3',
        version: '1.0'
      }, {
        name: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0'
      }, {
        name: 'form 4',
        published: false,
        uuid: 'uuid4-unpublished',
        version: '2.0'
      }, {
        name: 'form 5',
        published: false,
        uuid: 'uuid5-unpublished',
        version: '1.0'
      }];
    });

    it('should inject the form list service correctly', function() {
      expect(FormList).to.exist;
    });

    it('should sort array of forms given unsorted array and sorting metadata', function() {
      var favourite = [{
        name: 'form 5'
      }, {
        name: 'form 3'
      }];

      var defualtOrdering = [{
        name: 'form 2'
      }, {
        name: 'form 3'
      }];

      var expectedOrderForms = [{
        name: 'form 5',
        published: false,
        uuid: 'uuid5-unpublished',
        version: '1.0'
      }, {
        name: 'form 3',
        published: false,
        uuid: 'uuid3',
        version: '1.0'
      }, {
        name: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0'
      }, {
        name: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0'
      }, {
        name: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0'
      }, {
        name: 'form 4',
        published: false,
        uuid: 'uuid4-unpublished',
        version: '2.0'
      }];

      var actualOrderedForms = FormList.sortFormList(unsortArray, [favourite, defualtOrdering]);

      expect(Array.isArray(actualOrderedForms)).to.be.true;
      console.log('actual array', actualOrderedForms);
      expect(actualOrderedForms[0]).to.deep.equal(expectedOrderForms[0]);
      expect(actualOrderedForms[1]).to.deep.equal(expectedOrderForms[1]);
      expect(actualOrderedForms[2]).to.deep.equal(expectedOrderForms[2]);
      expect(actualOrderedForms.length === expectedOrderForms.length).to.be.true;
      expect(actualOrderedForms).to.deep.equal(expectedOrderForms);

    });

    it('should filter out unpublished openmrs forms from a list',
      function() {
        var expectedFilteredList = [{
          name: 'form 1',
          published: true,
          uuid: 'uuid',
          version: '1.0'
        }, {
          name: 'form 2',
          published: true,
          uuid: 'uuid2',
          version: '1.0'
        }, {
          name: 'form 4',
          published: true,
          uuid: 'uuid4',
          version: '1.0'
        }];

        var actualFilteredList = FormList.filterPublishedOpenmrsForms(unsortArray);

        expect(actualFilteredList.length === expectedFilteredList.length).to.be.true;
        expect(_.findWhere(actualFilteredList, expectedFilteredList[0]) !== null).to.be.true;
        expect(_.findWhere(actualFilteredList, expectedFilteredList[1]) !== null).to.be.true;
        expect(_.findWhere(actualFilteredList, expectedFilteredList[2]) !== null).to.be.true;

      });
    it('should add favourite property to forms list',
      function() {
        var favourite = [{
          name: 'form 5'
        }, {
          name: 'form 3'
        }];

        var expectedfavouriteForms = [{
          name: 'form 1',
          published: true,
          uuid: 'uuid',
          version: '1.0',
          favourite: false
        }, {
          name: 'form 2',
          published: true,
          uuid: 'uuid2',
          version: '1.0',
          favourite: false
        }, {
          name: 'form 3',
          published: false,
          uuid: 'uuid3',
          version: '1.0',
          favourite: true
        }, {
          name: 'form 4',
          published: true,
          uuid: 'uuid4',
          version: '1.0',
          favourite: false
        }, {
          name: 'form 4',
          published: false,
          uuid: 'uuid4-unpublished',
          version: '2.0',
          favourite: false
        }, {
          name: 'form 5',
          published: false,
          uuid: 'uuid5-unpublished',
          version: '1.0',
          favourite: true
        }];

        var processFavouriteForms = FormList.processFavouriteForms(unsortArray, favourite);

        expect(processFavouriteForms).to.deep.equal(expectedfavouriteForms);


      });

    it.only('should fetch and process the final form list when getFormList is invoked', function() {
      var favourite = [{
        name: 'form 5'
      }, {
        name: 'form 3'
      }];

      var defualtOrdering = [{
        name: 'form 2'
      }, {
        name: 'form 3'
      }];

      var expectedFormsList = [{
        name: 'form 2',
        display: 'form 2',
        published: true,
        uuid: 'uuid2',
        version: '1.0',
        favourite: false
      }, {
        name: 'form 1',
        display: 'form 1',
        published: true,
        uuid: 'uuid',
        version: '1.0',
        favourite: false
      }, {
        name: 'form 4',
        display: 'form 4',
        published: true,
        uuid: 'uuid4',
        version: '1.0',
        favourite: false
      }];

      var pocFormsStub = sinon.stub(formOrderMetaData, 'getPocForms', function() {
        return unsortArray;

      });

      var favouriteFormsStub = sinon.stub(formOrderMetaData, 'getFavouriteForm', function() {
        return favourite;
      });

      var defualtFormOrderStub = sinon.stub(formOrderMetaData, 'getDefaultFormOrder', function() {
        var deferred = $q.defer();
        deferred.resolve(defualtOrdering);
        return deferred.promise;
      });

      //make the call
      var actualFormList;

      FormList.getFormList().then(function(output){
        actualFormList = output;
      });

      //call rootscope digect to resolve all promises
      rootScope.$digest();
      //expect block

      console.log('actualFormList', actualFormList);
      expect(actualFormList).to.exist;
      expect(actualFormList).to.deep.equal(expectedFormsList);
      pocFormsStub.restore();
      favouriteFormsStub.restore();
      defualtFormOrderStub.restore();
    });

    it('should remove version information from a form name',
      function() {
        //CASE 1: Perfect form name
        var formName = ' some form name v1.00 '; //CASE 2: Imperfect version
        var formName2 = ' some form name v1. '; //CASE 3: No version information
        var formName3 = ' some form navme '; //the v intentionally put there for a certain test case
        expect(FormList.removeVersionInformation(formName)).to.equal('some form name');
        expect(FormList.removeVersionInformation(formName2)).to.equal('some form name');
        expect(FormList.removeVersionInformation(formName3)).to.equal('some form navme');
      });
    it('should remove version information from an array of forms ',
      function() {
        var formNames = [{
          name: 'some'
        }, {
          name: 'form v1.0'
        }];
        var expectedFormNames = [{
          name: 'some',
          display: 'some'
        }, {
          name: 'form',
          display: 'form v1.0'
        }];
        var actualFormNames = FormList.removeVersionInformationFromForms(formNames);
        expect(expectedFormNames).to.deep.equal(actualFormNames);
      });

  });

})();
