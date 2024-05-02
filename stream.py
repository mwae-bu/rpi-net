# Michael Waetzman, mwae@bu.edu

# References
    # Flask Tutorial: https://www.youtube.com/watch?v=qs3KhLDUBmk

import io
import picamera
from flask import Flask, Response

port = 5000

# Make the flask app
app = flask(__name__)

def generate_frames():
    with picamera.PiCamera as camera:
        camera.resolution = (640, 480)  #! Pi Cam v2.1 supports 720p60 and 640x480p90
        camera.framerate = 24
        stream = io.BytesIO()

        # Process frames and stream to app via JPEG stream
        for _ in camera.capture_continuous(stream, 'jpeg', use_video_port=True):
            stream.seek(0)  # wait to process
            yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + stream.read() + b'r\\n'
            stream.seek(0)
            stream.truncate()

@app.route('/video_feed')
def video_feed():
     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, threaded=True)
