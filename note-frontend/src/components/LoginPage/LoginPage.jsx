import './LoginPage.css';
import noteIcon from '../../assets/note-icon.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { loadUserObject, patchUserWithNewData } from '../features/helpers';
import emailjs from '@emailjs/browser';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [authenticationActive, setAuthenticationActive] = useState(false);
  const [code, setCode] = useState('');
  const [isLoginCorrect, setIsLoginCorrect] = useState(false);
  const [generatedAuthCode, setGeneratedAuthCode] = useState('');

  // State for handling messages
  const [errorMessage, setErrorMessage] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleAuthCheck = () => {
    // check if code is valid
    if (code === generatedAuthCode) {
      //   console.log('Appliying font size: ', userData.fontSize);

      if (userData.roles.includes('ADMIN')) {
        navigate('/admin', { state: { applicationState: userData } });
      } else {
        navigate('/home', { state: { applicationState: userData } });
      }

      writeDateTimeToDb(userData.id);
    } else {
      setSecondErrorMessage('AuthCode is not correct, please re-check!');
    }
  };

  const writeDateTimeToDb = async (id) => {
    // for our login history, we log the last 10 logins into the db
    let currTime = getDateTime();
    let userObj = {};
    userObj.loginList = [currTime];

    // our object has to look something like:
    //     {
    //   "loginList": ["2024-06-17T13:55:00"]
    // }
    await patchUserWithNewData(userObj, id);
  };

  const getDateTime = () => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    let dateTime =
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
  };

  const generateCode = () => {
    let length = 5;
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Loop to generate characters for the specified length
    for (let i = 0; i < length; i++) {
      const randomInd = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomInd);
    }
    //  console.log('Generated code: ', result);
    return result;
  };

  const sendMailToUser = (mailadress, authCode, fullname) => {
    // console.log('Sending mail to... ', mailadress);
    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          to_email: mailadress,
          to_name: fullname,
          from_name: 'Blitznotiz.at',
          from_email: 'noreply@blitznotiz.at',
          message: `Here is your authentication code: ${authCode}`,
        },
        import.meta.env.VITE_EMAIL_USER_ID
      )
      .then(
        (result) => {
          //console.log('Email sent successfully!', result.text);
          //alert('Email sent successfully!');
        },
        (error) => {
          console.error('Failed to send email:', error.text);
          alert('Failed to send email.');
        }
      );
  };

  // Handle form submission
  const handleLogin = async (e) => {
    localStorage.removeItem('userData');
    e.preventDefault();
    //console.log('Form submitted with:', { username, password });
    setErrorMessage('');

    // console.log('Logging in user ... ');

    try {
      const response = await axios.post(
        'https://api.blitznotiz.at/login',
        { username: username, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Handle successful login
      // console.log('Login successful:', response.data);

      const authToken = btoa(`${username}:${password}`);
      localStorage.setItem('authToken', authToken);

      // UserDaten fetchen und in den State speichern, zB. für Settings
      // und user-definierte Daten und Notes

      const userData = await loadUserObject(username);
      setUserData(userData);
      setIsLoginCorrect(true);

      // it may happen that the isAuthActive will be true, but the user did not supply the mail adress
      if (userData.isAuthActive && userData.email !== null) {
        // send user to 2 fa first
        setAuthenticationActive(true);

        let generatedCode = generateCode();
        setGeneratedAuthCode(generatedCode);
        // console.log(userData);
        sendMailToUser(userData.email, generatedCode, userData.username);
      } else {
        if (userData.roles.includes('ADMIN')) {
          navigate('/admin', { state: { applicationState: userData } });
        } else {
          navigate('/home', { state: { applicationState: userData } });
        }

        writeDateTimeToDb(userData.id);
        // console.log('Passing the following data to /home: ', userData);
      }
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.message || error);
      setErrorMessage('Invalid username or password');
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
          <img
            src={noteIcon}
            alt='note-logo'
            width={isMobile ? '100' : '150'}
            height={isMobile ? '100' : '150'}
          />
          <h1 style={{ fontSize: isMobile ? '22px' : 'auto' }}>
            ! my very important notes !
          </h1>
        </div>
        <div className='page-container'>
          <div className={`login-body ${authenticationActive ? '' : 'toLeft'}`}>
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

          <div
            className={` ${
              authenticationActive && isLoginCorrect ? '' : 'hidden'
            }`}
          >
            {secondErrorMessage && (
              <div className='error-message'>
                <p>{secondErrorMessage}</p>
              </div>
            )}
            <h2>Authentication</h2>

            <form className='login-form' onSubmit={handleAuthCheck} role='form'>
              <input
                type='text'
                id='code'
                name='code'
                placeholder='Enter your Code'
                value={code}
                onChange={handleCodeChange}
                required
              />

              <button type='submit'>Submit</button>
              <br />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
