/* global expect */
/* global it */
/* global beforeEach */
/* global describe */
/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/

(function () {
	'use strict';
	describe('util-cached data Service unit tests', function () {
		beforeEach(function () {
			module('app.utils');
		});

		var utilService;

		beforeEach(inject(function ($injector) {
			utilService = $injector.get('UtilService');
		}));

		it('should return right null/undefined bool value if isNullOrUndefined ' +
			'is invoked with a value',
			function () {
				var numberVal = 0;
				var emptyString = '';
				var undefinedObject;
				var nullObject = null;

				expect(utilService.isNullOrUndefined(numberVal)).to.equal(false);
				expect(utilService.isNullOrUndefined(emptyString)).to.equal(true);
				expect(utilService.isNullOrUndefined(undefinedObject)).to.equal(true);
				expect(utilService.isNullOrUndefined(nullObject)).to.equal(true);
			});
		it('should return true when an object with none null object is used to' +
			'invoke hasAllMembersUndefinedOrNull, and false otherwise',
			function () {
				var objs = [
					{
						memberA: null,
						memberB: undefined,
						memberC: 0
					},
					{
						memberA: 0,
						memberB: undefined,
						memberC: 0
					},
					{
						memberA: 'some string',
						memberB: null,
						memberC: 0
					}
				];
				var membersToCheck = ['memberA','memberB'];
				
				expect(utilService.hasAllMembersUndefinedOrNull(objs[0], 
				membersToCheck)).to.equal(true);
				
				expect(utilService.hasAllMembersUndefinedOrNull(objs[1], 
				membersToCheck)).to.equal(false);
				
				expect(utilService.hasAllMembersUndefinedOrNull(objs[2],
				membersToCheck)).to.equal(false);

			});
	});
})();
