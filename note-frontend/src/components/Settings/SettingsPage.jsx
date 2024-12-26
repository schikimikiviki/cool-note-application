import './SettingsPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { patchUserWithNewData } from '../features/helpers';
import api from '../../api/axiosConfig';
import { turnEnumToHex, getAllColorPalettes } from '../features/helpers';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../ColorPicker/ColorPicker';
import AdvancedSettings from '../AdvancedSettings/AdvancedSettings';
import EditUserData from '../EditUserData/EditUserData';

const SettingsPage = () => {
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [theme, setTheme] = useState(userData?.theme || 'DAY');

  const [fontSize, setFontSize] = useState(() => {
    if (userData?.fontSize === 'SMALL') {
      return 'var(--font-size-small)';
    } else if (userData?.fontSize === 'BIG') {
      return 'var(--font-size-big)';
    } else {
      return 'var(--font-size-medium)'; // Default value
    }
  });
  const [fontSizeInput, setFontSizeInput] = useState(() => {
    if (userData?.fontSize) {
      return userData.fontSize.toLowerCase();
    }
    return 'medium'; // Default to 'medium' if no fontSize or userData
  });

  const [selectedColor, setSelectedColor] = useState(null);
  const [colorMeanings, setColorMeanings] = useState(
    userData?.customNamesForColors
  );
  const [colorPalette, setColorPalette] = useState(); // saving id here
  const [paletteCollection, setPaletteCollection] = useState();
  const [chosenPalette, setChosenPalette] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // if (!userData) return;

      if (userData?.fontSize === 'SMALL') {
        setFontSize('var(--font-size-small)');
      } else if (userData?.fontSize === 'BIG') {
        setFontSize('var(--font-size-big)');
      } else {
        setFontSize('var(--font-size-medium)');
      }

      try {
        const palettes = await getAllColorPalettes();

        setPaletteCollection(palettes);

        if (userData?.colorPalette) {
          // this is the case where the user already had a patch request for this
          setColorPalette(userData.colorPalette.id);
          setChosenPalette(userData.colorPalette.id);
        } else {
          // look for default palette id

          let filteredPalette = palettes.find(
            (palette) => palette.name == 'Default'
          );
          setChosenPalette(filteredPalette.id);
          setColorPalette(filteredPalette.id);
        }
      } catch (error) {
        console.error('Error fetching palettes:', error);
      }
    };

    fetchData();
  }, [userData]);

  const handleSelectPalette = async (e) => {
    let isCustomPalette = false;
    let selectedPalette;

    let palette = e;
    setChosenPalette(palette);
    setColorPalette(palette);

    // check wheather we chose a palette from default section or from custom
    selectedPalette = paletteCollection.find((item) => item.id == palette);

    if (!selectedPalette) {
      selectedPalette = userData.customColorPaletteList.find(
        (item) => item.id === palette
      );
      isCustomPalette = true;
    }
    // TODO: Problem ist hier, dass man keinen Patch machen kann, weil ja zBso colorList nicht vorhanden ist
    // man muss sich hier was überlegen
    if (!selectedPalette) {
      console.log('Palette not found!');
      return;
    }

    console.log(
      isCustomPalette ? 'Custom palette selected' : 'Default palette selected'
    );

    // also, put this to the db :))))
    // translate the users notes to have a new color of the new palette!

    let userNotes = JSON.parse(localStorage.getItem('userData')).notes;

    if (isCustomPalette) {
      if (userNotes) {
        userNotes.forEach(function (note) {
          if (!userData.customColorPaletteList.userSetColors(note.color)) {
            let newColor =
              userData.customColorPaletteList.userSetColors[
                Math.floor(
                  Math.random() *
                    userData.customColorPaletteList.userSetColors.length
                )
              ];

            note.color = newColor;
          }
        });
      }
    } else {
      if (userNotes) {
        userNotes.forEach(function (note) {
          if (!selectedPalette.colorList.includes(note.color)) {
            let newColor =
              selectedPalette.colorList[
                Math.floor(Math.random() * selectedPalette.colorList.length)
              ];

            note.color = newColor;
          }
        });
      }
    }

    let userObj = {};
    userObj.colorPalette = { id: palette };

    if (userNotes?.length > 0) {
      userObj.notes = userNotes;
    }

    console.log(userData);

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleColorCustomMeaning = (e) => {
    const value = e.target.value;
    setColorMeanings((prev) => ({
      ...prev,
      [selectedColor]: value, // Update meaning for the selected color
    }));
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleFontSizeChange = async (e) => {
    setFontSizeInput(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.fontSize = e.target.value.toUpperCase();

    try {
      console.log('patching user with data: ', userObj);
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Now, get the updated user object and save it to the local storage
      try {
        const userResponse = await api.get(`/users/id/${userData.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Got the following user data: ', userResponse.data);
        localStorage.setItem('userData', JSON.stringify(userResponse.data));
        setUserData(userResponse.data);
      } catch (err) {
        console.log('Failed to GET user data', err);
      }
    } catch (error) {
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
  };

  const handleThemeChange = async (e) => {
    setTheme(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.theme = e.target.value.toUpperCase();

    try {
      console.log('patching user with data: ', userObj);
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Now, get the updated user object and save it to the local storage
      try {
        const userResponse = await api.get(`/users/id/${userData.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Got the following user data: ', userResponse.data);
        localStorage.setItem('userData', JSON.stringify(userResponse.data));
        setUserData(userResponse.data);
      } catch (err) {
        console.log('Failed to GET user data', err);
      }
    } catch (error) {
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
  };

  const handleSaveCustomColors = async () => {
    // save customColorNames for user

    //  {RED: 'red', YELLOW: 'eggshell', PURPLE: 'purple', GREEN: 'kale', BLUE: 'blueish'}

    let userObj = {};
    userObj.customNamesForColors = colorMeanings;

    try {
      console.log('patching user with data: ', userObj);
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Now, get the updated user object and save it to the local storage
      try {
        const userResponse = await api.get(`/users/id/${userData.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Got the following user data: ', userResponse.data);
        localStorage.setItem('userData', JSON.stringify(userResponse.data));
        setUserData(userResponse.data);
      } catch (err) {
        console.log('Failed to GET user data', err);
      }
    } catch (error) {
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
  };

  const handleAddCustomPalette = (newUserData) => {
    setUserData(newUserData);
  };

  const refreshStateFromDb = (response) => {
    console.log(response);
    setUserData(response);
  };

  let firstHalf = [];
  let secondHalf = [];

  if (userData?.loginList?.length > 1) {
    let midIndex = Math.ceil(userData.loginList.length / 2); // Round up to handle odd lengths
    firstHalf = userData.loginList.slice(0, midIndex);
    secondHalf = userData.loginList.slice(midIndex);
  }

  return (
    <>
      <div className='settings-background'>
        <div className='settings-box'>
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <button
              className='exit'
              type='submit'
              style={{ fontSize: fontSize }}
              onClick={() => {
                navigate('/home');
              }}
            >
              ⬅️ Back to home page
            </button>
          </div>
          <br />
          <br />
          <h1>User settings</h1>
          <br />
          <br />
          <Tabs defaultTab='vertical-tab-one' vertical>
            <TabList>
              <Tab tabFor='vertical-tab-one' style={{ fontSize: fontSize }}>
                User profile
              </Tab>
              <Tab tabFor='vertical-tab-two' style={{ fontSize: fontSize }}>
                Notes
              </Tab>
              <Tab tabFor='vertical-tab-three' style={{ fontSize: fontSize }}>
                Advanced settings
              </Tab>
            </TabList>
            <TabPanel tabId='vertical-tab-one'>
              <EditUserData
                userData={userData}
                fontSize={fontSize}
                onPatchUser={refreshStateFromDb}
              />
            </TabPanel>
            <TabPanel tabId='vertical-tab-two'>
              <div>
                <h2>
                  <u>Preferred theme</u>
                </h2>
                <br />

                <select
                  style={{ fontSize: fontSize }}
                  value={theme}
                  onChange={handleThemeChange}
                >
                  <option value='DAY'>Day</option>
                  <option value='NIGHT'>Night</option>
                </select>
                <br />
                <br />

                <h2>
                  <u>Preferred font Size</u>
                </h2>
                <br />
                <div style={{ display: 'flex', gap: '20px' }}>
                  <select
                    style={{ fontSize: fontSize }}
                    value={fontSizeInput}
                    onChange={handleFontSizeChange}
                  >
                    <option value='small'>small</option>
                    <option value='medium'>medium</option>
                    <option value='big'>big</option>
                  </select>

                  <p style={{ fontSize: fontSize }}>
                    The preferred font size will be applied to the notes page
                    and the settings page
                  </p>
                </div>
                <br />
                <br />

                <h2>
                  <u>Custom color palettes and custom values for colors</u>
                </h2>

                <p style={{ fontSize: fontSize }}>
                  You can give colors a custom meaning or even change your color
                  palette. Type in your own ideas for colors and filter your
                  notes according to your own values in the notes page! Choose
                  short, meaningful names for this to work best.
                </p>

                <br />
                <p>
                  <u>Attention:</u> The color of your existent notes will change
                  randomly to a new color if you choose a new palette!
                </p>
                <div className='color-div'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      {paletteCollection &&
                        paletteCollection.map((palette, paletteIndex) => (
                          <div
                            key={paletteIndex}
                            style={{
                              gap: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              paddingBottom: '10px',
                            }}
                          >
                            <input
                              type='checkbox'
                              id={`palette-${palette.id}`}
                              name={`palette-${palette.id}`}
                              value={palette.id}
                              checked={colorPalette === palette.id}
                              onChange={() => handleSelectPalette(palette.id)}
                            />
                            <label htmlFor={`palette-${palette.id}`}>
                              {palette.name || `Palette ${paletteIndex + 1}`}
                            </label>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                marginTop: '10px',
                              }}
                            >
                              {palette.colorList.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  onClick={
                                    chosenPalette === palette.id
                                      ? () => handleColorClick(color)
                                      : null
                                  }
                                  style={{
                                    width: '70px',
                                    height: '30px',
                                    backgroundColor: turnEnumToHex(color),
                                    cursor: 'pointer',
                                    border:
                                      selectedColor === color
                                        ? '2px solid #000'
                                        : 'none',
                                    display: 'inline-block',
                                  }}
                                >
                                  {(colorMeanings && colorMeanings[color]) ||
                                    ''}
                                </div>
                              ))}
                            </div>

                            <div>
                              {chosenPalette === palette.id && ( // Input field only for the chosen palette
                                <input
                                  type='text'
                                  id={`customMeaning-${palette.id}`}
                                  name={`customMeaning-${palette.id}`}
                                  placeholder='Enter a new name'
                                  value={
                                    selectedColor
                                      ? (colorMeanings &&
                                          colorMeanings[selectedColor]) ||
                                        ''
                                      : ''
                                  }
                                  onChange={handleColorCustomMeaning}
                                  style={{
                                    marginTop: '20px',
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        ))}

                      {/* SECOND PALETTE COLLECTION MAPPING BELOW:  */}

                      {userData?.customColorPaletteList &&
                        userData?.customColorPaletteList.map(
                          (palette, paletteIndex) => (
                            <div
                              key={paletteIndex}
                              style={{
                                gap: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingBottom: '10px',
                              }}
                            >
                              <input
                                type='checkbox'
                                id={`palette-${palette.id}`}
                                name={`palette-${palette.id}`}
                                value={palette.id}
                                checked={colorPalette === palette.id}
                                onChange={() => handleSelectPalette(palette.id)}
                              />
                              <label htmlFor={`palette-${palette.id}`}>
                                {palette.name || `Palette ${paletteIndex + 1}`}
                              </label>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  marginTop: '10px',
                                }}
                              >
                                {palette.userSetColors.map(
                                  (color, colorIndex) => (
                                    <div
                                      key={colorIndex}
                                      onClick={
                                        chosenPalette === palette.id
                                          ? () => handleColorClick(color)
                                          : null
                                      }
                                      style={{
                                        width: '70px',
                                        height: '30px',
                                        backgroundColor: color,
                                        cursor: 'pointer',
                                        border:
                                          selectedColor === color
                                            ? '2px solid #000'
                                            : 'none',
                                        display: 'inline-block',
                                      }}
                                    >
                                      {(colorMeanings &&
                                        colorMeanings[color]) ||
                                        ''}
                                    </div>
                                  )
                                )}
                              </div>

                              <div>
                                {chosenPalette === palette.id && ( // Input field only for the chosen palette
                                  <input
                                    type='text'
                                    id={`customMeaning-${palette.id}`}
                                    name={`customMeaning-${palette.id}`}
                                    placeholder='Enter a new name'
                                    value={
                                      selectedColor
                                        ? (colorMeanings &&
                                            colorMeanings[selectedColor]) ||
                                          ''
                                        : ''
                                    }
                                    onChange={handleColorCustomMeaning}
                                    style={{
                                      marginTop: '20px',
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )
                        )}

                      <button
                        className='exit'
                        style={{ marginTop: '20px', fontSize: fontSize }}
                        onClick={handleSaveCustomColors}
                        type='submit'
                      >
                        Save custom meanings for colors
                      </button>
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <ColorPicker
                  fontSize={fontSize}
                  user={userData}
                  onAddPalette={handleAddCustomPalette}
                  onDelete={refreshStateFromDb}
                  onChangePaletteName={refreshStateFromDb}
                />
              </div>
            </TabPanel>
            <TabPanel tabId='vertical-tab-three'>
              <AdvancedSettings
                userData={userData}
                fontSize={fontSize}
                firstHalf={firstHalf}
                secondHalf={secondHalf}
                onChangeAuth={refreshStateFromDb}
                onAuthSubmit={refreshStateFromDb}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
