/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
  'use strict';
  describe('WebSocket Service unit tests', function () {
    beforeEach(function () {
      module('app.utils');
      module('app.etlRestServices');
    });

    var webSocketService;
    var etlRestServicesSettings;

    beforeEach(inject(function ($injector) {
      webSocketService = $injector.get('webSocketService');
      etlRestServicesSettings = $injector.get('EtlRestServicesSettings');
    }));

    it('should have webSocketService injected for this to work', function () {
      expect(webSocketService).to.exist;
    });

    it('should have etlRestServicesSettings injected', function () {
      expect(etlRestServicesSettings).to.exist;
    });

    it('should have the following  method to exist and defined',
      function () {
        expect(webSocketService.getWebSocketConnection).to.exist;
        expect(webSocketService.getWebSocketConnection).to.be.an('function');
        expect(webSocketService.setWebSocketConnection).to.exist;
        expect(webSocketService.setWebSocketConnection).to.be.an('function');

      });

  });
})();
