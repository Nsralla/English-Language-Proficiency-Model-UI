import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./UploadAudio.css";
import AirplaneIcon from "@mui/icons-material/AirplanemodeActive";
import Confetti from "react-confetti"; // Confetti library

const UploadAudio = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const possibleScores = ["A2", "B1", "B2", "C"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ["audio/wav", "audio/mpeg"];
    const MAX_FILE_SIZE_MB = 10;

    if (file) {
      if (!allowedFormats.includes(file.type)) {
        setMessage("Invalid file format. Please upload WAV or MP3.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setMessage("File size exceeds the 10 MB limit.");
        return;
      }
      setAudioFile(file);
      setMessage("Audio file ready for upload!");
    } else {
      setMessage("Please select a valid audio file.");
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      setMessage("No audio file selected.");
      return;
    }

    try {
      setMessage("");
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", audioFile);

      const response = await fetch("http://127.0.0.1:8000/predict_audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data);
        setShowConfetti(true); // Show confetti
        setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
        setMessage("Upload successful!");
      } else {
        const errorText = data.error || "Upload failed. Please try again.";
        setMessage(errorText);
        setPrediction(null);
      }
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h1 className="upload-heading">Upload Your Audio for Scoring</h1>

        {/* Possible Scores Section */}
        <div className="score-display">
          <h2>Possible Scores</h2>
          <div className="score-cards">
            {possibleScores.map((score) => (
              <div
                key={score}
                className={`score-card ${
                  prediction?.predicted_label === score ? "highlighted" : ""
                }`}
              >
                {score}
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="upload-box">
          <label className="file-upload-label">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="file-input"
            />
            Choose File
          </label>
          <button
            onClick={handleUpload}
            className={`upload-button ${audioFile ? "enabled" : "disabled"}`}
            disabled={!audioFile || isLoading}
          >
            {isLoading ? (
              <div className="airplane-loader">
                <AirplaneIcon fontSize="large" />
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>

        {/* Status Message */}
        {message && <p className="upload-message">{message}</p>}

        {/* Confetti */}
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        {/* API Prediction Results */}
        {prediction && (
          <div className="result-panel">
            <div className="transcription-card">
              <div className="card-inner">
                {/* Front Side */}
                <div className="card-front">
                  <h3>Transcription</h3>
                </div>
                {/* Back Side */}
                <div className="card-back">
                  <p>{prediction.transcription}</p>
                </div>
              </div>
            </div>
          </div>

        )}
      </div>
    </>
  );
};

export default UploadAudio;
