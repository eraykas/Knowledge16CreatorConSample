(function (ns) {
        
    var context = ns.ProcessorContextFactory.create(g_request, g_response);

    ns.ApiHandlerFactory.getHandler(context).handle(context);
})(this);