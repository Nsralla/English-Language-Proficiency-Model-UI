import './Select.css';
import Navbar from '../Navbar/Navbar.jsx';
import sampleImage from '../../public/mic.jpg'; // Replace with the actual path to your image
import sampleImage2 from "../../public/cloud-drawer.jpg";
import { useNavigate } from 'react-router-dom';
const Select = () => {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <section className="options-box">
        <div onClick={()=>{navigate("/record")}} className="image-container">
          <img src={sampleImage} alt="Record Your Own" />
          <div className="hover-text">Start Recording</div>
        </div>
        <div onClick={()=>{navigate("/upload")}} className="image-container">
            <img src={sampleImage2} alt="Upload Your Own" />
          <div className="hover-text">Upload Recording</div>
        </div>
      </section>
    </>
  );
};

export default Select;
