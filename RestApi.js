(function (ns) {
    
    var context = ns.RestApiContextFactory.create(request, response);

    ns.ApiHandlerFactory.getHandler(context).handle(context);
})(this);