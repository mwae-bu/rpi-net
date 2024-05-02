# Michael Waetzman, mwae@bu.edu

# References
    # Flask Tutorial: https://www.youtube.com/watch?v=qs3KhLDUBmk
    # Picamera2: https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf

import io
from picamera2 import Picamera2, Preview, JpegEncoder
from flask import Flask, Response

port = 5000

# Make the flask app
app = Flask(__name__)

# Initialize Picamera2
picam2 = Picamera2()
preview_config = picam2.create_preview_configuration(main={"size": (640, 480)})
picam2.configure(preview_config)
picam2.start()

def generate_frames():
    encoder = JpegEncoder(picam2.video_configuration)
    picam2.start_recording(encoder, 'jpeg')    # record using mjpeg rather than raw

    while True:
        # Get one image => JPEG
        frame = encoder.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)

