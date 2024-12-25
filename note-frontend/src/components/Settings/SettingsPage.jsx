import './SettingsPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { fetchGetFromBackend } from '../features/helpers';
import api from '../../api/axiosConfig';
import { turnEnumToHex, getAllColorPalettes } from '../features/helpers';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../ColorPicker/ColorPicker';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });
  const [isChecked, setIsChecked] = useState(userData.isAuthActive);
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState(userData.theme);

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
    if (userData && userData.fontSize) {
      return userData.fontSize.toLowerCase();
    }
    return 'medium'; // Default to medium if no fontSize or userData
  });
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorMeanings, setColorMeanings] = useState(
    userData.customNamesForColors
  );
  const [colorPalette, setColorPalette] = useState(); // saving id here
  const [paletteCollection, setPaletteCollection] = useState();
  const [chosenPalette, setChosenPalette] = useState();

  useEffect(() => {
    const fetchData = async () => {
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
    // setColorMeanings({});

    let palette = e;
    setChosenPalette(palette);
    setColorPalette(palette);

    let newPalette = paletteCollection.find((item) => item.id == palette);

    // also, put this to the db :))))
    // translate the users notes to have a new color of the new palette!

    let userNotes = JSON.parse(localStorage.getItem('userData')).notes;

    userNotes.forEach(function (note) {
      if (!newPalette.colorList.includes(note.color)) {
        let newColor =
          newPalette.colorList[
            Math.floor(Math.random() * newPalette.colorList.length)
          ];

        note.color = newColor;
      }
    });

    let userObj = {};
    userObj.colorPalette = { id: palette };

    if (userNotes.length > 0) {
      userObj.notes = userNotes;
    }

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

  const handleMailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAuthSubmit = async (e) => {
    // save into db

    e.preventDefault();
    let userObj = {};
    if (email !== userData.email && email != '') {
      userObj.email = email;
    }

    console.log('Submitting the following updated user data:', userObj);

    try {
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // now, get the whole new user object and save it to the localstorage and to the state
      try {
        const response = await api.get(`/users/id/${userData.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Got the following user data: ', response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUserData(response.data);
      } catch (err) {
        console.log('Failed to GET user data');
      }
    } catch (error) {
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
  };

  const handleOnChange = async () => {
    // Toggle the checkbox state
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    // Check if the checkbox is checked or unchecked, then update the backend
    console.log(newIsChecked ? 'Activating 2fa .. ' : 'Deactivating 2fa .. ');

    let userObj = {};
    userObj.isAuthActive = newIsChecked; // Use the updated value

    try {
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

  const navigate = useNavigate();

  const handleUserDataChange = async (e) => {
    // save new data to db
    // then, save new data to state!

    e.preventDefault();

    // check only if userName was modified
    if (username !== userData.username) {
      const userAlreadyExists = await validateUsername(); // Wait for username validation

      if (userAlreadyExists) {
        setErrorMessage('Username already exists!');
        return; // Stop further execution if username exists
      }
    }

    // Create user object with only changed fields
    let userObj = {};
    if (username !== userData.username && username != '')
      userObj.username = username;
    if (password !== userData.password && password != '')
      userObj.password = password;
    if (fullname !== userData.fullname && fullname != '')
      userObj.fullname = fullname;

    // If no fields have changed, do nothing
    if (Object.keys(userObj).length === 0) {
      console.log('No changes detected, skipping update.');
      return;
    }

    console.log('Submitting the following updated user data:', userObj);

    try {
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Updated user data successfully');
        setErrorMessage('');

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);

        // now, get the whole new user object and save it to the localstorage and to the state
        try {
          const response = await api.get(`/users/id/${userData.id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Got the following user data: ', response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          setUserData(response.data);
        } catch (err) {
          console.log('Failed to GET user data');
        }
      } else {
        setErrorMessage('Could not update user data');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      setErrorMessage('Could not update user data');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
  };

  const initDelete = () => {
    setDeleteClicked(!deleteClicked);
  };

  const deleteProfile = async () => {
    // first make a delete request to the backend
    try {
      const response = await api.delete(`/users/${userData.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.log(err);
    }

    // then, redirect to the login page
    navigate('/login');
  };

  const validateUsername = async () => {
    let userArr = await fetchGetFromBackend('users', 'userFetch');
    let userAlreadyExists = false;

    console.log(userArr);

    for (const user of userArr) {
      if (user.username === username) {
        userAlreadyExists = true;
        console.log('User already exits!');
      }
    }

    return userAlreadyExists;
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullname(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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

  let firstHalf = [];
  let secondHalf = [];

  if (userData.loginList?.length > 1) {
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
              {errorMessage && (
                <div className='error-message'>
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className='success-message'>
                  <p>{successMessage}</p>
                </div>
              )}
              <br />

              <h2>Update your user data</h2>
              <br />
              <br />

              {userData ? (
                <form
                  className='register-form'
                  onSubmit={handleUserDataChange}
                  role='form'
                >
                  <input
                    type='text'
                    id='username'
                    style={{ fontSize: fontSize }}
                    name='username'
                    placeholder='Enter new Username'
                    defaultValue={userData.username}
                    onChange={handleUserNameChange}
                    required
                  />
                  <input
                    type='password'
                    id='password'
                    name='password'
                    style={{ fontSize: fontSize }}
                    placeholder='Enter your Password'
                    defaultValue={userData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <input
                    type='fullname'
                    id='fullname'
                    style={{ fontSize: fontSize }}
                    name='fullname'
                    placeholder='Enter your full name'
                    defaultValue={userData.fullname}
                    onChange={handleFullNameChange}
                    required
                  />

                  <br />
                  <button
                    style={{ fontSize: fontSize }}
                    className='save-settings'
                    type='submit'
                  >
                    Save
                  </button>
                  <br />
                </form>
              ) : (
                <p>Loading user...</p>
              )}
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
                        paletteCollection
                          .filter(
                            (palette) =>
                              Array.isArray(palette.userSetColors) &&
                              palette.userSetColors.length === 0 &&
                              palette.colorList.length
                          )
                          .map((palette, paletteIndex) => (
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

                      {userData.ownColorPalettes &&
                        userData.ownColorPalettes.map(
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
                />
              </div>
            </TabPanel>
            <TabPanel tabId='vertical-tab-three'>
              <h2>
                <u>Delete user account</u>
              </h2>

              <div className='delete-form'>
                <button
                  className='delete'
                  type='submit'
                  onClick={() => initDelete()}
                  style={{
                    fontSize:
                      fontSize === 'var(--font-size-big)' ? '17px' : '15px',
                  }}
                >
                  Delete user profile
                </button>

                <div className={` ${deleteClicked ? '' : 'hidden'}`}>
                  <div className='delete-form'>
                    <p
                      id='warning'
                      style={{
                        fontSize:
                          fontSize === 'var(--font-size-big)' ? '17px' : '15px',
                      }}
                    >
                      Are you sure ? This action will permanently delete your
                      user profile and log you out immediately. To proceed,
                      click on the button to the right.
                    </p>
                    <button
                      className='delete'
                      type='submit'
                      onClick={() => deleteProfile()}
                      style={{
                        fontSize:
                          fontSize === 'var(--font-size-big)' ? '17px' : '15px',
                      }}
                    >
                      Yes, delete my profile and log me out
                    </button>
                  </div>
                </div>
              </div>
              <br />

              <h2>
                <u>Two-Factor-Authentication</u>
              </h2>
              <div
                className='delete-form'
                style={{
                  fontSize:
                    fontSize === 'var(--font-size-big)' ? '17px' : '15px',
                }}
              >
                <input
                  type='checkbox'
                  id='auth'
                  name='auth'
                  value='Activate-2-factor authentication'
                  checked={isChecked}
                  onChange={handleOnChange}
                />
                Activate-2-factor authentication
                <div className={` ${isChecked ? 'visible' : 'hidden'}`}>
                  <form
                    className='delete-form'
                    onSubmit={handleAuthSubmit}
                    role='form'
                  >
                    <input
                      type='email'
                      id='email'
                      name='email'
                      placeholder='Enter e-mail adress for 2-factor authentication'
                      defaultValue={userData.email}
                      onChange={handleMailChange}
                      style={{ fontSize: fontSize }}
                      required
                    />

                    <button
                      className='delete'
                      type='submit'
                      style={{ fontSize: fontSize }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>

              <h2>
                <u>Login history</u>
                <br />
                <br />
                <div className='login-list'>
                  <div>
                    <ul>
                      {firstHalf.length > 0 && (
                        <>
                          {firstHalf.map((txt) => (
                            <li key={txt} style={{ fontSize: fontSize }}>
                              <p>{txt}</p>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <ul>
                      {secondHalf.length > 0 && (
                        <>
                          {secondHalf.map((txt) => (
                            <li key={txt} style={{ fontSize: fontSize }}>
                              <p>{txt}</p>
                            </li>
                          ))}{' '}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </h2>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
