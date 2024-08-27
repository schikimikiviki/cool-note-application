import './RegisterPage.css';
import noteIcon from '../../assets/note-icon.png';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const recaptcha = useRef();

  // Function to validate username and password lengths
  const validateForm = () => {
    if (username.length < 5) {
      setErrorMessage('Username must be at least 5 characters long!');
      return false;
    } else if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long!');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const captchaValue = recaptcha.current.getValue();

    if (!captchaValue) {
      setErrorMessage('Please verify the reCAPTCHA!');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/verify', {
        method: 'POST',
        body: JSON.stringify({ captchaValue }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.success) {
        // Form submission logic here
        setRegistrationMessage('Registration successful!');
        setErrorMessage('');
      } else {
        setErrorMessage('reCAPTCHA validation failed!');
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
      console.error('Error during registration:', error);
    }
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className='register-container'>
        <div className='register-header'>
          <img src={noteIcon} alt='note-logo' width={150} height={150} />
          <h1>! my very important notes !</h1>
        </div>
        <div className='register-body'>
          {errorMessage && (
            <div className='error-message'>
              <p>{errorMessage}</p>
            </div>
          )}

          {registrationMessage && (
            <div className='registration-message'>
              <p>{registrationMessage}</p>
            </div>
          )}
          <h2>Register</h2>
          <form className='register-form' onSubmit={handleRegister} role='form'>
            <input
              type='text'
              id='username'
              name='username'
              placeholder='Enter your Username'
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
            <br />
            <button type='submit'>Register</button>
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY}
            />
            <br />
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
