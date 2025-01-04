import React, { useState, useEffect } from 'react';
import './EditPopup.css';
import { turnEnumToHex, checkIfHex } from '../features/helpers';

const EditPopup = ({ note, onSave, onCancel, fontSize, colors }) => {
  const [editedContent, setEditedContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState(note.color);
  const [editedName, setEditedName] = useState(note.title);
  const [translatedColors, setTranslatedColors] = useState([]);
  const [fontColor, setFontColor] = useState(note.fontColor || '#000000');

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

    // Pass the note ID and the modified fields to onSave
    onSave(note.id, modifiedFields);
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
        <h1 className='popup-title' style={{ fontSize: fontSize }}>
          Edit note
        </h1>
        <p
          className='heading-edit'
          style={{ paddingTop: '1%', fontSize: fontSize }}
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
        <h1 className='heading-edit' style={{ fontSize: fontSize }}>
          Edit title:
        </h1>
        <textarea
          className='text-field'
          value={editedName}
          style={{ fontSize: fontSize }}
          onChange={(e) => setEditedName(e.target.value)}
        ></textarea>

        <h1 className='heading-edit' style={{ fontSize: fontSize }}>
          Edit contents:
        </h1>
        <textarea
          className='text-field'
          value={editedContent}
          style={{ fontSize: fontSize }}
          onChange={(e) => setEditedContent(e.target.value)}
        ></textarea>
        <h1
          className='heading-edit'
          style={{ fontSize: fontSize, marginBottom: '5px' }}
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

        <br />
        <br />
        <button
          className='submit-button'
          style={{ fontSize: fontSize }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPopup;
