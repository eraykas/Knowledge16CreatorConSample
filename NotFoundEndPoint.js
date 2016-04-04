(function (ns) {
 
    var json = new global.JSON();
    
    ns.NotFoundEndPoint = (new function () {
        this.handleRequest = function (context) {
            context.write({statusCode:404, mimeType:"application/json", body:json.encode({message:"No handler for endpoint: " + context.getEndPoint()})});
        };
        
        return this;
    }());
})(this);