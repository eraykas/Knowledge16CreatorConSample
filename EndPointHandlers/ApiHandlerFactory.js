(function (ns) {

    ns.ApiHandlerFactory = {

        getHandler: function (context) {

            switch(context.getEndPoint()){
                case "echo":
                    return ns.EchoEndPoint;
                default:
                    return ns.NotFoundEndPoint;
            }
        }
    };
})(this);