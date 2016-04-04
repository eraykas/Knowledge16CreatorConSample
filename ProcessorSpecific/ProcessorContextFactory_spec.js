(function(ns){

    describe('ProcessorContextFactory tests', function () {

        var request, response, processor, isDebugging;

        beforeEach(function(){

            ns.gs = jasmine.createSpyObj('gs', ['debug', 'isDebugging']);

            isDebugging = false;

            ns.gs.isDebugging.and.callFake(function () {
                return isDebugging;
            });

            request = jasmine.createSpyObj('request', ['getHeaderNames', 'getHeader', 'getParameterNames', 'getParameter', 'getQueryString'])

            response = jasmine.createSpyObj('response', ['setStatus', 'setHeader']);

            processor = jasmine.createSpyObj('processor', ['writeOutput']);
        });

        afterEach(function () {
            delete ns.gs;
        });

        function populateRequest(headers, parameters, query){

            request.getHeaderNames.and.callFake(function(){
                return Object.keys(headers || {});
            });

            request.getHeader.and.callFake(function(key){
                return (headers || {})[key];
            });

            request.getParameterNames.and.callFake(function(){
                return Object.keys(parameters || {});
            });

            request.getParameter.and.callFake(function(key){
                return (parameters || {})[key];
            });

            request.getQueryString.and.callFake(function(){
                return query;
            });
        }

        it('should log request when debugging', function(){

            var headers = {
                "foo":"bar",
                "fizz":"buzz"
            };

            var parameters = {
                "x":"10",
                "y":"42"  
            };

            var query = "question";

            isDebugging = true;

            populateRequest(headers, parameters, query);

            ns.ProcessorContextFactory.create(request, response, processor);

            expect(ns.gs.debug).toHaveBeenCalledWith('{"headers":{"foo":"bar","fizz":"buzz"},"parameters":{"x":"10","y":"42"},"query":"question"}');
        });

        it('should not log request when not debugging', function(){

            ns.ProcessorContextFactory.create(request, response, processor);

            expect(ns.gs.debug).not.toHaveBeenCalled();
        });

        it('should set the status code in the response', function () {

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            context.write({statusCode:200});
            
            expect(response.setStatus).toHaveBeenCalledWith(200);
        });

        it('should set the headers in the response', function () {

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            context.write({headers:{"foo":"bar", "fizz":"buzz"}});

            expect(response.setHeader).toHaveBeenCalledTimes(2);
            expect(response.setHeader.calls.argsFor(0)).toEqual(['foo', 'bar']);
            expect(response.setHeader.calls.argsFor(1)).toEqual(['fizz', 'buzz']);
        })

        it('should set the mime type in the response', function () {

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            context.write({mimeType:"application/json"});

            expect(processor.writeOutput.calls.argsFor(0)[0]).toEqual("application/json");
        });

        it('should set the body of the response', function () {

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            context.write({body:"[1,2,3,4]"});

            expect(processor.writeOutput.calls.argsFor(0)[1]).toEqual("[1,2,3,4]");
        });

        it('should parse the body of the request', function () {

            var data = {x:10, y:20};

            var parameters = {
                "_data" : data
            };

            populateRequest(null, parameters);

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            expect(context.getRequestBody()).toEqual(data);
        });

        it('should return the query string as endpoint', function () {

            populateRequest(null, null, "foo");

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            expect(context.getEndPoint()).toEqual("foo");
        });

        it('should split query string on ? return first half as endpoint', function () {

            populateRequest(null, null, "foo?bar");

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            expect(context.getEndPoint()).toEqual("foo");
        });

        it('should return full query of request', function () {

            populateRequest(null, null, "foo?bar");

            var context = ns.ProcessorContextFactory.create(request, response, processor);

            expect(context.getRequestQuery()).toEqual("foo?bar");
        });
    });

})(this);