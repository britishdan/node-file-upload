exports.router = function (url, response) {
    if (url === '/') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("<html><head></head><body>");
        response.write("<a href=/start>start here</a>");
        response.write("</body></html>");
        response.end();
    }
    else if(url === '/start') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end();
    }
    else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
};
