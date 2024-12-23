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
import {
  loadUserNotes,
  turnHexToEnum,
  getAllColorPalettes,
} from '../features/helpers.js';

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
  const [customMeanings, setCustomMeanings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData)); // Persist userData

        // Ensure originalNotes is set from userData.notes once
        if (userData.notes && originalNotes.length === 0) {
          setOriginalNotes(userData.notes);
        }

        if (userData.theme === 'NIGHT') {
          setIsDarkThemeSet(true);
        }

        if (userData.fontSize) {
          if (userData.fontSize === 'SMALL') {
            setFontSize('var(--font-size-small)');
          } else if (userData.fontSize === 'BIG') {
            setFontSize('var(--font-size-big)');
          } else {
            setFontSize('var(--font-size-medium)');
          }
        }

        if (userData.customMeanings != null) {
          setCustomMeanings(userData.customMeanings);
        }

        if (userData.colorPalette != null) {
          setUserColors(userData.colorPalette.colorList);
        } else {
          // use default colors if none are set
          try {
            const palettes = await getAllColorPalettes();
            const foundPalette = palettes.find(
              (palette) => palette.name === 'Default'
            );

            if (foundPalette) {
              setUserColors(foundPalette.colorList);
            } else {
              console.warn('No "Default" palette found.');
            }
          } catch (error) {
            console.error('Error fetching palettes:', error);
          }
        }
      }
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      let storedUserDataItem = JSON.parse(storedUserData);
      console.log('loading user data from localstorage: ', storedUserDataItem);

      setUserData(storedUserDataItem);
      setCustomMeanings(storedUserDataItem.customNamesForColors);
      setOriginalNotes(storedUserDataItem.notes);
      if (storedUserDataItem.fontSize) {
        if (storedUserDataItem.fontSize == 'SMALL') {
          setFontSize('var(--font-size-small)');
        } else if (storedUserDataItem.fontSize == 'BIG') {
          setFontSize('var(--font-size-big)');
        } else {
          setFontSize('var(--font-size-medium)');
        }
      }
    } else if (applicationState) {
      console.log(
        'loading user data from applicationState: ',
        applicationState
      );
      setCustomMeanings(applicationState.customNamesForColors);
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

  const handleThemeChange = async () => {
    let newState = !isDarkThemeSet;
    setIsDarkThemeSet(newState);

    // also post this to db

    let userObj = {};
    userObj.theme = newState ? 'NIGHT' : 'DAY';

    try {
      console.log('patching user with data: ', userObj);
      const response = await api.patch(`/users/${userData.id}`, userObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Now, get the updated user object and save it to the local storage
      try {
        const userResponse = await api.get(`/users/id/${userData.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Got the following user data: ', userResponse.data);

        localStorage.setItem('userData', JSON.stringify(userResponse.data));
        setUserData(userResponse.data);
      } catch (err) {
        console.log('Failed to GET user data', err);
      }
    } catch (error) {
      console.error(
        'An error occurred during the patch request:',
        error.message
      );
    }
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
      console.log(color);

      // Check if the color is null (reset filter case)
      if (color === null) {
        // Reset the notes to the original ones when filter is reset
        updateUserDataState('notes', originalNotes);
        console.log('Resetting notes to original ones');
        return;
      }

      // Proceed with color filtering if color is not null
      color = turnHexToEnum(color);
      console.log(color);

      if (color) {
        // Always filter from originalNotes to prevent notes from being deleted
        const filteredNotes = originalNotes.filter(
          (note) => note.color === color
        );
        updateUserDataState('notes', filteredNotes);
        console.log('Updating notes to filtered notes');
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
        isDarkThemeSet={isDarkThemeSet}
      />
      {isPopupOpen && (
        <Popup
          onClose={closePopup}
          onAdd={load}
          userId={userData.id}
          fontSize={fontSize}
          colors={userColors}
        />
      )}

      {isAboutPopupOpen && (
        <About onClose={closeAboutPopup} fontSize={fontSize} />
      )}
      <ColorSort
        colors={userColors}
        onColorSort={handleColorSort}
        fontSize={fontSize}
        customMeanings={customMeanings}
      />
      {userData ? (
        <NoteList
          notes={userData.notes}
          onDelete={load}
          titles={areTitlesVisible}
          onLoad={load}
          fontSize={fontSize}
          colors={userColors}
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
