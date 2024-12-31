import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';
import { turnEnumToHex, turnHexToEnum, checkIfHex } from '../features/helpers';

const Popup = ({ onClose, onAdd, userId, fontSize, colors }) => {
  const [noteData, setNoteData] = useState({
    name: '',
    content: '',
    color: '',
  });

  const [selectedColor, setSelectedColor] = useState(null);
  const [translatedColors, setTranslatedColors] = useState([]);

  useEffect(() => {
    const processColors = async () => {
      try {
        const resolvedColors = await colors; // Resolve the promise

        if (checkIfHex(resolvedColors)) {
          // no conversion
          setTranslatedColors(resolvedColors);
        } else {
          const hexColors = colors.map(turnEnumToHex);
          setTranslatedColors(hexColors);
        }
      } catch (error) {
        console.error('Error resolving colors:', error);
      }
    };

    processColors();
  }, [colors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
    console.log(noteData);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Check if a color is selected
    if (!selectedColor) {
      alert('Please select a color before submitting.');
      return;
    }

    try {
      const dataToSubmit = {
        title: noteData.name,
        content: noteData.content,
        done: false,
        colorString: selectedColor,
      };

      const jsonString = JSON.stringify(dataToSubmit);

      console.log('Data to submit: ', dataToSubmit);

      await api.post(`/api/notes/${userId}`, jsonString, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      onAdd();
      onClose();
      // console.log(dataToSubmit, typeof dataToSubmit);
    } catch (error) {
      console.error('Error while posting note:', error);
    }
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
          X
        </button>

        <form className='popup-form' onSubmit={submitForm}>
          <h2 className='popup-title' style={{ fontSize: fontSize }}>
            New Note
          </h2>
          <input
            type='text'
            name='name'
            style={{ fontSize: fontSize }}
            placeholder='Please type in a note heading'
            value={noteData.name}
            onChange={handleInputChange}
          />

          <input
            type='text'
            name='content'
            style={{ fontSize: fontSize }}
            placeholder='Please type note contents'
            value={noteData.content}
            onChange={handleInputChange}
          />

          <div className='colorPicker'>
            <p
              className='heading-medium'
              style={{ paddingTop: '1%', fontSize: fontSize }}
            >
              Select a color:
            </p>
            <div
              style={{
                display: 'flex',
                marginLeft: '30px',
                alignItems: 'center',
              }}
            >
              {translatedColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorClick(color)}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: color,
                    marginRight: '10px',
                    cursor: 'pointer',
                    border: selectedColor === color ? '2px solid #000' : 'none',
                  }}
                ></div>
              ))}
            </div>
          </div>

          <button
            type='submit'
            className='submit-button'
            style={{ fontSize: fontSize }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
