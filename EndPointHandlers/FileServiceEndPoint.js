(function (ns) {

	ns.FileServiceEndPoint = {
		handleRequest : function (context) {

			var path = context.getRequestQuery().split('?')[0];

			var record = ns.GlideFacade.getEncodedQuery("x_amiam_k16cce_fileservice", "path=" + path);

			switch(record.getRowCount()){
				case 0:
					context.write({statusCode:404, mimeType:"text/plain", body:"File Not Found"});
					break;
				case 1:
					record.next();

					var response = {statusCode:200};

					response.mimeType = record.getValue("mime_type");

					response.body = record.getValue("content");

					context.write(response);
					break;
				default:
					context.write({statusCode:400, mimeType:"text/plain", body:"Multiple files for " + path});
					break;
			}

		}
	};
})(this);