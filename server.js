const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/video') {
    // Spawn a child process to run libcamera-vid
    const libcamera = spawn('libcamera-vid', [
      '-t', '0', '--inline', '--listen', '-o', '-'
    ]);

    // Set the headers for an MJPEG stream
    res.writeHead(200, {
      'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary',
      'Connection': 'keep-alive',
      'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache'
    });

    // When data is received from the libcamera process, write it to the response
    libcamera.stdout.on('data', (data) => {
      res.write("--myboundary\nContent-Type: image/jpeg\n\n" + data.toString('binary') + "\n");
    });

    // If the libcamera process closes, end the HTTP response
    libcamera.on('close', (code) => {
      res.end();
    });

    // If there's an error with the libcamera process, log it
    libcamera.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  }
});

// Listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://192.168.1.101:3000');
});
