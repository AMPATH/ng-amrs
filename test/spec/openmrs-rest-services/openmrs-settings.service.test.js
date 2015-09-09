/* global inject */
/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Settings Service Unit Tests', function () {
    beforeEach(function () {
      module('app.openmrsRestServices');
    });
    
    
    var settingsService;
    var cookieStoreService;
    
    beforeEach(inject(function ($injector) {
      settingsService = $injector.get('OpenmrsSettings');
      cookieStoreService = $injector.get('$cookies');
    }));
    
    afterEach(function(){
      cookieStoreService.remove('restUrlBase');
    });
    
    it('should have OpenmrsSettings service defined', function () {
      expect(settingsService).to.exist;
      expect(cookieStoreService).to.exist;
    });
    
    it('should change the current  RestUrlBase when setCurrentRestUrlBase is invoked with a url', function () {
      var urlString = 'test1.url.com';
      settingsService.setCurrentRestUrlBase(urlString);
      expect(settingsService.getCurrentRestUrlBase()).to.equal(urlString);
    });
    
    it('should change the current  in-cookie RestUrlBase when setCurrentRestUrlBase is invoked with a url', function () {
      var urlString = 'test1.url.com';
      settingsService.setCurrentRestUrlBase(urlString);
      var storedUrl = cookieStoreService.get('restUrlBase');
      expect(storedUrl).to.equal(urlString);
      
     //second trial
      expect(storedUrl).to.equal(urlString);
      urlString = 'test2.url.com';
      settingsService.setCurrentRestUrlBase(urlString);
      storedUrl = cookieStoreService.get('restUrlBase');
      expect(storedUrl).to.equal(urlString);
      
    });
    
    it('should set current RestUrlBase with in-cookie cuurent RestUrlBase when reInitialize is invoked', function () {
      var urlString = 'stored.url.com';
      settingsService.setCurrentRestUrlBase(urlString); // set stored url base
      
      settingsService.reInitialize();
      expect(settingsService.getCurrentRestUrlBase()).to.equal(urlString);
    });
    
    it('should add a url string to the list of urls when addUrlToList is called with a url', function () {
      var urlString = 'test1.url.com';
      var urlList =  settingsService.getUrlBaseList();
      
      settingsService.addUrlToList(urlString);
      expect(urlList).to.include(urlString);
    });
    
    it('should return true if there is an in-coockie url, and false otherwise, when hasCoockiePersistedCurrentUrlBase is invoked', function () {
      //case has value
      settingsService.setCurrentRestUrlBase('casetrue.url.com');
      expect(settingsService.hasCoockiePersistedCurrentUrlBase()).to.equal(true);
      
      //case has NO value
      cookieStoreService.remove('restUrlBase');
      expect(settingsService.hasCoockiePersistedCurrentUrlBase()).to.equal(false);
      
    });
    
    
    
  });
})();