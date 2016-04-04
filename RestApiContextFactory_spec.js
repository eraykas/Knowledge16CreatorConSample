(function(ns){

    describe('RestApiContextFactory tests', function () {

        var response, streamWriter, isDebugging;

        beforeEach(function(){
            ns.gs = jasmine.createSpyObj('gs', ['debug', 'isDebugging']);

            isDebugging = false;

            ns.gs.isDebugging.and.callFake(function () {
                return isDebugging;
            });

            response = jasmine.createSpyObj('response', ['setStatus', 'setHeaders', 'setContentType', 'getStreamWriter']);

            streamWriter = jasmine.createSpyObj('streamWriter', ['writeString']);

            response.getStreamWriter.and.callFake(function () {
                return streamWriter;
            })
        });

        afterEach(function () {
            delete ns.gs;
        });

        it('should log request when debugging', function(){

            isDebugging = true;

            ns.RestApiContextFactory.create({
                headers:{
                    "foo":"bar",
                    "fizz":"buzz"
                },
                queryParams:{
                    "x":"10",
                    "y":"42"
                },
                queryString: "question"
            });


            expect(ns.gs.debug).toHaveBeenCalledWith('{"headers":{"foo":"bar","fizz":"buzz"},"parameters":{"x":"10","y":"42"},"query":"question"}');
        });

        it('should not log request when not debugging', function(){

            ns.RestApiContextFactory.create({});

            expect(ns.gs.debug).not.toHaveBeenCalled();
        });

        it('should set the status code in the response', function () {

            var context = ns.RestApiContextFactory.create({}, response);

            context.write({statusCode:200});

            expect(response.setStatus).toHaveBeenCalledWith(200);
        });

        it('should set the headers in the response', function () {

            var context = ns.RestApiContextFactory.create({}, response);

            var headers = {"foo":"bar", "fizz":"buzz"};

            context.write({headers: headers});

            expect(response.setHeaders).toHaveBeenCalledWith(headers);
        })

        it('should set the mime type in the response', function () {

           var context = ns.RestApiContextFactory.create({}, response);

            context.write({mimeType:"application/json"});

            expect(response.setContentType).toHaveBeenCalledWith("application/json");
        });

        it('should set the body of the response', function () {

            var context = ns.RestApiContextFactory.create({}, response);

            context.write({body:"[1,2,3,4]"});

            expect(streamWriter.writeString).toHaveBeenCalledWith("[1,2,3,4]");
        });

        it('should parse the body of the request', function () {

            var data = {x:10, y:20};

            var context = ns.RestApiContextFactory.create({body:{data:data}});

            expect(context.getRequestBody()).toEqual(data);
        });

        it('should return the query string', function () {

            var context = ns.RestApiContextFactory.create({queryString:"foo"});

            expect(context.getRequestQuery()).toEqual("foo");
        });

        it('should return the endpoint', function () {

            var context = ns.RestApiContextFactory.create({uri:"api/path/foo"});

            expect(context.getEndPoint()).toEqual("foo");
        });
    });

})(this);