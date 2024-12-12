import './SettingsPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchGetFromBackend } from '../features/helpers';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [userFullData, setUserFullData] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { userData } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      console.log('Got the following userdata: ', userData);
      setFullname(userData.fullname);
      setUsername(userData.username);
      setPassword(userData.password);
      setUserFullData(userData);
    }
  }, [userData]);

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
    if (username !== userData.username) userObj.username = username;
    if (password !== userData.password) userObj.password = password;
    if (fullname !== userData.fullname) userObj.fullname = fullname;

    // If no fields have changed, do nothing
    if (Object.keys(userObj).length === 0) {
      console.log('No changes detected, skipping update.');
      return;
    }

    console.log('Submitting the following updated user data:', userObj);

    try {
      const response = await api.patch(`/users/${userFullData.id}`, userObj, {
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
            class='exit'
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
                  value={username}
                  onChange={handleUserNameChange}
                  required
                />
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your Password'
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <input
                  type='fullname'
                  id='fullname'
                  name='fullname'
                  placeholder='Enter your full name'
                  value={fullname}
                  onChange={handleFullNameChange}
                  required
                />

                <br />
                <button class='save-settings' type='submit'>
                  Save
                </button>
                <br />
              </form>
            </TabPanel>
            <TabPanel tabId='vertical-tab-two'>
              <p>Tab 2 content</p>
            </TabPanel>
            <TabPanel tabId='vertical-tab-three'>
              <p>Tab 3 content</p>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
