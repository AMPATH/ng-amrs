/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
    'use strict';

    angular
        .module('models')
        .factory('SessionModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            session: session
        };

        return service;

        //this is the contructor for the session object
        //call this using the new function
        //e.g. var ses = new session(sessionId,isAuthenticated);
        //get the members for ses using ses.sessionId();
        //set the members for ses using ses.sessionId(newValue);

        function session(sessionId_, isAuthenticated_) {
            var modelDefinition = this;

            //initialize private members
            var _sessionId = '';
            var _isAuthenticated = false;

            //assign values
            if(sessionId_){
              _sessionId = sessionId_;
            }
            if(isAuthenticated_){
              _isAuthenticated = isAuthenticated_;
            }

            //this is a getter and setter for _sessionId.
            //convetion is usually to name private properties starting with _
            //so _sessionId is the private member and accessed via the setter below
            modelDefinition.sessionId = function(value){
              if(angular.isDefined(value)){
                //you can modify the value here before assigning it to _sessionId.
                //e.g _sessionId = trim(value);
                _sessionId = value;
              }
              else{
                //you can change _sessionId before returning it
                //e.g. return 'prefix' + _sessionId;
                return _sessionId;
              }
            };

            modelDefinition.isAuthenticated = function(value){
              if(angular.isDefined(value)){
                _isAuthenticated = value;
              }
              else{
                return _isAuthenticated;
              }
            };
            modelDefinition.openmrsModel = function(value){
              return {sessionId:_sessionId, authenticated:_isAuthenticated};
            };
        }
    }
})();
