import api from '../../api/axiosConfig.js';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../../index.css';
import NoteList from '../NoteList/NoteList.jsx';
import Header from '../Header/Header.jsx';
import Popup from '../Popup/Popup.jsx';
import Footer from '../Footer/Footer.jsx';
import About from '../About/About.jsx';
import ColorSort from '../ColorSort/ColorSort.jsx';
import { loadUserNotes, turnHexToEnum } from '../features/helpers.js';

function Home() {
  const [originalNotes, setOriginalNotes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);
  const [areTitlesVisible, setAreTitlesVisible] = useState(true);
  const location = useLocation();
  const { applicationState } = location.state || {};
  const [fontSize, setFontSize] = useState(); // put css prop in here
  const [userColors, setUserColors] = useState();

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData)); // Persist userData
      if (userData.theme == 'NIGHT') {
        setIsDarkThemeSet(true);
      }
      if (userData.fontSize) {
        if (userData.fontSize == 'SMALL') {
          setFontSize('var(--font-size-small)');
        } else if (userData.fontSize == 'BIG') {
          setFontSize('var(--font-size-big)');
        } else {
          setFontSize('var(--font-size-medium)');
        }
      }

      if (userData.colorPalette) {
        setUserColors(userData.colorPalette.colorList);
      } else {
        // use default colors if none are set

        let defaultColors = ['RED', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE'];
        setUserColors(defaultColors);
      }
    }
  }, [userData]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      console.log('loading user data from localstorage');
      setUserData(JSON.parse(storedUserData));
      setOriginalNotes(storedUserData.notes);
      if (storedUserData.fontSize) {
        if (storedUserData.fontSize == 'SMALL') {
          setFontSize('var(--font-size-small)');
        } else if (storedUserData.fontSize == 'BIG') {
          setFontSize('var(--font-size-big)');
        } else {
          setFontSize('var(--font-size-medium)');
        }
      }
    } else if (applicationState) {
      console.log('loading user data from applicationState');
      setUserData(applicationState); // Fall back to applicationState if no data in localStorage
      setOriginalNotes(applicationState.notes);
    }
  }, [applicationState]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openAboutPopup = () => {
    setIsAboutPopupOpen(true);
  };

  const closeAboutPopup = () => {
    setIsAboutPopupOpen(false);
  };

  const handleRequest = () => {
    openPopup();
  };

  const handleAboutPopup = () => {
    openAboutPopup();
  };

  const handleThemeChange = () => {
    setIsDarkThemeSet(!isDarkThemeSet);
  };

  const updateUserDataState = (stateToUpdate, newData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [stateToUpdate]: newData,
    }));
  };

  const load = async () => {
    try {
      console.log(`Executing load for user ${userData.username}...`);
      const newUserData = await loadUserNotes(userData.username);
      console.log('New user data: ', newUserData);
      updateUserDataState('notes', newUserData.notes);
      setOriginalNotes(newUserData.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSearch = async (searchTerm) => {
    console.log('SEARCH TERM: ', searchTerm);
    console.log('NOTES STATE', userData.notes);
    console.log('ORIGINALNOTES', originalNotes);
    if (searchTerm === '') {
      updateUserDataState('notes', originalNotes);
    } else {
      const filteredNotes = userData.notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(filteredNotes);

      updateUserDataState('notes', filteredNotes);
    }
  };

  const changeTitles = (data) => {
    console.log(data);
    setAreTitlesVisible(data);
  };

  const handleColorSort = async (color) => {
    try {
      if (!originalNotes.length && userData.notes.length) {
        // Store the original notes if not already stored
        setOriginalNotes(userData.notes);
      }

      color = turnHexToEnum(color);

      if (color) {
        const filteredNotes = originalNotes.filter(
          (note) => note.color === color
        );
        updateUserDataState('notes', filteredNotes);
      } else {
        // Reset the notes to the original ones
        updateUserDataState('notes', originalNotes);
      }
    } catch (error) {
      console.error('Error while sorting notes by color:', error);
    }
  };

  return (
    <div
      className={`main-page ${isDarkThemeSet ? 'dark-theme' : 'light-theme'}`}
    >
      {isDarkThemeSet ? (
        <div className='bg-animation'>
          <div id='stars'></div>
          <div id='stars2'></div>
          <div id='stars3'></div>
          <div id='stars4'></div>
        </div>
      ) : (
        <div id='background-wrap'>
          <div className='x1'>
            <div className='cloud'></div>
          </div>

          <div className='x2'>
            <div className='cloud'></div>
          </div>

          <div className='x3'>
            <div className='cloud'></div>
          </div>

          <div className='x4'>
            <div className='cloud'></div>
          </div>

          <div className='x5'>
            <div className='cloud'></div>
          </div>
        </div>
      )}

      <Header
        onReceive={handleRequest}
        onClick={handleThemeChange}
        onType={handleSearch}
        fontSize={fontSize}
      />
      {isPopupOpen && (
        <Popup
          onClose={closePopup}
          onAdd={load}
          userId={userData.id}
          fontSize={fontSize}
        />
      )}

      {isAboutPopupOpen && (
        <About onClose={closeAboutPopup} fontSize={fontSize} />
      )}
      <ColorSort
        colors={userColors}
        onColorSort={handleColorSort}
        fontSize={fontSize}
      />
      {userData ? (
        <NoteList
          notes={userData.notes}
          onDelete={load}
          titles={areTitlesVisible}
          onLoad={load}
          fontSize={fontSize}
        />
      ) : (
        <p>Loading notes...</p>
      )}
      <Footer
        onTitleChange={changeTitles}
        onAbout={handleAboutPopup}
        userDetails={userData}
        fontSize={fontSize}
      />
    </div>
  );
}

export default Home;
