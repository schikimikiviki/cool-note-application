import React, { useState, useEffect } from 'react';
import { patchUserWithNewData, fetchGetFromBackend } from '../features/helpers';
import api from '../../api/axiosConfig';

const EditUserData = ({ userData, fontSize, onPatchUser }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');

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

    let responseObj = await patchUserWithNewData(userObj, userData.id);

    if (responseObj) {
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

    onPatchUser(responseObj);
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
    </>
  );
};

export default EditUserData;