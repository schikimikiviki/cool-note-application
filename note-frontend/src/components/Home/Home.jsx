import api from '../../api/axiosConfig.js';
import { useEffect, useState } from 'react';

import '../../index.css';
import NoteList from '../NoteList/NoteList.jsx';
import Header from '../Header/Header.jsx';
import Popup from '../Popup/Popup.jsx';
import Footer from '../Footer/Footer.jsx';
import About from '../About/About.jsx';
import ColorSort from '../ColorSort/ColorSort.jsx';

function Home() {
  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);
  const [areTitlesVisible, setAreTitlesVisible] = useState(true);

  useEffect(() => {
    (async () => await load())();
  }, []);

  async function load() {
    const result = await api.get('');
    if (result.length > 0) {
      setNotes(result.data);
    }
  }

  const handleDeleteFromState = async (noteId) => {
    console.log(noteId);
    setNotes((notes) => notes.filter((note) => note.id !== noteId));
  };

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

  const handleSearch = async (searchTerm) => {
    const originalNotes = await api.get('').then((result) => result.data);

    if (searchTerm === '') {
      setNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter((note) =>
        note.name.includes(searchTerm)
      );
      setNotes(filteredNotes);
    }
  };

  const changeTitles = (data) => {
    console.log(data);
    setAreTitlesVisible(data);
  };

  const handleColorSort = async (color) => {
    try {
      const result = await api.get('');
      const allNotes = result.data;

      if (color) {
        const filteredNotes = allNotes.filter((note) => note.color === color);
        setNotes(filteredNotes);
      } else {
        setNotes(allNotes);
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
      />
      {isPopupOpen && <Popup onClose={closePopup} onAdd={load} />}

      {isAboutPopupOpen && <About onClose={closeAboutPopup} />}
      <ColorSort onColorSort={handleColorSort} />
      <NoteList
        notes={notes}
        onDelete={handleDeleteFromState}
        titles={areTitlesVisible}
      />
      <Footer onTitleChange={changeTitles} onAbout={handleAboutPopup} />
    </div>
  );
}

export default Home;
