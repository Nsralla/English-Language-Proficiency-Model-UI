import { useState, useEffect, useRef } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import Navbar from '../Navbar/Navbar';
import './VoiceRecorder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';

const AudioVisualizerComponent = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // --- NEW states for file upload & prediction ---
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setAudioChunks([]);
      setAudioUrl(null);
      startTimer();

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };
    }
  };

  const deleteRecording = () => {
    setAudioChunks([]);
    setAudioUrl(null);
    stopTimer();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --------------------
  // FILE ATTACH & UPLOAD LOGIC
  // --------------------

  // Open the file chooser
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When user chooses a file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setPrediction(null); // clear old prediction
    }
  };

  // Send the file to the backend
  const handleFileUpload = async () => {
    try {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("file", selectedFile);

      // Replace this URL with your FastAPI endpoint
      const response = await fetch("http://127.0.0.1:8000/predict_audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // data might have { predicted_label, transcription, etc. }
        setPrediction(data);
      } else {
        console.error("Upload failed:", data);
        setPrediction(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setPrediction(null);
    }
  };

  return (
    <>
      <Navbar />

      {/* Just an example animation when you're NOT recording */}
      {!isRecording && audioUrl && (
        <dotlottie-player
          src="https://lottie.host/112a05df-88a5-438c-9d0f-83d96357b9a4/nCkY9nP9jH.lottie"
          loop
          autoplay
          style={{
            width: '16.75rem',
            height: '18.75rem',
            margin: 'auto',
            display: 'block'
          }}
        />
      )}

      <div className="app-container">
        {isRecording && (
          <div className="timer">
            <p>Recording Time: {formatTime(timer)}</p>
          </div>
        )}

        {isRecording && mediaRecorder && (
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={500}
            height={100}
            barWidth={2}
            gap={1}
            barColor="#f76565"
            className="live-visualizer"
          />
        )}

        <div className="controls-container">
          <button className="control-button" onClick={toggleRecording}>
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
          <button
            className="control-button"
            onClick={pauseRecording}
            disabled={!isRecording || isPaused}
          >
            <FontAwesomeIcon icon={faPause} />
          </button>
          <button
            className="control-button"
            onClick={resumeRecording}
            disabled={!isPaused}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button
            className="control-button delete-button"
            onClick={deleteRecording}
            disabled={!audioUrl}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>

        {audioUrl && (
          <div className="recorded-audio-container">
            <h3 className="audio-header">Recorded Audio</h3>
            <audio className="audio-player" ref={audioRef} controls src={audioUrl} />
          </div>
        )}
      </div>

      {/* --------------------
          FILE ATTACH & SUBMIT
      -------------------- */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={handleAttachClick}>Attach file</button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* We only enable “Submit” if a file was chosen */}
        <button onClick={handleFileUpload} disabled={!selectedFile} style={{ marginLeft: '10px' }}>
          Submit
        </button>
      </div>

      {/* Display the prediction (if available) */}
      {prediction && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Result</h3>
          <p>Predicted Label: {prediction.predicted_label}</p>
          {/* If you also returned “transcription” or “score”, display them here */}
          {prediction.transcription && <p>Transcription: {prediction.transcription}</p>}
        </div>
      )}
    </>
  );
};

export default AudioVisualizerComponent;
