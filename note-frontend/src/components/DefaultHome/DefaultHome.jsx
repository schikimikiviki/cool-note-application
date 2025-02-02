import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../../index.css';
import NoteList from '../NoteList/NoteList.jsx';
import DefaultHeader from '../DefaultHeader/DefaultHeader.jsx';
import Popup from '../Popup/Popup.jsx';
import Footer from '../Footer/Footer.jsx';
import ColorSort from '../ColorSort/ColorSort.jsx';

function DefaultHome() {
  const [originalNotes, setOriginalNotes] = useState([
    {
      id: 1,
      title: 'Hello test user!',
      content: 'Welcome to the notes app!',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#ffd6ff',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
  ]);
  const [filteredNotes, setFilteredNotes] = useState(originalNotes);
  const [userData, setUserData] = useState({
    id: 0,
    username: 'Testuser',
    fullname: 'Test user',
    theme: 'NIGHT',
    fontSize: 'SMALL',
    colorPalette: {
      id: 10001,
      name: 'Pastel',
      colorList: ['#ffd6ff', '#E7C6FF', '#C8B6FF', '#b8c0ff', '#BBD0FF'],
    },
    notes: originalNotes,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);
  const [hideTitles, setHideTitles] = useState(false);
  const location = useLocation();
  const { applicationState } = location.state || {};
  const [fontSize, setFontSize] = useState(); // put css prop in here
  const [userColors, setUserColors] = useState();
  const [hideDoneNotes, setHideDoneNotes] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleThemeChange = () => {
    setIsDarkThemeSet(!isDarkThemeSet);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filteredNotes);
    }
  };

  const changeTitles = (data) => {
    setHideTitles(data);
  };

  const handleColorSort = (color) => {
    if (color === null) {
      setFilteredNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter(
        (note) => note.colorString === color
      );
      setFilteredNotes(filteredNotes);
    }
  };

  const handleHideNotes = (data) => {
    setHideDoneNotes(data);
    if (data) {
      const filteredNotes = originalNotes.filter((note) => !note.isDone);
      setFilteredNotes(filteredNotes);
    } else {
      setFilteredNotes(originalNotes);
    }
  };

  const filterDueDate = (filterState) => {
    if (filterState) {
      const today = new Date().toISOString().slice(0, 10);
      const filteredNotes = originalNotes.filter((note) => {
        if (note.dueDate) {
          const noteDate = note.dueDate.split('T')[0];
          return noteDate === today;
        }
        return false;
      });
      setFilteredNotes(filteredNotes);
    } else {
      setFilteredNotes(originalNotes);
    }
  };

  const handleAddNote = (newNote) => {
    setOriginalNotes((prevNotes) => [...prevNotes, newNote]);
    setFilteredNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const editNoteDefault = (noteBody, noteId) => {
    setOriginalNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...noteBody } : note
      )
    );
    setFilteredNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...noteBody } : note
      )
    );
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

      <DefaultHeader
        onClick={handleThemeChange}
        onReceive={openPopup}
        onType={handleSearch}
      />
      {isPopupOpen && (
        <Popup
          isDefault='true'
          onClose={closePopup}
          onAdd={handleAddNote}
          colors={userData.colorPalette.colorList}
        />
      )}

      <ColorSort
        colors={userData.colorPalette.colorList}
        onColorSort={handleColorSort}
        fontSize={fontSize}
        onFilterDue={filterDueDate}
      />

      <NoteList
        userData={userData}
        notes={filteredNotes}
        titles={hideTitles}
        isDoneDelete={hideDoneNotes}
        fontSize={fontSize}
        colors={userColors}
        isDefault={true}
        onEditDefault={editNoteDefault}
      />
    </div>
  );
}

export default DefaultHome;
