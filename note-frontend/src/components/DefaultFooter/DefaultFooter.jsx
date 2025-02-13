import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const DefaultFooter = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(true);
  const [areDoneNotesDeleted, setAreDoneNotesDeleted] = useState(
    props.deleteDone
  );
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

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
    navigate('/legal');
  };

  return (
    <div
      className='footer-main'
      style={{
        height: isMobile ? '30px' : 'auto',
        margin: isMobile ? '8px' : '40px',
      }}
    >
      <button
        className='footer-button'
        style={{ fontSize: isMobile ? '12px' : '22px' }}
        onClick={handleHideDone}
      >
        {props.deleteDone ? 'Show done notes' : 'Hide done notes'}
      </button>
      <button
        className='footer-button'
        style={{ fontSize: isMobile ? '12px' : '22px' }}
        onClick={handleSettings}
      >
        {isMobile
          ? 'Legal note & data'
          : 'Legal note, data protection and privacy'}
      </button>
      <button
        className='footer-button'
        style={{ fontSize: isMobile ? '12px' : '22px' }}
        onClick={manageTitles}
      >
        {areTitlesDisplayed ? 'Hide' : 'Show'} note titles
      </button>
    </div>
  );
};

export default DefaultFooter;
