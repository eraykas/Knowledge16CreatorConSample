(function(ns){

    var json = new global.JSON();

    ns.EchoEndPoint = (new function(){

        this.handleRequest  = function (context) {

            var data = context.getRequestBody();

            context.write({statusCode:200, mimeType:"application/json", headers:{echo:"parrot"}, body:json.encode(data)});
        };

        return this;
    }());
})(this);