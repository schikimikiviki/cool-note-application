import './SettingsPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchGetFromBackend } from '../features/helpers';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

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

  return (
    <>
      <div className='settings-background'>
        <div className='settings-box'>
          <br />
          <br />
          <button
            className='exit'
            type='submit'
            onClick={() => {
              navigate('/home');
            }}
          >
            ⬅️ Back to home page
          </button>
          <br />
          <br />
          <h1>User settings</h1>
          <br />
          <br />
          <Tabs defaultTab='vertical-tab-one' vertical>
            <TabList>
              <Tab tabFor='vertical-tab-one'>User profile</Tab>
              <Tab tabFor='vertical-tab-two'>Notes</Tab>
              <Tab tabFor='vertical-tab-three'>Advanced settings</Tab>
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
                    placeholder='Enter your Password'
                    defaultValue={userData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <input
                    type='fullname'
                    id='fullname'
                    name='fullname'
                    placeholder='Enter your full name'
                    defaultValue={userData.fullname}
                    onChange={handleFullNameChange}
                    required
                  />

                  <br />
                  <button className='save-settings' type='submit'>
                    Save
                  </button>
                  <br />
                </form>
              ) : (
                <p>Loading user...</p>
              )}
            </TabPanel>
            <TabPanel tabId='vertical-tab-two'>
              <h2>Note settings</h2>
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
                >
                  Delete user profile
                </button>

                <div className={` ${deleteClicked ? '' : 'hidden'}`}>
                  <div className='delete-form'>
                    <p id='warning'>
                      Are you sure ? This action will permanently delete your
                      user profile and log you out immediately. To proceed,
                      click on the button to the right.
                    </p>
                    <button
                      className='delete'
                      type='submit'
                      onClick={() => deleteProfile()}
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
              <div className='delete-form'>
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
                      required
                    />

                    <button className='delete' type='submit'>
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
                  <ul>
                    {userData.loginList.map((txt) => (
                      <li>
                        <p>{txt}</p>
                      </li>
                    ))}
                  </ul>
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
