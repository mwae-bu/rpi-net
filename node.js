// Michael Waetzman, mwae@bu.edu

var http = require('http'),
    fs = require('fs'),
    path = require('path');

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }

    http.createServer(function(request, response) {
        if (request.url === '/hls/stream') {
            // Serve the HLS stream
            const streamFile = 'http://192.168.1.101:3333';
            fs.readFile(streamFile, (err, data) => {
                if (err) {
                    response.writeHead(500);
                    response.end('Error loading HLS stream');
                    return;
                }

                response.writeHead(200, {'Content-Type': 'application/vnd.apple.mpegurl'});
                response.end(data);
            });
        } else {
            // Serve the HTML page
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        }
    }).listen(8080);

    console.log('Server Running.');
});
