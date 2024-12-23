import React, { useState, useEffect } from 'react';
import { patchUserWithNewData } from '../features/helpers';

const ColorPicker = ({ fontSize }) => {
  const [color1, setColor1] = useState();
  const [color2, setColor2] = useState();
  const [color3, setColor3] = useState();
  const [color4, setColor4] = useState();
  const [color5, setColor5] = useState();
  const [name, setName] = useState('');

  const savePalette = () => {
    let userObj = {};

    // TODO: first, a post request to colorpalettes has to be done, then you can patch the user with it
    // "customColors": ["#123456", "#789abc"] // Custom colors
    userObj.ownColorPalettes = {
      // TODO: add data
    };
    patchUserWithNewData(userObj);
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
    </>
  );
};

export default ColorPicker;
