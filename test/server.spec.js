const server = require("../src/server");

const port = 8888;
describe('server', function () {
    before(function () {
        server.listen(port);
    });

    after(function () {
        server.close();
    });

    const assert = require("assert");
    const expect = require("chai").expect;
    const http = require("http");

    describe('/unknown', function () {
        it('should return 404', function (done) {
            http.get(`http://localhost:${port}/unknown`, function (response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
    });

    describe('/', function () {
        it('should return 200', function (done) {
            http.get(`http://localhost:${port}`, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should return a link to start', function (done) {
            http.get('http://localhost:' + port, function (response) {
                let data = '';
                response.on('data', function (chunk) {
                    data += chunk
                });
                response.on('end', function () {
                    expect(data).to.include('<a href=/start>start here</a>');
                });
            });
            done();
        });
    });

    describe('/start', function () {
        it('should return 200', function (done) {
            http.get(`http://localhost:${port}/start`, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        // it('should return a file upload form', function (done) {
        //
        //     done();
        // });
    });
});

