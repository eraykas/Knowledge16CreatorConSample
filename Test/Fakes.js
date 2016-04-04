(function(global) {

    global.JSON = function () {

        this.encode = function (object) {
            return JSON.stringify(object);
        };

        this.decode = function (jsonString) {
            return JSON.parse(jsonString);
        };
    };

})(this.global || (this.global = {}));