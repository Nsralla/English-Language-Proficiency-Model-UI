import Hero from "./Hero";
import "./LandingPage.css";
import Welcome from "./Welcome";
import Navbar from "../Navbar/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <Welcome/>
    </>
  );
};

export default LandingPage;
