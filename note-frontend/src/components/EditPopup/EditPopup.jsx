import React, { useState, useEffect } from 'react';
import './EditPopup.css';
import { turnEnumToHex, checkIfHex } from '../features/helpers';
import RichTextEditor from '../RichTextEditor/RichTextEditor.jsx';

const EditPopup = ({ note, onSave, onCancel, fontSize, colors }) => {
  const [editedContent, setEditedContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState(note.color);
  const [editedName, setEditedName] = useState(note.title);
  const [translatedColors, setTranslatedColors] = useState([]);
  const [fontColor, setFontColor] = useState(note.fontColor || '#000000');
  const [dueDate, setDueDate] = useState(
    note.dueDate ? new Date(note.dueDate).toISOString().slice(0, 16) : ''
  );
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
    if (colors) {
      if (checkIfHex(colors)) {
        setTranslatedColors(colors);
      } else {
        const hexColors = colors.map(turnEnumToHex);
        setTranslatedColors(hexColors);
      }
    }
  }, [colors]);

  const handleSave = () => {
    // Initialize an object to hold only modified values
    const modifiedFields = {};

    // Compare each field and add it to modifiedFields if changed
    if (editedContent !== note.content) {
      modifiedFields.content = editedContent;
    }
    if (selectedColor !== note.color) {
      modifiedFields.colorString = selectedColor;
    }
    if (editedName !== note.title) {
      modifiedFields.title = editedName;
    }
    if (fontColor !== note.fontColor) {
      modifiedFields.fontColor = fontColor;
    }
    if (
      dueDate &&
      dueDate !== new Date(note.dueDate).toISOString().slice(0, 16)
    ) {
      modifiedFields.dueDate = convertToISOWithTimezone(dueDate);
    }

    //console.log('Onsave gets: ', modifiedFields);
    // Pass the note ID and the modified fields to onSave
    onSave(note.id, modifiedFields);
  };

  const handleDateChange = (event) => {
    const value = event.target.value; // 'YYYY-MM-DDTHH:mm'
    setDueDate(value); // Store the 'YYYY-MM-DDTHH:mm' value
  };

  const convertToISOWithTimezone = (dateString) => {
    if (dateString) {
      // Convert the stored value to ISO format with seconds and timezone (Z)
      const date = new Date(dateString); // Convert to Date object
      return date.toISOString(); // This gives the full ISO string with 'Z' (UTC)
    }
  };

  const handleChangeContent = (value) => {
    // console.log(value);
    setEditedContent(value);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onCancel}>
          X
        </button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <h1 className='popup-title' style={{ fontSize: fontSize }}>
            Edit note
          </h1>
        </div>

        <p
          className='heading-edit'
          style={{ paddingTop: '1%', fontSize: isMobile ? '15px' : fontSize }}
        >
          Edit color:
        </p>
        <div className='color-picker'>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
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
        <h1
          className='heading-edit'
          style={{ fontSize: isMobile ? '15px' : fontSize }}
        >
          Edit title:
        </h1>
        <textarea
          className='text-field'
          value={editedName}
          style={{ fontSize: fontSize }}
          onChange={(e) => setEditedName(e.target.value)}
        ></textarea>

        <h1
          className='heading-edit'
          style={{
            fontSize: isMobile ? '15px' : fontSize,
            marginBottom: '5px',
          }}
        >
          Edit contents:
        </h1>
        <div
          style={{
            paddingLeft: '5px',
            marginBottom: isMobile ? '10px' : '20px',
          }}
        >
          <RichTextEditor
            noteContent={editedContent}
            onChangeContent={handleChangeContent}
            style={{ fontSize: fontSize }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: '5px',
          }}
        >
          <div style={{ width: '30%' }}>
            <h1
              className='heading-edit'
              style={{
                fontSize: isMobile ? '15px' : fontSize,
                marginBottom: '5px',
              }}
            >
              Edit font color:
            </h1>

            <input
              onChange={(e) => setFontColor(e.target.value)}
              type='color'
              id='fontColor'
              value={fontColor}
              style={{ marginLeft: '10px' }}
            ></input>
          </div>

          <div>
            <h1
              className='heading-edit'
              style={{
                fontSize: isMobile ? '15px' : fontSize,
                marginBottom: '5px',
              }}
            >
              Edit due date:
            </h1>

            <input
              type='datetime-local'
              value={dueDate}
              style={{ marginLeft: '5px', height: '30px' }}
              onChange={handleDateChange}
            />
          </div>
        </div>
        {isMobile ? (
          <></>
        ) : (
          <>
            <br />
            <br />
          </>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <button
            className='submit-button'
            style={{ fontSize: fontSize }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
