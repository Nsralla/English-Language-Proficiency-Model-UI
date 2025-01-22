import "./Navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a onClick={()=>{navigate("/")}} >Whisper</a>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#pricing">Pricing</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
      {/* <button className="navbar-button">Sign In</button> */}
    </nav>
  );
}

export default Navbar