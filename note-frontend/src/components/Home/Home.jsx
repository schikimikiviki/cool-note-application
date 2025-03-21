import api from '../../api/axiosConfig.js';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../../index.css';
import NoteList from '../NoteList/NoteList.jsx';
import Header from '../Header/Header.jsx';
import Popup from '../Popup/Popup.jsx';
import Footer from '../Footer/Footer.jsx';
import ColorSort from '../ColorSort/ColorSort.jsx';
import {
  loadUserObject,
  turnEnumToHex,
  getAllColorPalettes,
  getCustomPaletteViaId,
  patchUserWithNewData,
} from '../features/helpers.js';
import NotFound from '../NotFound/NotFound.jsx';

function Home() {
  const [originalNotes, setOriginalNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);
  const [hideTitles, setHideTitles] = useState(false);
  const location = useLocation();
  const { applicationState } = location.state || {};
  const [fontSize, setFontSize] = useState(); // put css prop in here
  const [userColors, setUserColors] = useState();
  const [customMeanings, setCustomMeanings] = useState({});
  const [hideDoneNotes, setHideDoneNotes] = useState(false);
  const [deleteAllDone, setDeleteAllDone] = useState(false);

  const initializeUserData = (data) => ({
    ...data,
    deleteAllDone: data.deleteAllDone ?? false, // Default to false if null or undefined
    hideDoneNotes: data.hideDoneNotes ?? false,
    showNoteTitles: data.showNoteTitles ?? true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        const normalizedData = initializeUserData(userData);
        localStorage.setItem('userData', JSON.stringify(normalizedData));

        // Ensure originalNotes is set from userData.notes once
        if (userData.notes && originalNotes.length === 0) {
          setOriginalNotes(userData.notes);
        }

        if (userData.theme === 'NIGHT') {
          setIsDarkThemeSet(true);
        }

        if (
          userData.hideDoneNotes !== null &&
          userData.hideDoneNotes !== undefined
        ) {
          setHideDoneNotes(userData.hideDoneNotes);
        } else {
          setHideDoneNotes(false);
        }

        if (
          userData.showNoteTitles !== null &&
          userData.showNoteTitles !== undefined
        ) {
          setHideTitles(userData.showNoteTitles);
        } else {
          setHideTitles(true);
        }

        if (
          userData.deleteAllDone !== null &&
          userData.deleteAllDone !== undefined
        ) {
          setDeleteAllDone(userData.deleteAllDone);
        } else {
          setDeleteAllDone(false);
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

            // console.log('Found default palette: ', foundPalette);

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

              //  console.log('Updated palette saved:', newPalette);
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
      const parsedData = JSON.parse(storedUserData);
      const normalizedData = initializeUserData(parsedData);
      setUserData(normalizedData);
      setFilteredNotes(normalizedData.notes);
      setOriginalNotes(normalizedData.notes);
      setCustomMeanings(normalizedData.customPairs);
      setHideDoneNotes(normalizedData.hideDoneNotes);
      setHideTitles(normalizedData.showNoteTitles);
      setDeleteAllDone(normalizedData.deleteAllDone);
      setFontSize(
        normalizedData.fontSize === 'SMALL'
          ? 'var(--font-size-small)'
          : normalizedData.fontSize === 'BIG'
          ? 'var(--font-size-big)'
          : 'var(--font-size-medium)'
      );
    } else if (applicationState) {
      const normalizedState = initializeUserData(applicationState);
      setUserData(normalizedState);
      setOriginalNotes(normalizedState.notes);
      setFilteredNotes(normalizedState.notes);
      setCustomMeanings(normalizedState.customPairs);
      setHideDoneNotes(normalizedState.hideDoneNotes);
      setHideTitles(normalizedState.showNoteTitles);
      setDeleteAllDone(normalizedState.deleteAllDone);
    }
  }, [applicationState]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRequest = () => {
    openPopup();
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

  const load = async () => {
    try {
      // console.log(`Executing load for user ${userData.username}...`);
      const newUserData = await loadUserObject(userData.username);
      //   console.log('New user data: ', newUserData);

      localStorage.setItem('userData', JSON.stringify(newUserData));

      // Sort notes by 'id' consistently
      const sortedNotes = newUserData.notes.slice().sort((a, b) => a.id - b.id); // Use slice() to ensure immutability

      // Update the state with the sorted notes
      setFilteredNotes(sortedNotes);
      setOriginalNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSearch = async (searchTerm) => {
    // console.log('SEARCH TERM: ', searchTerm);
    // console.log('NOTES STATE', userData.notes);
    // console.log('ORIGINALNOTES', originalNotes);
    if (searchTerm === '') {
      setFilteredNotes(originalNotes);
    } else {
      const filteredNotes = userData.notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      //console.log(filteredNotes);

      setFilteredNotes(filteredNotes);
    }
  };

  const changeTitles = async (data) => {
    // console.log(data);
    setHideTitles(data);

    let userObj = {};
    userObj.showNoteTitles = data;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);
  };

  const handleColorSort = async (color) => {
    try {
      // Check if the color is null (reset filter case)
      if (color === null) {
        // Reset the notes to the original ones when filter is reset

        setFilteredNotes(originalNotes);
        // console.log('Resetting notes to original ones');
        return;
      }
      // console.log(color);
      // Proceed with color filtering if color is not null

      if (color) {
        // Always filter from originalNotes to prevent notes from being deleted

        // console.log(originalNotes);
        const filteredNotes = originalNotes.filter(
          (note) => note.colorString === color
        );

        setFilteredNotes(filteredNotes);

        // console.log('Updating notes to filtered notes', filteredNotes);
      }
    } catch (error) {
      console.error('Error while sorting notes by color:', error);
    }
  };

  const handleHideNotes = async (data) => {
    // patch the user and update the state
    // console.log(data);
    setHideDoneNotes(data);

    let userObj = {};
    userObj.hideDoneNotes = data;

    let responseObj = await patchUserWithNewData(userObj, userData.id);
    setUserData(responseObj);

    // also, we need to re-sort the notes so that there are no "holes" in the frontend
    // where the done notes were

    if (data) {
      const filteredNotes = originalNotes.filter((note) => !note.done);
      setFilteredNotes(filteredNotes);
    } else {
      load();
    }
  };

  const filterDueDate = (filterState) => {
    // console.log(filterState);

    if (filterState) {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().slice(0, 10);

      // console.log('Today is: ', today);
      // console.log(originalNotes);

      // Filter notes where the dueDate starts with today's date
      const filteredNotes = originalNotes.filter((note) => {
        if (note.dueDate) {
          // Compare only the date part (YYYY-MM-DD)
          const noteDate = note.dueDate.split('T')[0]; // Extract YYYY-MM-DD part
          return noteDate === today;
        }
        return false;
      });

      setFilteredNotes(filteredNotes);

      // console.log('Updating notes to filtered notes', filteredNotes);
    } else {
      // reset filter to OG state
      setFilteredNotes(originalNotes);
      //console.log('Resetting notes to original ones');
    }
  };

  return (
    <>
      {userData ? (
        <div
          className={`main-page ${
            isDarkThemeSet ? 'dark-theme' : 'light-theme'
          }`}
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

          <ColorSort
            colors={userColors}
            onColorSort={handleColorSort}
            fontSize={fontSize}
            customMeanings={customMeanings}
            onFilterDue={filterDueDate}
          />
          {userData ? (
            <NoteList
              userData={userData}
              notes={filteredNotes}
              onDelete={load}
              titles={hideTitles}
              isDoneDelete={hideDoneNotes}
              onLoad={load}
              fontSize={fontSize}
              colors={userColors}
            />
          ) : (
            <p>Loading notes...</p>
          )}
          <Footer
            titles={hideTitles}
            onTitleChange={changeTitles}
            userDetails={userData}
            fontSize={fontSize}
            onHide={handleHideNotes}
            deleteDone={hideDoneNotes}
          />
        </div>
      ) : (
        <>
          <NotFound />
        </>
      )}{' '}
    </>
  );
}

export default Home;
