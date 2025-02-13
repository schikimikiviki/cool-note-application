import PlusButton from '../PlusButton/PlusButton';
import ModeSwitcher from '../ModeSwitcher/ModeSwitcher';
import SearchBar from '../SearchBar/SearchBar';
import '../Header/Header.css';
import noteIcon from '../../assets/note-icon.png';
import LoginButton from '../LoginButton/LoginButton';
import MobileHeader from '../MobileHeader/MobileHeader.jsx';
import { useState, useEffect } from 'react';

const DefaultHeader = (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  if (isMobile) {
    // console.log('Mobile device  detected!');
    return (
      <MobileHeader
        onType={props.onType}
        onClick={props.onClick}
        isDarkThemeSet={props.isDarkThemeSet}
        onReceive={props.onReceive}
        isDefault='true'
      />
    );
  }

  const handleData = () => {
    props.onReceive();
  };

  const handleSwitch = () => {
    props.onClick();
  };

  const handleSearch = (searchData) => {
    props.onType(searchData);
  };

  return (
    <div className='margin-decent header-main'>
      <div className='header-item'>
        <img src={noteIcon} alt='note-logo' width={150} height={150} />
        <h1 className='heading-main'>! welcome, testuser !</h1>
      </div>

      <div className='header-item'>
        <SearchBar onSearch={handleSearch} fontSize={props.fontSize} />
        <ModeSwitcher
          onSwitch={handleSwitch}
          fontSize={props.fontSize}
          isDarkThemeSet={props.isDarkThemeSet}
        />
        <PlusButton onClick={handleData} fontSize={props.fontSize} />
        <LoginButton />
      </div>
    </div>
  );
};

export default DefaultHeader;
