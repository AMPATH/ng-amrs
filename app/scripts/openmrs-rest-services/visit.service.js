/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('app.openmrsRestServices')
          .factory('VisitResService', VisitResService);

  VisitResService.$inject = ['Restangular'];

  function VisitResService(Restangular) {
      var service = {
          getVisitByUuid: getVisitByUuid,
          getPatientVisits: getPatientVisits,
          saveVisit: saveOrUpdateVisit,
          getVisitEncounters: getVisitEncounters,
          getVisitTypes: getVisitTypes,
          defaultCustomRep: new DefaultCustomRep().getterSetter
      };

      return service;

      function getVisitByUuid(params, successCallback, errorCallBack) {
          var objParams = {};
          if(angular.isDefined(params) && typeof params === 'string') {
            objParams = {
                'visitUuid': params,
                'v': new DefaultCustomRep().getterSetter()
            }
          } else {
             var v = params.rep || params.v;
             objParams = {
                 'visitUuid': params.uuid,
                 'v': v || new DefaultCustomRep().getterSetter()
             }
          }

         Restangular.one('visit', objParams.visitUuid).get({v: objParams.v})
            .then(function(data) {
                _successCallbackHandler(successCallback, data);
            }, function(error) {
                console.log('Error: An error occured while fetching visit' +
                ' data for visit with uuid ' + objParams.visitUuid);
                if(typeof errorCallBack === 'function') {
                    errorCallBack(error);
                }
            });
      }

      function getPatientVisits(params, successCallback, errorCallBack) {
          var objParams = {};
          if(angular.isDefined(params) && typeof params === 'string') {
              // params is a patient uuid
              objParams = {
                  'patient': params,
                  'v': new DefaultCustomRep().getterSetter()
              }
          } else {
              var v = params.rep || params.v;
              objParams = {
                  'patient': params.patientUuid,
                  'v': v || new DefaultCustomRep().getterSetter()
              }
              /* jshint ignore: start */
              delete params.patientUuid;
              delete params.rep;
              /* jshint ignore: end */

              //Copy other fields.
              params.patient = objParams.patient;
              params.v = objParams.v;

              // Assign params to objParams
              objParams = params;
          }

          Restangular.one('visit').get(objParams).then(function(data) {
              if(angular.isDefined(data.results)) data = data.results.reverse();
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function saveOrUpdateVisit(payload, successCallback, errorCallBack) {
          if(angular.isDefined(payload.uuid)) {
              var visitUuid = payload.uuid;
              delete payload.uuid;

              Restangular.one('visit', visitUuid).customPOST(
                  JSON.stringify(payload)).then(function(data) {
                      _successCallbackHandler(successCallback, data);
                  }, function (error) {
                      if(typeof errorCallBack === 'function') {
                          errorCallBack(error);
                      }
                  })
          } else {
              // It is a new visit.
              Restangular.service('visit').post(payload).then(function(data) {
                  _successCallbackHandler(successCallback, data);
              }, function(error) {
                  if(typeof errorCallBack === 'function') {
                      errorCallBack(error);
                  }
              });
          }
      }

      //Get encounters for a given Visit
      function getVisitEncounters(params, successCallback, errorCallBack) {
          var rep = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                  'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                  'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                  'encounterRole:(uuid,name)),location:(uuid,name),' +
                  'visit:(uuid,visitType:(uuid,name))))';

          var visitUuid=null;
          if(angular.isDefined(params) && typeof params === 'object') {
              visitUuid = params.visitUuid;
          } else {
              //Assume string passed
              visitUuid = params;
          }

          Restangular.one('visit', visitUuid).get({v:rep}).then(function(data) {
              if(angular.isDefined(data.encounters)) {
                  data = data.encounters.reverse();
              }
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function getVisitTypes(rep, successCallback, errorCallback) {
          var params = {};
          if(angular.isDefined(rep)) {
              if(typeof rep === 'string')params.v = rep;
              else if(typeof rep === 'object')params = rep;
              else {
                  errorCallback = successCallback;
                  successCallback = rep;
              }
          }
          params.v = params.v || 'custom:(uuid,name,description)';

          Restangular.one('visittype').get(params).then(function(data) {
              if(angular.isDefined(data.results)) data = data.results.reverse();
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function DefaultCustomRep() {
         var _defaultCustomRep = 'custom:(uuid,patient:(uuid,uuid),' +
            'visitType:(uuid,name),location:ref,startDatetime,encounters:(' +
            'uuid,encounterDatetime,form:(uuid,name),encounterType:ref,' +
            'encounterProviders:ref,' +
            'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers)))';

        this.getterSetter = function(value) {
              if(angular.isDefined(value)) {
                  _defaultCustomRep = value;
              } else {
                  return _defaultCustomRep;
              }
         }
      }

      function _successCallbackHandler(successCallback, data) {
        if (typeof successCallback !== 'function') {
          console.log('Warning: You need a callback function to process' +
          ' results');
          return;
        }

        successCallback(data);
      }
  }
})();
