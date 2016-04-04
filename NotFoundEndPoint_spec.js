(function (ns) {

    describe('NotFoundEndPoint test', function () {

        var context, endpoint;

        beforeEach(function () {
            context = jasmine.createSpyObj('context', ['write', 'getEndPoint']);

            context.getEndPoint.and.callFake(function () {
                return endpoint;
            })
        });

        it('should return a 404 status', function () {

            ns.NotFoundEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].statusCode).toEqual(404);
        });

        it('should return a application/json mime type', function () {

            ns.NotFoundEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].mimeType).toEqual("application/json");
        });

        it('should return a message with the request endpoint', function () {

            endpoint = "foo";

            ns.NotFoundEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].body).toEqual(JSON.stringify({message:"No handler for endpoint: foo"}));
        });
    });

})(this);