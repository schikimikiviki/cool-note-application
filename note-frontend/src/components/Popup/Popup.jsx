import { useState } from "react";
import api from "../../api/axiosConfig";
import "./Popup.css";

const Popup = ({ onClose, onAdd }) => {
  const [noteData, setNoteData] = useState({
    name: "",
    content: "",
    color: "",
  });

  const [selectedColor, setSelectedColor] = useState(null);

  const colors = [
    "#FF595E", // Coral Red
    "#FFCA3A", // Happy Yellow
    "#8AC926", // Grass Green
    "#1982C4", // Sky Blue
    "#6A4C93", // Grape Violet
  ];

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
      alert("Please select a color before submitting.");
      return;
    }

    try {
      const dataToSubmit = {
        ...noteData,
        color: selectedColor,
        done: false,
      };

      const jsonString = JSON.stringify(dataToSubmit);

      await api.post("", jsonString, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      onAdd();
      onClose();
      console.log(dataToSubmit, typeof dataToSubmit);
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

          <div className="colorPicker">
            <p className="heading-medium" style={{ paddingTop: "1%" }}>
              Select a color:
            </p>
            <div
              style={{
                display: "flex",
                marginLeft: "30px",
                alignItems: "center",
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

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
