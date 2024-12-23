import { useState, useEffect } from 'react';
import './ColorSort.css';
import { turnEnumToHex } from '../features/helpers';

const ColorSort = ({ onColorSort, fontSize, colors, customMeanings }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [translatedColors, setTranslatedColors] = useState([]);
  const [translatedCustomMeanings, setTranslatedCustomMeanings] = useState({});

  useEffect(() => {
    if (colors) {
      const hexColors = colors.map(turnEnumToHex);
      setTranslatedColors(hexColors);

      const updatedMeanings = {};

      if (customMeanings) {
        // we need to translate the enums to hex values in order to be able to display and match them later in the div
        for (const [key, value] of Object.entries(customMeanings)) {
          let newKey = turnEnumToHex(key);
          updatedMeanings[newKey] = value;
        }
        setTranslatedCustomMeanings(updatedMeanings);
      }
    }
  }, [colors]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSort(color);
  };

  const resetColor = () => {
    setSelectedColor(null);
    onColorSort(null); // This triggers reset in the parent component (Home)
  };

  return (
    <div>
      <div className='colorPicker-header'>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div
            className='before-after'
            style={{
              fontSize:
                fontSize === 'var(--font-size-medium)' ? '16px' : fontSize,
              height: fontSize === 'var(--font-size-big)' ? '' : '20px',
            }}
          >
            Filter by color
          </div>
          {translatedColors.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: '100px',
                height: '20px',
                marginBottom: '20px',
                backgroundColor: color,
                cursor: 'pointer',
                border: selectedColor === color ? '2px solid #000' : 'none',
              }}
            >
              {translatedCustomMeanings[color]}
            </div>
          ))}
          <div
            className='before-after'
            style={{
              fontSize:
                fontSize === 'var(--font-size-medium)' ? '17px' : fontSize,
              height: fontSize === 'var(--font-size-big)' ? '' : '20px',
            }}
            onClick={resetColor} // Reset filter button
          >
            Reset filter
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSort;
