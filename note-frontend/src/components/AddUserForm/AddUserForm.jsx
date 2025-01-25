import { useState } from 'react';
import './AddUserForm.css';

const AddUserForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const handleRoleChange = (role) => {
    setRole((prevRoles) => {
      if (role === 'ADMIN') {
        // If Admin is checked, ensure User is also included
        if (!prevRoles.includes('ADMIN')) {
          return [...new Set([...prevRoles, 'ADMIN', 'USER'])];
        } else {
          // If Admin is unchecked, remove Admin but keep User
          return prevRoles.filter((r) => r !== 'ADMIN');
        }
      } else if (role === 'USER') {
        // Toggle User role independently
        return prevRoles.includes('USER')
          ? prevRoles.filter((r) => r !== 'USER')
          : [...prevRoles, 'USER'];
      }
      return prevRoles;
    });
  };

  const registerUser = async (event) => {
    event.preventDefault();

    if (userName.length == 0) {
      setErrorMessage('Please provide a username');
    } else if (password.length == 0) {
      setErrorMessage('Please provide a password');
    } else if (fullname.length == 0) {
      setErrorMessage('Please provide a full name');
    }
    if (role.length === 0) {
      setErrorMessage('Please select at least one role.');
      return false;
    }

    // check if roles are correct
    if (role.includes('ADMIN') && !role.includes('USER')) {
      setErrorMessage('Cannot create only admin role, must have both');
      return false;
    }

    let userObj = {
      username: userName,
      password: password,
      fullname: fullname,
      roles: role,
    };

    try {
      console.log('POSTING the following user to the db: ', userObj);
      const registerRes = await fetch('http://localhost:8080/register', {
        method: 'POST',
        body: JSON.stringify(userObj), // Make sure userObj is stringified
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const registerData = await registerRes.json();

      console.log(registerData);

      if (registerData.success) {
        setRegistrationMessage('Registration successful!');
        setErrorMessage('');
      } else {
        setErrorMessage('Registration failed!');
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <>
      <h2>
        <u>Add a new user</u>
      </h2>

      {errorMessage && (
        <div
          className='error-message'
          style={{ marginBottom: '20px', marginTop: '20px' }}
        >
          <p>{errorMessage}</p>
        </div>
      )}

      {registrationMessage && (
        <div
          className='registration-message'
          style={{ marginBottom: '20px', marginTop: '20px' }}
        >
          <p>{registrationMessage}</p>
        </div>
      )}

      <form onSubmit={registerUser}>
        <div className='add-user'>
          <div
            style={{ width: '20%', display: 'flex', flexDirection: 'column' }}
          >
            <label className='form-item'>
              Enter username:
              <br />
              <input
                type='text'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </label>
            <label className='form-item'>
              Enter password:
              <br />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className='form-item'>
              Enter full name:
              <br />
              <input
                type='text'
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </label>
          </div>
          <div>
            <fieldset style={{ width: '160px', padding: '10px' }}>
              <legend>Choose roles:</legend>

              <div>
                <input
                  type='checkbox'
                  id='admin'
                  name='admin'
                  style={{ marginRight: '5px' }}
                  checked={role.includes('ADMIN')}
                  onChange={() => handleRoleChange('ADMIN')}
                />
                <label htmlFor='admin'>Admin</label>
              </div>

              <div>
                <input
                  type='checkbox'
                  id='user'
                  name='user'
                  style={{ marginRight: '5px' }}
                  checked={role.includes('USER')}
                  onChange={() => handleRoleChange('USER')}
                />
                <label htmlFor='user'>User</label>
              </div>
            </fieldset>
          </div>
        </div>
        <br />

        <button
          style={{
            width: '150px',
            padding: '5px',
            backgroundColor: 'antiquewhite',
            border: 'none',
          }}
          type='submit'
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default AddUserForm;
