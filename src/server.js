const http = require("http");
const router = require("./router").router;

const handleRequest = function (request, response) {
    const url = request.url;
    console.log(`got request: ${url}`);

    router(url, response)
};

this.server = http.createServer(handleRequest);

exports.listen = function () {
    this.server.listen.apply(this.server, arguments)
};

exports.close = function (callback) {
    this.server.close(callback)
};
