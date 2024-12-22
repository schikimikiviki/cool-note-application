import { useState } from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(true);
  const navigate = useNavigate();

  const manageTitles = () => {
    setAreTitlesDisplayed((prevAreTitlesDisplayed) => !prevAreTitlesDisplayed);
    props.onTitleChange(!areTitlesDisplayed);
  };

  const handleAbout = () => {
    props.onAbout();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className='footer-main'>
      <button
        className='footer-button'
        style={{ fontSize: props.fontSize }}
        onClick={handleAbout}
      >
        About
      </button>
      <button
        className='footer-button'
        style={{ fontSize: props.fontSize }}
        onClick={handleSettings}
      >
        Settings
      </button>
      <button
        className='footer-button'
        style={{ fontSize: props.fontSize }}
        onClick={manageTitles}
      >
        {areTitlesDisplayed ? 'Hide' : 'Show'} note titles
      </button>
    </div>
  );
};

export default Footer;
