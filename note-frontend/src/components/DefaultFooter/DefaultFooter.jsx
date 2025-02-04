import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const DefaultFooter = (props) => {
  const [areTitlesDisplayed, setAreTitlesDisplayed] = useState(true);
  const [areDoneNotesDeleted, setAreDoneNotesDeleted] = useState(
    props.deleteDone
  );
  const navigate = useNavigate();

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
        Legal note, data protection and privacy
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

export default DefaultFooter;
