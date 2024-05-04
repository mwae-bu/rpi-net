var http = require('http');
var fs = require('fs');
var path = require('path');
const { StreamCamera, Codec } = require('pi-camera-connect');

// Create a new instance of the StreamCamera class with VP8 codec
const streamCamera = new StreamCamera({
  codec: Codec.VP8
});

const videoStream = streamCamera.createStream();
const videoOutputPath = path.join(__dirname, 'video-stream.webm');
const videoOutputStream = fs.createWriteStream(videoOutputPath);

// Start capture
streamCamera.startCapture().catch(error => console.error('Error capturing', error));

const PORT = 8080;

fs.readFile('./bonk.html', function (err, html) {
  if (err) throw err;

  http.createServer(function(request, response) {
    if (request.url === '/video-stream.webm') {
      response.writeHead(200, {
        'Content-Type': 'video/webm',
        'Connection': 'keep-alive',
        'Accept-Ranges': 'bytes'
      });

      videoStream.pipe(response);
    } else {

      //! Serve the HTML page
      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(html);
      response.end();
    }
  }).listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

// Stop capturing video after a certain time --> 5 min arb
setTimeout(() => {
  streamCamera.stopCapture().catch(error => console.error('Error stopping capture', error));
}, 300000); // 300000 ms = 5 minutes
