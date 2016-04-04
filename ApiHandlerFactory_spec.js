(function (ns) {
    
    describe('ApiHandlerFactory test', function () {
    
        it('should create echo endpoint from context', function () {
            
            var handler = ns.ApiHandlerFactory.getHandler({getEndPoint:function () {
                return "echo";
            }});

            expect(handler).toBe(ns.EchoEndPoint);
        });
        
        it('should return not found endpoint when endpoint not found', function () {

            var handler = ns.ApiHandlerFactory.getHandler({getEndPoint:function () {
                return "foo";
            }});

            expect(handler).toBe(ns.NotFoundEndPoint);
        })
        
    });
    
})(this);