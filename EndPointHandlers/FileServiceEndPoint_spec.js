(function (ns) {

	function createGlideResult(results){

		var index = -1;

		var record = jasmine.createSpyObj('record', ['getRowCount', 'next', 'getValue']);

		record.getRowCount.and.callFake(function () {
			return results.length;
		});

		record.getValue.and.callFake(function (key) {
			return results[index][key];
		});

		record.next.and.callFake(function () {
			index++;
			return index < results.length;
		});

		return record;
	}

	describe('FileServiceEndPoint tests', function () {
		
		var context, queryResult, record;
		
		beforeEach(function () {
			context = jasmine.createSpyObj('context', ['getEndPoint', 'write']);

			spyOn(ns.GlideFacade, 'getEncodedQuery').and.callFake(function(table, query){

				return queryResult[table][query];
			});

		});

		it('should query app table for requested file', function () {

			context.getEndPoint.and.callFake(function(){
				return "foo";
			});

			var values = {
				mime_type:"text/html",
				content:"<html></html>"
			};

			queryResult = {
				x_amiam_k16cce_fileservice:{
					"path=foo" : createGlideResult([values])
				}
			};

			ns.FileServiceEndPoint.handleRequest(context);

			expect(context.write).toHaveBeenCalledWith({ statusCode: 200, mimeType: 'text/html', body: '<html></html>' });
		});

		it('should 404 for unknown request', function () {

			context.getEndPoint.and.callFake(function(){
				return "foo";
			});

			queryResult = {
				x_amiam_k16cce_fileservice:{
					"path=foo" : createGlideResult([])
				}
			};

			ns.FileServiceEndPoint.handleRequest(context);

			expect(context.write).toHaveBeenCalledWith({statusCode:404, mimeType:"text/plain", body:"File Not Found"});
		});

		it('should 400 for multiple results', function () {

			context.getEndPoint.and.callFake(function(){
				return "foo";
			});

			queryResult = {
				x_amiam_k16cce_fileservice:{
					"path=foo" : createGlideResult([{}, {}])
				}
			};

			ns.FileServiceEndPoint.handleRequest(context);

			expect(context.write).toHaveBeenCalledWith({statusCode:400, mimeType:"text/plain", body:"Multiple files for foo"});
		});
	});

})(this);