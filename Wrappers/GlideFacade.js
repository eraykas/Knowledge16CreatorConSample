(function (ns) {

	ns.GlideFacade = {
		getEncodedQuery: function (table, query) {

			var result = new GlideRecordSecure(table);

			result.addEncodedQuery(query);

			result.query();

			return result;
		}
	};
})(this);