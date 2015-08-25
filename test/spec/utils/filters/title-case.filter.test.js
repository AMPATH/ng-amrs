(function() {
  'use strict'
  describe('filter: titlecase', function() {
    var titlecase;
    beforeEach(function() {
      module('app.utils');
      inject(function($injector){
        titlecase = $injector.get('$filter')('titlecase');
      });
    });
    
    it('Should convert text to title case', function() {
      expect(titlecase('does it work?')).to.equal('Does It Work?');
      expect(titlecase('MHAWILA A. MHAWILA')).to.equal('Mhawila A. Mhawila');
      expect(titlecase('')).to.equal('');
      expect(titlecase()).to.equal('');
      expect(titlecase(10)).to.equal('10');
      expect(titlecase(true)).to.equal('True');
      expect(titlecase(false)).to.equal('False');
      expect(titlecase(null)).to.equal('');
    });
  });
})();
