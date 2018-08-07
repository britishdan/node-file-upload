const server = require("../src/server");
const fs = require('fs');

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
        const url = `http://localhost:${port}`;
        it('should return 200', function (done) {
            http.get(url, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should return a link to start', function (done) {
            http.get(url, function (response) {
                let data = '';
                response.on('data', function (chunk) {
                    data += chunk
                });
                response.on('end', function () {
                    expect(data).to.include('<a href=/start>start here</a>');
                    done();
                });
            });
        });
    });

    describe('/start', function () {
        const url = `http://localhost:${port}/start`;
        it('should return 200', function (done) {
            http.get(url, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should return a file upload form', function (done) {
            http.get(url, function (response) {
                let data = '';
                response.on('data', function (chunk) {
                    data += chunk
                });
                response.on('end', function () {
                    expect(data).to.include('<form action="fileupload" method="post" enctype="multipart/form-data">');
                    done();
                });
            });
        });
    });

    describe('/fileupload', function () {
        const postOptions = {
            method: 'POST',
            host: 'localhost',
            port: port,
            path: `/fileupload`,
            headers: {
                'Content-Type': 'multipart/form-data;',
                'Content-Length': 1
            }
        };

        it('should return 200', function (done) {
            http.request(postOptions, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            }).end();
        });

        it('should return failure message and back link', function (done) {
            http.request(postOptions, function (response) {
                let data = '';
                response.on('data', function (chunk) {
                    data += chunk
                });
                response.on('end', function () {
                    expect(data).to.include('File not uploaded');
                    expect(data).to.include('<a href=/>back</a>');
                    done();
                });
            }).end();
        });

        it('should return success message and save the file', function (done) {
            if (!fs.existsSync('/tmp/node-file-upload')) {
                fs.mkdirSync('/tmp/node-file-upload');
            }
            if (fs.existsSync('/tmp/node-file-upload/test-file.txt')) {
                fs.unlinkSync('/tmp/node-file-upload/test-file.txt');
            }

            const formData = require('form-data');
            const form = new formData();
            form.append('filetoupload', fs.createReadStream('/Users/danielc/src/node/node-file-upload/test/resources/test-file.txt'));

            const postOptionsWithFile = postOptions;
            postOptionsWithFile.headers = form.getHeaders();
            const request = http.request(postOptionsWithFile);
            form.pipe(request);

            request.on('response', function (response) {
                expect(fs.existsSync('/tmp/node-file-upload/test-file.txt')).to.be.true;

                let data = '';
                response.on('data', function (chunk) {
                    data += chunk
                });
                response.on('end', function () {
                    expect(data).to.include('File uploaded');
                    expect(data).to.include('<a href=/>back</a>');
                    done();
                });
            });
        });
    });
});
