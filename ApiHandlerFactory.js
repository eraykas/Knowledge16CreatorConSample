(function (ns) {

    ns.ApiHandlerFactory = (new function () {

        this.getHandler = function (context) {

            switch(context.getEndPoint()){
                case "echo":
                    return ns.EchoEndPoint;
                default:
                    return ns.NotFoundEndPoint;
            }
        };

        return this;
    }());
})(this);