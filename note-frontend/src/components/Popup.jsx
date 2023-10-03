import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>This is the popup content.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
