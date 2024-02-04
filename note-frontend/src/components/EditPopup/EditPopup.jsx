import React, { useState } from "react";
import "./EditPopup.css";

const EditPopup = ({ note, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState(note.color);

  const colors = [
    "#FF595E", // Coral Red
    "#FFCA3A", // Happy Yellow
    "#8AC926", // Grass Green
    "#1982C4", // Sky Blue
    "#6A4C93", // Grape Violet
  ];

  const handleSave = () => {
    onSave(note.id, editedContent, selectedColor);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onCancel}>
          X
        </button>
        <h1 className="popup-title">Edit note</h1>
        <p className="heading-edit" style={{ paddingTop: "1%" }}>
          Edit color:
        </p>
        <div className="color-picker">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => handleColorClick(color)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: color,
                  marginRight: "10px",
                  cursor: "pointer",
                  border: selectedColor === color ? "2px solid #000" : "none",
                }}
              ></div>
            ))}
          </div>
        </div>

        <h1 className="heading-edit">Edit contents: </h1>
        <textarea
          className="text-field"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        ></textarea>

        <button className="submit-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPopup;
