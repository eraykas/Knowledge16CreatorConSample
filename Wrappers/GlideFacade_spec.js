(function (ns) {
	
	describe('GlideFacade test', function () {

		var result;

		beforeEach(function () {
			result = jasmine.createSpyObj('query', ['addEncodedQuery', 'query']);

			ns.GlideRecordSecure = function (table) {
				return result;
			};
		});

		afterEach(function () {
			delete ns.GlideRecordSecure;
		});
		
		it('should return query result for encoded query', function () {
			var query = ns.GlideFacade.getEncodedQuery('table', 'query');

			expect(query).toBe(result);
			expect(result.addEncodedQuery).toHaveBeenCalledWith('query');
			expect(result.addEncodedQuery).toHaveBeenCalled();
		})
	});
	
})(this);