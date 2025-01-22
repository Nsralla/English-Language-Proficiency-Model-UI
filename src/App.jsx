import LandingPage from "../components/LandingPage/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceRecorder from "../components/audi recording/VoiceRecorder";
import "./App.css";
import Select from "../components/LandingPage/Select";
import UploadAudio from "../components/upload/UploadAudio";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/select" element={<Select></Select>}/>
        <Route path="/record" element={<VoiceRecorder/>}/>
        <Route path="/upload" element={<UploadAudio/>}/>
      </Routes>
    </Router>
  );
}

export default App;
