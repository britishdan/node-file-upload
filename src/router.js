const formidable = require('formidable');
const fs = require('fs');

exports.router = function (url, request, response) {
    const writeStatusHeader = function (response, statusCode) {
        response.writeHead(statusCode, {'Content-Type': 'text/html'});
    };

    const writeOKHeader = function (response) {
        writeStatusHeader(response, 200);
    };

    const startHtml = function (response) {
        response.write('<html><head></head><body>');
    };

    const endHtml = function (response) {
        response.write('</body></html>');
        response.end();
    };

    if (url === '/') {
        writeOKHeader(response);
        startHtml(response);
        response.write('<a href=/start>start here</a>');
        endHtml(response)
    }
    else if(url === '/start') {
        writeOKHeader(response);
        startHtml(response);
        response.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        response.write('<input type="file" name="filetoupload"><br>');
        response.write('<input type="submit">');
        response.write('</form>');
        endHtml(response);
    }
    else if(url === '/fileupload') {
        const form = new formidable.IncomingForm();
        form.parse(request, function (parseError, fields, files) {
            if (files.file) {
                const oldpath = files.file.path;
                const newpath = `/tmp/node-file-upload/${files.file.name}`;
                fs.rename(oldpath, newpath, function (renameError) {
                    if (renameError) throw renameError;
                    writeOKHeader(response);
                    startHtml(response);
                    response.write('File uploaded<br />');
                    response.write('<a href=/>back</a>');
                    endHtml(response)
                });
            }
            else {
                console.log(parseError);
                writeOKHeader(response);
                startHtml(response);
                response.write('File not uploaded<br />');
                response.write('<a href=/>back</a>');
                endHtml(response)
            }
        });
    }
    else {
        writeStatusHeader(response, 404);
        startHtml(response);
        response.write('404 Not found');
        endHtml(response)
    }
};
