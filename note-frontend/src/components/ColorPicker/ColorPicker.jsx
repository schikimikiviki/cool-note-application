import React, { useState, useEffect } from 'react';
import { patchUserWithNewData } from '../features/helpers';
import api from '../../api/axiosConfig';

const ColorPicker = ({ fontSize, user, onAddPalette }) => {
  const [color1, setColor1] = useState('#000000');
  const [color2, setColor2] = useState('#000000');
  const [color3, setColor3] = useState('#000000');
  const [color4, setColor4] = useState('#000000');
  const [color5, setColor5] = useState('#000000');
  const [name, setName] = useState('');

  const savePalette = async () => {
    //first, a post request to colorpalettes has to be done, then you can patch the user with it

    let colorPaletteObj = {
      name: name,
      userSetColors: [color1, color2, color3, color4, color5],
    };

    try {
      const request = await api.post(
        `/api/colorpalettes/add`,
        colorPaletteObj,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // now, use the same data and do a patch request

      // save the palette id from the one we just created
      const paletteId = request.data?.id;

      if (paletteId) {
        let userObj = {
          ownColorPalettes: [
            {
              id: paletteId,
              name: name,
              colorList: [],
              userSetColors: [color1, color2, color3, color4, color5],
            },
          ],
        };

        let userData = patchUserWithNewData(userObj, user.id);
        onAddPalette(userData);

        // TODO: give this data to parent and handle correctly
      }
    } catch (err) {
      console.log('Failed to POST data', err);
    }
  };

  const handleEditPalette = () => {};

  const handleDeletePalette = async (id) => {
    console.log('trying to  delete palette with id: ', id);
    try {
      const request = await api.delete(`/api/colorpalettes/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // TODO: frontend refresh so that it vanishes
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
        <label style={{ fontSize: fontSize, marginRight: '10px' }} for='text'>
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
          type='submit'
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

      {user.ownColorPalettes &&
        user.ownColorPalettes.map((palette, paletteIndex) => (
          <div
            key={paletteIndex}
            style={{
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingBottom: '10px',
            }}
          >
            <p>{palette.name}</p>
            <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
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
        ))}
    </>
  );
};

export default ColorPicker;
