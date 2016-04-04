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

    ns.ProcessorContextFactory = (new function(){

        this.create = function(sn_request, sn_response, sn_processor){

            logRequest(sn_request);

            return (new function(){

                this.write = function (response) {

                    sn_response.setStatus(response.statusCode);

                    for (var key in response.headers) {
                        sn_response.setHeader(key, response.headers[key]);
                    }

                    sn_processor.writeOutput(response.mimeType, response.body);
                };
                
                this.getRequestBody = function () {
                    return json.decode(sn_request.getParameter('_data'));
                };

                this.getRequestQuery = function () {
                    var queryString = sn_request.getQueryString();

                    var splitIdx = queryString.indexOf('?');

                    if (splitIdx < 0) {
                        return "";
                    } else {
                        return queryString.substring(splitIdx + 1);
                    }
                };

                this.getEndPoint = function () {
                    var queryString = sn_request.getQueryString();

                    var splitIdx = queryString.indexOf('?');

                    if (splitIdx < 0) {
                        return queryString;
                    } else {
                        return queryString.substring(0, splitIdx);
                    }
                };

                return this;
            }());
        };

        return this;
    }());

})(this);
