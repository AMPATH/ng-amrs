/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('EncounterResService', EncounterResService);

  EncounterResService.$inject = ['Restangular'];

  function EncounterResService(Restangular) {
    var service = {
      getEncounterByUuid: getEncounterByUuid,
      saveEncounter: saveEncounter,
      getPatientEncounters: getPatientEncounters,
      voidEncounter: voidEncounter
    }

    return service;

    function voidEncounter(uuid, successCallback, errorCallback) {
        Restangular.one('encounter', uuid).remove().then(function(response) {
            if(typeof successCallback === 'function') {
                successCallback(response);
            }
        }, function(error) {
            if(typeof errorCallback === 'function') {
                errorCallback(error);
            }
        });
    }

    function getEncounterByUuid(params, successCallback, errorCallback) {
      var objParams = {};
      var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                      'patient:(uuid,uuid),form:(uuid,name),' +
                      'location:ref,encounterType:ref,provider:ref,' +
                      'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers))';

      if(angular.isDefined(params) && typeof params === 'string'){
        var encounterUuid = params;
        objParams = {'encounter': encounterUuid, 'v': _customDefaultRep}
      } else {
        objParams = {
          'encounter': params.uuid,
          'v': params.rep || _customDefaultRep
        }
      }
      Restangular.one('encounter',objParams.encounter).get({v:objParams.v}).then(function(data) {
        _successCallbackHandler(successCallback, data);
      },
      function(error) {
        console.log('An error occured while attempting to fetch encounter ' +
                    'with uuid ' + params.patientUuid);
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function saveEncounter(encounter, successCallback, errorCallback) {

      var _encounter =JSON.parse(encounter);
      if(_encounter.uuid !== undefined)
      {
        var uuid = _encounter.uuid
        delete _encounter['uuid'];
        //Restangular.one('encounter',uuid).remove(); // void encounter

        //_encounter['voided'] = false;
        console.log('update json');
        console.log(JSON.stringify(_encounter));
        //updating an existing encounter
        Restangular.one('encounter', uuid).customPOST(JSON.stringify(_encounter)).then(function(success) {
          console.log('Encounter saved successfully');
          if (typeof successCallback === 'function') successCallback(success);
        },
        function(error) {
          console.log('Error saving encounter');
          if (typeof errorCallback === 'function') errorCallback(error);
        });
      }
      else {
        Restangular.service('encounter').post(encounter).then(function(success) {
          console.log('Encounter saved successfully');
          if (typeof successCallback === 'function') successCallback(success);
        },
        function(error) {
          console.log('Error saving encounter');
          if (typeof errorCallback === 'function') errorCallback(error);
        });
      }
    }

    function getPatientEncounters(params, successCallback, errorCallback) {
      var objParams = {};

      // Don't include obs by default
      var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                      'patient:(uuid,uuid),form:(uuid,name),' +
                      'location:ref,encounterType:ref,provider:ref)';

      if(angular.isDefined(params) && typeof params === 'string'){
        var patientUuid = params;
        objParams = {'patient': patientUuid, 'v':_customDefaultRep}
      } else {
        var v = params.rep || params.v;
        objParams = {
          'patient': params.patientUuid,
          'v': v || _customDefaultRep
        }

        /* jshint ignore: start */
        delete params.patientUuid;
        delete params.rep;
        /* jshint ignore: end */

        //Add objParams to params and assign it back objParams
        params.patient = objParams.patient;
        params.v = objParams.v;

        objParams = params;
      }

      Restangular.one('encounter').get(objParams).then(function(data) {
        if(angular.isDefined(data.results)) data = data.results;
        _successCallbackHandler(successCallback, data.reverse());
      },
      function(error) {
        console.log('An error occured while attempting to fetch encounters ' +
                    'for patient with uuid ' + params.patientUuid);
        if (typeof errorCallback === 'function') errorCallback(error);
      });
    }

    function _successCallbackHandler(successCallback, data) {
      if (typeof successCallback !== 'function') {
        console.log('Error: You need a callback function to process' +
        ' results');
        return;
      }
      successCallback(data);
    }
  }
})();
