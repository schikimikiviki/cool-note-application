import React, { useState } from "react";
import "./EditPopup.css";

const EditPopup = ({ note, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    onSave(note.id, editedContent);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onCancel}>
          X
        </button>
        <h1 className="popup-title">Edit note</h1>
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
