import './MobileHeader.css';
import noteIcon from '../../assets/note-icon.png';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileHeader = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(props.isDarkThemeSet);
  const navigate = useNavigate();

  const handleThemeSwitch = () => {
    setIsDarkMode((prev) => !prev);
    props.onClick(); // Call the original function from props
  };

  const navigateLogin = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const navigateRegister = () => {
    navigate('/register');
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: '20px',
      }}
    >
      <div className='mobile-header'>
        <img src={noteIcon} alt='note-logo' width={100} height={100} />
        <h1 className='mobile-heading'>! my very important notes !</h1>
      </div>

      <div className='mobile-section'>
        <SearchBar
          onSearch={props.onType}
          fontSize={'SMALL'}
          style={{ width: '150px' }}
        />
        <p style={{ fontSize: '30px' }} onClick={handleThemeSwitch}>
          {isDarkMode ? '🌝' : '☀️'}
        </p>
        <p onClick={props.onReceive}>➕</p>
        {props.isDefault ? (
          <>
            <button className='button-mobile' onClick={navigateLogin}>
              Login
            </button>
            <button className='button-mobile' onClick={navigateRegister}>
              Register
            </button>
          </>
        ) : (
          <>
            <button className='button-mobile' onClick={navigateLogin}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
