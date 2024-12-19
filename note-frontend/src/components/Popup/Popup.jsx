import { useState } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';
import colors from '../../assets/imports.js';

const Popup = ({ onClose, onAdd, userId, fontSize }) => {
  const [noteData, setNoteData] = useState({
    name: '',
    content: '',
    color: '',
  });

  const [selectedColor, setSelectedColor] = useState(null);

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
      let enumColor;
      // we need enums for db
      if (selectedColor === '#FF595E') {
        enumColor = 'RED';
      } else if (selectedColor === '#FFCA3A') {
        enumColor = 'YELLOW';
      } else if (selectedColor === '#8AC926') {
        enumColor = 'GREEN';
      } else if (selectedColor === '#1982C4') {
        enumColor = 'BLUE';
      } else if (selectedColor === '#6A4C93') {
        enumColor = 'PURPLE';
      }

      const dataToSubmit = {
        title: noteData.name,
        content: noteData.content,
        color: enumColor,
        done: false,
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
      console.log(dataToSubmit, typeof dataToSubmit);
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
              {colors.map((color, index) => (
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
