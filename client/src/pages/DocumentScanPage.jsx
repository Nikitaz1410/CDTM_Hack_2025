// src/pages/DocumentScanPage.jsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const DocumentScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [uploadError, setUploadError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // API URL from environment
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please make sure camera permissions are granted and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send image to Flask server
  const sendImageToServer = async () => {
    if (!capturedImage) return;

    setUploadStatus('uploading');
    setUploadError('');

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('image', blob, 'scanned-document.jpg');
      formData.append('timestamp', new Date().toISOString());

      // Add additional metadata if needed
      formData.append('userId', 'user123'); // You can get this from your auth system
      formData.append('documentType', 'medical');

      // Send POST request to Flask server
      const uploadResponse = await fetch(`${API_URL}/api/upload-document`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const result = await uploadResponse.json();
      console.log('Upload successful:', result);
      setUploadStatus('success');

      // Reset after 3 seconds
      setTimeout(() => {
        setCapturedImage(null);
        setUploadStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message);
      setUploadStatus('error');
    }
  };

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-4">Scan Documents</h2>

      {/* Camera/Upload Options */}
      {!scanning && !capturedImage && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={startCamera}
              className="flex flex-col items-center justify-center h-32 bg-white rounded-lg shadow-sm p-4"
            >
              <Camera size={32} className="text-blue-500 mb-2" />
              <span className="text-center">Scan with Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center h-32 bg-white rounded-lg shadow-sm p-4"
            >
              <Upload size={32} className="text-blue-500 mb-2" />
              <span className="text-center">Upload Document</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {scanning && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover rounded-lg bg-black"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button
              onClick={captureImage}
              className="bg-white text-black p-4 rounded-full"
            >
              <Camera size={24} />
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-500 text-white p-4 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && !scanning && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured document"
              className="w-full h-96 object-contain rounded-lg border border-gray-200"
            />
          </div>

          {/* Upload Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={sendImageToServer}
              disabled={uploadStatus === 'uploading'}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Upload Document
                </>
              )}
            </button>

            <button
              onClick={() => setCapturedImage(null)}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg"
            >
              <X className="mr-2 inline" size={20} />
              Retake
            </button>
          </div>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="flex items-center justify-center text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="mr-2" size={20} />
              Document uploaded successfully!
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="mr-2" size={20} />
              Error: {uploadError}
            </div>
          )}
        </div>
      )}

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Recent Documents */}
      <h3 className="text-lg font-semibold mb-3 mt-8">Recent Documents</h3>
      <div className="space-y-2">
        {[
          { id: 1, name: 'Blood Test Results', date: 'May 5, 2025' },
          { id: 2, name: 'Prescription', date: 'April 28, 2025' },
          { id: 3, name: 'Medical Certificate', date: 'April 15, 2025' }
        ].map(doc => (
          <div key={doc.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{doc.name}</h4>
              <p className="text-xs text-gray-500">{doc.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentScanPage;