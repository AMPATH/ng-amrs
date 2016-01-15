/*jshint -W003, -W098, -W033 */
(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name ngAmrsApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the ngAmrsApp
     */
    angular
        .module('ngAmrsApp')
        .controller('UrlSelectorCtrl', UrlSelectorCtrl);
    UrlSelectorCtrl.$nject = ['$rootScope', '$scope', 'OpenmrsSettings', 'EtlRestServicesSettings', 'AuthService', '$state'];

    function UrlSelectorCtrl($rootScope, $scope, OpenmrsSettings, EtlRestServicesSettings, AuthService, $state) {

        $scope.currentMode = '';

        $scope.currentRestBaseUrl = '';

        $scope.currentEtlRestBaseUrl = '';

        $scope.urlRestBaseList = [];
        $scope.urlEtlRestBaseList = [];

        $scope.urlToAdd = '';

        $scope.urlEtlToAdd = '';

        $scope.addingUrl = false;

        $scope.addingEtlUrl = false;

        $scope.preConfiguredSettings = [
            {
                name: 'Production',
                etl: 'https://amrsreporting.ampath.or.ke:8002/etl/',
                amrs: 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/'
            },
            {
                name: 'Production Demo',
                etl: 'https://amrsreporting.ampath.or.ke:8003/etl/',
                amrs: 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/'
            },
            {
                name: 'Test',
                etl: 'https://test1.ampath.or.ke:8002/etl/',
                amrs: 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/'
            },
            {
                name: 'Test Demo',
                etl: 'https://test1.ampath.or.ke:8003/etl/',
                amrs: 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/'
            }
        ];

        //methods
        $scope.addUrlToList = addUrlToList;
        $scope.addEtlUrlToList = addEtlUrlToList;
        $scope.saveSettings = saveSettings;
        $scope.cancelAddingUrl = cancelAddingUrl;
        $scope.selectConfiguration = selectConfiguration;

        activate();

        function activate() {
            var hasPersistedCurrentUrl = OpenmrsSettings.hasCoockiePersistedCurrentUrlBase() && EtlRestServicesSettings.hasCoockiePersistedCurrentUrlBase();
            if (!hasPersistedCurrentUrl)
                $scope.currentMode = 'SetMode';
            else
                $scope.currentMode = 'ChangeMode';

            $scope.urlRestBaseList = OpenmrsSettings.getUrlBaseList();
            $scope.urlEtlRestBaseList = EtlRestServicesSettings.getUrlBaseList();

            //add current url to list to enable selection
            var currentUrl = OpenmrsSettings.getCurrentRestUrlBase();
            var hasCurUrl = _.contains($scope.urlRestBaseList, currentUrl);
            if (!hasCurUrl) OpenmrsSettings.addUrlToList(currentUrl);

            var currentEtlUrl = EtlRestServicesSettings.getCurrentRestUrlBase();
            var hasCurEtlUrl = _.contains($scope.urlEtlRestBaseList, currentEtlUrl);
            if (!hasCurEtlUrl) EtlRestServicesSettings.addUrlToList(currentEtlUrl);

            $scope.currentRestBaseUrl = currentUrl;
            $scope.currentEtlRestBaseUrl = currentEtlUrl;

        }

        function addUrlToList() {
            if ($scope.addingUrl) {
                if ($scope.urlToAdd && $scope.urlToAdd !== '') {
                    OpenmrsSettings.addUrlToList($scope.urlToAdd);
                    $scope.currentRestBaseUrl = $scope.urlToAdd;
                    $scope.addingUrl = false;
                }
            }
            else {
                $scope.addingUrl = true;
            }

        }

        function cancelAddingUrl() {
            $scope.addingUrl = false;
            $scope.addingEtlUrl = false;
        }

        function addEtlUrlToList() {
            if ($scope.addingEtlUrl) {
                if ($scope.urlEtlToAdd && $scope.urlEtlToAdd !== '') {
                    EtlRestServicesSettings.addUrlToList($scope.urlEtlToAdd);
                    $scope.currentEtlRestBaseUrl = $scope.urlEtlToAdd;
                    $scope.addingEtlUrl = false;
                }
            }
            else {
                $scope.addingEtlUrl = true;
            }
        }

        function saveSettings() {
            EtlRestServicesSettings.setCurrentRestUrlBase($scope.currentEtlRestBaseUrl);
            OpenmrsSettings.setCurrentRestUrlBase($scope.currentRestBaseUrl);
            AuthService.logOut();
        }

        function selectConfiguration(configuration) {
            $scope.currentRestBaseUrl = findAmrsConfiguration(configuration.amrs);
            $scope.currentEtlRestBaseUrl = findEtlConfiguration(configuration.etl);
        }
        
        function findEtlConfiguration(url) {
            console.log('finding etl.. ', url);
            var found;
            for(var i = 0; i < $scope.urlEtlRestBaseList.length; i ++) {
                var val = $scope.urlEtlRestBaseList[i];
                if(_.includes(val, url) || _.includes(url, val)) {
                    found = i;
                }
            }
            console.log('found etl.. ', $scope.urlEtlRestBaseList[found]);
            return $scope.urlEtlRestBaseList[found];
        }
        
        function findAmrsConfiguration(url) {
            console.log('finding amrs.. ', url);
            var found;
            for(var i = 0; i < $scope.urlRestBaseList.length; i ++) {
                var val = $scope.urlRestBaseList[i];
                if(_.includes(val, url) || _.includes(url, val)) {
                    found = i;
                }
            }            
            
            console.log('found amrs.. ', $scope.urlRestBaseList[found]);
            return $scope.urlRestBaseList[found];
        }

    }
})();
