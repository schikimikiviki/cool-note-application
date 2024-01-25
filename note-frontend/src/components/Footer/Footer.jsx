import { useState } from "react";
import "./Footer.css";

const Footer = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(true);

  const manageTitles = () => {
    setAreTitlesDisplayed((prevAreTitlesDisplayed) => !prevAreTitlesDisplayed);
    props.onTitleChange(!areTitlesDisplayed);
  };

  return (
    <div className="footer-main">
      <div>About</div>
      <div onClick={manageTitles}>
        {areTitlesDisplayed ? "Hide" : "Show"} note titles
      </div>
    </div>
  );
};

export default Footer;
