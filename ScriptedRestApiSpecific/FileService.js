(function (ns) {

	var context = ns.RestApiContextFactory.create(request, response);

	ns.FileServiceEndPoint.handleRequest(context);
})(this);