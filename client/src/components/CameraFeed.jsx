import React, { useEffect, useRef } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const videoStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    transform: 'scaleX(-1)', // Mirror effect
  };

  return <video ref={videoRef} style={videoStyles} className="camera-feed" autoPlay playsInline muted />;
};

export default CameraFeed;
