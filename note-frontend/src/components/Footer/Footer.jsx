import { useState, useEffect } from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(props.titles);
  const [areDoneNotesDeleted, setAreDoneNotesDeleted] = useState(
    props.deleteDone
  );
  const navigate = useNavigate();

  console.log(props.titles);

  useEffect(() => {
    setAreDoneNotesDeleted(props.deleteDone);
    setAreTitlesDisplayed(props.titles);
  }, [props.deleteDone, props.titles]);

  const manageTitles = () => {
    setAreTitlesDisplayed((prevAreTitlesDisplayed) => !prevAreTitlesDisplayed);
    props.onTitleChange(!areTitlesDisplayed);
  };

  const handleHideDone = () => {
    setAreDoneNotesDeleted((prevStateNotesDeleted) => {
      const newState = !prevStateNotesDeleted;
      props.onHide(newState);
      return newState;
    });
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className='footer-main'>
      <button
        className='footer-button'
        style={{ fontSize: props.fontSize }}
        onClick={handleHideDone}
      >
        {props.deleteDone ? 'Show done notes' : 'Hide done notes'}
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
