import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const Popup = ({ onClose, onAdd }) => {
  const [noteData, setNoteData] = useState({
    name: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const jsonString = JSON.stringify(noteData);

      await api.post("", jsonString, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(noteData, typeof noteData);

      onAdd();
      onClose();
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
          <input
            type="text"
            name="name"
            placeholder="Please type in a note heading"
            value={noteData.name}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="content"
            placeholder="Please type note contents"
            value={noteData.content}
            onChange={handleInputChange}
          />

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
