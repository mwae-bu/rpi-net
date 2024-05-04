const http = require('http');
const fs = require('fs');
const path = require('path');

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
  }

  if (req.url === '/video') {
    // Set the headers for an MJPEG stream
    res.writeHead(200, {
      'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary',
      'Connection': 'keep-alive',
      'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache'
    });

    const { spawn } = require('child_process');
    const libcamera = spawn('libcamera-vid', [
      '-t', '0', '--inline', '--listen', '-o', 'tcp://0.0.0.0:8888'
    ]);

    libcamera.stdout.on('data', (data) => {
      res.write(data);
    });

    libcamera.on('close', (code) => {
      res.end();
    });

    libcamera.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  }
});

// Listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://192.168.1.101:3000');
});
