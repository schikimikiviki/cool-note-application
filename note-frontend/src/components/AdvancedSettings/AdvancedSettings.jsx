import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { patchUserWithNewData } from '../features/helpers';

const AdvancedSettings = ({
  userData,
  fontSize,
  firstHalf,
  secondHalf,
  onChangeAuth,
  onAuthSubmit,
  isMobile,
}) => {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(userData.isAuthActive);
  const [email, setEmail] = useState(userData.email || '');

  const initDelete = () => {
    setDeleteClicked(!deleteClicked);
  };

  const deleteProfile = async () => {
    // first make a delete request to the backend
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await api.delete(`/users/${userData.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
        },
      });
    } catch (err) {
      console.log(err);
    }

    // then, redirect to the login page
    navigate('/login');
  };

  const handleOnChange = async () => {
    // Toggle the checkbox state
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    // Check if the checkbox is checked or unchecked, then update the backend
    console.log(newIsChecked ? 'Activating 2fa .. ' : 'Deactivating 2fa .. ');

    let userObj = {};
    userObj.isAuthActive = newIsChecked; // Use the updated value

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    onChangeAuth(responseObj);
  };

  const handleAuthSubmit = async (e) => {
    // save into db
    e.preventDefault();
    let userObj = {};
    if (email !== userData.email && email != '') {
      userObj.email = email;
    }

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    onAuthSubmit(responseObj);
  };

  const handleMailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <h2>
        <u>Delete user account</u>
      </h2>

      <div className='delete-form'>
        <button
          className='delete'
          type='submit'
          onClick={() => initDelete()}
          style={{
            fontSize: fontSize === 'var(--font-size-big)' ? '17px' : '15px',
          }}
        >
          Delete user profile
        </button>

        <div className={` ${deleteClicked ? '' : 'hidden'}`}>
          <div className='delete-form'>
            <p
              id='warning'
              style={{
                fontSize: fontSize === 'var(--font-size-big)' ? '17px' : '15px',
              }}
            >
              Are you sure ? This action will permanently delete your user
              profile and log you out immediately. To proceed, click on the
              button to the right.
            </p>
            <button
              className='delete'
              type='submit'
              onClick={() => deleteProfile()}
              style={{
                fontSize: fontSize === 'var(--font-size-big)' ? '17px' : '15px',
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
          fontSize: fontSize === 'var(--font-size-big)' ? '17px' : '15px',
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
          <form className='delete-form' onSubmit={handleAuthSubmit} role='form'>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter e-mail adress for 2-factor authentication'
              defaultValue={userData.email || ''}
              onChange={handleMailChange}
              style={{ fontSize: isMobile ? '15px' : fontSize }}
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
      </h2>
      <br />
      <br />
      <div className='login-list'>
        <div>
          <ul>
            {firstHalf.length > 0 && (
              <>
                {firstHalf.map((txt) => (
                  <li
                    key={txt}
                    style={{ fontSize: isMobile ? '16px' : fontSize }}
                  >
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
                  <li
                    key={txt}
                    style={{ fontSize: isMobile ? '16px' : fontSize }}
                  >
                    <p>{txt}</p>
                  </li>
                ))}{' '}
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdvancedSettings;
