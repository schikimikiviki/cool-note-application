import React, { useState } from 'react';
import './EditPopup.css';
import colors from '../../assets/imports.js';

const EditPopup = ({ note, onSave, onCancel, fontSize }) => {
  const [editedContent, setEditedContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState(note.color);
  const [editedName, setEditedName] = useState(note.title);

  const handleSave = () => {
    onSave(note.id, editedContent, selectedColor, editedName);
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
        <h1 className='heading-edit' style={{ fontSize: fontSize }}>
          Edit title:{' '}
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
