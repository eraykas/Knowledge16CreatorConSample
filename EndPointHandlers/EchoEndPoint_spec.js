(function(ns){

    describe('EchoEndPoint tests', function () {

        var context, body;

        beforeEach(function () {
            context = jasmine.createSpyObj('context', ['write', 'getRequestBody']);
            
            context.getRequestBody.and.callFake(function () {
                return body;
            })
        });

        it('should set the status code to 200', function () {

            EchoEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].statusCode).toEqual(200);
        });

        it('should set the mime type to application/json', function () {

            EchoEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].mimeType).toEqual("application/json");
        });

        it('should set the echo header', function () {

            EchoEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].headers).toEqual({echo:"parrot"});
        });

        it('should set the body', function () {

            body = {foo:"bar"};

            EchoEndPoint.handleRequest(context);

            expect(context.write.calls.argsFor(0)[0].body).toEqual(JSON.stringify(body));
        })
    })

})(this)