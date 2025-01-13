import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';
import { turnEnumToHex, turnHexToEnum, checkIfHex } from '../features/helpers';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

const Popup = ({ onClose, onAdd, userId, fontSize, colors }) => {
  const [noteData, setNoteData] = useState({
    name: '',
    content: '',
    color: '',
    fontColor: '',
    dueDate: '',
  });

  const [selectedColor, setSelectedColor] = useState(null);
  const [translatedColors, setTranslatedColors] = useState([]);
  const [fontColor, setFontColor] = useState('#000000');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const processColors = async () => {
      try {
        const resolvedColors = await colors; // Resolve the promise

        if (checkIfHex(resolvedColors)) {
          // no conversion
          setTranslatedColors(resolvedColors);
        } else {
          const hexColors = colors.map(turnEnumToHex);
          setTranslatedColors(hexColors);
        }
      } catch (error) {
        console.error('Error resolving colors:', error);
      }
    };

    processColors();
  }, [colors]);

  const handleInputChange = (e) => {
    console.log(e);
    // const { name, value } = e.target;
    // setNoteData({ ...noteData, [name]: value });
    // console.log(noteData);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const submitForm = async (e) => {
    // e.preventDefault();
    // // Check if a color is selected
    // if (!selectedColor) {
    //   alert('Please select a color before submitting.');
    //   return;
    // }
    // try {
    //   const dataToSubmit = {
    //     title: noteData.name,
    //     content: noteData.content,
    //     done: false,
    //     colorString: selectedColor,
    //     fontColor: fontColor,
    //   };
    //   // das datum ist keine pflichtangabe
    //   if (dueDate) {
    //     dataToSubmit.dueDate = convertToISOWithTimezone(dueDate);
    //   }
    //   const jsonString = JSON.stringify(dataToSubmit);
    //   console.log('Data to submit: ', dataToSubmit);
    //   await api.post(`/api/notes/${userId}`, jsonString, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   onAdd();
    //   onClose();
    //   // console.log(dataToSubmit, typeof dataToSubmit);
    // } catch (error) {
    //   console.error('Error while posting note:', error);
    // }
  };

  const convertToISOWithTimezone = (dateString) => {
    // Convert the stored value to ISO format with seconds and timezone (Z)
    const date = new Date(dateString); // Convert to Date object
    return date.toISOString(); // This gives the full ISO string with 'Z' (UTC)
  };

  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
          X
        </button>

        <form className='popup-form' onSubmit={submitForm}>
          <h2 className='popup-title' style={{ fontSize: fontSize }}>
            New Note
          </h2>
          <input
            type='text'
            name='name'
            style={{ fontSize: fontSize }}
            placeholder='Please type in a note heading'
            value={noteData.name}
            onChange={handleInputChange}
          />

          <RichTextEditor
            noteContent={noteData.content}
            onChangeContent={handleInputChange}
            style={{ fontSize: fontSize }}
          />

          {/* <input
            type='text'
            name='content'
            style={{ fontSize: fontSize }}
            placeholder='Please type note contents'
            value={noteData.content}
            onChange={handleInputChange}
          /> */}

          <div className='colorPicker'>
            <p
              className='heading-medium'
              style={{ paddingTop: '1%', fontSize: fontSize }}
            >
              Select a color:
            </p>
            <div
              style={{
                display: 'flex',
                marginLeft: '30px',
                alignItems: 'center',
              }}
            >
              {translatedColors.map((color, index) => (
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

          <div style={{ display: 'flex' }}>
            <h1
              className='heading-edit'
              style={{ fontSize: fontSize, marginBottom: '5px' }}
            >
              Edit font color:
            </h1>
            <input
              onChange={(e) => setFontColor(e.target.value)}
              type='color'
              id='fontColor'
              value={fontColor}
              style={{
                marginLeft: '10px',
                width: '100px',
                marginTop: '10px',
              }}
            ></input>

            <h1 className='heading-edit' style={{ fontSize: fontSize }}>
              Edit due date:
            </h1>
            <input
              type='datetime-local'
              value={dueDate}
              style={{ marginLeft: '5px', width: '200px', marginTop: '10px' }}
              onChange={handleDateChange}
            />
          </div>

          <button
            type='submit'
            className='submit-button'
            style={{ fontSize: fontSize }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
