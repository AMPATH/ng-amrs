/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  describe('$exceptionHandler', function() {
    var exceptionHandler;
    var logToServerInterceptor;
    var log;
    var es;
    // Load your module.
    beforeEach(module('app.logToServer'));
    beforeEach(inject(function($injector) {
        exceptionHandler = $injector.get('$exceptionHandler');
        logToServerInterceptor = $injector.get('LogToServerInterceptor');
        es = $injector.get('envService');
        log = $injector.get('$log');

      }
    ));
    it('should have $exceptionHandler factory', function() {
        expect(exceptionHandler).to.exist;
      }
    );
    it('should have logToServerInterceptor factory', function() {
      expect(logToServerInterceptor).to.exist;
    }
   );

    it('should have $log service', function() {
      expect(log).to.exist;
    });
  });
})();
