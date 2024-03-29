import { useState } from "react";
import "./ColorSort.css";
import colors from "../../assets/imports.js";

const ColorSort = ({ onColorSort }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSort(color);
  };

  const resetColor = () => {
    setSelectedColor(null);
    onColorSort(null);
  };
  return (
    <div>
      <div className="colorPicker-header">
        <div
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <div className="before-after">Filter by color</div>
          {colors.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: "100px",
                height: "20px",
                marginBottom: "20px",
                backgroundColor: color,
                cursor: "pointer",
                border: selectedColor === color ? "2px solid #000" : "none",
              }}
            ></div>
          ))}
          <div className="before-after" onClick={() => resetColor()}>
            Reset filter
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSort;
