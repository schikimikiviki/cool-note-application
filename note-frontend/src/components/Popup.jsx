import React from "react";
import api from "../api/axiosConfig";

const Popup = ({ onClose }) => {
  const submitForm = async () => {
    try {
      // const newNote =
      // await api.put(``, newNote);
    } catch (error) {
      console.error("Error while posting note:", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          X
        </button>

        <form className="popup-form" onSubmit={submitForm}>
          <h2 className="popup-title">New Note</h2>
          <input type="text" placeholder="Please type in a note heading" />

          <input type="text" placeholder="Please type note contents" />

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
