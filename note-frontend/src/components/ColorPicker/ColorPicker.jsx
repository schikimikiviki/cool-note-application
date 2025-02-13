import React, { useState, useEffect } from 'react';
import { patchUserWithNewData } from '../features/helpers';
import api from '../../api/axiosConfig';

const ColorPicker = ({
  fontSize,
  user,
  onAddPalette,
  onDelete,
  onChangePaletteName,
  isMobile,
}) => {
  const [color1, setColor1] = useState('#000000');
  const [color2, setColor2] = useState('#000000');
  const [color3, setColor3] = useState('#000000');
  const [color4, setColor4] = useState('#000000');
  const [color5, setColor5] = useState('#000000');
  const [name, setName] = useState('');
  const [edit, setEdit] = useState(null);
  const [paletteNameInput, setPaletteNameInput] = useState('');

  const savePalette = async () => {
    if (!name.trim()) {
      // Prevent saving if the name is empty
      alert('Please provide a name for the palette.');
      return;
    }

    try {
      let userObj = {
        customColorPaletteList: [
          {
            name: name,
            userSetColors: [color1, color2, color3, color4, color5],
          },
        ],
      };

      console.log(user);

      let responseObj = await patchUserWithNewData(userObj, user.id);
      onAddPalette(responseObj);

      // reset fields
      setName('');
      setColor1('#000000');
      setColor2('#000000');
      setColor3('#000000');
      setColor4('#000000');
      setColor5('#000000');
    } catch (err) {
      console.log('Failed to POST data', err);
    }
  };

  const handleEditPalette = (paletteIndex) => {
    setEdit(paletteIndex);
    setPaletteNameInput(user.customColorPaletteList[paletteIndex].name);
  };

  const handleDeletePalette = async (id) => {
    console.log('trying to  delete palette with id: ', id);
    const authToken = localStorage.getItem('authToken');

    try {
      const request = await api.delete(`/api/colorpalettes/custom/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
        },
      });

      // If successful, call the refreshStateFromDb function to update the UI with the latest user data
      const userResponse = await api.get(`/users/id/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
        },
      });

      console.log('Updated user data after delete:', userResponse.data);
      onDelete(userResponse.data); // Call onDelete to update the state
    } catch (err) {
      console.log('Failed to POST data', err);
    }
  };

  const handleSubmitName = async (id) => {
    // patch request to palette

    let paletteObj = {};
    paletteObj.name = paletteNameInput;
    const authToken = localStorage.getItem('authToken');

    try {
      const request = await api.patch(
        `/api/colorpalettes/custom/${id}`,
        paletteObj,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authToken}`,
          },
        }
      );

      // Now, get the updated user object and save it to the local storage
      try {
        const userResponse = await api.get(`/users/id/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authToken}`,
          },
        });

        console.log('Got the following user data: ', userResponse.data);
        localStorage.setItem('userData', JSON.stringify(userResponse.data));
        onChangePaletteName(userResponse.data);
      } catch (err) {
        console.log('Failed to GET user data', err);
      }
    } catch (err) {
      console.log('Failed to POST data', err);
    }
  };

  return (
    <>
      <h2>
        <u>Create your own palette</u>
      </h2>

      <p style={{ fontSize: fontSize }}>
        Click on each field to choose your five favorite colors and choose a
        name for your palette.
      </p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <input
          onChange={(e) => setColor1(e.target.value)}
          type='color'
          id='favcolor'
          value={color1}
        ></input>
        <input
          onChange={(e) => setColor2(e.target.value)}
          type='color'
          id='favcolor'
          value={color2}
        ></input>
        <input
          onChange={(e) => setColor3(e.target.value)}
          type='color'
          id='favcolor'
          value={color3}
        ></input>
        <input
          onChange={(e) => setColor4(e.target.value)}
          type='color'
          id='favcolor'
          value={color4}
        ></input>
        <input
          onChange={(e) => setColor5(e.target.value)}
          type='color'
          id='favcolor'
          value={color5}
        ></input>
      </div>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px' }} htmlFor='text'>
          Select a name for the new palette:
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          type='text'
          id='text'
          value={name}
        ></input>
        <button
          className='delete'
          type='button'
          onClick={() => savePalette()}
          style={{
            fontSize: fontSize === 'var(--font-size-big)' ? '17px' : '15px',
            marginTop: '20px',
          }}
        >
          Save new palette
        </button>
      </div>

      <br />
      <br />

      <h2>
        <u>Manage your palettes</u>
      </h2>
      <br />

      {user.customColorPaletteList && user.customColorPaletteList.length > 0 ? (
        user.customColorPaletteList.map((palette, paletteIndex) => (
          <div
            key={paletteIndex}
            style={{
              gap: '10px',
              display: 'flex',
              flexDirection: 'column', // Stack name/icons and input button in separate lines
              alignItems: 'flex-start',
              paddingBottom: '10px',
            }}
          >
            {/* Name and Icons in a single line */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <p>{palette.name}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'blue',
                    fontSize: '20px',
                  }}
                  title='Edit Palette'
                  onClick={() => handleEditPalette(paletteIndex)}
                >
                  ✏️
                </span>

                <span
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    fontSize: '20px',
                  }}
                  title='Delete Palette'
                  onClick={() => handleDeletePalette(palette.id)}
                >
                  🗑️
                </span>
              </div>
            </div>

            {/* Input field and Submit button below */}
            {edit === paletteIndex && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column', // Stack input field and button in separate lines
                  gap: '10px',
                  marginTop: '10px',
                }}
              >
                <input
                  type='text'
                  value={paletteNameInput}
                  onChange={(e) => setPaletteNameInput(e.target.value)}
                />

                <button
                  type='submit'
                  onClick={() =>
                    handleSubmitName(
                      user.customColorPaletteList[paletteIndex].id
                    )
                  }
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No custom palettes found.</p>
      )}
    </>
  );
};

export default ColorPicker;
