(function() {
  'use strict';

  angular
    .module('app.formentry')
    .factory('FormListService', FormListService);

  FormListService.$inject = ['FormOrderMetaData', '$q'];

  function FormListService(FormOrderMetaData, $q) {
    var service = {
      sortFormList: sortFormList,
      filterPublishedOpenmrsForms: filterPublishedOpenmrsForms,
      processFavouriteForms: processFavouriteForms,
      getFormList: getFormList,
      removeVersionFromFormNames: removeVersionFromFormNames,
      removeVersionInformationFromForms: removeVersionInformationFromForms,
      removeVersionInformation: removeVersionInformation
    };

    return service;

    function removeVersionFromFormNames(pocForms) {
      _.each(pocForms, function(form) {
        form.display = form.name;
      });
      return pocForms;
    }

    function sortFormList(unsortArray, sortingMetadataArrays) {
      if (!Array.isArray(unsortArray)) throw new Error('unsortedArray must be an array');

      if (!Array.isArray(sortingMetadataArrays)) throw new Error('sortingMetadataArrays must be an array');

      _.each(sortingMetadataArrays, function(array) {
        if (!Array.isArray(array)) throw new Error('Every member of the sortingMetadataArrays  must be an array');
      });

      var sortedArray = [];

      //add items to the list of sorted array by using the metadata provided
      _.each(sortingMetadataArrays, function(sortingMetadata) {
        _.each(sortingMetadata, function(metadata) {
          var found = _findItemByName(metadata.name, unsortArray);
          if (found) {
            _addMemberToArray(found, sortedArray);
          }
        });
      });

      //add missing items that weren't in the sorting metadata
      _.each(unsortArray, function(item) {
        var found = _findItemByName(item.name, sortedArray);
        console.log('----->', item.name, found);
        if (_.isEmpty(found)) {
          var toAdd = _findItemByName(item.name, unsortArray);
          _addMemberToArray(toAdd, sortedArray);
        }
      });

      return sortedArray;
    }

    function _findItemByName(name, array) {
      var foundItems = [];
      for (var i = 0; i < array.length; i++) {
        //TODO: find a way to compare strings by first eliminating the spaces
        if (array[i] && name === array[i].name)
          foundItems.push(array[i]);
      }
      return foundItems.length === 0 ? undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    }

    function _findItemByUuid(uuid, array) {
      var foundItems = [];
      for (var i = 0; i < array.length; i++) {
        //TODO: find a way to compare strings by first eliminating the spaces
        if (array[i] && uuid === array[i].uuid)
          foundItems.push(array[i]);
      }
      return foundItems.length === 0 ? undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    }

    function _arrayHasMember(member, array) {
      return array.indexOf(member) !== -1;
    }

    function _addMemberToArray(member, array) {
      if (Array.isArray(member)) {
        //add individual members to array
        _.each(member, function(item) {
          _addMemberToArray(item, array);
        });
      } else {
        if (member && !_arrayHasMember(member, array))
          array.push(member);
      }

    }


    function filterPublishedOpenmrsForms(unsortArray) {
      if (!Array.isArray(unsortArray)) throw new Error('Input must be an array');

      var PublishedOpenmrsForms = [];

      _.each(unsortArray,
        function(item) {
          if (item.published === true) {
            PublishedOpenmrsForms.push(item);
          }
        });
      return PublishedOpenmrsForms;
    }

    function processFavouriteForms(openmrsForms, favouriteForms) {
      if (!Array.isArray(openmrsForms)) throw new Error('unsortedArray must be an array');
      if (!Array.isArray(favouriteForms)) throw new Error('favourite must be an array');
      _.each(openmrsForms, function(form) {
        if (_findItemByName(form.name, favouriteForms)) {
          form.favourite = true;
        } else {
          form.favourite = false;
        }

      });
      console.log('fav', openmrsForms);
      return openmrsForms;
    }

    function removeVersionInformationFromForms(formsArray) {
      _.each(formsArray, function(form) {
        form.display = angular.copy(form.name);
        form.name = removeVersionInformation(form.name);
      });
      return formsArray;
    }

    function removeVersionInformation(formName) {
      if (typeof formName !== 'string') throw new Error('formName should be a string');
      var trimmed = formName.trim();
      //minimum form length is 5 characters
      if (trimmed.length < 5)
        return trimmed;
      var lastFiveCharacters = trimmed.substr(trimmed.length - 5);
      console.log('last 5', lastFiveCharacters);
      var indexOfV = lastFiveCharacters.search('v') === -1 ? lastFiveCharacters.search('V') : lastFiveCharacters.search('v');
      if (indexOfV === -1 || indexOfV === (lastFiveCharacters.length - 1))
        return trimmed;
      if (_isVersionInformation(lastFiveCharacters.substr(indexOfV, lastFiveCharacters.length - indexOfV))) {
        return trimmed.substr(0, (trimmed.length - (5 - indexOfV))).trim();
      }
      return trimmed;
    }

    function _isVersionInformation(subString) {
      if (subString.length < 2) return false;
      if (subString.substr(0, 1) !== 'v' && subString.substr(0, 1) !== 'V') return false;
      if (!_isNumeric(subString.substr(1, 1))) return false;
      return true;
    }

    function _isNumeric(str) {
      return /^\d+$/.test(str);
    }

    function getFormList() {
      var deferred = $q.defer();

      //fetch the poc forms
      var pocForms = FormOrderMetaData.getPocForms();
      pocForms = angular.copy(pocForms);

      //fetch theh metadata used to order forms
      var favouriteForms = FormOrderMetaData.getFavouriteForm();
      FormOrderMetaData.getDefaultFormOrder()
        .then(function(defaultOrder) {
          try {
            var formlist =
            processFavouriteForms(_getFormList(pocForms, [favouriteForms, defaultOrder]), favouriteForms);
            deferred.resolve(formlist);
          } catch (e) {
            deferred.reject(e);
          }
        })
        .catch(function(error) {
          try {
            var formlist =
            processFavouriteForms(_getFormList(pocForms, [favouriteForms]), favouriteForms);
            deferred.resolve(formlist);
          } catch (e) {
            deferred.reject(e);
          }
        });

      return deferred.promise;
    }

    function _getFormList(pocForms, formOrderArray) {
      //first filter out unpublished forms
      var effectiveForms = removeVersionInformationFromForms(pocForms);
      var publishedForms = filterPublishedOpenmrsForms(effectiveForms);
      console.log('=============1', publishedForms);
      var sortedList = sortFormList(publishedForms, formOrderArray);
      return sortedList;
    }

  }
})();
