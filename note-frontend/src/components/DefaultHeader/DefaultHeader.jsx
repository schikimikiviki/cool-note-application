import PlusButton from '../PlusButton/PlusButton';
import ModeSwitcher from '../ModeSwitcher/ModeSwitcher';
import SearchBar from '../SearchBar/SearchBar';
import '../Header/Header.css';
import noteIcon from '../../assets/note-icon.png';
import LoginButton from '../LoginButton/LoginButton';

const DefaultHeader = (props) => {
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
