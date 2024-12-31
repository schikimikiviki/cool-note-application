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
  turnEnumToHex,
  getAllColorPalettes,
  getCustomPaletteViaId,
  patchUserWithNewData,
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

        if (
          userData.colorPalette != null ||
          userData.favoritePaletteReference != null
        ) {
          // wenn hier ein Value gesetzt ist, müssen wir differenzieren, ob es sich um eine custom palette
          // oder eine default palette handelt

          //  console.log(userData.favoritePaletteReference);

          let parts = userData.favoritePaletteReference.split(':');
          let colorPaletteType = parts[0];
          let colorPaletteID = parts[1];

          if (colorPaletteType === 'colorPalette') {
            // default
            setUserColors(userData.colorPalette.colorList);
            // set it to localstorage as well here
            localStorage.setItem(
              'colors',
              JSON.stringify(userData.colorPalette)
            );
          } else if (colorPaletteType === 'customPalette') {
            // die custom Palette suchen

            getCustomPaletteViaId(colorPaletteID).then((userSetColors) => {
              if (userSetColors) {
                // console.log('Palette colors:', userSetColors);
                setUserColors(userSetColors.userSetColors);
                localStorage.setItem('colors', JSON.stringify(userSetColors)); // speichern damit wir das in den Settings abrufen können
              } else {
                console.log('Palette not found.');
              }
            });
          } else {
            console.log('Cannot read favorite palette type');
          }
        } else {
          console.log('user has no colorPalette and no fav palette ref');
          // use default colors if none are set
          try {
            const palettes = await getAllColorPalettes();
            const foundPalette = palettes.find(
              (palette) => palette.name === 'Default'
            );

            console.log('Found default palette: ', foundPalette);

            if (foundPalette) {
              setUserColors(foundPalette.colorList);

              // Create a copy of foundPalette
              let newPalette = { ...foundPalette };

              // Update the colorList with new keys (converted to hex)
              const updatedColors = foundPalette.colorList.map((color) =>
                turnEnumToHex(color)
              );

              // Update newPalette with the updated color list
              newPalette.colorList = updatedColors;

              // Save updated palette to localStorage
              localStorage.setItem('colors', JSON.stringify(newPalette));

              console.log('Updated palette saved:', newPalette);
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
      setCustomMeanings(storedUserDataItem.customPairs);
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
      setCustomMeanings(applicationState.customPairs);
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

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
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

      // Sort notes by 'id'
      const sortedNotes = newUserData.notes.sort((a, b) => a.id - b.id);

      updateUserDataState('notes', sortedNotes);
      setOriginalNotes(sortedNotes);
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
      // Check if the color is null (reset filter case)
      if (color === null) {
        // Reset the notes to the original ones when filter is reset
        updateUserDataState('notes', originalNotes);
        console.log('Resetting notes to original ones');
        return;
      }
      console.log(color);
      // Proceed with color filtering if color is not null

      if (color) {
        // Always filter from originalNotes to prevent notes from being deleted

        console.log(originalNotes);
        const filteredNotes = originalNotes.filter(
          (note) => note.colorString === color
        );
        updateUserDataState('notes', filteredNotes);
        console.log('Updating notes to filtered notes', filteredNotes);
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
