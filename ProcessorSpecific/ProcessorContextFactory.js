(function (ns) {

    var json = new global.JSON();

    function createPropertyObj(names, getter) {
        var propertyObj = {};

        for (var index = 0; index < names.length; index++) {
            propertyObj[names[index]] = getter(names[index]);
        }

        return propertyObj;
    }

    function logRequest(request) {

        if (gs.isDebugging()) {

            var logValue = {};

            logValue.headers = createPropertyObj(request.getHeaderNames(), function (name) {
                return request.getHeader(name);
            });

            logValue.parameters = createPropertyObj(request.getParameterNames(), function (name) {
                return request.getParameter(name);
            });

            logValue.query = request.getQueryString();

            gs.debug(json.encode(logValue));
        }
    }

    ns.ProcessorContextFactory = {

        create : function(sn_request, sn_response, sn_processor){

            logRequest(sn_request);

            return {

                write:function (response) {

                    sn_response.setStatus(response.statusCode);

                    for (var key in response.headers) {
                        sn_response.setHeader(key, response.headers[key]);
                    }

                    sn_processor.writeOutput(response.mimeType, response.body);
                },
                
                getRequestBody: function () {
                    return sn_request.getParameter('_data');
                },

                getRequestQuery : function () {
                    return sn_request.getQueryString();
                },

                getEndPoint: function () {
                    return sn_request.getQueryString().split('?')[0];
                }
            };
        }
    };

})(this);