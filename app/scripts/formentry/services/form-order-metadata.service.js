/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069
*/
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
    .module('app.formentry')
    .factory('FormOrderMetaData', FormOrderMetaData);

  FormOrderMetaData.$inject = ['CachedDataService', '$http', 'FormResService', '$q', '$log', 'FormEntry', 'FormsCache'];

  function FormOrderMetaData(CachedDataService, $http, FormResService, $q, $log, FormEntry, FormsCache) {

    var formservice = {
      setFavouriteForm: setFavouriteForm,
      getFavouriteForm: getFavouriteForm,
      removeFavouriteForm: removeFavouriteForm,
      getDefaultFormOrder: getDefaultFormOrder,
      getPocForms: CachedDataService.getCachedPocForms,
    };

    return formservice;

    function setFavouriteForm(name) {
      var formNames = getFavouriteForm();
      var obj = {
        name: name
      };

      if (_.findWhere(formNames, obj) == null) {
        formNames.push(obj);
        localStorage.setItem('formNames', JSON.stringify(formNames));
      }

    }

    function removeFavouriteForm(name) {
      var formNames = getFavouriteForm();
      var obj = {
        name: name
      };
      formNames.splice(_.indexOf(formNames, _.findWhere(formNames, obj)), 1);
      localStorage.setItem('formNames', JSON.stringify(formNames));
    }

    function getFavouriteForm() {
      var storedData = localStorage.getItem("formNames");
      var arrayData = [];
      if (storedData) {
        arrayData = JSON.parse(storedData);
      }
      return arrayData;
    }

    function getDefaultFormOrder() {
      var deferred = $q.defer();
      var url = 'scripts/formentry/form-order.json';
      $http.get(url, {
          cache: true
        })
        .success(function(response) {
          //onSuccess(response);
          deferred.resolve(response);
        })
        .error(function(data, status, headers, config) {
          if (status === 404) {
            //alert('form-order.json not Available');
            console.error('form-order.json not available');
          }
          //onError(data);
          deferred.reject(new Error('Uknown error. Status:' + status));
        });

      return deferred.promise;
    }
  }
})();
