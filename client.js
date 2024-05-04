document.addEventListener('DOMContentLoaded', function() {
    // The video element on your page that will display the stream
    var videoElement = document.getElementById('videoStream');
  
    var videoStreamUrl = 'http://192.168.1.101:8888';
  
    videoElement.src = videoStreamUrl;
  
    videoElement.crossOrigin = 'anonymous';

    // Play the video stream
    videoElement.play()
      .catch(function(error) {
        console.error('Error attempting to play video stream:', error);
      });
  });
  