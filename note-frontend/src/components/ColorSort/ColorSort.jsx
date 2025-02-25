import { useState, useEffect } from 'react';
import './ColorSort.css';
import { turnEnumToHex, checkIfHex } from '../features/helpers';

const ColorSort = ({
  onColorSort,
  fontSize,
  colors,
  customMeanings,
  onFilterDue,
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [translatedColors, setTranslatedColors] = useState([]);
  const [translatedCustomMeanings, setTranslatedCustomMeanings] = useState({});
  const [filterByDueDate, setFilterByDueDate] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [colorWidth, setColorWidth] = useState('100px');
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setColorWidth(width <= 768 ? '70px' : '100px');
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  useEffect(() => {
    const processColors = async () => {
      try {
        const resolvedColors = (await colors) || [];

        if (checkIfHex(resolvedColors)) {
          setTranslatedColors(resolvedColors);

          if (customMeanings) {
            // no need to translate to hex
            setTranslatedCustomMeanings(customMeanings);
          }
        } else {
          const hexColors = resolvedColors.map(turnEnumToHex);
          setTranslatedColors(hexColors);

          if (customMeanings) {
            const updatedMeanings = {};
            for (const [key, value] of Object.entries(customMeanings)) {
              let newKey = turnEnumToHex(key);
              updatedMeanings[newKey] = value;
            }
            setTranslatedCustomMeanings(updatedMeanings);
          }
        }
      } catch (error) {
        console.error('Error resolving colors:', error);
      }
    };

    processColors();
  }, [colors, customMeanings]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSort(color);
  };

  const resetColor = () => {
    setSelectedColor(null);
    onColorSort(null); // This triggers reset in the parent component (Home)
  };

  const filterByDate = () => {
    let newState = !filterByDueDate;

    setFilterByDueDate(newState);
    onFilterDue(newState);
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
          {/* {isMobile ? (
            <></>
          ) : (
            <div
              className='before-after'
              style={{
                fontSize:
                  fontSize === 'var(--font-size-medium)' ? '16px' : fontSize,
                height: fontSize === 'var(--font-size-big)' ? '' : '20px',
              }}
            >
              Click on a color
            </div>
          )} */}

          {translatedColors.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: colorWidth,
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

          {isMobile ? (
            <></>
          ) : (
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
          )}
        </div>

        {isMobile ? (
          <></>
        ) : (
          <button
            onClick={filterByDate}
            style={{
              marginLeft: '50px',
              fontSize:
                fontSize === 'var(--font-size-medium)' ? '17px' : fontSize,
              height: fontSize === 'var(--font-size-big)' ? '' : '20px',
            }}
          >
            {filterByDueDate ? 'Show all notes' : '  Show due notes'}
          </button>
        )}
      </div>

      {isMobile ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <button className='button-mobile-small' onClick={resetColor}>
            Reset filter
          </button>
          <button className='button-mobile-small' onClick={filterByDate}>
            {filterByDueDate ? 'Show all notes' : '  Show due notes'}
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ColorSort;
