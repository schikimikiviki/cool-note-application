import './SettingsPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { patchUserWithNewData, loadUserObject } from '../features/helpers';
import {
  turnEnumToHex,
  getAllColorPalettes,
  getCustomPaletteViaId,
  getPaletteViaID,
} from '../features/helpers';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../ColorPicker/ColorPicker';
import AdvancedSettings from '../AdvancedSettings/AdvancedSettings';
import EditUserData from '../EditUserData/EditUserData';
import About from '../About/About';
import api from '../../api/axiosConfig';
import GoogleCalender from '../GoogleCalender/GoogleCalender';

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
  const [colorMeanings, setColorMeanings] = useState(userData?.customPairs);
  const [colorPalette, setColorPalette] = useState(); // saving id here
  const [paletteCollection, setPaletteCollection] = useState();
  const [chosenPalette, setChosenPalette] = useState();
  const [showDoneInput, setShowDoneInput] = useState(userData?.hideDoneNotes);
  const [hideTitleInput, setHideTitleInput] = useState(
    userData?.showNoteTitles
  );
  const [deleteAllDoneInput, setDeleteAllDoneInput] = useState(
    userData?.deleteAllDone
  );
  const [fontStyle, setFontStyle] = useState(
    userData?.fontStyle || 'Montserrat'
  );
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

        // get item in localstorage because we need a saved color palette to use

        let colorsToUse = localStorage.getItem('colors');

        // console.log('colorsToUse: ', colorsToUse);

        // we should have saved the whole palette:
        // colorsToUse:  {"id":57,"name":"Neon","colorList":["NEON_GREEN","NEON_ORANGE","NEON_PINK","NEON_PURPLE","NEON_YELLOW"]}

        if (colorsToUse) {
          colorsToUse = JSON.parse(colorsToUse);
          setColorPalette(colorsToUse.id);
          setChosenPalette(colorsToUse.id);
        }
      } catch (error) {
        console.error('Error fetching palettes:', error);
      }
    };

    fetchData();
  }, [userData]);

  const handleShowDone = async (e) => {
    setShowDoneInput(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.hideDoneNotes = e.target.value;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleHideTitle = async (e) => {
    setHideTitleInput(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.showNoteTitles = e.target.value;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

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
    let oldNotes = JSON.parse(JSON.stringify(userNotes)); // Deep clone to make sure that we dont display an old version of the object from localstorage
    console.log('Old notes: ', oldNotes);

    if (isCustomPalette) {
      if (userNotes) {
        // get colors to do a check
        let colorsToCheck;
        await getCustomPaletteViaId(palette).then((userSetColors) => {
          if (userSetColors) {
            colorsToCheck = userSetColors.userSetColors;
          }
        });

        console.log(colorsToCheck);

        userNotes.forEach(function (note) {
          // check if the color is included already in the customColorPaletteList
          if (!colorsToCheck.includes(note.colorString)) {
            let newColor =
              colorsToCheck[Math.floor(Math.random() * colorsToCheck.length)];

            note.colorString = newColor;
          }
        });
        console.log('new notes: ', userNotes);
      }
    } else {
      if (userNotes) {
        userNotes.forEach(function (note) {
          if (!selectedPalette.colorList.includes(note.colorString)) {
            let newColor = turnEnumToHex(
              selectedPalette.colorList[
                Math.floor(Math.random() * selectedPalette.colorList.length)
              ]
            );

            note.colorString = newColor;
          }
        });

        console.log('new notes: ', userNotes);
      }
    }

    let userObj = {};
    userObj.colorPalette = { id: palette };
    let type = isCustomPalette ? 'customPalette' : 'colorPalette';
    let colorRef = `${type}:${palette}`;
    userObj.favoritePaletteReference = colorRef;

    if (userNotes?.length > 0) {
      userObj.notes = userNotes;
    }

    console.log(userData);

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);

    // color im Localstorage überschreiben, weil sonst die neue Farbe nicht gerendert wird

    console.log('wir speichern: ', palette);
    if (isCustomPalette) {
      console.log('getting custom pallete');
      getCustomPaletteViaId(palette).then((userSetColors) => {
        if (userSetColors) {
          localStorage.setItem('colors', JSON.stringify(userSetColors)); // speichern damit wir das in den Settings abrufen können
        }
      });
    } else {
      console.log('getting default pallete');

      getPaletteViaID(palette).then((userSetColors) => {
        if (userSetColors) {
          localStorage.setItem('colors', JSON.stringify(userSetColors)); // speichern damit wir das in den Settings abrufen können
        }
      });
    }
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

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleThemeChange = async (e) => {
    setTheme(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.theme = e.target.value.toUpperCase();

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleSaveCustomColors = async () => {
    // save customColorNames for user

    let userObj = {};
    userObj.customPairs = colorMeanings;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleAddCustomPalette = (newUserData) => {
    setUserData(newUserData);
  };

  const handleDeleteAllDone = async (e) => {
    let newState = e.target.value === 'true';
    setDeleteAllDoneInput(newState);

    // Patch the user data in the database
    const userObj = { deleteAllDone: newState };
    let responseObj;

    try {
      responseObj = await patchUserWithNewData(userObj, userData.id);
      setUserData(responseObj);
    } catch (err) {
      console.error('Error updating user data:', err);
      return; // Exit early if patching fails
    }

    // Delete all done notes if the new state is true
    if (newState === true && responseObj) {
      const notesToDelete = responseObj.notes.filter(
        (note) => note.isDone === true
      );
      console.log('Notes to delete:', notesToDelete);

      if (notesToDelete.length > 0) {
        try {
          const deletionPromises = notesToDelete.map((note) =>
            api.delete(`/api/notes/${note.id}`, {
              headers: { 'Content-Type': 'application/json' },
            })
          );

          await Promise.all(deletionPromises); // Wait for all deletions to complete
          console.log('All notes deleted');
        } catch (err) {
          console.error('Error deleting notes:', err);
          return; // Exit early if deletion fails
        }
      }
    }

    // Refetch the updated user object and save it to local storage
    try {
      const updatedUser = await api.get(`/users/id/${userData.id}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Got the updated user data:', updatedUser.data);
      localStorage.setItem('userData', JSON.stringify(updatedUser.data));
      setUserData(updatedUser.data); // Update the state with the latest data
    } catch (err) {
      console.error('Failed to fetch updated user data:', err);
    }
  };

  const refreshStateFromDb = (response) => {
    console.log(response);
    setUserData(response);
  };

  const handleFontStyleChange = async (e) => {
    setFontStyle(e.target.value);

    // also, patch to the db

    let userObj = {};
    userObj.fontStyle = e.target.value;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
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

            <button
              className='exit'
              type='submit'
              style={{
                fontSize: fontSize,
                visibility: userData.roles.includes('ADMIN')
                  ? 'visible'
                  : 'hidden',
              }}
              onClick={() => {
                navigate('/admin');
              }}
            >
              ⬅️ Go to admin settings
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
              <Tab tabFor='extra' style={{ fontSize: fontSize }}>
                Color palettes
              </Tab>
              <Tab tabFor='vertical-tab-two' style={{ fontSize: fontSize }}>
                Notes
              </Tab>

              <Tab tabFor='vertical-tab-three' style={{ fontSize: fontSize }}>
                Advanced settings
              </Tab>
              <Tab tabFor='vertical-tab-four' style={{ fontSize: fontSize }}>
                About
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
                  <u>Preferred font</u>
                </h2>
                <br />
                <div style={{ display: 'flex', gap: '20px' }}>
                  <select
                    style={{ fontSize: fontSize }}
                    value={fontStyle ?? 'Montserrat'}
                    onChange={handleFontStyleChange}
                  >
                    <option value='Montserrat'>Montserrat</option>
                    <option value='Arial'>Arial</option>
                    <option value='Helvetica'>Helvetica</option>
                    <option value='Georgia'>Georgia</option>
                    <option value='Courier'>Courier</option>
                    <option value='Times'>Times</option>
                    <option value='Tahoma'>Tahoma</option>
                    <option value='Palatino'>Palatino</option>
                    <option value='Optima'>Optima</option>
                  </select>

                  <p style={{ fontSize: fontSize }}>
                    The preferred font will be applied only to the notes.
                  </p>
                </div>
                <br />
                <br />

                <h2>
                  <u>Show notes that are done ? </u>
                </h2>
                <br />

                <select
                  style={{ fontSize: fontSize }}
                  value={showDoneInput ?? 'true'}
                  onChange={handleShowDone}
                >
                  <option value='true'>yes</option>
                  <option value='false'>no</option>
                </select>
                <br />
                <br />
                <h2>
                  <u>Show note titles ? </u>
                </h2>

                <br />

                <select
                  style={{ fontSize: fontSize }}
                  value={hideTitleInput ?? 'true'}
                  onChange={handleHideTitle}
                >
                  <option value='true'>yes</option>
                  <option value='false'>no</option>
                </select>
                <br />
                <br />
                <h2>
                  <u>Permanently delete notes marked as "done? </u>
                </h2>

                <br />

                <select
                  style={{ fontSize: fontSize }}
                  value={deleteAllDoneInput ?? 'false'}
                  onChange={handleDeleteAllDone}
                >
                  <option value='true'>yes</option>
                  <option value='false'>no</option>
                </select>

                <br />
                <br />
                <h2>
                  <u>Export your notes</u>
                </h2>
                <p style={{ fontSize: fontSize }}>
                  Please note that only notes having a date can be exported
                </p>
                <br />

                <GoogleCalender notes={userData.notes} />
                <br />
              </div>
            </TabPanel>
            <TabPanel tabId='extra'>
              <h2>
                <u>Custom color palettes and custom values for colors</u>
              </h2>

              <p style={{ fontSize: fontSize }}>
                You can give colors a custom meaning or even change your color
                palette. Type in your own ideas for colors and filter your notes
                according to your own values in the notes page! Choose short,
                meaningful names for this to work best.
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
                            checked={chosenPalette === palette.id}
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
                                {(colorMeanings && colorMeanings[color]) || ''}
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
                              checked={chosenPalette === palette.id}
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
                                    {(colorMeanings && colorMeanings[color]) ||
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
            <TabPanel tabId='vertical-tab-four'>
              <About style={{ fontSize: fontSize }} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
