// Michael Waetzman, mwae@bu.edu

var http = require('http'),
    fs = require('fs'),
    path = require('path');

fs.readFile('templates/index.html', function (err, html) {
    if (err) {
        throw err;
    }

    http.createServer(function(request, response) {
        if (request.url === '/hls/stream') {
            // Serve the HLS stream
            const streamFile = 'http://192.168.1.100:5001';    // Video IP
            http.get(streamFile, function(res) {
                var data = '';

                // A chunk of data has been received.
                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    response.writeHead(200, {'Content-Type': 'application/vnd.apple.mpegurl'});
                    response.end(data);
                });
            }).on('error', function(err) {
                console.log('Error loading HLS stream:', err);
                response.writeHead(500);
                response.end('Error loading HLS stream');
            });
        } else {
            // Serve the HTML page
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        }
    }).listen(3030);

    console.log('Server Running.');
});
