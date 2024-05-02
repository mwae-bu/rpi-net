# Credit to Xukyo at https://www.aranacorp.com/en/stream-video-from-a-raspberry-pi-to-a-web-browser/

#111!/usr/bin/env python
# -*- coding: utf-8 -*

#sudo apt-get install python3-flask
#pip3 install opencv-python

from flask import Flask, render_template, Response # type: ignore
import cv2 # type: ignore

app = Flask(__name__)
#app.config["CACHE_TYPE"] = "null"

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

def gen():
    """Video streaming generator function."""
    vs = cv2.VideoCapture(0)
    while True:
        ret, frame = vs.read()
        if not ret:
            break

        # Encode frame as JPEG
        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()

        # Yield the frame
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    vs.release()

@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == '__main__': 
    app.run(host='0.0.0.0', port =5000, debug=True, threaded=True)
