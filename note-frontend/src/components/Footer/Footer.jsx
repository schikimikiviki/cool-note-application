import { useState } from "react";
import "./Footer.css";

const Footer = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(true);

  const manageTitles = () => {
    setAreTitlesDisplayed((prevAreTitlesDisplayed) => !prevAreTitlesDisplayed);
    props.onTitleChange(!areTitlesDisplayed);
  };

  const handleAbout = () => {
    props.onAbout();
  };

  return (
    <div className="footer-main">
      <button className="footer-button" onClick={handleAbout}>
        About
      </button>
      <button className="footer-button" onClick={manageTitles}>
        {areTitlesDisplayed ? "Hide" : "Show"} note titles
      </button>
    </div>
  );
};

export default Footer;
