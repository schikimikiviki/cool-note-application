import './LoginPage.css';
import noteIcon from '../../assets/note-icon.png';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadUserNotes } from '../features/helpers';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  // State for handling messages
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { username, password });
    setErrorMessage('');

    console.log('Logging in user ... ');

    try {
      const response = await axios.post(
        'http://localhost:8080/login',
        `username=${username}&password=${password}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      // Handle successful login
      console.log('Login successful:', response.data);

      // UserDaten fetchen und in den State speichern, zB. für Settings
      // und user-definierte Daten und Notes

      const userData = await loadUserNotes(username);
      setUserData(userData);

      navigate('/home', { state: { applicationState: userData } });

      console.log('Passing the following data to /home: ', userData);
    } catch (error) {
      // Handle login error
      setErrorMessage('Invalid Username or Password');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className='login-container'>
        <div className='login-header'>
          <img src={noteIcon} alt='note-logo' width={150} height={150} />
          <h1>! my very important notes !</h1>
        </div>
        <div className='login-body'>
          {errorMessage && (
            <div className='error-message'>
              <p>{errorMessage}</p>
            </div>
          )}

          <h2>Login</h2>

          <form className='login-form' onSubmit={handleLogin} role='form'>
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
            <button type='submit'>Login</button>
            ---------------OR---------------
            <button onClick={handleRegister}>Register</button>
            <br />
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
