(function (ns) {

    var json = new global.JSON();

    function logRequest(request) {

        if (gs.isDebugging()) {

            var logValue = {
                headers:{},
                parameters:{}
            };

            for (var header in request.headers) {
                logValue.headers[header] = request.headers[header];
            }

            for (var parameter in request.queryParams) {
                logValue.parameters[parameter] = request.queryParams[parameter];
            }

            logValue.query = request.queryString;

            gs.debug(json.encode(logValue));
        }
    }

    ns.RestApiContextFactory = (new function(){

        this.create = function(sn_request, sn_response){

            logRequest(sn_request);

            return (new function () {

                this.write = function (response) {

                    sn_response.setStatus(response.statusCode);

                    sn_response.setHeaders(response.headers);

                    sn_response.setContentType(response.mimeType);

                    sn_response.getStreamWriter().writeString(response.body);
                };

                this.getRequestBody = function () {

                    return sn_request.body.data;
                };
                
                this.getRequestQuery = function () {
                    return sn_request.queryString;
                };

                this.getEndPoint = function () {
                    return sn_request.uri.split('/').pop();
                };

                return this;
            }());
        };

        return this;
    }());

})(this);
